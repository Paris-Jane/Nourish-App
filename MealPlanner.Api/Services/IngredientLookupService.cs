namespace MealPlanner.Api.Services;

public interface IIngredientLookupService
{
    Task<decimal> GetMyPlateServingsAsync(int ingredientId, decimal quantity, string unit, string? preferredFoodGroup = null);
}

public class IngredientLookupService : IIngredientLookupService
{
    private readonly AppDbContext _db;
    private readonly INutritionGapService _gapService;

    public IngredientLookupService(AppDbContext db, INutritionGapService gapService)
    {
        _db = db;
        _gapService = gapService;
    }

    public async Task<decimal> GetMyPlateServingsAsync(int ingredientId, decimal quantity, string unit, string? preferredFoodGroup = null)
    {
        var ingredient = await _db.Ingredients.FindAsync(ingredientId);
        if (ingredient == null) return 0;

        // Calculate how many MyPlate servings this quantity represents
        // by comparing to the ingredient's defined ServingSize
        decimal servings = ingredient.ServingSize > 0
            ? quantity / ingredient.ServingSize
            : quantity;

        // For flexible-group legumes (IsFlexibleGroup = true), assign to the food group
        // with the larger gap when a preferredFoodGroup hint is provided
        if (ingredient.IsFlexibleGroup && string.IsNullOrEmpty(preferredFoodGroup))
        {
            // Default to protein group for legumes if no context given
            return servings;
        }

        return Math.Round(servings, 2);
    }
}
