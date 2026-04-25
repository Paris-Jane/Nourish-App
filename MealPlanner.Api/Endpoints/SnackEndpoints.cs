using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Models;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class SnackEndpoints
{
    public static void MapSnackEndpoints(this IEndpointRouteBuilder app)
    {
        var weekGroup = app.MapGroup("/api/weeks").RequireAuthorization().WithTags("Snacks");
        weekGroup.MapGet("/{weekId:int}/snack-suggestions", GetSuggestions);
        weekGroup.MapPost("/{weekId:int}/snack-suggestions/generate", Generate);

        var snackGroup = app.MapGroup("/api/snack-suggestions").RequireAuthorization().WithTags("Snacks");
        snackGroup.MapPut("/{id:int}/accept", Accept);
    }

    private static async Task<IResult> GetSuggestions(int weekId, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == weekId && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var suggestions = await db.SnackSuggestions
            .Where(s => s.WeekId == weekId)
            .OrderBy(s => s.DayOfWeek)
            .ToListAsync();

        return Results.Ok(suggestions.Select(ToDto));
    }

    private static async Task<IResult> Generate(
        int weekId, AppDbContext db, ClaimsPrincipal user, INutritionGapService gapService)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == weekId && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var existing = await db.SnackSuggestions.Where(s => s.WeekId == weekId).ToListAsync();
        db.SnackSuggestions.RemoveRange(existing);

        var gaps = await gapService.GetDailyGapAmountsAsync(weekId);

        var expiringItems = await db.FridgeItems
            .Include(f => f.Ingredient)
            .Where(f => f.HouseholdId == householdId &&
                        f.ExpiresAt.HasValue &&
                        f.ExpiresAt.Value <= DateTime.UtcNow.AddDays(3) &&
                        f.Quantity > 0)
            .ToListAsync();

        var created = new List<SnackSuggestion>();

        foreach (var (day, dayGaps) in gaps)
        {
            if (dayGaps.Count == 0) continue;

            var selections = SelectSnacksForDay(dayGaps, expiringItems);

            foreach (var (item, servings, fridgeItemId) in selections)
            {
                var coveredGroups = item.MyPlateServings.Keys
                    .Where(g => dayGaps.ContainsKey(g))
                    .OrderBy(g => g);

                var snack = new SnackSuggestion
                {
                    WeekId = weekId,
                    DayOfWeek = day,
                    SuggestionText = DescribeSnack(item, servings),
                    FoodGroupTarget = string.Join(",", coveredGroups),
                    UsesFridgeItemId = fridgeItemId,
                    CreatedAt = DateTime.UtcNow
                };
                db.SnackSuggestions.Add(snack);
                created.Add(snack);
            }
        }

        await db.SaveChangesAsync();
        return Results.Created($"/api/weeks/{weekId}/snack-suggestions", created.Select(ToDto));
    }

    private static async Task<IResult> Accept(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var snack = await db.SnackSuggestions
            .Include(s => s.Week)
            .FirstOrDefaultAsync(s => s.Id == id && s.Week.HouseholdId == householdId);
        if (snack == null) return Results.NotFound();

        snack.IsAccepted = true;
        await db.SaveChangesAsync();
        return Results.Ok(ToDto(snack));
    }

    // ── Selection algorithm ────────────────────────────────────────────────────

    /// <summary>
    /// Greedily picks up to 3 snack items from <see cref="SnackCatalog"/> to fill the given daily gaps.
    /// Combos (items covering multiple food groups) are preferred when their coverage score ties.
    /// Expiring fridge items are matched to note urgency when they cover the same food group.
    /// </summary>
    private static List<(SnackItem Item, int Servings, int? FridgeItemId)> SelectSnacksForDay(
        Dictionary<string, decimal> gaps,
        List<FridgeItem> expiringItems)
    {
        var remaining = new Dictionary<string, decimal>(gaps);
        var selected = new List<(SnackItem, int, int?)>();
        var usedNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        while (remaining.Any(kv => kv.Value > 0) && selected.Count < 3)
        {
            var best = SnackCatalog.Items
                .Where(item => !usedNames.Contains(item.Name))
                .Select(item =>
                {
                    // Coverage = sum of min(gap, item servings) for each shared food group
                    var coverage = item.MyPlateServings
                        .Sum(kv => remaining.TryGetValue(kv.Key, out var rem) ? Math.Min(rem, kv.Value) : 0m);
                    return (item, coverage);
                })
                .Where(x => x.coverage > 0)
                .OrderByDescending(x => x.coverage)
                .ThenByDescending(x => x.item.MyPlateServings.Count) // prefer combos when scores tie
                .Select(x => x.item)
                .FirstOrDefault();

            if (best == null) break;

            var servings = ComputeServings(best, remaining);

            // Attach the first expiring fridge item whose food group this snack covers
            var fridgeItemId = expiringItems
                .FirstOrDefault(f => best.MyPlateServings.ContainsKey(FridgeGroupKey(f.Ingredient.FoodGroup)))
                ?.Id;

            usedNames.Add(best.Name);
            selected.Add((best, servings, fridgeItemId));
            ReduceRemaining(remaining, best, servings);
        }

        return selected;
    }

    /// <summary>
    /// How many servings of <paramref name="item"/> are needed to fill the primary gap.
    /// Combo items always use 1 serving; single-group items scale up to 2.
    /// </summary>
    private static int ComputeServings(SnackItem item, Dictionary<string, decimal> remaining)
    {
        if (item.MyPlateServings.Count > 1) return 1;

        var (group, itemServings) = item.MyPlateServings.First();
        if (!remaining.TryGetValue(group, out var gapAmount) || itemServings <= 0) return 1;
        return Math.Min(2, (int)Math.Ceiling(gapAmount / itemServings));
    }

    private static void ReduceRemaining(Dictionary<string, decimal> remaining, SnackItem item, int servings)
    {
        foreach (var (group, provided) in item.MyPlateServings)
        {
            if (remaining.TryGetValue(group, out var rem))
                remaining[group] = Math.Max(0, rem - provided * servings);
        }
    }

    private static string DescribeSnack(SnackItem item, int servings)
    {
        if (servings <= 1) return item.ServingDescription;
        return item.DoubleServingDescription ?? $"2× {item.ServingDescription}";
    }

    private static string FridgeGroupKey(FoodGroup group) => group switch
    {
        FoodGroup.Fruit     => "fruit",
        FoodGroup.Vegetable => "vegetables",
        FoodGroup.Dairy     => "dairy",
        FoodGroup.Grains    => "grains",
        FoodGroup.Protein   => "protein",
        FoodGroup.Legume    => "protein",
        _                   => string.Empty
    };

    private static SnackSuggestionResponse ToDto(SnackSuggestion s) => new(
        s.Id, s.WeekId, s.DayOfWeek, s.SuggestionText,
        s.FoodGroupTarget, s.UsesFridgeItemId, s.IsAccepted, s.CreatedAt);
}
