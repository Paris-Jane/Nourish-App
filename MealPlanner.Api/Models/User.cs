namespace MealPlanner.Api.Models;

public class User
{
    public int Id { get; set; }
    public int HouseholdId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Sex { get; set; } = string.Empty;
    public ActivityLevel ActivityLevel { get; set; }
    public int HeightInches { get; set; }
    public decimal WeightPounds { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public string PasswordHash { get; set; } = string.Empty;

    public Household Household { get; set; } = null!;
    public ICollection<UserIngredientPref> IngredientPrefs { get; set; } = new List<UserIngredientPref>();
    public ICollection<UserWeekPref> WeekPrefs { get; set; } = new List<UserWeekPref>();
}
