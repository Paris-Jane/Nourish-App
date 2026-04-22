namespace MealPlanner.Api.Models;

public class FridgeItem
{
    public int Id { get; set; }
    public int HouseholdId { get; set; }
    public int IngredientId { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public FridgeLocation Location { get; set; }
    public DateTime? PurchasedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsLeftover { get; set; }
    public int? SourceRecipeId { get; set; }
    public AddedVia AddedVia { get; set; }

    public Household Household { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
    public ICollection<FridgeDepletionLog> DepletionLogs { get; set; } = new List<FridgeDepletionLog>();
}
