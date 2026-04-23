using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Models;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class WeekEndpoints
{
    public static void MapWeekEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/weeks").RequireAuthorization().WithTags("Weeks");

        group.MapPost("/", CreateWeek);
        group.MapGet("/saved", GetSavedTemplates);
        group.MapGet("/{id:int}", GetWeek);
        group.MapGet("/{id:int}/preferences", GetPreferences);
        group.MapPut("/{id:int}", UpdateWeek);
        group.MapPut("/{id:int}/preferences", UpsertPreferences);
        group.MapPost("/{id:int}/generate", GeneratePlan);
        group.MapPost("/{id:int}/approve", ApproveWeek);
        group.MapGet("/{id:int}/slots", GetSlots);
        group.MapPut("/{id:int}/slots/{slotId:int}", UpdateSlot);
        group.MapPost("/{id:int}/slots/{slotId:int}/skip", SkipSlot);
        group.MapPost("/{id:int}/save-as-template", SaveAsTemplate);
        group.MapPut("/{id:int}/rotation", ToggleRotation);
    }

    private static async Task<IResult> CreateWeek(CreateWeekRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();

        // Fetch household size to use as default ServingsPlanned — avoid null nav property
        var householdSize = await db.Households
            .Where(h => h.Id == householdId)
            .Select(h => h.Size)
            .FirstOrDefaultAsync();
        var defaultServings = householdSize > 0 ? householdSize : 2;

        var week = new Week
        {
            HouseholdId = householdId,
            WeekStartDate = req.WeekStartDate,
            Status = WeekStatus.Draft,
            PrepStyle = req.PrepStyle,
            MaxCookTime = req.MaxCookTime,
            CreatedAt = DateTime.UtcNow
        };
        db.Weeks.Add(week);
        await db.SaveChangesAsync();

        // Create all 28 meal slots (7 days × 4 meal types)
        foreach (var day in Enum.GetValues<WeekDay>())
        {
            foreach (var mealType in Enum.GetValues<MealType>())
            {
                db.WeekMealSlots.Add(new WeekMealSlot
                {
                    WeekId = week.Id,
                    SelectedModifierIngredientIds = new List<int>(),
                    DayOfWeek = day,
                    MealType = mealType,
                    ServingsPlanned = defaultServings
                });
            }
        }
        await db.SaveChangesAsync();

        return Results.Created($"/api/weeks/{week.Id}", ToDto(week));
    }

    private static async Task<IResult> GetSavedTemplates(AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var weeks = await db.Weeks
            .Where(w => w.HouseholdId == householdId && w.IsSavedTemplate)
            .ToListAsync();
        return Results.Ok(weeks.Select(ToDto));
    }

    private static async Task<IResult> GetWeek(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks.FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        return week == null ? Results.NotFound() : Results.Ok(ToDto(week));
    }

    private static async Task<IResult> GetPreferences(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var userId = user.GetUserId();
        var weekExists = await db.Weeks.AnyAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (!weekExists) return Results.NotFound();

        var pref = await db.UserWeekPrefs.FirstOrDefaultAsync(p => p.UserId == userId && p.WeekId == id);
        if (pref == null) return Results.NotFound();

        return Results.Ok(new WeekPreferenceResponse(pref.Id, pref.UserId, pref.WeekId, pref.IsFavorite));
    }

    private static async Task<IResult> UpdateWeek(int id, UpdateWeekRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks.FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        if (req.PrepStyle.HasValue) week.PrepStyle = req.PrepStyle.Value;
        if (req.MaxCookTime.HasValue) week.MaxCookTime = req.MaxCookTime.Value;
        if (req.Status.HasValue) week.Status = req.Status.Value;
        await db.SaveChangesAsync();

        return Results.Ok(ToDto(week));
    }

    private static async Task<IResult> UpsertPreferences(
        int id, WeekPreferenceRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var userId = user.GetUserId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var pref = await db.UserWeekPrefs.FirstOrDefaultAsync(p => p.UserId == userId && p.WeekId == id);
        if (pref == null)
        {
            pref = new UserWeekPref { UserId = userId, WeekId = id };
            db.UserWeekPrefs.Add(pref);
        }

        if (req.IsFavorite.HasValue) pref.IsFavorite = req.IsFavorite.Value;
        await db.SaveChangesAsync();

        return Results.Ok(new WeekPreferenceResponse(pref.Id, pref.UserId, pref.WeekId, pref.IsFavorite));
    }

    private static async Task<IResult> GeneratePlan(int id, AppDbContext db, ClaimsPrincipal user, IPlanGeneratorService generator)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var slots = await generator.GeneratePlanAsync(id);
        return Results.Ok(new { generated = slots.Count, weekId = id });
    }

    private static async Task<IResult> ApproveWeek(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks.FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        week.Status = WeekStatus.Active;
        await db.SaveChangesAsync();

        return Results.Ok(ToDto(week));
    }

    private static async Task<IResult> GetSlots(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var slots = await db.WeekMealSlots
            .Include(s => s.Recipe)
            .Where(s => s.WeekId == id)
            .OrderBy(s => s.DayOfWeek).ThenBy(s => s.MealType)
            .ToListAsync();

        return Results.Ok(slots.Select(ToSlotDto));
    }

    private static async Task<IResult> UpdateSlot(
        int id, int slotId, UpdateMealSlotRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var slot = await db.WeekMealSlots
            .Include(s => s.Week)
            .Include(s => s.Recipe)
            .FirstOrDefaultAsync(s => s.Id == slotId && s.WeekId == id && s.Week.HouseholdId == householdId);
        if (slot == null) return Results.NotFound();

        var recipeChanged = false;
        if (req.RecipeId.HasValue)
        {
            var nextRecipeId = req.RecipeId.Value == 0 ? null : req.RecipeId.Value;
            recipeChanged = slot.RecipeId != nextRecipeId;
            slot.RecipeId = nextRecipeId;
            if (recipeChanged && req.SelectedModifierIngredientIds == null)
            {
                slot.SelectedModifierIngredientIds = new List<int>();
            }
        }
        if (req.SelectedModifierIngredientIds != null)
        {
            slot.SelectedModifierIngredientIds = req.SelectedModifierIngredientIds.Distinct().ToList();
        }
        if (req.IsEatingOut.HasValue) slot.IsEatingOut = req.IsEatingOut.Value;
        if (req.IsSkipped.HasValue) slot.IsSkipped = req.IsSkipped.Value;
        if (req.IsLocked.HasValue) slot.IsLocked = req.IsLocked.Value;
        if (req.ServingsPlanned.HasValue) slot.ServingsPlanned = req.ServingsPlanned.Value;
        await db.SaveChangesAsync();

        await db.Entry(slot).Reference(s => s.Recipe).LoadAsync();
        return Results.Ok(ToSlotDto(slot));
    }

    private static async Task<IResult> SkipSlot(
        int id, int slotId, AppDbContext db, ClaimsPrincipal user, IFridgeService fridgeService)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.WeekMealSlots
            .Include(s => s.Week)
            .AnyAsync(s => s.Id == slotId && s.WeekId == id && s.Week.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        await fridgeService.ReverseDepletionForSlotAsync(slotId);
        return Results.Ok(new { slotId, skipped = true });
    }

    private static async Task<IResult> SaveAsTemplate(int id, SaveAsTemplateRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks.FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        week.IsSavedTemplate = true;
        week.TemplateName = req.TemplateName;
        await db.SaveChangesAsync();

        return Results.Ok(ToDto(week));
    }

    private static async Task<IResult> ToggleRotation(int id, ToggleRotationRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks.FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        week.IsInRotation = req.IsInRotation;
        await db.SaveChangesAsync();

        return Results.Ok(ToDto(week));
    }

    private static WeekResponse ToDto(Week w) => new(
        w.Id, w.HouseholdId, w.WeekStartDate, w.Status, w.PrepStyle,
        w.MaxCookTime, w.IsSavedTemplate, w.TemplateName, w.IsInRotation, w.CreatedAt);

    private static WeekMealSlotResponse ToSlotDto(WeekMealSlot s) => new(
        s.Id, s.WeekId, s.RecipeId, s.Recipe?.Name, s.SelectedModifierIngredientIds,
        s.DayOfWeek, s.MealType, s.IsEatingOut, s.IsSkipped,
        s.IsLocked, s.ServingsPlanned, s.AssumedCompleted, s.MarkedSkippedAt);
}
