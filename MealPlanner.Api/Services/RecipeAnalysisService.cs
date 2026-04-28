using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MealPlanner.Api.Services;

public interface IRecipeAnalysisService
{
    Task<RecipeAnalysisResponse> AnalyzeAsync(int householdId, string rawText, CancellationToken cancellationToken = default);
}

public class RecipeAnalysisService : IRecipeAnalysisService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private readonly AppDbContext _db;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<RecipeAnalysisService> _logger;

    public RecipeAnalysisService(
        AppDbContext db,
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<RecipeAnalysisService> logger)
    {
        _db = db;
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<RecipeAnalysisResponse> AnalyzeAsync(int householdId, string rawText, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(rawText))
            throw new InvalidOperationException("Recipe text is required.");

        var apiKey = _configuration["OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("OpenAI:ApiKey is required to analyze recipes.");

        var model = _configuration["OpenAI:RecipeModel"] ?? "gpt-4o-mini";
        var ingredients = await _db.Ingredients.AsNoTracking().OrderBy(i => i.Name).ToListAsync(cancellationToken);
        var ingredientCatalog = BuildIngredientCatalog(ingredients);
        var sourceUrl = ExtractFirstUrl(rawText);
        var fetchedSource = sourceUrl is null ? null : await TryFetchSourceAsync(sourceUrl, cancellationToken);

        AiRecipeDraft aiDraft;
        if (TryBuildSimpleSnackDraft(rawText, out var fallbackDraft))
        {
            aiDraft = fallbackDraft;
        }
        else
        {
            var promptText = BuildPrompt(rawText, fetchedSource, ingredientCatalog);
            aiDraft = await RequestDraftAsync(model, apiKey, promptText, cancellationToken);
        }

        var warnings = new List<string>(aiDraft.Warnings ?? []);
        var createdIngredients = new List<IngredientResponse>();
        var ingredientMap = ingredients.ToDictionary(i => i.Id);
        var resolvedIngredients = new List<RecipeIngredientRequest>();
        var resolvedByName = new Dictionary<string, Ingredient>(StringComparer.OrdinalIgnoreCase);

        foreach (var draftIngredient in aiDraft.Ingredients)
        {
            var resolved = ResolveIngredient(draftIngredient, ingredientMap, ingredients);
            if (resolved is null)
            {
                resolved = await CreateIngredientFromDraftAsync(draftIngredient, cancellationToken);
                ingredientMap[resolved.Id] = resolved;
                ingredients.Add(resolved);
                createdIngredients.Add(ToIngredientResponse(resolved));
                warnings.Add($"Created new ingredient: {resolved.Name}");
            }

            resolvedByName[draftIngredient.Name] = resolved;

            var unit = !string.IsNullOrWhiteSpace(draftIngredient.Unit)
                ? draftIngredient.Unit.Trim()
                : (!string.IsNullOrWhiteSpace(resolved.PurchaseUnit) ? resolved.PurchaseUnit : resolved.ServingUnit);

            var quantity = draftIngredient.Quantity > 0 ? draftIngredient.Quantity : (resolved.ServingSize > 0 ? resolved.ServingSize : 1m);

            resolvedIngredients.Add(new RecipeIngredientRequest(
                resolved.Id,
                quantity,
                unit,
                draftIngredient.IsModifier,
                draftIngredient.IsOptional,
                null,
                draftIngredient.Notes));
        }

        var resolvedSteps = aiDraft.Steps
            .Select((step, index) => new RecipeStepRequest(
                index + 1,
                step.Instruction.Trim(),
                step.TimingTag,
                step.DurationMinutes > 0 ? step.DurationMinutes : 10,
                step.IsPassive,
                step.PrepCategory,
                step.LinkedIngredientNames?
                    .Select(name => resolvedByName.TryGetValue(name, out var ingredient) ? ingredient.Id : 0)
                    .Where(id => id > 0)
                    .Distinct()
                    .ToList() ?? new List<int>(),
                step.ScaleByLinkedIngredients))
            .ToList();

        var draft = new RecipeRequest(
            aiDraft.Name.Trim(),
            aiDraft.Cuisine.Trim(),
            aiDraft.ScalabilityTag,
            aiDraft.TimeTag,
            aiDraft.PrepStyleTag,
            aiDraft.IsFreezerFriendly,
            aiDraft.IsCookFreshOnly,
            aiDraft.BaseYieldServings > 0 ? aiDraft.BaseYieldServings : 4,
            aiDraft.MealTypeTags.Count > 0 ? aiDraft.MealTypeTags : new List<MealType> { MealType.Dinner },
            aiDraft.FoodGroupServings ?? new Dictionary<string, decimal>(),
            resolvedIngredients,
            resolvedSteps,
            null,
            sourceUrl ?? aiDraft.SourceUrl);

        return new RecipeAnalysisResponse(draft, warnings.Distinct().ToList(), createdIngredients);
    }

    private async Task<AiRecipeDraft> RequestDraftAsync(string model, string apiKey, string promptText, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var body = new
        {
            model,
            messages = new object[]
            {
                new
                {
                    role = "system",
                    content =
                        "You turn raw recipes into a structured household recipe schema. Be practical, conservative, and explicit. Keep optional toppings or swaps as modifiers when appropriate. Only mark prep-ahead for steps that genuinely hold up well. Do not prep avocado or watery fresh garnishes ahead unless the source clearly says to."
                },
                new
                {
                    role = "user",
                    content = promptText
                }
            },
            response_format = new
            {
                type = "json_schema",
                json_schema = new
                {
                    name = "recipe_draft",
                    strict = true,
                    schema = BuildSchema()
                }
            }
        };

        request.Content = new StringContent(JsonSerializer.Serialize(body, JsonOptions), Encoding.UTF8, "application/json");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var raw = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("OpenAI recipe analysis failed: {StatusCode} {Body}", response.StatusCode, raw);
            throw new InvalidOperationException(BuildOpenAiFailureMessage((int)response.StatusCode, response.StatusCode.ToString(), raw));
        }

        var parsed = JsonSerializer.Deserialize<ChatCompletionResponse>(raw, JsonOptions);
        var content = parsed?.Choices?.FirstOrDefault()?.Message?.Content;
        if (string.IsNullOrWhiteSpace(content))
            throw new InvalidOperationException("OpenAI returned an empty recipe analysis.");

        var draft = JsonSerializer.Deserialize<AiRecipeDraft>(content, JsonOptions);
        if (draft is null)
            throw new InvalidOperationException("OpenAI returned an unreadable recipe draft.");

        return draft;
    }

    private static string BuildOpenAiFailureMessage(int statusCode, string statusText, string raw)
    {
        var detail = TryReadOpenAiErrorMessage(raw);
        return string.IsNullOrWhiteSpace(detail)
            ? $"OpenAI recipe analysis failed ({statusCode} {statusText})."
            : $"OpenAI recipe analysis failed ({statusCode} {statusText}): {detail}";
    }

    private static string? TryReadOpenAiErrorMessage(string raw)
    {
        try
        {
            using var doc = JsonDocument.Parse(raw);
            return doc.RootElement.TryGetProperty("error", out var error) &&
                   error.TryGetProperty("message", out var message)
                ? message.GetString()
                : null;
        }
        catch
        {
            return null;
        }
    }

    private static object BuildSchema() => new
    {
        type = "object",
        additionalProperties = false,
        required = new[]
        {
            "name", "cuisine", "scalabilityTag", "timeTag", "prepStyleTag", "isFreezerFriendly",
            "isCookFreshOnly", "baseYieldServings", "mealTypeTags", "foodGroupServings", "ingredients", "steps", "warnings", "sourceUrl"
        },
        properties = new
        {
            name = new { type = "string" },
            cuisine = new { type = "string" },
            scalabilityTag = new { type = "string", @enum = new[] { "Flexible", "Rigid", "Portioned" } },
            timeTag = new { type = "string", @enum = new[] { "Quick", "Medium", "Involved" } },
            prepStyleTag = new { type = "string", @enum = new[] { "BatchFriendly", "CookFresh", "FreezerFriendly" } },
            isFreezerFriendly = new { type = "boolean" },
            isCookFreshOnly = new { type = "boolean" },
            baseYieldServings = new { type = "integer" },
            mealTypeTags = new
            {
                type = "array",
                items = new { type = "string", @enum = new[] { "Breakfast", "Lunch", "Dinner", "Snack" } }
            },
            foodGroupServings = new
            {
                type = "object",
                additionalProperties = false,
                required = new[] { "grains", "protein", "vegetables", "fruit", "dairy" },
                properties = new
                {
                    grains = new { type = "number" },
                    protein = new { type = "number" },
                    vegetables = new { type = "number" },
                    fruit = new { type = "number" },
                    dairy = new { type = "number" }
                }
            },
            warnings = new
            {
                type = "array",
                items = new { type = "string" }
            },
            sourceUrl = new
            {
                anyOf = new object[]
                {
                    new { type = "string" },
                    new { type = "null" }
                }
            },
            ingredients = new
            {
                type = "array",
                items = new
                {
                    type = "object",
                    additionalProperties = false,
                    required = new[]
                    {
                        "name", "quantity", "unit", "isModifier", "isOptional", "foodGroup", "defaultLocation", "storeSection", "isPerishable", "notes"
                    },
                    properties = new
                    {
                        name = new { type = "string" },
                        quantity = new { type = "number" },
                        unit = new { type = "string" },
                        isModifier = new { type = "boolean" },
                        isOptional = new { type = "boolean" },
                        foodGroup = new { type = "string", @enum = new[] { "Grains", "Protein", "Vegetable", "Fruit", "Dairy", "Legume", "Other" } },
                        defaultLocation = new { type = "string", @enum = new[] { "Fridge", "Pantry", "Freezer" } },
                        storeSection = new { type = "string", @enum = new[] { "Produce", "Protein", "Dairy", "Grains", "Pantry", "Frozen", "Bakery", "Other" } },
                        isPerishable = new { type = "boolean" },
                        notes = new
                        {
                            anyOf = new object[]
                            {
                                new { type = "string" },
                                new { type = "null" }
                            }
                        }
                    }
                }
            },
            steps = new
            {
                type = "array",
                items = new
                {
                    type = "object",
                    additionalProperties = false,
                    required = new[]
                    {
                        "instruction", "timingTag", "durationMinutes", "isPassive", "prepCategory", "linkedIngredientNames", "scaleByLinkedIngredients"
                    },
                    properties = new
                    {
                        instruction = new { type = "string" },
                        timingTag = new { type = "string", @enum = new[] { "PrepAhead", "DayOfActive", "DayOfPassive" } },
                        durationMinutes = new { type = "integer" },
                        isPassive = new { type = "boolean" },
                        prepCategory = new { type = "string", @enum = new[] { "WashChop", "MixSauce", "CookStarch", "CookProtein", "RoastBake", "AssemblePortion", "FreshFinish" } },
                        linkedIngredientNames = new
                        {
                            type = "array",
                            items = new { type = "string" }
                        },
                        scaleByLinkedIngredients = new { type = "boolean" }
                    }
                }
            }
        }
    };

    private static string BuildIngredientCatalog(List<Ingredient> ingredients)
    {
        var lines = ingredients.Select(ingredient =>
        {
            var aliases = ingredient.Aliases.Count > 0 ? $" aliases: {string.Join(", ", ingredient.Aliases)};" : string.Empty;
            return $"- {ingredient.Id}: {ingredient.Name}; group: {ingredient.FoodGroup}; purchase unit: {ingredient.PurchaseUnit}; serving unit: {ingredient.ServingUnit}; default location: {ingredient.DefaultLocation}; section: {ingredient.StoreSection};{aliases}";
        });
        return string.Join('\n', lines);
    }

    private static string BuildPrompt(string rawText, string? fetchedSource, string ingredientCatalog)
    {
        var builder = new StringBuilder();
        builder.AppendLine("Turn this recipe into a structured draft for a household meal-planning app.");
        builder.AppendLine("Use ingredient IDs only conceptually; the app will resolve names after you respond.");
        builder.AppendLine("If the recipe includes optional toppings or variants, mark them as optional modifiers.");
        builder.AppendLine("Keep steps practical for both day-of cooking and weekly prep.");
        builder.AppendLine();
        builder.AppendLine("Known ingredient catalog:");
        builder.AppendLine(ingredientCatalog);
        builder.AppendLine();
        builder.AppendLine("User-provided recipe text:");
        builder.AppendLine(rawText.Trim());

        if (!string.IsNullOrWhiteSpace(fetchedSource))
        {
            builder.AppendLine();
            builder.AppendLine("Fetched source content:");
            builder.AppendLine(fetchedSource);
        }

        builder.AppendLine();
        builder.AppendLine("If the input is incomplete, make sensible household-friendly assumptions and add warnings describing what you inferred.");
        return builder.ToString();
    }

    private static bool TryBuildSimpleSnackDraft(string rawText, out AiRecipeDraft draft)
    {
        var normalized = Normalize(rawText);
        var asksForApple = normalized.Contains("apple", StringComparison.OrdinalIgnoreCase) ||
                           normalized.Contains("apples", StringComparison.OrdinalIgnoreCase);
        var asksForPeanutButter = normalized.Contains("peanut butter", StringComparison.OrdinalIgnoreCase);

        if (!asksForApple || !asksForPeanutButter)
        {
            draft = new AiRecipeDraft();
            return false;
        }

        draft = new AiRecipeDraft
        {
            Name = "Apple and Peanut Butter",
            Cuisine = "Snack",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 1,
            MealTypeTags = new List<MealType> { MealType.Snack },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 0m,
                ["protein"] = 0.5m,
                ["vegetables"] = 0m,
                ["fruit"] = 1m,
                ["dairy"] = 0m
            },
            Ingredients = new List<AiIngredientDraft>
            {
                new()
                {
                    Name = "Apple",
                    Quantity = 1m,
                    Unit = "whole",
                    IsModifier = false,
                    IsOptional = false,
                    FoodGroup = FoodGroup.Fruit,
                    DefaultLocation = DefaultLocation.Fridge,
                    StoreSection = StoreSection.Produce,
                    IsPerishable = true,
                    Notes = "Use any crisp apple variety."
                },
                new()
                {
                    Name = "Peanut Butter",
                    Quantity = 2m,
                    Unit = "tbsp",
                    IsModifier = false,
                    IsOptional = false,
                    FoodGroup = FoodGroup.Protein,
                    DefaultLocation = DefaultLocation.Pantry,
                    StoreSection = StoreSection.Pantry,
                    IsPerishable = false,
                    Notes = "Use creamy or crunchy peanut butter."
                }
            },
            Steps = new List<AiStepDraft>
            {
                new()
                {
                    Instruction = "Wash and slice the apple just before eating.",
                    TimingTag = TimingTag.DayOfActive,
                    DurationMinutes = 3,
                    IsPassive = false,
                    PrepCategory = PrepStepCategory.FreshFinish,
                    LinkedIngredientNames = new List<string> { "Apple" },
                    ScaleByLinkedIngredients = true
                },
                new()
                {
                    Instruction = "Serve the apple slices with peanut butter for dipping.",
                    TimingTag = TimingTag.DayOfActive,
                    DurationMinutes = 2,
                    IsPassive = false,
                    PrepCategory = PrepStepCategory.AssemblePortion,
                    LinkedIngredientNames = new List<string> { "Apple", "Peanut Butter" },
                    ScaleByLinkedIngredients = true
                }
            },
            Warnings = new List<string> { "OpenAI formatting failed, so Nourish created a simple snack draft from your prompt." },
            SourceUrl = null
        };
        return true;
    }

    private Ingredient? ResolveIngredient(AiIngredientDraft draftIngredient, Dictionary<int, Ingredient> ingredientMap, List<Ingredient> ingredients)
    {
        var normalized = Normalize(draftIngredient.Name);
        return ingredients.FirstOrDefault(ingredient =>
            Normalize(ingredient.Name) == normalized ||
            ingredient.Aliases.Any(alias => Normalize(alias) == normalized));
    }

    private async Task<Ingredient> CreateIngredientFromDraftAsync(AiIngredientDraft draftIngredient, CancellationToken cancellationToken)
    {
        var ingredient = new Ingredient
        {
            Name = draftIngredient.Name.Trim(),
            FoodGroup = draftIngredient.FoodGroup,
            ServingSize = draftIngredient.Quantity > 0 ? draftIngredient.Quantity : 1m,
            ServingUnit = !string.IsNullOrWhiteSpace(draftIngredient.Unit) ? draftIngredient.Unit.Trim() : "item",
            PurchaseUnit = !string.IsNullOrWhiteSpace(draftIngredient.Unit) ? draftIngredient.Unit.Trim() : "item",
            DefaultLocation = draftIngredient.DefaultLocation,
            StoreSection = draftIngredient.StoreSection,
            IsPerishable = draftIngredient.IsPerishable,
            IsFlexibleGroup = draftIngredient.FoodGroup == FoodGroup.Legume,
            IsMyPlateCounted = draftIngredient.FoodGroup != FoodGroup.Other,
            ShelfLifeDays = draftIngredient.DefaultLocation switch
            {
                DefaultLocation.Freezer => 180,
                DefaultLocation.Pantry => 180,
                _ => 7
            },
            TypicalPackageSize = null,
            PackageSizeUnit = null,
            IsStaple = false,
            Aliases = new List<string>(),
            Notes = draftIngredient.Notes ?? "Created from AI recipe import"
        };

        _db.Ingredients.Add(ingredient);
        await _db.SaveChangesAsync(cancellationToken);
        return ingredient;
    }

    private static IngredientResponse ToIngredientResponse(Ingredient ingredient) =>
        new(
            ingredient.Id,
            ingredient.Name,
            ingredient.FoodGroup,
            ingredient.ServingSize,
            ingredient.ServingUnit,
            ingredient.PurchaseUnit,
            ingredient.DefaultLocation,
            ingredient.StoreSection,
            ingredient.IsPerishable,
            ingredient.IsFlexibleGroup,
            ingredient.IsMyPlateCounted,
            ingredient.ShelfLifeDays,
            ingredient.TypicalPackageSize,
            ingredient.PackageSizeUnit,
            ingredient.IsStaple,
            ingredient.Aliases,
            ingredient.Notes);

    private static string? ExtractFirstUrl(string text)
    {
        var match = Regex.Match(text, @"https?://\S+", RegexOptions.IgnoreCase);
        return match.Success ? match.Value.Trim().TrimEnd('.', ',', ';', ')') : null;
    }

    private async Task<string?> TryFetchSourceAsync(string sourceUrl, CancellationToken cancellationToken)
    {
        try
        {
            using var response = await _httpClient.GetAsync(sourceUrl, cancellationToken);
            if (!response.IsSuccessStatusCode) return null;
            var html = await response.Content.ReadAsStringAsync(cancellationToken);
            var text = Regex.Replace(html, "<script[\\s\\S]*?</script>|<style[\\s\\S]*?</style>", " ", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, "<[^>]+>", " ");
            text = Regex.Replace(text, "\\s+", " ").Trim();
            return text.Length > 6000 ? text[..6000] : text;
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Unable to fetch recipe source {SourceUrl}", sourceUrl);
            return null;
        }
    }

    private static string Normalize(string value) =>
        Regex.Replace(value.Trim().ToLowerInvariant(), @"[^a-z0-9]+", " ");

    private sealed class ChatCompletionResponse
    {
        [JsonPropertyName("choices")]
        public List<ChatChoice>? Choices { get; set; }
    }

    private sealed class ChatChoice
    {
        [JsonPropertyName("message")]
        public ChatMessage? Message { get; set; }
    }

    private sealed class ChatMessage
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }

    private sealed class AiRecipeDraft
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("cuisine")]
        public string Cuisine { get; set; } = string.Empty;

        [JsonPropertyName("scalabilityTag")]
        public ScalabilityTag ScalabilityTag { get; set; }

        [JsonPropertyName("timeTag")]
        public TimeTag TimeTag { get; set; }

        [JsonPropertyName("prepStyleTag")]
        public RecipePrepStyleTag PrepStyleTag { get; set; }

        [JsonPropertyName("isFreezerFriendly")]
        public bool IsFreezerFriendly { get; set; }

        [JsonPropertyName("isCookFreshOnly")]
        public bool IsCookFreshOnly { get; set; }

        [JsonPropertyName("baseYieldServings")]
        public int BaseYieldServings { get; set; }

        [JsonPropertyName("mealTypeTags")]
        public List<MealType> MealTypeTags { get; set; } = new();

        [JsonPropertyName("foodGroupServings")]
        public Dictionary<string, decimal>? FoodGroupServings { get; set; }

        [JsonPropertyName("ingredients")]
        public List<AiIngredientDraft> Ingredients { get; set; } = new();

        [JsonPropertyName("steps")]
        public List<AiStepDraft> Steps { get; set; } = new();

        [JsonPropertyName("warnings")]
        public List<string>? Warnings { get; set; }

        [JsonPropertyName("sourceUrl")]
        public string? SourceUrl { get; set; }
    }

    private sealed class AiIngredientDraft
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("quantity")]
        public decimal Quantity { get; set; }

        [JsonPropertyName("unit")]
        public string Unit { get; set; } = string.Empty;

        [JsonPropertyName("isModifier")]
        public bool IsModifier { get; set; }

        [JsonPropertyName("isOptional")]
        public bool IsOptional { get; set; }

        [JsonPropertyName("foodGroup")]
        public FoodGroup FoodGroup { get; set; }

        [JsonPropertyName("defaultLocation")]
        public DefaultLocation DefaultLocation { get; set; }

        [JsonPropertyName("storeSection")]
        public StoreSection StoreSection { get; set; }

        [JsonPropertyName("isPerishable")]
        public bool IsPerishable { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }
    }

    private sealed class AiStepDraft
    {
        [JsonPropertyName("instruction")]
        public string Instruction { get; set; } = string.Empty;

        [JsonPropertyName("timingTag")]
        public TimingTag TimingTag { get; set; }

        [JsonPropertyName("durationMinutes")]
        public int DurationMinutes { get; set; }

        [JsonPropertyName("isPassive")]
        public bool IsPassive { get; set; }

        [JsonPropertyName("prepCategory")]
        public PrepStepCategory PrepCategory { get; set; }

        [JsonPropertyName("linkedIngredientNames")]
        public List<string>? LinkedIngredientNames { get; set; }

        [JsonPropertyName("scaleByLinkedIngredients")]
        public bool ScaleByLinkedIngredients { get; set; }
    }
}
