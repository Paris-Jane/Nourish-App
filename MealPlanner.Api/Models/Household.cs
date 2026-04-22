namespace MealPlanner.Api.Models;

public class Household
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Size { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Timezone { get; set; } = "UTC";

    public ICollection<User> Users { get; set; } = new List<User>();
    public HouseholdPreferences? Preferences { get; set; }
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    public ICollection<Week> Weeks { get; set; } = new List<Week>();
    public ICollection<FridgeItem> FridgeItems { get; set; } = new List<FridgeItem>();
    public ICollection<GroceryList> GroceryLists { get; set; } = new List<GroceryList>();
    public ICollection<UserRecipePref> RecipePrefs { get; set; } = new List<UserRecipePref>();
}
