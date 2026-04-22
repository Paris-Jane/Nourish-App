namespace MealPlanner.Api.Models;

public class RecipeIngredient
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public int IngredientId { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public bool IsModifier { get; set; }
    public bool IsOptional { get; set; }
    public List<int> SubstituteIngredientIds { get; set; } = new();
    public string? Notes { get; set; }

    public Recipe Recipe { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
}
