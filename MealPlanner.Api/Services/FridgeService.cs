namespace MealPlanner.Api.Services;

public interface IFridgeService
{
    Task DepleteForSlotAsync(int weekMealSlotId);
    Task ReverseDepletionForSlotAsync(int weekMealSlotId);
    Task<List<FridgeItem>> GetExpiringAsync(int householdId);
    Task<List<FridgeItem>> GetByLocationAsync(int householdId, FridgeLocation location);
    Task<List<Recipe>> GetWhatCanIMakeAsync(int householdId);
}

public class FridgeService : IFridgeService
{
    private readonly AppDbContext _db;

    public FridgeService(AppDbContext db) => _db = db;

    public async Task DepleteForSlotAsync(int weekMealSlotId)
    {
        var slot = await _db.WeekMealSlots
            .Include(s => s.Recipe)
                .ThenInclude(r => r!.Ingredients)
            .FirstOrDefaultAsync(s => s.Id == weekMealSlotId);

        if (slot?.Recipe == null) return;

        var householdId = (await _db.Weeks.FindAsync(slot.WeekId))!.HouseholdId;
        var scale = slot.Recipe.BaseYieldServings > 0
            ? (decimal)slot.ServingsPlanned / slot.Recipe.BaseYieldServings
            : 1m;

        foreach (var ri in slot.Recipe.Ingredients)
        {
            var needed = ri.Quantity * scale;
            var fridgeItems = await _db.FridgeItems
                .Where(f => f.HouseholdId == householdId &&
                            f.IngredientId == ri.IngredientId &&
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
