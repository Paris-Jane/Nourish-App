namespace MealPlanner.Api.DTOs;

public record RecipeRequest(
    string Name,
    string Cuisine,
    ScalabilityTag ScalabilityTag,
    TimeTag TimeTag,
    RecipePrepStyleTag PrepStyleTag,
    bool IsFreezerFriendly,
    bool IsCookFreshOnly,
    int BaseYieldServings,
    List<MealType> MealTypeTags,
    Dictionary<string, decimal> FoodGroupServings,
    List<RecipeIngredientRequest> Ingredients,
    string? ImageUrl = null,
    string? SourceUrl = null
);

public record RecipeIngredientRequest(
    int IngredientId,
    decimal Quantity,
    string Unit,
    bool IsModifier = false,
    bool IsOptional = false,
    List<int>? SubstituteIngredientIds = null,
    string? Notes = null
);

public record RecipeStepRequest(
    int StepNumber,
    string Instruction,
    TimingTag TimingTag,
    int DurationMinutes,
    bool IsPassive = false
);

public record RecipeResponse(
    int Id,
    int HouseholdId,
    string Name,
    string Cuisine,
    ScalabilityTag ScalabilityTag,
    TimeTag TimeTag,
    RecipePrepStyleTag PrepStyleTag,
    bool IsFreezerFriendly,
    bool IsCookFreshOnly,
    int BaseYieldServings,
    List<MealType> MealTypeTags,
    string? ImageUrl,
    string? SourceUrl,
    Dictionary<string, decimal> FoodGroupServings,
    DateTime CreatedAt,
    List<RecipeIngredientResponse> Ingredients,
    List<RecipeStepResponse> Steps
);

public record RecipeIngredientResponse(
    int Id,
    int IngredientId,
    string IngredientName,
    decimal Quantity,
    string Unit,
    bool IsModifier,
    bool IsOptional,
    List<int> SubstituteIngredientIds,
    string? Notes
);

public record RecipeStepResponse(
    int Id,
    int StepNumber,
    string Instruction,
    TimingTag TimingTag,
    int DurationMinutes,
    bool IsPassive
);

public record RecipePreferenceRequest(
    bool? IsFavorite,
    bool? IsDisliked,
    List<int>? SelectedModifierIngredientIds = null
);

public record RecipePreferenceResponse(
    int Id,
    int RecipeId,
    bool IsFavorite,
    bool IsDisliked,
    List<int> SelectedModifierIngredientIds,
    DateTime? LastUsedAt
);

public record AddRecipeModifierRequest(
    int IngredientId,
    decimal? Quantity = null,
    string? Unit = null,
    string? Notes = null
);
