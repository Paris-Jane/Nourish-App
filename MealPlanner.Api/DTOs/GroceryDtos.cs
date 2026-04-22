namespace MealPlanner.Api.DTOs;

public record GroceryListResponse(
    int Id,
    int WeekId,
    int HouseholdId,
    DateTime GeneratedAt,
    GroceryListStatus Status,
    DateTime? CompletedAt,
    List<GroceryListItemResponse> Items
);

public record GroceryListItemResponse(
    int Id,
    int GroceryListId,
    int IngredientId,
    string IngredientName,
    decimal PlannedQuantity,
    string PlannedUnit,
    decimal? PurchasedQuantity,
    string StoreSection,
    bool IsChecked,
    bool AddedToFridge,
    List<int> RecipeIds
);

public record CheckGroceryItemRequest(bool IsChecked);

public record UpdateQuantityRequest(decimal PurchasedQuantity);
