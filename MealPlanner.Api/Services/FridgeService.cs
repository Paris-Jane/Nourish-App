namespace MealPlanner.Api.Services;

public interface IFridgeService
{
    Task DepleteForSlotAsync(int weekMealSlotId);
    Task ReverseDepletionForSlotAsync(int weekMealSlotId);
    Task<int> ReconcilePastMealsAsync(int householdId);
    Task<List<FridgeItem>> GetExpiringAsync(int householdId);
    Task<List<FridgeItem>> GetByLocationAsync(int householdId, FridgeLocation location);
    Task<List<Recipe>> GetWhatCanIMakeAsync(int householdId);
}

public class FridgeService : IFridgeService
{
    private readonly AppDbContext _db;

    public FridgeService(AppDbContext db) => _db = db;

    private static DateOnly SlotDate(Week week, WeekDay dayOfWeek)
    {
        return week.WeekStartDate.AddDays((int)dayOfWeek);
    }

    private static DateOnly ResolveTodayForTimezone(string? timezone)
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(timezone))
            {
                var tz = TimeZoneInfo.FindSystemTimeZoneById(timezone);
                return DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz));
            }
        }
        catch
        {
            // Fall back to UTC if the configured timezone isn't available on this host.
        }

        return DateOnly.FromDateTime(DateTime.UtcNow);
    }

    public async Task DepleteForSlotAsync(int weekMealSlotId)
    {
        var slot = await _db.WeekMealSlots
            .Include(s => s.Week)
            .Include(s => s.Recipe)
                .ThenInclude(r => r!.Ingredients)
            .FirstOrDefaultAsync(s => s.Id == weekMealSlotId);

        if (slot?.Recipe == null) return;
        if (slot.AssumedCompleted) return;

        var householdId = slot.Week.HouseholdId;
        var scale = slot.Recipe.BaseYieldServings > 0
            ? (decimal)slot.ServingsPlanned / slot.Recipe.BaseYieldServings
            : 1m;
        var selectedModifierIds = slot.SelectedModifierIngredientIds.ToHashSet();

        foreach (var ri in slot.Recipe.Ingredients.Where(i => !i.IsModifier || selectedModifierIds.Contains(i.IngredientId)))
        {
            var needed = ri.Quantity * scale;
            var fridgeItems = await _db.FridgeItems
                .Where(f => f.HouseholdId == householdId &&
                            f.IngredientId == ri.IngredientId &&
                            f.Unit == ri.Unit &&
                            f.Quantity > 0)
                .OrderBy(f => f.ExpiresAt ?? DateTime.MaxValue) // use soonest-expiring first
                .ToListAsync();

            foreach (var fi in fridgeItems)
            {
                if (needed <= 0) break;
                var used = Math.Min(fi.Quantity, needed);
                fi.Quantity -= used;
                needed -= used;

                _db.FridgeDepletionLogs.Add(new FridgeDepletionLog
                {
                    FridgeItemId = fi.Id,
                    WeekMealSlotId = weekMealSlotId,
                    QuantityUsed = used,
                    DepletedAt = DateTime.UtcNow,
                    WasAssumed = true,
                    OverriddenByUser = false
                });
            }
        }

        slot.AssumedCompleted = true;
        await _db.SaveChangesAsync();
    }

    public async Task ReverseDepletionForSlotAsync(int weekMealSlotId)
    {
        var logs = await _db.FridgeDepletionLogs
            .Where(d => d.WeekMealSlotId == weekMealSlotId && !d.OverriddenByUser)
            .Include(d => d.FridgeItem)
            .ToListAsync();

        foreach (var log in logs)
        {
            log.FridgeItem.Quantity += log.QuantityUsed;
            log.OverriddenByUser = true;
        }

        var slot = await _db.WeekMealSlots.FindAsync(weekMealSlotId);
        if (slot != null)
        {
            slot.IsSkipped = true;
            slot.MarkedSkippedAt = DateTime.UtcNow;
            slot.AssumedCompleted = false;
        }

        await _db.SaveChangesAsync();
    }

    public async Task<int> ReconcilePastMealsAsync(int householdId)
    {
        var timezone = await _db.Households
            .Where(h => h.Id == householdId)
            .Select(h => h.Timezone)
            .FirstOrDefaultAsync();

        var today = ResolveTodayForTimezone(timezone);

        var slotIds = await _db.WeekMealSlots
            .Include(s => s.Week)
            .Where(s =>
                s.Week.HouseholdId == householdId &&
                s.RecipeId != null &&
                !s.IsSkipped &&
                !s.IsEatingOut &&
                !s.AssumedCompleted)
            .Where(s => SlotDate(s.Week, s.DayOfWeek) < today)
            .OrderBy(s => s.Week.WeekStartDate)
            .ThenBy(s => s.DayOfWeek)
            .ThenBy(s => s.MealType)
            .Select(s => s.Id)
            .ToListAsync();

        foreach (var slotId in slotIds)
        {
            await DepleteForSlotAsync(slotId);
        }

        return slotIds.Count;
    }

    public async Task<List<FridgeItem>> GetExpiringAsync(int householdId)
    {
        var threshold = DateTime.UtcNow.AddDays(3);
        return await _db.FridgeItems
            .Include(f => f.Ingredient)
            .Where(f => f.HouseholdId == householdId &&
                        f.ExpiresAt.HasValue &&
                        f.ExpiresAt.Value <= threshold &&
                        f.Quantity > 0)
            .OrderBy(f => f.ExpiresAt)
            .ToListAsync();
    }

    public async Task<List<FridgeItem>> GetByLocationAsync(int householdId, FridgeLocation location)
    {
        return await _db.FridgeItems
            .Include(f => f.Ingredient)
            .Where(f => f.HouseholdId == householdId && f.Location == location && f.Quantity > 0)
            .ToListAsync();
    }

    public async Task<List<Recipe>> GetWhatCanIMakeAsync(int householdId)
    {
        var fridgeIngredientIds = await _db.FridgeItems
            .Where(f => f.HouseholdId == householdId && f.Quantity > 0)
            .Select(f => f.IngredientId)
            .Distinct()
            .ToListAsync();

        if (fridgeIngredientIds.Count == 0) return new List<Recipe>();

        // Return recipes where all non-optional, non-modifier ingredients are in the fridge
        var recipes = await _db.Recipes
            .Include(r => r.Ingredients)
            .Where(r => r.HouseholdId == householdId)
            .ToListAsync();

        return recipes.Where(r =>
        {
            var coreIngredients = r.Ingredients
                .Where(i => !i.IsOptional && !i.IsModifier)
                .Select(i => i.IngredientId)
                .ToList();
            return coreIngredients.Count > 0 &&
                   coreIngredients.All(id => fridgeIngredientIds.Contains(id));
        }).ToList();
    }
}
