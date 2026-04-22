namespace MealPlanner.Api.DTOs;

public record AddFridgeItemRequest(
    int IngredientId,
    decimal Quantity,
    string Unit,
    FridgeLocation Location,
    DateTime? PurchasedAt = null,
    DateTime? ExpiresAt = null,
    bool IsLeftover = false,
    int? SourceRecipeId = null,
    AddedVia AddedVia = AddedVia.Manual
);

public record UpdateFridgeItemRequest(
    decimal? Quantity,
    string? Unit,
    FridgeLocation? Location,
    DateTime? ExpiresAt
);

public record FridgeItemResponse(
    int Id,
    int HouseholdId,
    int IngredientId,
    string IngredientName,
    decimal Quantity,
    string Unit,
    FridgeLocation Location,
    DateTime? PurchasedAt,
    DateTime? ExpiresAt,
    bool IsLeftover,
    int? SourceRecipeId,
    AddedVia AddedVia
);
