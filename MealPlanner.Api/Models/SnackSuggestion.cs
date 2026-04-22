namespace MealPlanner.Api.Models;

public class SnackSuggestion
{
    public int Id { get; set; }
    public int WeekId { get; set; }
    public WeekDay DayOfWeek { get; set; }
    public string SuggestionText { get; set; } = string.Empty;
    public string FoodGroupTarget { get; set; } = string.Empty;
    public int? UsesFridgeItemId { get; set; }
    public bool IsAccepted { get; set; }
    public DateTime CreatedAt { get; set; }

    public Week Week { get; set; } = null!;
}
