namespace MealPlanner.Api.Models;

public class GroceryListItem
{
    public int Id { get; set; }
    public int GroceryListId { get; set; }
    public int IngredientId { get; set; }
    public decimal PlannedQuantity { get; set; }
    public string PlannedUnit { get; set; } = string.Empty;
    public decimal? PurchasedQuantity { get; set; }
    public string StoreSection { get; set; } = string.Empty;
    public bool IsChecked { get; set; }
    public bool AddedToFridge { get; set; }
    public List<int> RecipeIds { get; set; } = new();

    public GroceryList GroceryList { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
}
