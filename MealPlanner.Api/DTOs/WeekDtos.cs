namespace MealPlanner.Api.DTOs;

public record CreateWeekRequest(
    DateOnly WeekStartDate,
    PrepStyle PrepStyle,
    CookTime MaxCookTime
);

public record UpdateWeekRequest(
    PrepStyle? PrepStyle,
    CookTime? MaxCookTime,
    WeekStatus? Status
);

public record WeekResponse(
    int Id,
    int HouseholdId,
    DateOnly WeekStartDate,
    WeekStatus Status,
    PrepStyle PrepStyle,
    CookTime MaxCookTime,
    bool IsSavedTemplate,
    string? TemplateName,
    bool IsInRotation,
    DateTime CreatedAt
);

public record WeekMealSlotResponse(
    int Id,
    int WeekId,
    int? RecipeId,
    string? RecipeName,
    List<int> SelectedModifierIngredientIds,
    WeekDay DayOfWeek,
    MealType MealType,
    bool IsEatingOut,
    bool IsSkipped,
    bool IsLocked,
    int ServingsPlanned,
    bool AssumedCompleted,
    DateTime? MarkedSkippedAt
);

public record UpdateMealSlotRequest(
    int? RecipeId,
    List<int>? SelectedModifierIngredientIds,
    bool? IsEatingOut,
    bool? IsSkipped,
    bool? IsLocked,
    int? ServingsPlanned
);

public record SaveAsTemplateRequest(string TemplateName);

public record ToggleRotationRequest(bool IsInRotation);

public record WeekPreferenceRequest(bool? IsFavorite);

public record WeekPreferenceResponse(
    int Id,
    int UserId,
    int WeekId,
    bool IsFavorite
);
