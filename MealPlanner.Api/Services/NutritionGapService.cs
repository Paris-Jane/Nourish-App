namespace MealPlanner.Api.Services;

public interface INutritionGapService
{
    Task<Dictionary<WeekDay, List<string>>> GetDailyGapsAsync(int weekId);
}

public class NutritionGapService : INutritionGapService
{
    private readonly AppDbContext _db;

    public NutritionGapService(AppDbContext db) => _db = db;

    public async Task<Dictionary<WeekDay, List<string>>> GetDailyGapsAsync(int weekId)
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
            return new Dictionary<WeekDay, List<string>>();

        var targets = week.Household.Preferences.MyPlateTargets;
        var gaps = new Dictionary<WeekDay, List<string>>();

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

            var dayGaps = new List<string>();
            if (totals["grains"] < targets.Grains)         dayGaps.Add("grains");
            if (totals["protein"] < targets.Protein)       dayGaps.Add("protein");
            if (totals["vegetables"] < targets.Vegetables) dayGaps.Add("vegetables");
            if (totals["fruit"] < targets.Fruit)           dayGaps.Add("fruit");
            if (totals["dairy"] < targets.Dairy)           dayGaps.Add("dairy");

            gaps[day] = dayGaps;
        }

        return gaps;
    }

    private static string NormalizeTargetKey(string group) =>
        group.Trim().ToLowerInvariant() switch
        {
            "grain" or "grains" => "grains",
            "protein" or "proteins" => "protein",
            "vegetable" or "vegetables" => "vegetables",
            "fruit" or "fruits" => "fruit",
            "dairy" => "dairy",
            "legume" or "legumes" => "protein",
            _ => group.Trim().ToLowerInvariant()
        };
}
