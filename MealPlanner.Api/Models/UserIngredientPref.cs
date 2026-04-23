namespace MealPlanner.Api.Models;

public class UserIngredientPref
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int IngredientId { get; set; }
    public bool IsFavorite { get; set; }
    public DateTime? LastUsedAt { get; set; }

    public User User { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
}
