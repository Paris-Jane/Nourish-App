using MealPlanner.Api.Models;

namespace MealPlanner.Api.Data;

public static class RecipeStepRepair
{
    public static async Task RepairAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        await RepairBurritoBowlsAsync(db, cancellationToken);
    }

    private static async Task RepairBurritoBowlsAsync(AppDbContext db, CancellationToken cancellationToken)
    {
        var tacoSeasoningId = await db.Ingredients
            .Where(i => i.Name == "Taco Seasoning")
            .Select(i => i.Id)
            .FirstOrDefaultAsync(cancellationToken);

        var recipes = await db.Recipes
            .Include(r => r.Ingredients)
            .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .Where(r => r.Name == "Burrito Bowl")
            .ToListAsync(cancellationToken);

        foreach (var recipe in recipes)
        {
            var ingredientIds = recipe.Ingredients
                .Where(ri => ri.Ingredient != null)
                .ToDictionary(ri => ri.Ingredient.Name, ri => ri.IngredientId, StringComparer.OrdinalIgnoreCase);

            if (tacoSeasoningId > 0 && !recipe.Ingredients.Any(ri => ri.IngredientId == tacoSeasoningId))
            {
                db.RecipeIngredients.Add(new RecipeIngredient
                {
                    RecipeId = recipe.Id,
                    IngredientId = tacoSeasoningId,
                    Quantity = 2,
                    Unit = "tbsp",
                });
                ingredientIds["Taco Seasoning"] = tacoSeasoningId;
            }

            var requiredNames = new[]
            {
                "Brown Rice", "Black Beans", "Ground Beef", "Taco Seasoning", "Corn", "Salsa",
                "Avocado", "Cheddar Cheese", "Pico de Gallo", "Romaine Lettuce", "Sour Cream", "Bell Pepper"
            };
            if (requiredNames.Any(name => !ingredientIds.ContainsKey(name)))
            {
                continue;
            }

            db.RecipeSteps.RemoveRange(recipe.Steps);
            db.RecipeSteps.AddRange(
                Step(recipe.Id, 1, "Cook {ingredients} until the beef is browned and seasoned.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, ingredientIds["Ground Beef"], ingredientIds["Taco Seasoning"]),
                Step(recipe.Id, 2, "Portion {ingredients} as the grain base.", TimingTag.PrepAhead, 3, false, PrepStepCategory.AssemblePortion, true, ingredientIds["Brown Rice"]),
                Step(recipe.Id, 3, "Drain, rinse, and portion {ingredients}.", TimingTag.PrepAhead, 3, false, PrepStepCategory.AssemblePortion, true, ingredientIds["Black Beans"]),
                Step(recipe.Id, 4, "Thaw or drain, then portion {ingredients} without warming it.", TimingTag.PrepAhead, 3, false, PrepStepCategory.AssemblePortion, true, ingredientIds["Corn"]),
                Step(recipe.Id, 5, "Pack {ingredients} separately or spoon it into each bowl.", TimingTag.PrepAhead, 2, false, PrepStepCategory.MixSauce, true, ingredientIds["Salsa"]),
                Step(recipe.Id, 6, "Slice selected pepper add-ins and store separately: {ingredients}.", TimingTag.PrepAhead, 6, false, PrepStepCategory.WashChop, true, ingredientIds["Bell Pepper"]),
                Step(recipe.Id, 7, "Reheat the prepared bowl base if you want it warm.", TimingTag.DayOfActive, 3, false, PrepStepCategory.FreshFinish, false, ingredientIds["Brown Rice"], ingredientIds["Black Beans"], ingredientIds["Ground Beef"], ingredientIds["Corn"]),
                Step(recipe.Id, 8, "Finish with any fresh toppings you selected: {ingredients}.", TimingTag.DayOfActive, 2, false, PrepStepCategory.FreshFinish, true, ingredientIds["Avocado"], ingredientIds["Cheddar Cheese"], ingredientIds["Pico de Gallo"], ingredientIds["Romaine Lettuce"], ingredientIds["Sour Cream"])
            );
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    private static RecipeStep Step(
        int recipeId,
        int stepNumber,
        string instruction,
        TimingTag timingTag,
        int durationMinutes,
        bool isPassive,
        PrepStepCategory prepCategory,
        bool scaleByLinkedIngredients,
        params int[] linkedIngredientIds) =>
        new()
        {
            RecipeId = recipeId,
            StepNumber = stepNumber,
            Instruction = instruction,
            TimingTag = timingTag,
            DurationMinutes = durationMinutes,
            IsPassive = isPassive,
            PrepCategory = prepCategory,
            LinkedIngredientIds = linkedIngredientIds.ToList(),
            ScaleByLinkedIngredients = scaleByLinkedIngredients,
        };
}
