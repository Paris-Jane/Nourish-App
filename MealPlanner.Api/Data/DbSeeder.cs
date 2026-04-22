namespace MealPlanner.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Households.Any()) return;

        // Household
        var household = new Household
        {
            Name = "Smith Family",
            Size = 4,
            Timezone = "America/New_York",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Households.Add(household);
        await db.SaveChangesAsync();

        // Owner user
        var user = new User
        {
            HouseholdId = household.Id,
            Email = "owner@example.com",
            DisplayName = "Jane Smith",
            Age = 35,
            Sex = "Female",
            ActivityLevel = ActivityLevel.Moderate,
            Role = UserRole.Owner,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123")
        };
        db.Users.Add(user);

        // Household preferences
        var prefs = new HouseholdPreferences
        {
            HouseholdId = household.Id,
            DietaryRestrictions = new List<string>(),
            DislikedIngredients = new List<string> { "cilantro" },
            CuisinePreferences = new List<string> { "Italian", "American", "Mexican" },
            DefaultCookTime = CookTime.Under45,
            DefaultPrepStyle = PrepStyle.OnePrepDay,
            UpdatedAt = DateTime.UtcNow
        };
        db.HouseholdPreferences.Add(prefs);
        await db.SaveChangesAsync();

        // Ingredients
        var chickenBreast = new Ingredient
        {
            Name = "Chicken Breast",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "lb",
            IsPerishable = true,
            IsFlexibleGroup = false,
            ShelfLifeDays = 3
        };
        var brownRice = new Ingredient
        {
            Name = "Brown Rice",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 0.5m,
            ServingUnit = "cup cooked",
            PurchaseUnit = "lb",
            IsPerishable = false,
            IsFlexibleGroup = false,
            ShelfLifeDays = 365
        };
        var broccoli = new Ingredient
        {
            Name = "Broccoli",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "head",
            IsPerishable = true,
            IsFlexibleGroup = false,
            ShelfLifeDays = 7
        };
        var eggs = new Ingredient
        {
            Name = "Eggs",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 1,
            ServingUnit = "large egg",
            PurchaseUnit = "dozen",
            IsPerishable = true,
            IsFlexibleGroup = false,
            ShelfLifeDays = 21
        };
        var blackBeans = new Ingredient
        {
            Name = "Black Beans",
            FoodGroup = FoodGroup.Legume,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "can",
            IsPerishable = false,
            IsFlexibleGroup = true,
            ShelfLifeDays = 730
        };

        db.Ingredients.AddRange(chickenBreast, brownRice, broccoli, eggs, blackBeans);
        await db.SaveChangesAsync();

        // Recipe 1: Chicken and Rice
        var chickenRice = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Chicken and Rice",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = true,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(chickenRice);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = chickenRice.Id, IngredientId = chickenBreast.Id, Quantity = 1.5m, Unit = "lb" },
            new RecipeIngredient { RecipeId = chickenRice.Id, IngredientId = brownRice.Id, Quantity = 1, Unit = "cup dry" },
            new RecipeIngredient { RecipeId = chickenRice.Id, IngredientId = broccoli.Id, Quantity = 2, Unit = "cups" }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = chickenRice.Id, StepNumber = 1, Instruction = "Cook brown rice according to package directions.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 40, IsPassive = true },
            new RecipeStep { RecipeId = chickenRice.Id, StepNumber = 2, Instruction = "Season chicken and sear in a hot skillet for 6 minutes per side.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 15, IsPassive = false },
            new RecipeStep { RecipeId = chickenRice.Id, StepNumber = 3, Instruction = "Steam broccoli and combine with rice and sliced chicken.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 10, IsPassive = false }
        );

        // Recipe 2: Scrambled Eggs
        var scrambledEggs = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Scrambled Eggs",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 2,
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["protein"] = 2,
                ["dairy"] = 0.5m
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(scrambledEggs);
        await db.SaveChangesAsync();

        db.RecipeIngredients.Add(
            new RecipeIngredient { RecipeId = scrambledEggs.Id, IngredientId = eggs.Id, Quantity = 4, Unit = "large eggs" }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = scrambledEggs.Id, StepNumber = 1, Instruction = "Whisk eggs with a splash of milk, salt, and pepper.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false },
            new RecipeStep { RecipeId = scrambledEggs.Id, StepNumber = 2, Instruction = "Cook over medium-low heat, stirring gently until just set.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        // Recipe 3: Black Bean Tacos
        var blackBeanTacos = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Black Bean Tacos",
            Cuisine = "Mexican",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(blackBeanTacos);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = blackBeanTacos.Id, IngredientId = blackBeans.Id, Quantity = 2, Unit = "cans" },
            new RecipeIngredient { RecipeId = blackBeanTacos.Id, IngredientId = broccoli.Id, Quantity = 1, Unit = "cup", IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = blackBeanTacos.Id, StepNumber = 1, Instruction = "Drain and rinse black beans. Season with cumin, garlic powder, and smoked paprika.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 5, IsPassive = false },
            new RecipeStep { RecipeId = blackBeanTacos.Id, StepNumber = 2, Instruction = "Warm beans in a skillet over medium heat for 5 minutes.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false },
            new RecipeStep { RecipeId = blackBeanTacos.Id, StepNumber = 3, Instruction = "Warm tortillas and assemble tacos with beans and desired toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        await db.SaveChangesAsync();
    }
}
