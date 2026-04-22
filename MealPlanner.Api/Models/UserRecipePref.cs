namespace MealPlanner.Api.Models;

public class UserRecipePref
{
    public int Id { get; set; }
    public int HouseholdId { get; set; }
    public int RecipeId { get; set; }
    public bool IsFavorite { get; set; }
    public bool IsDisliked { get; set; }
    public DateTime? LastUsedAt { get; set; }

    public Household Household { get; set; } = null!;
    public Recipe Recipe { get; set; } = null!;
}
