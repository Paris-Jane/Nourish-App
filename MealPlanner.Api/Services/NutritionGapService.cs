namespace MealPlanner.Api.Services;

public interface INutritionGapService
{
    /// <summary>Returns per-day food groups that are under target (keys only, no amounts).</summary>
    Task<Dictionary<WeekDay, List<string>>> GetDailyGapsAsync(int weekId);

    /// <summary>Returns per-day gap amounts: {WeekDay → {foodGroup → servings short}}. Only groups with a real gap are included.</summary>
    Task<Dictionary<WeekDay, Dictionary<string, decimal>>> GetDailyGapAmountsAsync(int weekId);
}

public class NutritionGapService : INutritionGapService
{
    private readonly AppDbContext _db;

    public NutritionGapService(AppDbContext db) => _db = db;

    public async Task<Dictionary<WeekDay, List<string>>> GetDailyGapsAsync(int weekId)
    {
        var amounts = await GetDailyGapAmountsAsync(weekId);
        return amounts.ToDictionary(kv => kv.Key, kv => kv.Value.Keys.ToList());
    }

    public async Task<Dictionary<WeekDay, Dictionary<string, decimal>>> GetDailyGapAmountsAsync(int weekId)
    {
        var week = await _db.Weeks
            .Include(w => w.MealSlots.Where(s => !s.IsSkipped && !s.IsEatingOut))
                .ThenInclude(s => s.Recipe)
                    .ThenInclude(r => r!.Ingredients)
                        .ThenInclude(ri => ri.Ingredient)
            .Include(w => w.Household)
                .ThenInclude(h => h.Preferences)
            .FirstOrDefaultAsync(w => w.Id == weekId);

        if (week?.Household.Preferences?.MyPlateTargets == null)
            return Enum.GetValues<WeekDay>().ToDictionary(d => d, _ => new Dictionary<string, decimal>());

        var targets = week.Household.Preferences.MyPlateTargets;
        var result = new Dictionary<WeekDay, Dictionary<string, decimal>>();

        foreach (var day in Enum.GetValues<WeekDay>())
        {
            var daySlots = week.MealSlots.Where(s => s.DayOfWeek == day && s.Recipe != null);

            var totals = new Dictionary<string, decimal>
            {
                ["grains"] = 0, ["protein"] = 0, ["vegetables"] = 0, ["fruit"] = 0, ["dairy"] = 0
            };

            foreach (var slot in daySlots)
            {
                var recipe = slot.Recipe!;
                var scale = recipe.BaseYieldServings > 0
                    ? (decimal)slot.ServingsPlanned / recipe.BaseYieldServings
                    : 1m;

                foreach (var (group, servings) in recipe.FoodGroupServings)
                {
                    var key = NormalizeTargetKey(group);
                    if (totals.ContainsKey(key))
                        totals[key] += servings * scale;
                }

                if (slot.SelectedModifierIngredientIds.Count > 0)
                {
                    var selectedModifierIds = slot.SelectedModifierIngredientIds.ToHashSet();
                    foreach (var ingredient in recipe.Ingredients.Where(i => selectedModifierIds.Contains(i.IngredientId)))
                    {
                        if (!ingredient.Ingredient.IsMyPlateCounted) continue;
                        var key = NormalizeTargetKey(ingredient.Ingredient.FoodGroup.ToString());
                        if (!totals.ContainsKey(key)) continue;
                        if (ingredient.Ingredient.ServingSize <= 0) continue;
                        var servings = ingredient.Quantity / ingredient.Ingredient.ServingSize;
                        if (servings <= 0) continue;
                        totals[key] += Math.Round(servings * scale, 2);
                    }
                }
            }

            var gaps = new Dictionary<string, decimal>();
            if (totals["grains"] < targets.Grains)         gaps["grains"]     = Math.Round(targets.Grains - totals["grains"], 2);
            if (totals["protein"] < targets.Protein)       gaps["protein"]    = Math.Round(targets.Protein - totals["protein"], 2);
            if (totals["vegetables"] < targets.Vegetables) gaps["vegetables"] = Math.Round(targets.Vegetables - totals["vegetables"], 2);
            if (totals["fruit"] < targets.Fruit)           gaps["fruit"]      = Math.Round(targets.Fruit - totals["fruit"], 2);
            if (totals["dairy"] < targets.Dairy)           gaps["dairy"]      = Math.Round(targets.Dairy - totals["dairy"], 2);

            result[day] = gaps;
        }

        return result;
    }

    private static string NormalizeTargetKey(string group) =>
        group.Trim().ToLowerInvariant() switch
        {
            "grain" or "grains"         => "grains",
            "protein" or "proteins"     => "protein",
            "vegetable" or "vegetables" => "vegetables",
            "fruit" or "fruits"         => "fruit",
            "dairy"                     => "dairy",
            "legume" or "legumes"       => "protein",
            _                           => group.Trim().ToLowerInvariant()
        };
}
