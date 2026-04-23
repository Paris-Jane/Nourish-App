namespace MealPlanner.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Households.Any()) return;

        // ── Household ─────────────────────────────────────────────────────────

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

        // ── Owner user ────────────────────────────────────────────────────────

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

        // ── Household preferences ─────────────────────────────────────────────

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

        // ── Ingredients ───────────────────────────────────────────────────────

        var chickenBreast = new Ingredient
        {
            Name = "Chicken Breast",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "lb",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 3,
            TypicalPackageSize = 1.5m,
            PackageSizeUnit = "lb",
            IsStaple = false,
            Aliases = new List<string> { "chicken", "chicken breast" }
        };
        var brownRice = new Ingredient
        {
            Name = "Brown Rice",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 0.5m,
            ServingUnit = "cup cooked",
            PurchaseUnit = "lb",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 2,
            PackageSizeUnit = "lb",
            IsStaple = true,
            Aliases = new List<string> { "rice", "brown rice" }
        };
        var broccoli = new Ingredient
        {
            Name = "Broccoli",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "head",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            IsStaple = false,
            Aliases = new List<string> { "broccoli florets" }
        };
        var eggs = new Ingredient
        {
            Name = "Eggs",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 1,
            ServingUnit = "large egg",
            PurchaseUnit = "dozen",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 21,
            TypicalPackageSize = 12,
            PackageSizeUnit = "count",
            IsStaple = true,
            Aliases = new List<string> { "egg", "large eggs" }
        };
        var blackBeans = new Ingredient
        {
            Name = "Black Beans",
            FoodGroup = FoodGroup.Legume,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "can",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = true,
            IsMyPlateCounted = true,
            ShelfLifeDays = 730,
            TypicalPackageSize = 15,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "canned black beans" }
        };

        db.Ingredients.AddRange(chickenBreast, brownRice, broccoli, eggs, blackBeans);
        await db.SaveChangesAsync();

        var greekYogurt = new Ingredient
        {
            Name = "Greek Yogurt",
            FoodGroup = FoodGroup.Dairy,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "tub",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 10,
            TypicalPackageSize = 32,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "yogurt", "greek yogurt" }
        };
        var mixedBerries = new Ingredient
        {
            Name = "Mixed Berries",
            FoodGroup = FoodGroup.Fruit,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "bag",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "berries", "mixed berries" }
        };
        var granola = new Ingredient
        {
            Name = "Granola",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "bag",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 180,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "granola" }
        };
        var honey = new Ingredient
        {
            Name = "Honey",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "bottle",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "honey" }
        };
        var banana = new Ingredient
        {
            Name = "Banana",
            FoodGroup = FoodGroup.Fruit,
            ServingSize = 1,
            ServingUnit = "whole",
            PurchaseUnit = "bunch",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "bunch",
            IsStaple = false,
            Aliases = new List<string> { "banana" }
        };
        var whippedCream = new Ingredient
        {
            Name = "Whipped Cream",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "can",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 14,
            TypicalPackageSize = 6.5m,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "whipped topping", "whipped cream" },
            Notes = "Tracked as Other for MyPlate counting."
        };
        var jam = new Ingredient
        {
            Name = "Jam",
            FoodGroup = FoodGroup.Fruit,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "fruit jam", "jam" }
        };
        var walnuts = new Ingredient
        {
            Name = "Walnuts",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 1,
            ServingUnit = "oz",
            PurchaseUnit = "bag",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Protein,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 180,
            TypicalPackageSize = 8,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "walnuts" }
        };
        var peanutButter = new Ingredient
        {
            Name = "Peanut Butter",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 2,
            ServingUnit = "tbsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Protein,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 180,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "peanut butter" }
        };
        var oatmealPacket = new Ingredient
        {
            Name = "Oatmeal Packet",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 1,
            ServingUnit = "packet",
            PurchaseUnit = "box",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 8,
            PackageSizeUnit = "count",
            IsStaple = true,
            Aliases = new List<string> { "instant oatmeal", "oatmeal packet" }
        };
        var butter = new Ingredient
        {
            Name = "Butter",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "box",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 90,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "butter" },
            Notes = "Tracked as Other rather than Dairy for MyPlate counting."
        };
        var mapleSyrup = new Ingredient
        {
            Name = "Maple Syrup",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "bottle",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "maple syrup" }
        };
        var cinnamon = new Ingredient
        {
            Name = "Cinnamon",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 2,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "ground cinnamon" }
        };
        var wholeGrainBread = new Ingredient
        {
            Name = "Whole Grain Bread",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 1,
            ServingUnit = "slice",
            PurchaseUnit = "loaf",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "loaf",
            IsStaple = false,
            Aliases = new List<string> { "whole grain bread", "bread" }
        };
        var avocado = new Ingredient
        {
            Name = "Avocado",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "whole",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "avocado" }
        };
        var salt = new Ingredient
        {
            Name = "Salt",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tsp",
            PurchaseUnit = "container",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 26,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "salt", "kosher salt" }
        };
        var blackPepper = new Ingredient
        {
            Name = "Black Pepper",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 2,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "black pepper", "pepper" }
        };
        var cottageCheese = new Ingredient
        {
            Name = "Cottage Cheese",
            FoodGroup = FoodGroup.Dairy,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "tub",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "cottage cheese" }
        };
        var picoDeGallo = new Ingredient
        {
            Name = "Pico de Gallo",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "container",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "pico", "pico de gallo" }
        };
        var tomatoes = new Ingredient
        {
            Name = "Tomatoes",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "tomato", "tomatoes" }
        };
        var balsamicGlaze = new Ingredient
        {
            Name = "Balsamic Glaze",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "bottle",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 365,
            TypicalPackageSize = 8,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "balsamic glaze" }
        };
        var basil = new Ingredient
        {
            Name = "Basil",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "bunch",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 5,
            TypicalPackageSize = 1,
            PackageSizeUnit = "bunch",
            IsStaple = false,
            Aliases = new List<string> { "fresh basil", "basil" }
        };
        var bacon = new Ingredient
        {
            Name = "Bacon",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 2,
            ServingUnit = "slices",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "bacon" }
        };
        var flourTortilla = new Ingredient
        {
            Name = "Flour Tortilla",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 1,
            ServingUnit = "tortilla",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 14,
            TypicalPackageSize = 10,
            PackageSizeUnit = "count",
            IsStaple = false,
            Aliases = new List<string> { "flour tortillas", "tortilla" }
        };
        var cheddarCheese = new Ingredient
        {
            Name = "Cheddar Cheese",
            FoodGroup = FoodGroup.Dairy,
            ServingSize = 1.5m,
            ServingUnit = "oz",
            PurchaseUnit = "block",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 21,
            TypicalPackageSize = 8,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "cheddar", "cheddar cheese" }
        };
        var potato = new Ingredient
        {
            Name = "Potato",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup cooked",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 30,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "russet potato", "potato", "potatoes" }
        };
        var salsa = new Ingredient
        {
            Name = "Salsa",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "jarred salsa", "salsa" }
        };
        var breakfastSausage = new Ingredient
        {
            Name = "Breakfast Sausage",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 3,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "sausage", "breakfast sausage" }
        };
        var ham = new Ingredient
        {
            Name = "Ham",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "lb",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 1,
            PackageSizeUnit = "lb",
            IsStaple = false,
            Aliases = new List<string> { "ham", "diced ham" }
        };
        var spinach = new Ingredient
        {
            Name = "Spinach",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 2,
            ServingUnit = "cups raw",
            PurchaseUnit = "bag",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 5,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "baby spinach", "spinach" }
        };
        var bellPepper = new Ingredient
        {
            Name = "Bell Pepper",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "sweet pepper", "bell pepper" }
        };
        var onion = new Ingredient
        {
            Name = "Onion",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 30,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = true,
            Aliases = new List<string> { "yellow onion", "onion" }
        };
        var oliveOil = new Ingredient
        {
            Name = "Olive Oil",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "bottle",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "olive oil" }
        };
        var smokedPaprika = new Ingredient
        {
            Name = "Smoked Paprika",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 2,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "smoked paprika" }
        };
        var garlicPowder = new Ingredient
        {
            Name = "Garlic Powder",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 3,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "garlic powder" }
        };
        var greenOnions = new Ingredient
        {
            Name = "Green Onions",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "bunch",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "bunch",
            IsStaple = false,
            Aliases = new List<string> { "scallions", "green onions" }
        };
        var hotSauce = new Ingredient
        {
            Name = "Hot Sauce",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tsp",
            PurchaseUnit = "bottle",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 730,
            TypicalPackageSize = 5,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "hot sauce" }
        };
        var romaineLettuce = new Ingredient
        {
            Name = "Romaine Lettuce",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 2,
            ServingUnit = "cups chopped",
            PurchaseUnit = "head",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "head",
            IsStaple = false,
            Aliases = new List<string> { "romaine", "romaine lettuce" }
        };
        var cucumber = new Ingredient
        {
            Name = "Cucumber",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup sliced",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "cucumber" }
        };
        var redOnion = new Ingredient
        {
            Name = "Red Onion",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 30,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "red onion" }
        };
        var fetaCheese = new Ingredient
        {
            Name = "Feta Cheese",
            FoodGroup = FoodGroup.Dairy,
            ServingSize = 1.5m,
            ServingUnit = "oz",
            PurchaseUnit = "container",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 14,
            TypicalPackageSize = 8,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "feta", "feta cheese" }
        };
        var mozzarella = new Ingredient
        {
            Name = "Mozzarella Cheese",
            FoodGroup = FoodGroup.Dairy,
            ServingSize = 1.5m,
            ServingUnit = "oz",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 14,
            TypicalPackageSize = 8,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "mozzarella", "mozzarella cheese" }
        };
        var dill = new Ingredient
        {
            Name = "Dill",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "bunch",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 5,
            TypicalPackageSize = 1,
            PackageSizeUnit = "bunch",
            IsStaple = false,
            Aliases = new List<string> { "fresh dill", "dill" }
        };
        var groundBeef = new Ingredient
        {
            Name = "Ground Beef",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "lb",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 2,
            TypicalPackageSize = 1,
            PackageSizeUnit = "lb",
            IsStaple = false,
            Aliases = new List<string> { "ground beef", "beef mince" }
        };
        var chickpeas = new Ingredient
        {
            Name = "Chickpeas",
            FoodGroup = FoodGroup.Legume,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "can",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Protein,
            IsPerishable = false,
            IsFlexibleGroup = true,
            IsMyPlateCounted = true,
            ShelfLifeDays = 730,
            TypicalPackageSize = 15,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "garbanzo beans", "chickpeas" }
        };
        var spaghetti = new Ingredient
        {
            Name = "Spaghetti",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 0.5m,
            ServingUnit = "cup cooked",
            PurchaseUnit = "box",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "spaghetti pasta", "spaghetti" }
        };
        var marinara = new Ingredient
        {
            Name = "Marinara Sauce",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 24,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "marinara", "marinara sauce", "pasta sauce" },
            Notes = "Prepared tomato-based sauce used as a vegetable contributor in recipes."
        };
        var pesto = new Ingredient
        {
            Name = "Pesto",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Pantry,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 30,
            TypicalPackageSize = 6,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "pesto" }
        };
        var alfredoSauce = new Ingredient
        {
            Name = "Alfredo Sauce",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Pantry,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 30,
            TypicalPackageSize = 15,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "alfredo", "alfredo sauce" },
            Notes = "Prepared mixed sauce; tracked as Other rather than Dairy for MyPlate counting."
        };
        var parmesan = new Ingredient
        {
            Name = "Parmesan Cheese",
            FoodGroup = FoodGroup.Dairy,
            ServingSize = 1.5m,
            ServingUnit = "oz",
            PurchaseUnit = "wedge",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 30,
            TypicalPackageSize = 8,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "parmesan", "parmesan cheese" }
        };
        var corn = new Ingredient
        {
            Name = "Corn",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "bag",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "corn kernels", "corn" }
        };
        var sourCream = new Ingredient
        {
            Name = "Sour Cream",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "tub",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 14,
            TypicalPackageSize = 16,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "sour cream" }
        };
        var pita = new Ingredient
        {
            Name = "Pita Bread",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 1,
            ServingUnit = "pita",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 6,
            PackageSizeUnit = "count",
            IsStaple = false,
            Aliases = new List<string> { "pita", "pita bread" }
        };
        var naan = new Ingredient
        {
            Name = "Naan",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 1,
            ServingUnit = "piece",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 7,
            TypicalPackageSize = 4,
            PackageSizeUnit = "count",
            IsStaple = false,
            Aliases = new List<string> { "naan" }
        };
        var gyroMeat = new Ingredient
        {
            Name = "Gyro Meat",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "package",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "gyro meat", "gyro slices" }
        };
        var tzatziki = new Ingredient
        {
            Name = "Tzatziki",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "container",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Dairy,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 10,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "tzatziki", "tzatziki sauce" }
        };
        var creamSauce = new Ingredient
        {
            Name = "Cream Sauce",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "batch",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Pantry,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 4,
            TypicalPackageSize = 4,
            PackageSizeUnit = "cups",
            IsStaple = false,
            Aliases = new List<string> { "cream sauce", "creamy sauce" },
            Notes = "Seed placeholder for homemade creamy sauce used in Hawaiian haystacks."
        };
        var pineapple = new Ingredient
        {
            Name = "Pineapple",
            FoodGroup = FoodGroup.Fruit,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "pineapple" }
        };
        var chowMeinNoodles = new Ingredient
        {
            Name = "Chow Mein Noodles",
            FoodGroup = FoodGroup.Grains,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "can",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Grains,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 5,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "chow mein noodles" }
        };
        var peas = new Ingredient
        {
            Name = "Peas",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "bag",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 5,
            TypicalPackageSize = 12,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "peas" }
        };
        var celery = new Ingredient
        {
            Name = "Celery",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup chopped",
            PurchaseUnit = "bunch",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 14,
            TypicalPackageSize = 1,
            PackageSizeUnit = "bunch",
            IsStaple = false,
            Aliases = new List<string> { "celery" }
        };
        var tacoSeasoning = new Ingredient
        {
            Name = "Taco Seasoning",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "packet",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 365,
            TypicalPackageSize = 1,
            PackageSizeUnit = "packet",
            IsStaple = false,
            Aliases = new List<string> { "taco seasoning" }
        };
        var v8 = new Ingredient
        {
            Name = "V8 Juice",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup",
            PurchaseUnit = "bottle",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 46,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "vegetable juice", "v8", "v8 juice" }
        };
        var sweetPotato = new Ingredient
        {
            Name = "Sweet Potato",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 1,
            ServingUnit = "cup cooked",
            PurchaseUnit = "each",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Produce,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 30,
            TypicalPackageSize = 1,
            PackageSizeUnit = "each",
            IsStaple = false,
            Aliases = new List<string> { "sweet potato", "sweet potatoes" }
        };
        var olives = new Ingredient
        {
            Name = "Olives",
            FoodGroup = FoodGroup.Vegetable,
            ServingSize = 0.5m,
            ServingUnit = "cup",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Pantry,
            StoreSection = StoreSection.Pantry,
            IsPerishable = false,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 365,
            TypicalPackageSize = 6,
            PackageSizeUnit = "oz",
            IsStaple = false,
            Aliases = new List<string> { "olives", "black olives" }
        };
        var mayonnaise = new Ingredient
        {
            Name = "Mayonnaise",
            FoodGroup = FoodGroup.Other,
            ServingSize = 0,
            ServingUnit = "tbsp",
            PurchaseUnit = "jar",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Pantry,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = false,
            ShelfLifeDays = 90,
            TypicalPackageSize = 30,
            PackageSizeUnit = "oz",
            IsStaple = true,
            Aliases = new List<string> { "mayo", "mayonnaise" }
        };
        var turkeyBreast = new Ingredient
        {
            Name = "Turkey Breast",
            FoodGroup = FoodGroup.Protein,
            ServingSize = 3,
            ServingUnit = "oz",
            PurchaseUnit = "lb",
            DefaultLocation = DefaultLocation.Fridge,
            StoreSection = StoreSection.Protein,
            IsPerishable = true,
            IsFlexibleGroup = false,
            IsMyPlateCounted = true,
            ShelfLifeDays = 3,
            TypicalPackageSize = 1,
            PackageSizeUnit = "lb",
            IsStaple = false,
            Aliases = new List<string> { "turkey breast", "turkey" }
        };

        db.Ingredients.AddRange(
            greekYogurt, mixedBerries, granola, honey, banana, whippedCream, jam, walnuts, peanutButter,
            oatmealPacket, butter, mapleSyrup, cinnamon, wholeGrainBread, avocado, salt, blackPepper,
            cottageCheese, picoDeGallo, tomatoes, balsamicGlaze, basil, bacon, flourTortilla,
            cheddarCheese, potato, salsa, breakfastSausage, ham, spinach, bellPepper, onion,
            oliveOil, smokedPaprika, garlicPowder, greenOnions, hotSauce, romaineLettuce,
            cucumber, redOnion, fetaCheese, mozzarella, dill, groundBeef, chickpeas, spaghetti, marinara, pesto,
            alfredoSauce, parmesan, corn, sourCream, pita, naan, gyroMeat, tzatziki,
            creamSauce, pineapple, chowMeinNoodles, peas, celery, tacoSeasoning, v8, sweetPotato,
            olives, mayonnaise, turkeyBreast
        );
        await db.SaveChangesAsync();

        // ── Recipe 1: Chicken and Rice ────────────────────────────────────────

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
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
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

        // ── Recipe 2: Scrambled Eggs ──────────────────────────────────────────

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
            MealTypeTags = new List<MealType> { MealType.Breakfast, MealType.Snack },
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

        // ── Recipe 3: Black Bean Tacos ────────────────────────────────────────

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
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
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

        // ── Recipe 4: Yogurt Parfait ────────────────────────────────────────

        var yogurtParfait = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Yogurt Parfait",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 1,
            MealTypeTags = new List<MealType> { MealType.Breakfast, MealType.Snack },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["dairy"] = 1,
                ["fruit"] = 1,
                ["grains"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(yogurtParfait);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = greekYogurt.Id, Quantity = 1, Unit = "cup" },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = mixedBerries.Id, Quantity = 1, Unit = "cup" },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = granola.Id, Quantity = 0.5m, Unit = "cup" },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = honey.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = banana.Id, Quantity = 0.5m, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = walnuts.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = jam.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = yogurtParfait.Id, IngredientId = whippedCream.Id, Quantity = 2, Unit = "tbsp", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = yogurtParfait.Id, StepNumber = 1, Instruction = "Layer Greek yogurt, berries, and granola in a jar or bowl.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 4, IsPassive = false },
            new RecipeStep { RecipeId = yogurtParfait.Id, StepNumber = 2, Instruction = "Add any optional toppings before serving.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 1, IsPassive = false }
        );

        // ── Recipe 5: Oatmeal ───────────────────────────────────────────────

        var oatmeal = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Oatmeal",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 1,
            MealTypeTags = new List<MealType> { MealType.Breakfast, MealType.Snack },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(oatmeal);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = oatmealPacket.Id, Quantity = 1, Unit = "packet" },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = butter.Id, Quantity = 1, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = mapleSyrup.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = cinnamon.Id, Quantity = 0.5m, Unit = "tsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = mixedBerries.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = banana.Id, Quantity = 0.5m, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = peanutButter.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = walnuts.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = oatmeal.Id, IngredientId = whippedCream.Id, Quantity = 2, Unit = "tbsp", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = oatmeal.Id, StepNumber = 1, Instruction = "Microwave the oatmeal packet according to package directions.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false },
            new RecipeStep { RecipeId = oatmeal.Id, StepNumber = 2, Instruction = "Stir in butter and finish with any optional toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 2, IsPassive = false }
        );

        // ── Recipe 6: Avocado Toast ─────────────────────────────────────────

        var avocadoToast = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Avocado Toast",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 1,
            MealTypeTags = new List<MealType> { MealType.Breakfast, MealType.Lunch },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(avocadoToast);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = wholeGrainBread.Id, Quantity = 2, Unit = "slices" },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = avocado.Id, Quantity = 1, Unit = "whole" },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = salt.Id, Quantity = 0.25m, Unit = "tsp" },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = blackPepper.Id, Quantity = 0.25m, Unit = "tsp" },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = eggs.Id, Quantity = 1, Unit = "large egg", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = bacon.Id, Quantity = 2, Unit = "slices", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = cottageCheese.Id, Quantity = 0.25m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = picoDeGallo.Id, Quantity = 0.25m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = tomatoes.Id, Quantity = 0.5m, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = balsamicGlaze.Id, Quantity = 1, Unit = "tsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = avocadoToast.Id, IngredientId = basil.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = avocadoToast.Id, StepNumber = 1, Instruction = "Toast the bread until golden and crisp.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false },
            new RecipeStep { RecipeId = avocadoToast.Id, StepNumber = 2, Instruction = "Mash avocado with salt and pepper, then spread over toast.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 4, IsPassive = false },
            new RecipeStep { RecipeId = avocadoToast.Id, StepNumber = 3, Instruction = "Add any optional toppings and serve immediately.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false }
        );

        // ── Recipe 7: Breakfast Burrito ─────────────────────────────────────

        var breakfastBurrito = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Breakfast Burrito",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Portioned,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = true,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Breakfast, MealType.Lunch },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["vegetables"] = 1,
                ["dairy"] = 0.5m
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(breakfastBurrito);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = flourTortilla.Id, Quantity = 4, Unit = "tortillas" },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = eggs.Id, Quantity = 8, Unit = "large eggs" },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = cheddarCheese.Id, Quantity = 4, Unit = "oz" },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = potato.Id, Quantity = 4, Unit = "medium potatoes" },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = bacon.Id, Quantity = 8, Unit = "slices" },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = blackBeans.Id, Quantity = 1, Unit = "can", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = salsa.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = breakfastSausage.Id, Quantity = 8, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = spinach.Id, Quantity = 2, Unit = "cups raw", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = avocado.Id, Quantity = 1, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = tomatoes.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = bellPepper.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = breakfastBurrito.Id, IngredientId = onion.Id, Quantity = 0.5m, Unit = "cup chopped", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = breakfastBurrito.Id, StepNumber = 1, Instruction = "Roast or saute the potatoes until tender and crisp at the edges.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 20, IsPassive = false },
            new RecipeStep { RecipeId = breakfastBurrito.Id, StepNumber = 2, Instruction = "Cook the bacon and scramble the eggs until just set.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 12, IsPassive = false },
            new RecipeStep { RecipeId = breakfastBurrito.Id, StepNumber = 3, Instruction = "Fill each tortilla with potatoes, eggs, bacon, and cheddar. Add any optional modifiers you want included.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = breakfastBurrito.Id, StepNumber = 4, Instruction = "Wrap tightly and refrigerate or freeze. Reheat before serving and add fresh toppings like salsa or avocado after warming if desired.", TimingTag = TimingTag.DayOfPassive, DurationMinutes = 5, IsPassive = true }
        );

        // ── Recipe 8: Country Breakfast Bowl ────────────────────────────────

        var countryBreakfastBowl = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Country Breakfast Bowl",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Portioned,
            TimeTag = TimeTag.Involved,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = true,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Breakfast, MealType.Lunch, MealType.Dinner },
            SourceUrl = "https://www.budgetbytes.com/country-breakfast-bowls-freezable/",
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["protein"] = 2,
                ["vegetables"] = 1.5m,
                ["dairy"] = 0.5m
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(countryBreakfastBowl);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = potato.Id, Quantity = 6, Unit = "medium potatoes" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = oliveOil.Id, Quantity = 2, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = smokedPaprika.Id, Quantity = 1, Unit = "tsp" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = garlicPowder.Id, Quantity = 1, Unit = "tsp" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = salt.Id, Quantity = 1, Unit = "tsp" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = blackPepper.Id, Quantity = 0.5m, Unit = "tsp" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = eggs.Id, Quantity = 8, Unit = "large eggs" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = butter.Id, Quantity = 1, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = salsa.Id, Quantity = 1, Unit = "cup" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = cheddarCheese.Id, Quantity = 4, Unit = "oz" },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = breakfastSausage.Id, Quantity = 8, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = bacon.Id, Quantity = 8, Unit = "slices", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = greenOnions.Id, Quantity = 0.5m, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = ham.Id, Quantity = 8, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = bellPepper.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = hotSauce.Id, Quantity = 2, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = countryBreakfastBowl.Id, IngredientId = tomatoes.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = countryBreakfastBowl.Id, StepNumber = 1, Instruction = "Dice the potatoes, toss with olive oil, smoked paprika, garlic powder, salt, and pepper, then roast until browned and tender.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 35, IsPassive = true },
            new RecipeStep { RecipeId = countryBreakfastBowl.Id, StepNumber = 2, Instruction = "Scramble the eggs in butter until softly set.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = countryBreakfastBowl.Id, StepNumber = 3, Instruction = "Divide potatoes, eggs, salsa, and cheddar between containers. Add any optional proteins or toppings you want included for meal prep.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = countryBreakfastBowl.Id, StepNumber = 4, Instruction = "Reheat and finish with fresh toppings like green onions or hot sauce when serving.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        // ── Recipe 9: Bruschetta Toast ──────────────────────────────────────

        var bruschettaToast = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Bruschetta Toast",
            Cuisine = "Italian",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 2,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner, MealType.Snack },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(bruschettaToast);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = wholeGrainBread.Id, Quantity = 4, Unit = "slices" },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = tomatoes.Id, Quantity = 2, Unit = "cups chopped" },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = basil.Id, Quantity = 2, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = oliveOil.Id, Quantity = 1, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = salt.Id, Quantity = 0.25m, Unit = "tsp" },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = blackPepper.Id, Quantity = 0.25m, Unit = "tsp" },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = balsamicGlaze.Id, Quantity = 1, Unit = "tsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = mozzarella.Id, Quantity = 2, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = bruschettaToast.Id, IngredientId = avocado.Id, Quantity = 1, Unit = "whole", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = bruschettaToast.Id, StepNumber = 1, Instruction = "Mix the chopped tomatoes with basil, olive oil, salt, and pepper.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 5, IsPassive = false },
            new RecipeStep { RecipeId = bruschettaToast.Id, StepNumber = 2, Instruction = "Toast the bread until crisp.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 4, IsPassive = false },
            new RecipeStep { RecipeId = bruschettaToast.Id, StepNumber = 3, Instruction = "Spoon the tomato mixture over the toast and finish with any optional toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false }
        );

        // ── Recipe 10: BLT Sandwich ─────────────────────────────────────────

        var bltSandwich = new Recipe
        {
            HouseholdId = household.Id,
            Name = "BLT Sandwich",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 2,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 1,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(bltSandwich);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = wholeGrainBread.Id, Quantity = 4, Unit = "slices" },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = bacon.Id, Quantity = 8, Unit = "slices" },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = romaineLettuce.Id, Quantity = 2, Unit = "cups chopped" },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = tomatoes.Id, Quantity = 1, Unit = "cup chopped" },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = mayonnaise.Id, Quantity = 2, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = avocado.Id, Quantity = 1, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = turkeyBreast.Id, Quantity = 4, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = bltSandwich.Id, IngredientId = cheddarCheese.Id, Quantity = 2, Unit = "oz", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = bltSandwich.Id, StepNumber = 1, Instruction = "Cook the bacon until crisp.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = bltSandwich.Id, StepNumber = 2, Instruction = "Toast the bread and spread with mayonnaise.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false },
            new RecipeStep { RecipeId = bltSandwich.Id, StepNumber = 3, Instruction = "Layer bacon, lettuce, tomato, and any optional add-ins before serving.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false }
        );

        // ── Recipe 11: Greek Salad ──────────────────────────────────────────

        var greekSalad = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Greek Salad",
            Cuisine = "Greek",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 2,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["vegetables"] = 2,
                ["dairy"] = 0.5m
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(greekSalad);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = cucumber.Id, Quantity = 2, Unit = "cups sliced" },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = tomatoes.Id, Quantity = 2, Unit = "cups chopped" },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = redOnion.Id, Quantity = 0.5m, Unit = "cup sliced" },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = fetaCheese.Id, Quantity = 3, Unit = "oz" },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = oliveOil.Id, Quantity = 2, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = dill.Id, Quantity = 1, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = chickenBreast.Id, Quantity = 6, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = chickpeas.Id, Quantity = 1, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = pita.Id, Quantity = 2, Unit = "pitas", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = greekSalad.Id, IngredientId = bellPepper.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = greekSalad.Id, StepNumber = 1, Instruction = "Chop the cucumber, tomatoes, and red onion.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 8, IsPassive = false },
            new RecipeStep { RecipeId = greekSalad.Id, StepNumber = 2, Instruction = "Toss the vegetables with feta, olive oil, dill, salt, and pepper.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 4, IsPassive = false },
            new RecipeStep { RecipeId = greekSalad.Id, StepNumber = 3, Instruction = "Add any optional protein or bread just before serving.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 2, IsPassive = false }
        );

        // ── Recipe 12: Pasta with Marinara ─────────────────────────────────

        var pastaWithMarinara = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Pasta with Marinara",
            Cuisine = "Italian",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = true,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(pastaWithMarinara);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = spaghetti.Id, Quantity = 16, Unit = "oz" },
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = marinara.Id, Quantity = 3, Unit = "cups" },
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = pesto.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = alfredoSauce.Id, Quantity = 2, Unit = "cups", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = groundBeef.Id, Quantity = 12, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = spinach.Id, Quantity = 3, Unit = "cups raw", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = pastaWithMarinara.Id, IngredientId = parmesan.Id, Quantity = 2, Unit = "oz", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = pastaWithMarinara.Id, StepNumber = 1, Instruction = "Boil the pasta according to package directions.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 12, IsPassive = true },
            new RecipeStep { RecipeId = pastaWithMarinara.Id, StepNumber = 2, Instruction = "Warm the marinara and stir in any optional sauce or protein additions.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 8, IsPassive = false },
            new RecipeStep { RecipeId = pastaWithMarinara.Id, StepNumber = 3, Instruction = "Toss the cooked pasta with the sauce and finish with any optional toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false }
        );

        // ── Recipe 13: Burrito Bowl ─────────────────────────────────────────

        var burritoBowl = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Burrito Bowl",
            Cuisine = "Mexican",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["vegetables"] = 1.5m
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(burritoBowl);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = brownRice.Id, Quantity = 2, Unit = "cups cooked" },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = blackBeans.Id, Quantity = 2, Unit = "cups" },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = groundBeef.Id, Quantity = 16, Unit = "oz" },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = corn.Id, Quantity = 1.5m, Unit = "cups" },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = salsa.Id, Quantity = 1, Unit = "cup" },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = avocado.Id, Quantity = 2, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = cheddarCheese.Id, Quantity = 4, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = picoDeGallo.Id, Quantity = 1, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = romaineLettuce.Id, Quantity = 4, Unit = "cups chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = sourCream.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = burritoBowl.Id, IngredientId = bellPepper.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = burritoBowl.Id, StepNumber = 1, Instruction = "Cook the ground beef with taco seasoning until browned.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = burritoBowl.Id, StepNumber = 2, Instruction = "Warm the rice, black beans, and corn.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = burritoBowl.Id, StepNumber = 3, Instruction = "Assemble bowls with rice, beans, beef, corn, and salsa. Finish with any optional toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 8, IsPassive = false }
        );

        // ── Recipe 14: Greek Gyro Wrap ──────────────────────────────────────

        var greekGyroWrap = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Greek Gyro Wrap",
            Cuisine = "Greek",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(greekGyroWrap);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = naan.Id, Quantity = 4, Unit = "pieces" },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = gyroMeat.Id, Quantity = 16, Unit = "oz" },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = tzatziki.Id, Quantity = 1, Unit = "cup" },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = tomatoes.Id, Quantity = 1.5m, Unit = "cups chopped" },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = cucumber.Id, Quantity = 1.5m, Unit = "cups chopped" },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = redOnion.Id, Quantity = 0.5m, Unit = "cup sliced" },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = fetaCheese.Id, Quantity = 3, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = romaineLettuce.Id, Quantity = 2, Unit = "cups chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = greekGyroWrap.Id, IngredientId = olives.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = greekGyroWrap.Id, StepNumber = 1, Instruction = "Warm the naan and gyro meat.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 6, IsPassive = false },
            new RecipeStep { RecipeId = greekGyroWrap.Id, StepNumber = 2, Instruction = "Slice the tomatoes, cucumber, and onion.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 8, IsPassive = false },
            new RecipeStep { RecipeId = greekGyroWrap.Id, StepNumber = 3, Instruction = "Assemble the wraps with tzatziki and any optional toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        // ── Recipe 15: Hawaiian Haystacks ───────────────────────────────────

        var hawaiianHaystacks = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Hawaiian Haystacks",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["fruit"] = 0.5m
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(hawaiianHaystacks);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = brownRice.Id, Quantity = 2, Unit = "cups cooked" },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = chickenBreast.Id, Quantity = 16, Unit = "oz" },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = creamSauce.Id, Quantity = 3, Unit = "cups" },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = pineapple.Id, Quantity = 1.5m, Unit = "cups chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = cheddarCheese.Id, Quantity = 3, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = chowMeinNoodles.Id, Quantity = 2, Unit = "cups", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = greenOnions.Id, Quantity = 0.5m, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = peas.Id, Quantity = 1, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = hawaiianHaystacks.Id, IngredientId = celery.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = hawaiianHaystacks.Id, StepNumber = 1, Instruction = "Cook the rice and chicken ahead of time.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 25, IsPassive = true },
            new RecipeStep { RecipeId = hawaiianHaystacks.Id, StepNumber = 2, Instruction = "Warm the cream sauce and combine with the cooked chicken.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = hawaiianHaystacks.Id, StepNumber = 3, Instruction = "Serve the chicken mixture over rice and let everyone add any optional toppings they like.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        // ── Recipe 16: Ground Beef Tacos ────────────────────────────────────

        var groundBeefTacos = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Ground Beef Tacos",
            Cuisine = "Mexican",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["protein"] = 2,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(groundBeefTacos);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = flourTortilla.Id, Quantity = 8, Unit = "tortillas" },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = groundBeef.Id, Quantity = 16, Unit = "oz" },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = tacoSeasoning.Id, Quantity = 1, Unit = "packet" },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = romaineLettuce.Id, Quantity = 2, Unit = "cups chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = tomatoes.Id, Quantity = 1, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = cheddarCheese.Id, Quantity = 4, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = salsa.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = avocado.Id, Quantity = 1, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = blackBeans.Id, Quantity = 1, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = groundBeefTacos.Id, IngredientId = sourCream.Id, Quantity = 0.5m, Unit = "cup", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = groundBeefTacos.Id, StepNumber = 1, Instruction = "Brown the ground beef, then stir in taco seasoning.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = groundBeefTacos.Id, StepNumber = 2, Instruction = "Warm the tortillas.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 3, IsPassive = false },
            new RecipeStep { RecipeId = groundBeefTacos.Id, StepNumber = 3, Instruction = "Fill the tortillas with seasoned beef and any optional toppings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        // ── Recipe 17: Grilled Cheese and V8 ────────────────────────────────

        var grilledCheeseAndV8 = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Grilled Cheese and V8",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Quick,
            PrepStyleTag = RecipePrepStyleTag.CookFresh,
            IsFreezerFriendly = false,
            IsCookFreshOnly = true,
            BaseYieldServings = 2,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["grains"] = 2,
                ["dairy"] = 1,
                ["vegetables"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(grilledCheeseAndV8);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = wholeGrainBread.Id, Quantity = 4, Unit = "slices" },
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = cheddarCheese.Id, Quantity = 4, Unit = "oz" },
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = butter.Id, Quantity = 2, Unit = "tbsp" },
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = v8.Id, Quantity = 2, Unit = "cups" },
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = basil.Id, Quantity = 1, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = mozzarella.Id, Quantity = 2, Unit = "oz", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = grilledCheeseAndV8.Id, IngredientId = ham.Id, Quantity = 4, Unit = "oz", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = grilledCheeseAndV8.Id, StepNumber = 1, Instruction = "Butter the bread and build the sandwiches with cheddar and any optional fillings.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 4, IsPassive = false },
            new RecipeStep { RecipeId = grilledCheeseAndV8.Id, StepNumber = 2, Instruction = "Grill the sandwiches until the bread is golden and the cheese is melted.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 8, IsPassive = false },
            new RecipeStep { RecipeId = grilledCheeseAndV8.Id, StepNumber = 3, Instruction = "Pour the chilled V8 and serve alongside the sandwiches.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 1, IsPassive = false }
        );

        // ── Recipe 18: Sweet Potato Beef Cottage Cheese Bowl ────────────────

        var sweetPotatoBeefBowl = new Recipe
        {
            HouseholdId = household.Id,
            Name = "Sweet Potato Beef Cottage Cheese Bowl",
            Cuisine = "American",
            ScalabilityTag = ScalabilityTag.Flexible,
            TimeTag = TimeTag.Medium,
            PrepStyleTag = RecipePrepStyleTag.BatchFriendly,
            IsFreezerFriendly = false,
            IsCookFreshOnly = false,
            BaseYieldServings = 4,
            MealTypeTags = new List<MealType> { MealType.Lunch, MealType.Dinner },
            FoodGroupServings = new Dictionary<string, decimal>
            {
                ["protein"] = 2,
                ["vegetables"] = 1.5m,
                ["dairy"] = 1
            },
            CreatedAt = DateTime.UtcNow
        };
        db.Recipes.Add(sweetPotatoBeefBowl);
        await db.SaveChangesAsync();

        db.RecipeIngredients.AddRange(
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = sweetPotato.Id, Quantity = 4, Unit = "medium sweet potatoes" },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = groundBeef.Id, Quantity = 16, Unit = "oz" },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = cottageCheese.Id, Quantity = 2, Unit = "cups" },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = avocado.Id, Quantity = 1, Unit = "whole", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = greenOnions.Id, Quantity = 0.5m, Unit = "cup chopped", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = hotSauce.Id, Quantity = 2, Unit = "tbsp", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = blackBeans.Id, Quantity = 1, Unit = "cup", IsModifier = true, IsOptional = true },
            new RecipeIngredient { RecipeId = sweetPotatoBeefBowl.Id, IngredientId = spinach.Id, Quantity = 2, Unit = "cups raw", IsModifier = true, IsOptional = true }
        );
        db.RecipeSteps.AddRange(
            new RecipeStep { RecipeId = sweetPotatoBeefBowl.Id, StepNumber = 1, Instruction = "Roast the sweet potatoes until tender.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 35, IsPassive = true },
            new RecipeStep { RecipeId = sweetPotatoBeefBowl.Id, StepNumber = 2, Instruction = "Brown the ground beef and season with salt and pepper.", TimingTag = TimingTag.PrepAhead, DurationMinutes = 10, IsPassive = false },
            new RecipeStep { RecipeId = sweetPotatoBeefBowl.Id, StepNumber = 3, Instruction = "Assemble bowls with roasted sweet potato, beef, and cottage cheese. Add any optional toppings before serving.", TimingTag = TimingTag.DayOfActive, DurationMinutes = 5, IsPassive = false }
        );

        await db.SaveChangesAsync();
    }
}
