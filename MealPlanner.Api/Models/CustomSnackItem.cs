namespace MealPlanner.Api.Models;

public class CustomSnackItem
{
    public int IngredientId { get; set; }
    public string IngredientName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public Dictionary<string, decimal> FoodGroupServings { get; set; } = new();
}
