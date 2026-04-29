using MealPlanner.Api.Services;

namespace MealPlanner.Api.Data;

public static class RecipeServingRepair
{
    public static async Task NormalizeExistingRecipesAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        var recipes = await db.Recipes
            .Include(recipe => recipe.Ingredients)
            .Where(recipe => recipe.BaseYieldServings > 1)
            .ToListAsync(cancellationToken);

        var changed = false;
        foreach (var recipe in recipes)
        {
            changed = RecipeServingNormalizer.NormalizeRecipeEntityToSingleServing(recipe) || changed;
        }

        if (changed)
        {
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
