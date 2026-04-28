using MealPlanner.Api.Models;

namespace MealPlanner.Api.Data;

public static class WeekBootstrapper
{
    public static async Task<Week> EnsureCurrentWeekAsync(AppDbContext db, int householdId, CancellationToken cancellationToken = default)
    {
        var householdSize = await db.Households
            .Where(h => h.Id == householdId)
            .Select(h => h.Size)
            .FirstOrDefaultAsync(cancellationToken);
        var defaultServings = householdSize > 0 ? householdSize : 1;

        var existingWeek = await db.Weeks
            .Include(w => w.MealSlots)
            .Where(w => w.HouseholdId == householdId && !w.IsSavedTemplate)
            .OrderByDescending(w => w.WeekStartDate)
            .FirstOrDefaultAsync(cancellationToken);

        if (existingWeek != null)
        {
            await EnsureBaseSlotsAsync(db, existingWeek, defaultServings, cancellationToken);
            return existingWeek;
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var daysSinceMonday = ((int)today.DayOfWeek + 6) % 7;
        var week = new Week
        {
            HouseholdId = householdId,
            WeekStartDate = today.AddDays(-daysSinceMonday),
            Status = WeekStatus.Draft,
            PrepStyle = PrepStyle.DayOf,
            MaxCookTime = CookTime.NoLimit,
            CreatedAt = DateTime.UtcNow
        };

        db.Weeks.Add(week);
        await db.SaveChangesAsync(cancellationToken);

        await EnsureBaseSlotsAsync(db, week, defaultServings, cancellationToken);
        return week;
    }

    private static async Task EnsureBaseSlotsAsync(AppDbContext db, Week week, int defaultServings, CancellationToken cancellationToken)
    {
        var changed = false;

        foreach (var day in Enum.GetValues<WeekDay>())
        {
            foreach (var mealType in Enum.GetValues<MealType>())
            {
                var slot = week.MealSlots.FirstOrDefault(s => s.DayOfWeek == day && s.MealType == mealType && s.Position == 0);
                if (slot == null)
                {
                    db.WeekMealSlots.Add(new WeekMealSlot
                    {
                        WeekId = week.Id,
                        SelectedModifierIngredientIds = new List<int>(),
                        DayOfWeek = day,
                        MealType = mealType,
                        Position = 0,
                        ServingsPlanned = defaultServings,
                    });
                    changed = true;
                    continue;
                }

                if (slot.ServingsPlanned <= 0)
                {
                    slot.ServingsPlanned = defaultServings;
                    changed = true;
                }
            }
        }

        if (changed)
        {
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
