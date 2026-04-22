namespace MealPlanner.Api.Models;

public class PrepSheetStep
{
    public int Id { get; set; }
    public int PrepSheetId { get; set; }
    public int RecipeStepId { get; set; }
    public int DisplayOrder { get; set; }
    public int ParallelGroup { get; set; }
    public int StartOffsetMinutes { get; set; }
    public string RecipeNameContext { get; set; } = string.Empty;

    public PrepSheet PrepSheet { get; set; } = null!;
    public RecipeStep RecipeStep { get; set; } = null!;
}
