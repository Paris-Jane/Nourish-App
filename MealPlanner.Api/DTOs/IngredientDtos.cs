namespace MealPlanner.Api.DTOs;

public record IngredientRequest(
    string Name,
    FoodGroup FoodGroup,
    decimal ServingSize,
    string ServingUnit,
    string PurchaseUnit,
    bool IsPerishable,
    bool IsFlexibleGroup,
    int ShelfLifeDays
);

public record IngredientResponse(
    int Id,
    string Name,
    FoodGroup FoodGroup,
    decimal ServingSize,
    string ServingUnit,
    string PurchaseUnit,
    bool IsPerishable,
    bool IsFlexibleGroup,
    int ShelfLifeDays
);
