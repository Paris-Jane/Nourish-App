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

        // Remove existing suggestions
        var existing = await db.SnackSuggestions.Where(s => s.WeekId == weekId).ToListAsync();
        db.SnackSuggestions.RemoveRange(existing);

        var gaps = await gapService.GetDailyGapsAsync(weekId);

        // Get expiring fridge items to incorporate
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
            foreach (var gap in dayGaps)
            {
                var suggestion = BuildSuggestion(gap, expiringItems);
                var snack = new SnackSuggestion
                {
                    WeekId = weekId,
                    DayOfWeek = day,
                    SuggestionText = suggestion.Text,
                    FoodGroupTarget = gap,
                    UsesFridgeItemId = suggestion.FridgeItemId,
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

    private static (string Text, int? FridgeItemId) BuildSuggestion(string gap, List<FridgeItem> expiringItems)
    {
        // Try to use an expiring fridge item that matches the food group
        var groupEnum = gap.ToLower() switch
        {
            "fruit"      => FoodGroup.Fruit,
            "vegetables" => FoodGroup.Vegetable,
            "dairy"      => FoodGroup.Dairy,
            "grains"     => FoodGroup.Grains,
            "protein"    => FoodGroup.Protein,
            _            => (FoodGroup?)null
        };

        if (groupEnum.HasValue)
        {
            var match = expiringItems.FirstOrDefault(f => f.Ingredient.FoodGroup == groupEnum.Value);
            if (match != null)
                return ($"Use up {match.Ingredient.Name} — try it as a snack to hit your {gap} goal.", match.Id);
        }

        var defaultText = gap.ToLower() switch
        {
            "fruit"      => "Add a piece of fresh fruit as a mid-morning snack.",
            "vegetables" => "Try baby carrots with hummus or a small side salad.",
            "dairy"      => "Have a glass of milk or a cup of yogurt between meals.",
            "grains"     => "Snack on a small portion of whole-grain crackers.",
            "protein"    => "Try a hard-boiled egg or a handful of nuts for a protein boost.",
            _            => $"Add a snack to fill your {gap} gap for the day."
        };

        return (defaultText, null);
    }

    private static SnackSuggestionResponse ToDto(SnackSuggestion s) => new(
        s.Id, s.WeekId, s.DayOfWeek, s.SuggestionText,
        s.FoodGroupTarget, s.UsesFridgeItemId, s.IsAccepted, s.CreatedAt);
}
