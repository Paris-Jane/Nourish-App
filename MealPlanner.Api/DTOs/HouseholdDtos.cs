namespace MealPlanner.Api.DTOs;

public record HouseholdResponse(
    int Id,
    string Name,
    int Size,
    string Timezone,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record HouseholdPreferencesRequest(
    List<string> DietaryRestrictions,
    List<string> DislikedIngredients,
    List<string> CuisinePreferences,
    CookTime DefaultCookTime,
    PrepStyle DefaultPrepStyle
);

public record HouseholdPreferencesResponse(
    int Id,
    int HouseholdId,
    List<string> DietaryRestrictions,
    List<string> DislikedIngredients,
    List<string> CuisinePreferences,
    CookTime DefaultCookTime,
    PrepStyle DefaultPrepStyle,
    MyPlateTargets? MyPlateTargets,
    DateTime UpdatedAt
);
