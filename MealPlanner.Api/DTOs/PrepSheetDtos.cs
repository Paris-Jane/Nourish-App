namespace MealPlanner.Api.DTOs;

public record PrepSheetResponse(
    int Id,
    int WeekId,
    DateOnly PrepDay,
    SheetType SheetType,
    DateTime GeneratedAt,
    int TotalTimeMinutes,
    List<PrepSheetStepResponse> Steps
);

public record PrepSheetStepResponse(
    int Id,
    int RecipeStepId,
    string Instruction,
    int DisplayOrder,
    int ParallelGroup,
    int StartOffsetMinutes,
    string RecipeNameContext,
    int DurationMinutes,
    bool IsPassive
);
