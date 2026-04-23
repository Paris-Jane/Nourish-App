namespace MealPlanner.Api.Models;

public class Ingredient
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public FoodGroup FoodGroup { get; set; }
    public decimal ServingSize { get; set; }
    public string ServingUnit { get; set; } = string.Empty;
    public string PurchaseUnit { get; set; } = string.Empty;
    public DefaultLocation DefaultLocation { get; set; }
    public StoreSection StoreSection { get; set; }
    public bool IsPerishable { get; set; }
    public bool IsFlexibleGroup { get; set; }
    public bool IsMyPlateCounted { get; set; }
    public int ShelfLifeDays { get; set; }
    public decimal? TypicalPackageSize { get; set; }
    public string? PackageSizeUnit { get; set; }
    public bool IsStaple { get; set; }
    public List<string> Aliases { get; set; } = new();
    public string? Notes { get; set; }

    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
    public ICollection<FridgeItem> FridgeItems { get; set; } = new List<FridgeItem>();
    public ICollection<GroceryListItem> GroceryListItems { get; set; } = new List<GroceryListItem>();
    public ICollection<UserIngredientPref> UserPreferences { get; set; } = new List<UserIngredientPref>();
}
