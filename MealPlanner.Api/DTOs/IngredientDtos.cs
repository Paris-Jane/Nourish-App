namespace MealPlanner.Api.DTOs;

public record IngredientRequest(
    string Name,
    FoodGroup FoodGroup,
    decimal ServingSize,
    string ServingUnit,
    string PurchaseUnit,
    DefaultLocation DefaultLocation,
    StoreSection StoreSection,
    bool IsPerishable,
    bool IsFlexibleGroup,
    bool IsMyPlateCounted,
    int ShelfLifeDays,
    decimal? TypicalPackageSize = null,
    string? PackageSizeUnit = null,
    bool IsStaple = false,
    List<string>? Aliases = null,
    string? Notes = null
);

public record IngredientResponse(
    int Id,
    string Name,
    FoodGroup FoodGroup,
    decimal ServingSize,
    string ServingUnit,
    string PurchaseUnit,
    DefaultLocation DefaultLocation,
    StoreSection StoreSection,
    bool IsPerishable,
    bool IsFlexibleGroup,
    bool IsMyPlateCounted,
    int ShelfLifeDays,
    decimal? TypicalPackageSize,
    string? PackageSizeUnit,
    bool IsStaple,
    List<string> Aliases,
    string? Notes
);
