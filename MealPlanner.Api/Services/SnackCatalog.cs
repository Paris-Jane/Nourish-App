namespace MealPlanner.Api.Services;

/// <summary>
/// One snack option with the MyPlate servings it provides per <see cref="ServingDescription"/>.
/// Adjust any field here to tune what the recommendation engine suggests.
/// </summary>
public record SnackItem(
    string Name,
    string ServingDescription,        // Shown when 1 serving is recommended, e.g. "1 medium apple"
    string? DoubleServingDescription, // Shown when 2 servings are needed; null → "2× {ServingDescription}"
    Dictionary<string, decimal> MyPlateServings  // food group → MyPlate servings per one ServingDescription
);

/// <summary>
/// Editable snack catalog. Add, remove, or retune items here to change what gets recommended.
/// Valid MyPlateServings keys: grains · protein · vegetables · fruit · dairy
/// </summary>
public static class SnackCatalog
{
    public static readonly IReadOnlyList<SnackItem> Items = new List<SnackItem>
    {
        // ── Fruit ────────────────────────────────────────────────────────────
        new("Apple",          "1 medium apple",           "2 medium apples",          new() { ["fruit"] = 1.0m }),
        new("Banana",         "1 medium banana",          "2 medium bananas",         new() { ["fruit"] = 1.0m }),
        new("Orange",         "1 medium orange",          "2 medium oranges",         new() { ["fruit"] = 1.0m }),
        new("Grapes",         "1 cup grapes",             "2 cups grapes",            new() { ["fruit"] = 1.0m }),
        new("Mixed berries",  "¾ cup mixed berries",      "1½ cups mixed berries",    new() { ["fruit"] = 1.0m }),
        new("Dried mango",    "¼ cup dried mango",        "½ cup dried mango",        new() { ["fruit"] = 1.0m }),

        // ── Vegetables ───────────────────────────────────────────────────────
        new("Baby carrots",    "½ cup baby carrots",      "1 cup baby carrots",       new() { ["vegetables"] = 0.5m }),
        new("Snap peas",       "1 cup snap peas",         "2 cups snap peas",         new() { ["vegetables"] = 1.0m }),
        new("Cherry tomatoes", "1 cup cherry tomatoes",   "2 cups cherry tomatoes",   new() { ["vegetables"] = 1.0m }),
        new("Celery sticks",   "1 cup celery sticks",     "2 cups celery sticks",     new() { ["vegetables"] = 1.0m }),

        // ── Protein ──────────────────────────────────────────────────────────
        new("Hard-boiled egg",  "1 hard-boiled egg",      "2 hard-boiled eggs",       new() { ["protein"] = 1.0m }),
        new("Beef jerky",       "1 oz beef jerky",        "2 oz beef jerky",          new() { ["protein"] = 1.0m }),
        new("Almonds",          "1 oz almonds (~23)",     "2 oz almonds",             new() { ["protein"] = 1.0m }),
        new("Edamame",          "½ cup shelled edamame",  "1 cup shelled edamame",    new() { ["protein"] = 1.5m }),
        new("Turkey slices",    "2 oz deli turkey",       "4 oz deli turkey",         new() { ["protein"] = 1.0m }),
        new("Tuna pouch",       "2.5 oz tuna pouch",      null,                       new() { ["protein"] = 2.0m }),
        new("Sunflower seeds",  "2 tbsp sunflower seeds", "¼ cup sunflower seeds",    new() { ["protein"] = 0.5m }),

        // ── Grains ───────────────────────────────────────────────────────────
        new("Whole-grain crackers", "6 whole-grain crackers (1 oz)", "12 whole-grain crackers (2 oz)", new() { ["grains"] = 1.0m }),
        new("Rice cakes",       "2 rice cakes",           "4 rice cakes",             new() { ["grains"] = 1.0m }),
        new("Popcorn",          "3 cups air-popped popcorn", "6 cups air-popped popcorn", new() { ["grains"] = 1.0m }),
        new("Oat bar",          "1 oat bar (1.5 oz)",     null,                       new() { ["grains"] = 1.5m }),
        new("Whole-wheat pita", "1 small whole-wheat pita", null,                    new() { ["grains"] = 1.0m }),

        // ── Dairy ────────────────────────────────────────────────────────────
        new("String cheese",    "1 string cheese stick",  "2 string cheese sticks",  new() { ["dairy"] = 1.0m }),
        new("Milk",             "1 cup milk",             "2 cups milk",             new() { ["dairy"] = 1.0m }),
        new("Kefir",            "¾ cup kefir",            "1½ cups kefir",           new() { ["dairy"] = 1.0m }),
        new("Cheddar cheese",   "1.5 oz cheddar",         "3 oz cheddar",            new() { ["dairy"] = 1.0m }),

        // ── Multi-group combos (fill two or more gaps at once) ───────────────
        new("Apple with peanut butter",    "1 medium apple + 2 tbsp peanut butter",           null, new() { ["fruit"] = 1.0m, ["protein"] = 1.5m }),
        new("Crackers with string cheese", "6 whole-grain crackers + 1 string cheese stick",  null, new() { ["grains"] = 1.0m, ["dairy"] = 1.0m }),
        new("Carrots with hummus",         "½ cup carrots + 3 tbsp hummus",                   null, new() { ["vegetables"] = 0.5m, ["protein"] = 0.5m }),
        new("Greek yogurt with berries",   "6 oz plain Greek yogurt + ½ cup berries",         null, new() { ["dairy"] = 1.0m, ["protein"] = 1.5m, ["fruit"] = 0.5m }),
        new("Cheese and apple slices",     "1.5 oz cheddar + 1 medium apple",                 null, new() { ["dairy"] = 1.0m, ["fruit"] = 1.0m }),
        new("Almond butter on rice cakes", "2 rice cakes + 2 tbsp almond butter",             null, new() { ["grains"] = 1.0m, ["protein"] = 1.5m }),
        new("Celery with peanut butter",   "2 celery stalks + 2 tbsp peanut butter",          null, new() { ["vegetables"] = 0.5m, ["protein"] = 1.5m }),
        new("Trail mix",                   "¼ cup trail mix (nuts, seeds, dried fruit)",      null, new() { ["protein"] = 1.0m, ["fruit"] = 0.5m }),
        new("Cottage cheese with fruit",   "½ cup cottage cheese + ½ cup mixed fruit",        null, new() { ["protein"] = 1.0m, ["dairy"] = 0.5m, ["fruit"] = 0.5m }),
        new("Hummus with pita",            "3 tbsp hummus + 1 small whole-wheat pita",        null, new() { ["protein"] = 0.5m, ["grains"] = 1.0m }),
        new("Yogurt parfait",              "6 oz Greek yogurt + ¾ cup berries",               null, new() { ["dairy"] = 1.0m, ["protein"] = 1.5m, ["fruit"] = 1.0m }),
    };
}
