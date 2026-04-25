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
        group.MapPost("/{id:int}/slots", CreateSlot);
        group.MapPut("/{id:int}/slots/{slotId:int}", UpdateSlot);
        group.MapDelete("/{id:int}/slots/{slotId:int}", DeleteSlot);
        group.MapPost("/{id:int}/slots/{slotId:int}/skip", SkipSlot);
        group.MapPost("/{id:int}/clear", ClearWeek);
        group.MapPost("/{id:int}/apply-template", ApplyTemplate);
        group.MapPost("/{id:int}/save-as-template", SaveAsTemplate);
        group.MapPut("/{id:int}/rotation", ToggleRotation);
        group.MapDelete("/saved/{id:int}", DeleteSavedTemplate);
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
                    Position = 0,
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
            .Include(w => w.MealSlots)
            .ThenInclude(s => s.Recipe)
            .Where(w => w.HouseholdId == householdId && w.IsSavedTemplate)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();
        return Results.Ok(weeks.Select(ToSavedTemplateDto));
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
            .OrderBy(s => s.DayOfWeek).ThenBy(s => s.MealType).ThenBy(s => s.Position)
            .ToListAsync();

        return Results.Ok(slots.Select(ToSlotDto));
    }

    private static async Task<IResult> CreateSlot(
        int id, CreateWeekMealSlotRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks
            .Include(w => w.MealSlots)
            .FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        if (req.MealType != MealType.Snack)
        {
            return Results.BadRequest(new { message = "Only additional snack slots can be created." });
        }

        var nextPosition = week.MealSlots
            .Where(s => s.DayOfWeek == req.DayOfWeek && s.MealType == req.MealType)
            .Select(s => s.Position)
            .DefaultIfEmpty(-1)
            .Max() + 1;

        var defaultServings = req.ServingsPlanned
            ?? week.MealSlots.FirstOrDefault(s => s.DayOfWeek == req.DayOfWeek && s.MealType == req.MealType)?.ServingsPlanned
            ?? 2;

        var slot = new WeekMealSlot
        {
            WeekId = id,
            RecipeId = null,
            SelectedModifierIngredientIds = new List<int>(),
            DayOfWeek = req.DayOfWeek,
            MealType = req.MealType,
            Position = nextPosition,
            IsEatingOut = false,
            IsSkipped = false,
            IsLocked = false,
            ServingsPlanned = defaultServings,
            AssumedCompleted = false,
            MarkedSkippedAt = null,
        };

        db.WeekMealSlots.Add(slot);
        await db.SaveChangesAsync();
        return Results.Created($"/api/weeks/{id}/slots/{slot.Id}", ToSlotDto(slot));
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
            var nextRecipeId = req.RecipeId.Value == 0 ? (int?)null : req.RecipeId.Value;
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

    private static async Task<IResult> DeleteSlot(int id, int slotId, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var slot = await db.WeekMealSlots
            .Include(s => s.Week)
            .FirstOrDefaultAsync(s => s.Id == slotId && s.WeekId == id && s.Week.HouseholdId == householdId);
        if (slot == null) return Results.NotFound();

        if (slot.Position == 0)
        {
            return Results.BadRequest(new { message = "Base meal slots cannot be deleted." });
        }

        db.WeekMealSlots.Remove(slot);
        await db.SaveChangesAsync();
        return Results.NoContent();
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

    private static async Task<IResult> ClearWeek(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks
            .Include(w => w.MealSlots)
            .Include(w => w.GroceryList)
            .ThenInclude(g => g!.Items)
            .Include(w => w.SnackSuggestions)
            .Include(w => w.PrepSheets)
            .FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        foreach (var slot in week.MealSlots)
        {
            slot.RecipeId = null;
            slot.SelectedModifierIngredientIds = new List<int>();
            slot.IsEatingOut = false;
            slot.IsSkipped = false;
            slot.IsLocked = false;
            slot.AssumedCompleted = false;
            slot.MarkedSkippedAt = null;
        }

        if (week.GroceryList != null)
        {
            db.GroceryListItems.RemoveRange(week.GroceryList.Items);
            db.GroceryLists.Remove(week.GroceryList);
        }

        if (week.SnackSuggestions.Count > 0)
        {
            db.SnackSuggestions.RemoveRange(week.SnackSuggestions);
        }

        if (week.PrepSheets.Count > 0)
        {
            db.PrepSheets.RemoveRange(week.PrepSheets);
        }

        await db.SaveChangesAsync();
        return Results.Ok(new { weekId = id, cleared = true });
    }

    private static async Task<IResult> ApplyTemplate(
        int id, ApplyWeekTemplateRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks
            .Include(w => w.MealSlots)
            .Include(w => w.GroceryList)
            .ThenInclude(g => g!.Items)
            .Include(w => w.SnackSuggestions)
            .Include(w => w.PrepSheets)
            .FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId);
        if (week == null) return Results.NotFound();

        var template = await db.Weeks
            .Include(w => w.MealSlots)
            .FirstOrDefaultAsync(w => w.Id == req.TemplateWeekId && w.HouseholdId == householdId && w.IsSavedTemplate);
        if (template == null) return Results.NotFound();

        var templateKeys = template.MealSlots
            .Select(s => $"{s.DayOfWeek}-{s.MealType}-{s.Position}")
            .ToHashSet();

        var extraSlotsToDelete = week.MealSlots
            .Where(s => s.Position > 0 && !templateKeys.Contains($"{s.DayOfWeek}-{s.MealType}-{s.Position}"))
            .ToList();
        if (extraSlotsToDelete.Count > 0)
        {
            db.WeekMealSlots.RemoveRange(extraSlotsToDelete);
        }

        foreach (var source in template.MealSlots.Where(s => s.Position > 0))
        {
            var exists = week.MealSlots.Any(s => s.DayOfWeek == source.DayOfWeek && s.MealType == source.MealType && s.Position == source.Position);
            if (exists) continue;
            week.MealSlots.Add(new WeekMealSlot
            {
                WeekId = week.Id,
                RecipeId = null,
                SelectedModifierIngredientIds = new List<int>(),
                DayOfWeek = source.DayOfWeek,
                MealType = source.MealType,
                Position = source.Position,
                IsEatingOut = false,
                IsSkipped = false,
                IsLocked = false,
                ServingsPlanned = source.ServingsPlanned,
                AssumedCompleted = false,
                MarkedSkippedAt = null,
            });
        }

        await db.SaveChangesAsync();

        var targetSlots = await db.WeekMealSlots.Where(s => s.WeekId == week.Id).ToListAsync();

        foreach (var slot in targetSlots)
        {
            var source = template.MealSlots.FirstOrDefault(s => s.DayOfWeek == slot.DayOfWeek && s.MealType == slot.MealType && s.Position == slot.Position);
            slot.RecipeId = source?.RecipeId;
            slot.SelectedModifierIngredientIds = new List<int>();
            slot.IsEatingOut = false;
            slot.IsSkipped = source?.IsSkipped ?? false;
            slot.IsLocked = false;
            slot.AssumedCompleted = false;
            slot.MarkedSkippedAt = null;
        }

        if (week.GroceryList != null)
        {
            db.GroceryListItems.RemoveRange(week.GroceryList.Items);
            db.GroceryLists.Remove(week.GroceryList);
        }

        if (week.SnackSuggestions.Count > 0)
        {
            db.SnackSuggestions.RemoveRange(week.SnackSuggestions);
        }

        if (week.PrepSheets.Count > 0)
        {
            db.PrepSheets.RemoveRange(week.PrepSheets);
        }

        await db.SaveChangesAsync();
        return Results.Ok(new { weekId = id, templateWeekId = req.TemplateWeekId, applied = true });
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

    private static async Task<IResult> DeleteSavedTemplate(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var week = await db.Weeks.FirstOrDefaultAsync(w => w.Id == id && w.HouseholdId == householdId && w.IsSavedTemplate);
        if (week == null) return Results.NotFound();

        week.IsSavedTemplate = false;
        week.TemplateName = null;
        week.IsInRotation = false;
        await db.SaveChangesAsync();

        return Results.NoContent();
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
        s.DayOfWeek, s.MealType, s.Position, s.IsEatingOut, s.IsSkipped,
        s.IsLocked, s.ServingsPlanned, s.AssumedCompleted, s.MarkedSkippedAt);

    private static SavedWeekTemplateResponse ToSavedTemplateDto(Week week) => new(
        week.Id,
        week.HouseholdId,
        week.TemplateName ?? $"Week of {week.WeekStartDate:MMM d}",
        week.CreatedAt,
        week.MealSlots
            .OrderBy(s => s.DayOfWeek)
            .ThenBy(s => s.MealType)
            .Select(s => new SavedWeekTemplateSlotResponse(
                s.DayOfWeek,
                s.MealType,
                s.Position,
                s.RecipeId,
                s.Recipe?.Name,
                s.IsEatingOut,
                s.IsSkipped
            ))
            .ToList()
    );
}
