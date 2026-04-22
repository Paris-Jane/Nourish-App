namespace MealPlanner.Api.Models;

public class Recipe
{
    public int Id { get; set; }
    public int HouseholdId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    public ScalabilityTag ScalabilityTag { get; set; }
    public TimeTag TimeTag { get; set; }
    public RecipePrepStyleTag PrepStyleTag { get; set; }
    public bool IsFreezerFriendly { get; set; }
    public bool IsCookFreshOnly { get; set; }
    public int BaseYieldServings { get; set; }
    public List<MealType> MealTypeTags { get; set; } = new();
    public string? ImageUrl { get; set; }
    public string? SourceUrl { get; set; }
    public Dictionary<string, decimal> FoodGroupServings { get; set; } = new();
    public DateTime CreatedAt { get; set; }

    public Household Household { get; set; } = null!;
    public ICollection<RecipeIngredient> Ingredients { get; set; } = new List<RecipeIngredient>();
    public ICollection<RecipeStep> Steps { get; set; } = new List<RecipeStep>();
    public ICollection<UserRecipePref> UserPreferences { get; set; } = new List<UserRecipePref>();
    public ICollection<WeekMealSlot> MealSlots { get; set; } = new List<WeekMealSlot>();
}
