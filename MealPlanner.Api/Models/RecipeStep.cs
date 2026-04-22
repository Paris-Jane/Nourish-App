namespace MealPlanner.Api.Models;

public class RecipeStep
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public int StepNumber { get; set; }
    public string Instruction { get; set; } = string.Empty;
    public TimingTag TimingTag { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsPassive { get; set; }

    public Recipe Recipe { get; set; } = null!;
    public ICollection<PrepSheetStep> PrepSheetSteps { get; set; } = new List<PrepSheetStep>();
}
