using MealPlanner.Api.Models;

namespace MealPlanner.Api.Data;

public static class RecipeStepRepair
{
    public static async Task RepairAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        await RepairBurritoBowlsAsync(db, cancellationToken);
        await RepairCanonicalSeedRecipesAsync(db, cancellationToken);
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

    private static async Task RepairCanonicalSeedRecipesAsync(AppDbContext db, CancellationToken cancellationToken)
    {
        await RepairRecipeStepsAsync(db, cancellationToken, "Chicken and Rice", new[]
        {
            Spec(1, "Cook {ingredients} until tender.", TimingTag.PrepAhead, 40, true, PrepStepCategory.CookStarch, true, "Brown Rice"),
            Spec(2, "Season and cook {ingredients} until done, then slice for easy reheating.", TimingTag.PrepAhead, 15, false, PrepStepCategory.CookProtein, true, "Chicken Breast"),
            Spec(3, "Steam {ingredients} until crisp-tender.", TimingTag.PrepAhead, 8, false, PrepStepCategory.RoastBake, true, "Broccoli"),
            Spec(4, "Reheat the rice, chicken, and broccoli together before serving.", TimingTag.DayOfActive, 5, false, PrepStepCategory.AssemblePortion, false, "Brown Rice", "Chicken Breast", "Broccoli"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Scrambled Eggs", new[]
        {
            Spec(1, "Whisk {ingredients} with salt and pepper.", TimingTag.DayOfActive, 3, false, PrepStepCategory.CookProtein, true, "Eggs"),
            Spec(2, "Cook the eggs over medium-low heat, stirring gently until just set.", TimingTag.DayOfActive, 5, false, PrepStepCategory.CookProtein, false, "Eggs"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Black Bean Tacos", new[]
        {
            Spec(1, "Drain, rinse, and season {ingredients}.", TimingTag.PrepAhead, 5, false, PrepStepCategory.CookProtein, true, "Black Beans"),
            Spec(2, "Warm the beans before serving.", TimingTag.DayOfActive, 5, false, PrepStepCategory.CookProtein, false, "Black Beans"),
            Spec(3, "Warm tortillas and assemble tacos with beans and your chosen toppings.", TimingTag.DayOfActive, 5, false, PrepStepCategory.AssemblePortion, false),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Yogurt Parfait", new[]
        {
            Spec(1, "Portion {ingredients} into jars or bowls.", TimingTag.PrepAhead, 4, false, PrepStepCategory.AssemblePortion, true, "Greek Yogurt", "Mixed Berries"),
            Spec(2, "Keep granola separate so it stays crisp, then add it just before serving.", TimingTag.DayOfActive, 1, false, PrepStepCategory.FreshFinish, true, "Granola"),
            Spec(3, "Add any selected extras: {ingredients}.", TimingTag.DayOfActive, 1, false, PrepStepCategory.FreshFinish, true, "Honey", "Banana", "Walnuts", "Jam", "Whipped Cream"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Oatmeal", new[]
        {
            Spec(1, "Microwave {ingredients} according to package directions.", TimingTag.DayOfActive, 3, false, PrepStepCategory.CookStarch, true, "Oatmeal Packet"),
            Spec(2, "Stir in {ingredients} while the oats are hot.", TimingTag.DayOfActive, 1, false, PrepStepCategory.AssemblePortion, true, "Butter"),
            Spec(3, "Finish with any selected toppings: {ingredients}.", TimingTag.DayOfActive, 1, false, PrepStepCategory.FreshFinish, true, "Maple Syrup", "Cinnamon", "Mixed Berries", "Banana", "Peanut Butter", "Walnuts", "Whipped Cream"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Avocado Toast", new[]
        {
            Spec(1, "Boil {ingredients}, cool them, and refrigerate until needed.", TimingTag.PrepAhead, 10, true, PrepStepCategory.CookProtein, true, "Eggs"),
            Spec(2, "Cook {ingredients} until crisp, then refrigerate for the week.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Bacon"),
            Spec(3, "Toast {ingredients} until golden and crisp.", TimingTag.DayOfActive, 3, false, PrepStepCategory.CookStarch, true, "Whole Grain Bread"),
            Spec(4, "Mash {ingredients} with salt and pepper, then spread over the toast.", TimingTag.DayOfActive, 4, false, PrepStepCategory.FreshFinish, true, "Avocado"),
            Spec(5, "Add any selected toppings: {ingredients}. Serve right away.", TimingTag.DayOfActive, 2, false, PrepStepCategory.FreshFinish, true, "Eggs", "Bacon", "Cottage Cheese", "Pico de Gallo", "Tomatoes", "Balsamic Glaze", "Basil"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Breakfast Burrito", new[]
        {
            Spec(1, "Roast or saute {ingredients} until tender and crisp at the edges.", TimingTag.PrepAhead, 20, false, PrepStepCategory.RoastBake, true, "Potato"),
            Spec(2, "Cook {ingredients} until browned and cooked through.", TimingTag.PrepAhead, 12, false, PrepStepCategory.CookProtein, true, "Bacon", "Breakfast Sausage"),
            Spec(3, "Scramble {ingredients} until just set.", TimingTag.PrepAhead, 8, false, PrepStepCategory.CookProtein, true, "Eggs"),
            Spec(4, "Cook any selected filling vegetables or beans: {ingredients}.", TimingTag.PrepAhead, 8, false, PrepStepCategory.WashChop, true, "Black Beans", "Spinach", "Bell Pepper", "Onion"),
            Spec(5, "Fill each tortilla with the cooked potatoes, eggs, bacon, cheddar, and any cooked add-ins you chose.", TimingTag.PrepAhead, 10, false, PrepStepCategory.AssemblePortion, false, "Flour Tortilla", "Eggs", "Cheddar Cheese", "Potato", "Bacon", "Breakfast Sausage", "Black Beans", "Spinach", "Bell Pepper", "Onion"),
            Spec(6, "Wrap tightly and refrigerate or freeze the burritos.", TimingTag.PrepAhead, 5, false, PrepStepCategory.AssemblePortion, false, "Flour Tortilla"),
            Spec(7, "Reheat the burritos and finish with any fresh toppings you selected: {ingredients}.", TimingTag.DayOfActive, 5, false, PrepStepCategory.FreshFinish, true, "Salsa", "Avocado", "Tomatoes"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Country Breakfast Bowl", new[]
        {
            Spec(1, "Dice and roast {ingredients} with olive oil and seasonings until browned and tender.", TimingTag.PrepAhead, 35, true, PrepStepCategory.RoastBake, true, "Potato"),
            Spec(2, "Cook any selected add-in proteins: {ingredients}.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Breakfast Sausage", "Bacon", "Ham"),
            Spec(3, "Cook any selected vegetables you want packed into the bowls: {ingredients}.", TimingTag.PrepAhead, 6, false, PrepStepCategory.WashChop, true, "Bell Pepper"),
            Spec(4, "Scramble {ingredients} in butter until softly set.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Eggs"),
            Spec(5, "Divide the potatoes, eggs, salsa, cheddar, and any cooked add-ins between containers.", TimingTag.PrepAhead, 10, false, PrepStepCategory.AssemblePortion, false, "Potato", "Eggs", "Salsa", "Cheddar Cheese", "Breakfast Sausage", "Bacon", "Ham", "Bell Pepper"),
            Spec(6, "Reheat and finish with any fresh toppings you selected: {ingredients}.", TimingTag.DayOfActive, 5, false, PrepStepCategory.FreshFinish, true, "Green Onions", "Hot Sauce", "Tomatoes"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Bruschetta Toast", new[]
        {
            Spec(1, "Toast {ingredients} until crisp.", TimingTag.DayOfActive, 4, false, PrepStepCategory.CookStarch, true, "Whole Grain Bread"),
            Spec(2, "Toss {ingredients} with olive oil, salt, and pepper right before serving.", TimingTag.DayOfActive, 5, false, PrepStepCategory.FreshFinish, true, "Tomatoes", "Basil"),
            Spec(3, "Spoon the tomato mixture over the toast and finish with any selected toppings: {ingredients}.", TimingTag.DayOfActive, 3, false, PrepStepCategory.FreshFinish, true, "Balsamic Glaze", "Mozzarella Cheese", "Avocado"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "BLT Sandwich", new[]
        {
            Spec(1, "Cook {ingredients} until crisp and refrigerate for quick assembly.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Bacon"),
            Spec(2, "Toast {ingredients} and spread with mayonnaise.", TimingTag.DayOfActive, 3, false, PrepStepCategory.CookStarch, true, "Whole Grain Bread"),
            Spec(3, "Layer the bacon with lettuce, tomatoes, and any selected add-ins: {ingredients}.", TimingTag.DayOfActive, 3, false, PrepStepCategory.FreshFinish, true, "Romaine Lettuce", "Tomatoes", "Avocado", "Turkey Breast", "Cheddar Cheese"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Greek Salad", new[]
        {
            Spec(1, "Cook {ingredients} so it can be chilled for the salad.", TimingTag.PrepAhead, 12, false, PrepStepCategory.CookProtein, true, "Chicken Breast"),
            Spec(2, "Rinse and drain {ingredients}.", TimingTag.PrepAhead, 3, false, PrepStepCategory.AssemblePortion, true, "Chickpeas"),
            Spec(3, "Chop {ingredients} right before serving so the salad stays crisp.", TimingTag.DayOfActive, 8, false, PrepStepCategory.FreshFinish, true, "Cucumber", "Tomatoes", "Red Onion", "Bell Pepper"),
            Spec(4, "Toss the vegetables with feta, olive oil, dill, and any chilled proteins or chickpeas you selected: {ingredients}.", TimingTag.DayOfActive, 4, false, PrepStepCategory.FreshFinish, true, "Feta Cheese", "Chicken Breast", "Chickpeas"),
            Spec(5, "Warm or plate any selected pita and serve immediately.", TimingTag.DayOfActive, 2, false, PrepStepCategory.FreshFinish, true, "Pita Bread"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Pasta with Marinara", new[]
        {
            Spec(1, "Cook {ingredients} if you want it ready to reheat later in the week.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Ground Beef"),
            Spec(2, "Boil {ingredients} according to package directions.", TimingTag.DayOfActive, 12, true, PrepStepCategory.CookStarch, true, "Spaghetti"),
            Spec(3, "Warm the sauce you chose and stir in any cooked protein add-ins: {ingredients}.", TimingTag.DayOfActive, 8, false, PrepStepCategory.MixSauce, true, "Marinara Sauce", "Pesto", "Alfredo Sauce", "Ground Beef"),
            Spec(4, "Toss the cooked pasta with the sauce and finish with any selected toppings: {ingredients}.", TimingTag.DayOfActive, 3, false, PrepStepCategory.FreshFinish, true, "Spinach", "Parmesan Cheese"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Greek Gyro Wrap", new[]
        {
            Spec(1, "Warm {ingredients}.", TimingTag.DayOfActive, 6, false, PrepStepCategory.CookProtein, true, "Naan", "Gyro Meat"),
            Spec(2, "Chop the fresh vegetables right before serving: {ingredients}.", TimingTag.DayOfActive, 8, false, PrepStepCategory.FreshFinish, true, "Tomatoes", "Cucumber", "Red Onion"),
            Spec(3, "Assemble the wraps with tzatziki and any selected toppings: {ingredients}.", TimingTag.DayOfActive, 5, false, PrepStepCategory.FreshFinish, true, "Feta Cheese", "Romaine Lettuce", "Olives"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Hawaiian Haystacks", new[]
        {
            Spec(1, "Cook {ingredients} ahead of time for the haystack base.", TimingTag.PrepAhead, 25, true, PrepStepCategory.CookStarch, true, "Brown Rice", "Chicken Breast"),
            Spec(2, "Warm {ingredients} and combine with the cooked chicken.", TimingTag.PrepAhead, 10, false, PrepStepCategory.MixSauce, true, "Cream Sauce", "Chicken Breast"),
            Spec(3, "Prep any selected toppings so they are ready for serving: {ingredients}.", TimingTag.PrepAhead, 8, false, PrepStepCategory.AssemblePortion, true, "Pineapple", "Cheddar Cheese", "Chow Mein Noodles", "Green Onions", "Peas", "Celery"),
            Spec(4, "Serve the chicken mixture over rice and add any prepped toppings you chose.", TimingTag.DayOfActive, 5, false, PrepStepCategory.FreshFinish, false),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Ground Beef Tacos", new[]
        {
            Spec(1, "Brown {ingredients}, then stir in taco seasoning.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Ground Beef"),
            Spec(2, "Warm the tortillas.", TimingTag.DayOfActive, 3, false, PrepStepCategory.CookStarch, true, "Flour Tortilla"),
            Spec(3, "Add any selected fresh toppings: {ingredients}.", TimingTag.DayOfActive, 3, false, PrepStepCategory.FreshFinish, true, "Romaine Lettuce", "Tomatoes", "Cheddar Cheese", "Salsa", "Avocado", "Black Beans", "Sour Cream"),
            Spec(4, "Fill the tortillas with seasoned beef and the toppings you picked.", TimingTag.DayOfActive, 2, false, PrepStepCategory.AssemblePortion, false),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Grilled Cheese and V8", new[]
        {
            Spec(1, "Butter the bread and build the sandwiches with cheddar and any selected fillings: {ingredients}.", TimingTag.DayOfActive, 4, false, PrepStepCategory.AssemblePortion, true, "Cheddar Cheese", "Basil", "Mozzarella Cheese", "Ham"),
            Spec(2, "Grill the sandwiches until the bread is golden and the cheese is melted.", TimingTag.DayOfActive, 8, false, PrepStepCategory.CookStarch, false, "Whole Grain Bread"),
            Spec(3, "Pour {ingredients} and serve alongside the sandwiches.", TimingTag.DayOfActive, 1, false, PrepStepCategory.FreshFinish, true, "V8 Juice"),
        });

        await RepairRecipeStepsAsync(db, cancellationToken, "Sweet Potato Beef Cottage Cheese Bowl", new[]
        {
            Spec(1, "Roast {ingredients} until tender.", TimingTag.PrepAhead, 35, true, PrepStepCategory.RoastBake, true, "Sweet Potato"),
            Spec(2, "Brown and season {ingredients}.", TimingTag.PrepAhead, 10, false, PrepStepCategory.CookProtein, true, "Ground Beef"),
            Spec(3, "Warm any selected beans before serving: {ingredients}.", TimingTag.PrepAhead, 4, false, PrepStepCategory.CookProtein, true, "Black Beans"),
            Spec(4, "Assemble bowls with the roasted sweet potato, beef, and cottage cheese.", TimingTag.PrepAhead, 5, false, PrepStepCategory.AssemblePortion, false, "Sweet Potato", "Ground Beef", "Cottage Cheese"),
            Spec(5, "Finish with any selected toppings: {ingredients}.", TimingTag.DayOfActive, 2, false, PrepStepCategory.FreshFinish, true, "Avocado", "Green Onions", "Hot Sauce", "Black Beans", "Spinach"),
        });
    }

    private static async Task RepairRecipeStepsAsync(AppDbContext db, CancellationToken cancellationToken, string recipeName, IReadOnlyList<StepSpec> specs)
    {
        var recipes = await db.Recipes
            .Include(r => r.Ingredients)
            .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.Steps)
            .Where(r => r.Name == recipeName)
            .ToListAsync(cancellationToken);

        foreach (var recipe in recipes)
        {
            var ingredientIds = recipe.Ingredients
                .Where(ri => ri.Ingredient != null)
                .ToDictionary(ri => ri.Ingredient.Name, ri => ri.IngredientId, StringComparer.OrdinalIgnoreCase);

            var steps = new List<RecipeStep>();
            foreach (var spec in specs)
            {
                var linkedIds = new List<int>();
                var canApply = true;
                foreach (var name in spec.LinkedIngredientNames)
                {
                    if (ingredientIds.TryGetValue(name, out var id))
                    {
                        linkedIds.Add(id);
                    }
                    else
                    {
                        canApply = false;
                        break;
                    }
                }
                if (!canApply) continue;
                steps.Add(Step(recipe.Id, spec.StepNumber, spec.Instruction, spec.TimingTag, spec.DurationMinutes, spec.IsPassive, spec.PrepCategory, spec.ScaleByLinkedIngredients, linkedIds.ToArray()));
            }

            if (steps.Count == 0) continue;
            db.RecipeSteps.RemoveRange(recipe.Steps);
            db.RecipeSteps.AddRange(steps);
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    private static StepSpec Spec(
        int stepNumber,
        string instruction,
        TimingTag timingTag,
        int durationMinutes,
        bool isPassive,
        PrepStepCategory prepCategory,
        bool scaleByLinkedIngredients,
        params string[] linkedIngredientNames) =>
        new(stepNumber, instruction, timingTag, durationMinutes, isPassive, prepCategory, scaleByLinkedIngredients, linkedIngredientNames);

    private sealed record StepSpec(
        int StepNumber,
        string Instruction,
        TimingTag TimingTag,
        int DurationMinutes,
        bool IsPassive,
        PrepStepCategory PrepCategory,
        bool ScaleByLinkedIngredients,
        IReadOnlyList<string> LinkedIngredientNames);

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
