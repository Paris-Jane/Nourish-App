using MealPlanner.Api.Models;

namespace MealPlanner.Api.Data;

public static class RecipeCatalogSeeder
{
    public static async Task SeedForHouseholdAsync(AppDbContext db, int householdId, CancellationToken cancellationToken = default)
    {
        var alreadyHasRecipes = await db.Recipes.AnyAsync(r => r.HouseholdId == householdId, cancellationToken);
        if (alreadyHasRecipes) return;

        var sourceHouseholdId = await db.Recipes
            .Where(r => r.HouseholdId != householdId)
            .OrderBy(r => r.HouseholdId)
            .Select(r => r.HouseholdId)
            .FirstOrDefaultAsync(cancellationToken);

        if (sourceHouseholdId == 0) return;

        var sourceRecipes = await db.Recipes
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .Where(r => r.HouseholdId == sourceHouseholdId)
            .ToListAsync(cancellationToken);

        foreach (var source in sourceRecipes)
        {
            db.Recipes.Add(new Recipe
            {
                HouseholdId = householdId,
                Name = source.Name,
                Cuisine = source.Cuisine,
                ScalabilityTag = source.ScalabilityTag,
                TimeTag = source.TimeTag,
                PrepStyleTag = source.PrepStyleTag,
                IsFreezerFriendly = source.IsFreezerFriendly,
                IsCookFreshOnly = source.IsCookFreshOnly,
                BaseYieldServings = source.BaseYieldServings,
                MealTypeTags = [.. source.MealTypeTags],
                ImageUrl = source.ImageUrl,
                SourceUrl = source.SourceUrl,
                FoodGroupServings = new Dictionary<string, decimal>(source.FoodGroupServings),
                CreatedAt = DateTime.UtcNow,
                Ingredients = source.Ingredients.Select(ingredient => new RecipeIngredient
                {
                    IngredientId = ingredient.IngredientId,
                    Quantity = ingredient.Quantity,
                    Unit = ingredient.Unit,
                    IsModifier = ingredient.IsModifier,
                    IsOptional = ingredient.IsOptional,
                    SubstituteIngredientIds = [.. ingredient.SubstituteIngredientIds],
                    Notes = ingredient.Notes
                }).ToList(),
                Steps = source.Steps.Select(step => new RecipeStep
                {
                    StepNumber = step.StepNumber,
                    Instruction = step.Instruction,
                    TimingTag = step.TimingTag,
                    DurationMinutes = step.DurationMinutes,
                    IsPassive = step.IsPassive,
                    PrepCategory = step.PrepCategory,
                    LinkedIngredientIds = [.. step.LinkedIngredientIds],
                    ScaleByLinkedIngredients = step.ScaleByLinkedIngredients
                }).ToList()
            });
        }

        await db.SaveChangesAsync(cancellationToken);
    }
}
