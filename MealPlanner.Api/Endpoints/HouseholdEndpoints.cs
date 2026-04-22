using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class HouseholdEndpoints
{
    public static void MapHouseholdEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/households").RequireAuthorization().WithTags("Households").WithOpenApi();

        group.MapGet("/{id:int}", GetHousehold);
        group.MapPut("/{id:int}/preferences", UpdatePreferences);
    }

    private static async Task<IResult> GetHousehold(int id, AppDbContext db, ClaimsPrincipal user)
    {
        if (user.GetHouseholdId() != id) return Results.Forbid();

        var household = await db.Households.FindAsync(id);
        if (household == null) return Results.NotFound();

        return Results.Ok(new HouseholdResponse(
            household.Id, household.Name, household.Size,
            household.Timezone, household.CreatedAt, household.UpdatedAt));
    }

    private static async Task<IResult> UpdatePreferences(
        int id,
        HouseholdPreferencesRequest req,
        AppDbContext db,
        ClaimsPrincipal user,
        IMyPlateService myPlate)
    {
        if (user.GetHouseholdId() != id) return Results.Forbid();

        var prefs = await db.HouseholdPreferences.FirstOrDefaultAsync(p => p.HouseholdId == id);
        if (prefs == null) return Results.NotFound();

        prefs.DietaryRestrictions = req.DietaryRestrictions;
        prefs.DislikedIngredients = req.DislikedIngredients;
        prefs.CuisinePreferences = req.CuisinePreferences;
        prefs.DefaultCookTime = req.DefaultCookTime;
        prefs.DefaultPrepStyle = req.DefaultPrepStyle;
        prefs.UpdatedAt = DateTime.UtcNow;

        // Recalculate MyPlate targets based on household owner
        var owner = await db.Users
            .FirstOrDefaultAsync(u => u.HouseholdId == id && u.Role == UserRole.Owner);
        if (owner != null)
            prefs.MyPlateTargets = myPlate.Calculate(owner.Age, owner.Sex, owner.ActivityLevel);

        await db.SaveChangesAsync();

        return Results.Ok(new HouseholdPreferencesResponse(
            prefs.Id, prefs.HouseholdId,
            prefs.DietaryRestrictions, prefs.DislikedIngredients, prefs.CuisinePreferences,
            prefs.DefaultCookTime, prefs.DefaultPrepStyle, prefs.MyPlateTargets, prefs.UpdatedAt));
    }
}
