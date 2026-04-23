namespace MealPlanner.Api.Models;

public class Week
{
    public int Id { get; set; }
    public int HouseholdId { get; set; }
    public DateOnly WeekStartDate { get; set; }
    public WeekStatus Status { get; set; }
    public PrepStyle PrepStyle { get; set; }
    public CookTime MaxCookTime { get; set; }
    public bool IsSavedTemplate { get; set; }
    public string? TemplateName { get; set; }
    public bool IsInRotation { get; set; }
    public DateTime CreatedAt { get; set; }

    public Household Household { get; set; } = null!;
    public ICollection<WeekMealSlot> MealSlots { get; set; } = new List<WeekMealSlot>();
    public ICollection<SnackSuggestion> SnackSuggestions { get; set; } = new List<SnackSuggestion>();
    public GroceryList? GroceryList { get; set; }
    public ICollection<PrepSheet> PrepSheets { get; set; } = new List<PrepSheet>();
    public ICollection<UserWeekPref> UserPreferences { get; set; } = new List<UserWeekPref>();
}
