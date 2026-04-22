namespace MealPlanner.Api.Services;

public interface IPlanGeneratorService
{
    Task<List<WeekMealSlot>> GeneratePlanAsync(int weekId);
}

public class PlanGeneratorService : IPlanGeneratorService
{
    private readonly AppDbContext _db;
    private readonly INutritionGapService _nutritionGapService;

    public PlanGeneratorService(AppDbContext db, INutritionGapService nutritionGapService)
    {
        _db = db;
        _nutritionGapService = nutritionGapService;
    }

    public async Task<List<WeekMealSlot>> GeneratePlanAsync(int weekId)
    {
        var week = await _db.Weeks
            .Include(w => w.Household).ThenInclude(h => h.Preferences)
            .Include(w => w.MealSlots)
            .FirstOrDefaultAsync(w => w.Id == weekId);

        if (week == null) return new List<WeekMealSlot>();

        var householdId = week.HouseholdId;
        var twoWeeksAgo = DateTime.UtcNow.AddDays(-14);

        // Load available recipes with ingredients and user preferences
        var recipes = await _db.Recipes
            .Include(r => r.Ingredients).ThenInclude(ri => ri.Ingredient)
            .Include(r => r.UserPreferences.Where(p => p.HouseholdId == householdId))
            .Where(r => r.HouseholdId == householdId)
            .ToListAsync();

        // Filter disliked recipes
        recipes = recipes
            .Where(r => !r.UserPreferences.Any(p => p.IsDisliked))
            .ToList();

        // Filter disliked ingredients from preferences
        var disliked = week.Household.Preferences?.DislikedIngredients ?? new List<string>();
        if (disliked.Count > 0)
        {
            recipes = recipes
                .Where(r => !r.Ingredients.Any(ri =>
                    disliked.Any(d => ri.Ingredient.Name.Contains(d, StringComparison.OrdinalIgnoreCase))))
                .ToList();
        }

        // Filter by MaxCookTime → TimeTag
        var allowedTimeTags = week.MaxCookTime switch
        {
            CookTime.Under20 => new HashSet<TimeTag> { TimeTag.Quick },
            CookTime.Under45 => new HashSet<TimeTag> { TimeTag.Quick, TimeTag.Medium },
            _                => new HashSet<TimeTag> { TimeTag.Quick, TimeTag.Medium, TimeTag.Involved }
        };
        recipes = recipes.Where(r => allowedTimeTags.Contains(r.TimeTag)).ToList();

        // Gather scoring context
        var expiringIngredientIds = await _db.FridgeItems
            .Where(f => f.HouseholdId == householdId &&
                        f.ExpiresAt.HasValue &&
                        f.ExpiresAt.Value <= DateTime.UtcNow.AddDays(3))
            .Select(f => f.IngredientId)
            .ToListAsync();

        var recentlyUsedRecipeIds = await _db.UserRecipePrefs
            .Where(p => p.HouseholdId == householdId &&
                        p.LastUsedAt.HasValue &&
                        p.LastUsedAt.Value > twoWeeksAgo)
            .Select(p => p.RecipeId)
            .ToListAsync();

        var favoriteRecipeIds = await _db.UserRecipePrefs
            .Where(p => p.HouseholdId == householdId && p.IsFavorite)
            .Select(p => p.RecipeId)
            .ToListAsync();

        // Only fill unlocked, empty slots
        var emptySlots = week.MealSlots
            .Where(s => !s.IsLocked && !s.IsEatingOut && !s.IsSkipped && s.RecipeId == null)
            .ToList();

        var usedIngredientIds = new HashSet<int>(
            week.MealSlots
                .Where(s => s.RecipeId.HasValue)
                .SelectMany(s => _db.RecipeIngredients
                    .Where(ri => ri.RecipeId == s.RecipeId)
                    .Select(ri => ri.IngredientId))
        );

        var nutritionGaps = await _nutritionGapService.GetDailyGapsAsync(weekId);
        var rng = new Random();

        foreach (var slot in emptySlots)
        {
            if (recipes.Count == 0) break;

            var scored = recipes
                .Select(r => (Recipe: r, Score: Score(r, slot.DayOfWeek, expiringIngredientIds,
                    recentlyUsedRecipeIds, favoriteRecipeIds, usedIngredientIds, nutritionGaps, slot.MealType)
                    + rng.Next(0, 3))) // small random to prevent identical weeks
                .OrderByDescending(x => x.Score)
                .ToList();

            var best = scored.First().Recipe;
            slot.RecipeId = best.Id;
            slot.ServingsPlanned = best.BaseYieldServings;

            // Track ingredient overlap for remaining slots
            foreach (var ing in best.Ingredients)
                usedIngredientIds.Add(ing.IngredientId);

            // Warn if rigid recipe yield exceeds servings (caller can surface this)
            if (best.ScalabilityTag == ScalabilityTag.Rigid &&
                best.BaseYieldServings > slot.ServingsPlanned && best.IsFreezerFriendly)
            {
                // No-op: the flag is a suggestion to freeze leftovers; noted in recipe properties
            }
        }

        await _db.SaveChangesAsync();
        return emptySlots;
    }

    private static int Score(
        Recipe recipe,
        WeekDay day,
        List<int> expiringIds,
        List<int> recentlyUsedIds,
        List<int> favoriteIds,
        HashSet<int> usedIngredientIds,
        Dictionary<WeekDay, List<string>> nutritionGaps,
        MealType slotMealType)
    {
        var score = 0;
        var recipeIngredientIds = recipe.Ingredients.Select(i => i.IngredientId).ToList();

        // Prefer recipes tagged for this slot's meal type, but don't require it.
        if (recipe.MealTypeTags.Contains(slotMealType)) score += 6;
        if (slotMealType == MealType.Dinner && recipe.MealTypeTags.Contains(MealType.Lunch)) score += 2;
        if (slotMealType == MealType.Lunch && recipe.MealTypeTags.Contains(MealType.Dinner)) score += 2;
        if (slotMealType == MealType.Snack && recipe.MealTypeTags.Contains(MealType.Breakfast)) score += 1;
        if (slotMealType == MealType.Breakfast && recipe.MealTypeTags.Contains(MealType.Snack)) score += 1;

        // Prefer recipes that use expiring fridge items
        score += recipeIngredientIds.Count(id => expiringIds.Contains(id)) * 5;

        // Prefer ingredient overlap with already-planned meals (fewer groceries)
        score += recipeIngredientIds.Count(id => usedIngredientIds.Contains(id)) * 2;

        // Prefer not recently used
        if (!recentlyUsedIds.Contains(recipe.Id)) score += 3;

        // Boost favorites
        if (favoriteIds.Contains(recipe.Id)) score += 4;

        // Boost recipes that fill nutrition gaps for this day
        if (nutritionGaps.TryGetValue(day, out var gaps))
        {
            foreach (var (group, servings) in recipe.FoodGroupServings)
            {
                if (gaps.Contains(group.ToLower()) && servings > 0)
                    score += 3;
            }
        }

        return score;
    }
}
