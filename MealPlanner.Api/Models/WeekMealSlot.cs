namespace MealPlanner.Api.Models;

public class WeekMealSlot
{
    public int Id { get; set; }
    public int WeekId { get; set; }
    public int? RecipeId { get; set; }
    public WeekDay DayOfWeek { get; set; }
    public MealType MealType { get; set; }
    public bool IsEatingOut { get; set; }
    public bool IsSkipped { get; set; }
    public bool IsLocked { get; set; }
    public int ServingsPlanned { get; set; }
    public bool AssumedCompleted { get; set; }
    public DateTime? MarkedSkippedAt { get; set; }

    public Week Week { get; set; } = null!;
    public Recipe? Recipe { get; set; }
    public ICollection<FridgeDepletionLog> DepletionLogs { get; set; } = new List<FridgeDepletionLog>();
}
