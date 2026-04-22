namespace MealPlanner.Api.DTOs;

public record SnackSuggestionResponse(
    int Id,
    int WeekId,
    WeekDay DayOfWeek,
    string SuggestionText,
    string FoodGroupTarget,
    int? UsesFridgeItemId,
    bool IsAccepted,
    DateTime CreatedAt
);
