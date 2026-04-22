namespace MealPlanner.Api.Services;

public interface IGroceryListService
{
    Task<GroceryList> GenerateAsync(int weekId, int householdId);
}

public class GroceryListService : IGroceryListService
{
    private readonly AppDbContext _db;

    public GroceryListService(AppDbContext db) => _db = db;

    public async Task<GroceryList> GenerateAsync(int weekId, int householdId)
    {
        var week = await _db.Weeks
            .Include(w => w.MealSlots.Where(s => !s.IsSkipped && !s.IsEatingOut && s.RecipeId != null))
                .ThenInclude(s => s.Recipe!)
                    .ThenInclude(r => r.Ingredients)
                        .ThenInclude(ri => ri.Ingredient)
            .FirstOrDefaultAsync(w => w.Id == weekId && w.HouseholdId == householdId);

        if (week == null) throw new KeyNotFoundException("Week not found");

        // Remove existing grocery list for this week
        var existing = await _db.GroceryLists
            .Include(g => g.Items)
            .FirstOrDefaultAsync(g => g.WeekId == weekId);
        if (existing != null)
        {
            _db.GroceryListItems.RemoveRange(existing.Items);
            _db.GroceryLists.Remove(existing);
            await _db.SaveChangesAsync();
        }

        // Aggregate quantities per ingredient across all slots
        var aggregated = new Dictionary<int, AggregatedItem>();

        foreach (var slot in week.MealSlots.Where(s => s.Recipe != null))
        {
            var recipe = slot.Recipe!;
            var scale = recipe.BaseYieldServings > 0
                ? (decimal)slot.ServingsPlanned / recipe.BaseYieldServings
                : 1m;

            foreach (var ri in recipe.Ingredients.Where(i => !i.IsModifier))
            {
                var scaledQty = ri.Quantity * scale;
                if (aggregated.TryGetValue(ri.IngredientId, out var agg))
                {
                    agg.Quantity += scaledQty;
                    if (!agg.RecipeIds.Contains(slot.RecipeId!.Value))
                        agg.RecipeIds.Add(slot.RecipeId!.Value);
                }
                else
                {
                    aggregated[ri.IngredientId] = new AggregatedItem
                    {
                        Ingredient = ri.Ingredient,
                        Quantity = scaledQty,
                        Unit = ri.Unit,
                        RecipeIds = new List<int> { slot.RecipeId!.Value }
                    };
                }
            }
        }

        // Subtract fridge inventory (same unit only)
        var fridgeItems = await _db.FridgeItems
            .Where(f => f.HouseholdId == householdId)
            .ToListAsync();

        // Create the list
        var groceryList = new GroceryList
        {
            WeekId = weekId,
            HouseholdId = householdId,
            GeneratedAt = DateTime.UtcNow,
            Status = GroceryListStatus.Active
        };
        _db.GroceryLists.Add(groceryList);
        await _db.SaveChangesAsync();

        foreach (var (ingredientId, agg) in aggregated)
        {
            var fridgeQty = fridgeItems
                .Where(f => f.IngredientId == ingredientId &&
                            string.Equals(f.Unit, agg.Unit, StringComparison.OrdinalIgnoreCase))
                .Sum(f => f.Quantity);

            var plannedQty = Math.Max(0, agg.Quantity - fridgeQty);

            _db.GroceryListItems.Add(new GroceryListItem
            {
                GroceryListId = groceryList.Id,
                IngredientId = ingredientId,
                PlannedQuantity = Math.Round(plannedQty, 2),
                PlannedUnit = agg.Unit,
                StoreSection = GetStoreSection(agg.Ingredient.FoodGroup),
                IsChecked = false,
                AddedToFridge = false,
                RecipeIds = agg.RecipeIds
            });
        }

        await _db.SaveChangesAsync();

        return await _db.GroceryLists
            .Include(g => g.Items).ThenInclude(i => i.Ingredient)
            .FirstAsync(g => g.Id == groceryList.Id);
    }

    private static string GetStoreSection(FoodGroup group) => group switch
    {
        FoodGroup.Vegetable or FoodGroup.Fruit           => "Produce",
        FoodGroup.Protein                                => "Protein",
        FoodGroup.Dairy                                  => "Dairy",
        FoodGroup.Grains                                 => "Grains",
        FoodGroup.Legume                                 => "Pantry",
        _                                                => "Pantry"
    };

    private class AggregatedItem
    {
        public Ingredient Ingredient { get; set; } = null!;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;
        public List<int> RecipeIds { get; set; } = new();
    }
}
