namespace MealPlanner.Api.Models;

public class PrepSheet
{
    public int Id { get; set; }
    public int WeekId { get; set; }
    public DateOnly PrepDay { get; set; }
    public SheetType SheetType { get; set; }
    public DateTime GeneratedAt { get; set; }
    public int TotalTimeMinutes { get; set; }

    public Week Week { get; set; } = null!;
    public ICollection<PrepSheetStep> Steps { get; set; } = new List<PrepSheetStep>();
}
