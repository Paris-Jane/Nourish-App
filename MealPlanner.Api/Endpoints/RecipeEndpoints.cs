using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Models;

namespace MealPlanner.Api.Endpoints;

public static class RecipeEndpoints
{
    public static void MapRecipeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/recipes").RequireAuthorization().WithTags("Recipes").WithOpenApi();

        group.MapGet("/", GetAll);
        group.MapGet("/search", Search);
        group.MapGet("/saved-templates", GetSavedTemplates);
        group.MapGet("/{id:int}", GetById);
        group.MapPost("/", Create);
        group.MapPut("/{id:int}", Update);
        group.MapDelete("/{id:int}", Delete);
        group.MapGet("/{id:int}/steps", GetSteps);
        group.MapPost("/{id:int}/steps", AddStep);
        group.MapGet("/{id:int}/preferences", GetPreferences);
        group.MapPut("/{id:int}/preferences", UpsertPreferences);
    }

    private static async Task<IResult> GetAll(AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var recipes = await db.Recipes
            .Include(r => r.Ingredients).ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .Where(r => r.HouseholdId == householdId)
            .ToListAsync();
        return Results.Ok(recipes.Select(ToDto));
    }

    private static async Task<IResult> Search(
        AppDbContext db,
        ClaimsPrincipal user,
        string? query = null,
        string? cuisine = null,
        TimeTag? timeTag = null,
        RecipePrepStyleTag? prepStyle = null,
        bool? inFridge = null)
    {
        var householdId = user.GetHouseholdId();
        var q = db.Recipes
            .Include(r => r.Ingredients).ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .Where(r => r.HouseholdId == householdId);

        if (!string.IsNullOrWhiteSpace(query))
            q = q.Where(r => r.Name.Contains(query) || r.Cuisine.Contains(query));
        if (!string.IsNullOrWhiteSpace(cuisine))
            q = q.Where(r => r.Cuisine == cuisine);
        if (timeTag.HasValue)
            q = q.Where(r => r.TimeTag == timeTag.Value);
        if (prepStyle.HasValue)
            q = q.Where(r => r.PrepStyleTag == prepStyle.Value);

        var recipes = await q.ToListAsync();

        if (inFridge == true)
        {
            var fridgeIngredientIds = await db.FridgeItems
                .Where(f => f.HouseholdId == householdId && f.Quantity > 0)
                .Select(f => f.IngredientId)
                .Distinct()
                .ToListAsync();

            recipes = recipes.Where(r =>
            {
                var core = r.Ingredients.Where(i => !i.IsOptional && !i.IsModifier).Select(i => i.IngredientId).ToList();
                return core.Count > 0 && core.All(id => fridgeIngredientIds.Contains(id));
            }).ToList();
        }

        return Results.Ok(recipes.Select(ToDto));
    }

    private static async Task<IResult> GetSavedTemplates(AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var templates = await db.Weeks
            .Where(w => w.HouseholdId == householdId && w.IsSavedTemplate)
            .ToListAsync();
        return Results.Ok(templates.Select(w => new WeekResponse(
            w.Id, w.HouseholdId, w.WeekStartDate, w.Status, w.PrepStyle,
            w.MaxCookTime, w.IsSavedTemplate, w.TemplateName, w.IsInRotation, w.CreatedAt)));
    }

    private static async Task<IResult> GetById(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var recipe = await db.Recipes
            .Include(r => r.Ingredients).ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == id && r.HouseholdId == householdId);
        return recipe == null ? Results.NotFound() : Results.Ok(ToDto(recipe));
    }

    private static async Task<IResult> Create(RecipeRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var recipe = new Recipe
        {
            HouseholdId = householdId,
            Name = req.Name,
            Cuisine = req.Cuisine,
            ScalabilityTag = req.ScalabilityTag,
            TimeTag = req.TimeTag,
            PrepStyleTag = req.PrepStyleTag,
            IsFreezerFriendly = req.IsFreezerFriendly,
            IsCookFreshOnly = req.IsCookFreshOnly,
            BaseYieldServings = req.BaseYieldServings,
            MealTypeTags = req.MealTypeTags,
            ImageUrl = req.ImageUrl,
            SourceUrl = req.SourceUrl,
            FoodGroupServings = req.FoodGroupServings,
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();

        foreach (var ing in req.Ingredients)
        {
            db.RecipeIngredients.Add(new RecipeIngredient
            {
                RecipeId = recipe.Id,
                IngredientId = ing.IngredientId,
                Quantity = ing.Quantity,
                Unit = ing.Unit,
                IsModifier = ing.IsModifier,
                IsOptional = ing.IsOptional,
                SubstituteIngredientIds = ing.SubstituteIngredientIds ?? new List<int>(),
                Notes = ing.Notes
            });
        }
        await db.SaveChangesAsync();

        var created = await db.Recipes
            .Include(r => r.Ingredients).ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .FirstAsync(r => r.Id == recipe.Id);

        return Results.Created($"/api/recipes/{recipe.Id}", ToDto(created));
    }

    private static async Task<IResult> Update(int id, RecipeRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var recipe = await db.Recipes
            .Include(r => r.Ingredients)
            .FirstOrDefaultAsync(r => r.Id == id && r.HouseholdId == householdId);
        if (recipe == null) return Results.NotFound();

        recipe.Name = req.Name;
        recipe.Cuisine = req.Cuisine;
        recipe.ScalabilityTag = req.ScalabilityTag;
        recipe.TimeTag = req.TimeTag;
        recipe.PrepStyleTag = req.PrepStyleTag;
        recipe.IsFreezerFriendly = req.IsFreezerFriendly;
        recipe.IsCookFreshOnly = req.IsCookFreshOnly;
        recipe.BaseYieldServings = req.BaseYieldServings;
        recipe.MealTypeTags = req.MealTypeTags;
        recipe.ImageUrl = req.ImageUrl;
        recipe.SourceUrl = req.SourceUrl;
        recipe.FoodGroupServings = req.FoodGroupServings;

        db.RecipeIngredients.RemoveRange(recipe.Ingredients);
        foreach (var ing in req.Ingredients)
        {
            db.RecipeIngredients.Add(new RecipeIngredient
            {
                RecipeId = recipe.Id,
                IngredientId = ing.IngredientId,
                Quantity = ing.Quantity,
                Unit = ing.Unit,
                IsModifier = ing.IsModifier,
                IsOptional = ing.IsOptional,
                SubstituteIngredientIds = ing.SubstituteIngredientIds ?? new List<int>(),
                Notes = ing.Notes
            });
        }
        await db.SaveChangesAsync();

        var updated = await db.Recipes
            .Include(r => r.Ingredients).ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .FirstAsync(r => r.Id == id);
        return Results.Ok(ToDto(updated));
    }

    private static async Task<IResult> Delete(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var recipe = await db.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.HouseholdId == householdId);
        if (recipe == null) return Results.NotFound();
        db.Recipes.Remove(recipe);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> GetSteps(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Recipes.AnyAsync(r => r.Id == id && r.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var steps = await db.RecipeSteps
            .Where(s => s.RecipeId == id)
            .OrderBy(s => s.StepNumber)
            .ToListAsync();

        return Results.Ok(steps.Select(s => new RecipeStepResponse(
            s.Id, s.StepNumber, s.Instruction, s.TimingTag, s.DurationMinutes, s.IsPassive)));
    }

    private static async Task<IResult> AddStep(int id, RecipeStepRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Recipes.AnyAsync(r => r.Id == id && r.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var step = new RecipeStep
        {
            RecipeId = id,
            StepNumber = req.StepNumber,
            Instruction = req.Instruction,
            TimingTag = req.TimingTag,
            DurationMinutes = req.DurationMinutes,
            IsPassive = req.IsPassive
        };
        db.RecipeSteps.Add(step);
        await db.SaveChangesAsync();

        return Results.Created($"/api/recipes/{id}/steps",
            new RecipeStepResponse(step.Id, step.StepNumber, step.Instruction, step.TimingTag, step.DurationMinutes, step.IsPassive));
    }

    private static async Task<IResult> GetPreferences(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var pref = await db.UserRecipePrefs.FirstOrDefaultAsync(p => p.HouseholdId == householdId && p.RecipeId == id);
        if (pref == null) return Results.NotFound();
        return Results.Ok(new RecipePreferenceResponse(pref.Id, pref.RecipeId, pref.IsFavorite, pref.IsDisliked, pref.LastUsedAt));
    }

    private static async Task<IResult> UpsertPreferences(
        int id, RecipePreferenceRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Recipes.AnyAsync(r => r.Id == id && r.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var pref = await db.UserRecipePrefs.FirstOrDefaultAsync(p => p.HouseholdId == householdId && p.RecipeId == id);
        if (pref == null)
        {
            pref = new UserRecipePref { HouseholdId = householdId, RecipeId = id };
            db.UserRecipePrefs.Add(pref);
        }

        if (req.IsFavorite.HasValue) pref.IsFavorite = req.IsFavorite.Value;
        if (req.IsDisliked.HasValue) pref.IsDisliked = req.IsDisliked.Value;
        await db.SaveChangesAsync();

        return Results.Ok(new RecipePreferenceResponse(pref.Id, pref.RecipeId, pref.IsFavorite, pref.IsDisliked, pref.LastUsedAt));
    }

    private static RecipeResponse ToDto(Recipe r) => new(
        r.Id, r.HouseholdId, r.Name, r.Cuisine, r.ScalabilityTag, r.TimeTag, r.PrepStyleTag,
        r.IsFreezerFriendly, r.IsCookFreshOnly, r.BaseYieldServings, r.MealTypeTags, r.ImageUrl, r.SourceUrl,
        r.FoodGroupServings, r.CreatedAt,
        r.Ingredients.Select(i => new RecipeIngredientResponse(
            i.Id, i.IngredientId, i.Ingredient?.Name ?? string.Empty,
            i.Quantity, i.Unit, i.IsModifier, i.IsOptional,
            i.SubstituteIngredientIds, i.Notes)).ToList(),
        r.Steps.OrderBy(s => s.StepNumber).Select(s => new RecipeStepResponse(
            s.Id, s.StepNumber, s.Instruction, s.TimingTag, s.DurationMinutes, s.IsPassive)).ToList()
    );
}
