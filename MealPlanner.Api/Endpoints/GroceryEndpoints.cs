using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Models;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class GroceryEndpoints
{
    public static void MapGroceryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/weeks").RequireAuthorization().WithTags("Grocery");

        group.MapGet("/{weekId:int}/grocery-list", GetList);
        group.MapPost("/{weekId:int}/grocery-list/generate", Generate);
        group.MapPost("/{weekId:int}/grocery-list/items", AddItem);
        group.MapPut("/{weekId:int}/grocery-list/items/{itemId:int}/check", CheckItem);
        group.MapPut("/{weekId:int}/grocery-list/items/{itemId:int}/quantity", UpdateQuantity);
        group.MapDelete("/{weekId:int}/grocery-list/items/{itemId:int}", DeleteItem);
    }

    private static async Task<IResult> GetList(int weekId, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var list = await db.GroceryLists
            .Include(g => g.Items).ThenInclude(i => i.Ingredient)
            .FirstOrDefaultAsync(g => g.WeekId == weekId && g.HouseholdId == householdId);
        return list == null ? Results.NotFound() : Results.Ok(ToDto(list));
    }

    private static async Task<IResult> Generate(int weekId, AppDbContext db, ClaimsPrincipal user, IGroceryListService service)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == weekId && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var list = await service.GenerateAsync(weekId, householdId);
        return Results.Created($"/api/weeks/{weekId}/grocery-list", ToDto(list));
    }

    private static async Task<IResult> AddItem(
        int weekId, CreateGroceryItemRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var list = await db.GroceryLists
            .Include(g => g.Items)
            .FirstOrDefaultAsync(g => g.WeekId == weekId && g.HouseholdId == householdId);
        if (list == null) return Results.NotFound();

        var ingredient = await db.Ingredients.FirstOrDefaultAsync(i => i.Id == req.IngredientId);
        if (ingredient == null) return Results.BadRequest(new { message = "Ingredient not found" });

        var item = new GroceryListItem
        {
            GroceryListId = list.Id,
            IngredientId = ingredient.Id,
            PlannedQuantity = req.PlannedQuantity,
            PlannedUnit = req.PlannedUnit,
            StoreSection = string.IsNullOrWhiteSpace(req.StoreSection) ? ingredient.StoreSection.ToString() : req.StoreSection!,
            IsChecked = false,
            AddedToFridge = false,
            RecipeIds = new List<int>()
        };

        db.GroceryListItems.Add(item);
        await db.SaveChangesAsync();
        await db.Entry(item).Reference(i => i.Ingredient).LoadAsync();

        return Results.Created($"/api/weeks/{weekId}/grocery-list/items/{item.Id}", ToItemDto(item));
    }

    private static async Task<IResult> CheckItem(
        int weekId, int itemId, CheckGroceryItemRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var item = await db.GroceryListItems
            .Include(i => i.GroceryList)
            .Include(i => i.Ingredient)
            .FirstOrDefaultAsync(i => i.Id == itemId &&
                                      i.GroceryList.WeekId == weekId &&
                                      i.GroceryList.HouseholdId == householdId);
        if (item == null) return Results.NotFound();

        var effectiveQuantity = item.PurchasedQuantity ?? item.PlannedQuantity;
        item.IsChecked = req.IsChecked;

        if (req.IsChecked && !item.AddedToFridge)
        {
            await MergeIntoKitchenAsync(db, householdId, item.Ingredient, item.PlannedUnit, effectiveQuantity);
            item.AddedToFridge = true;
        }
        else if (!req.IsChecked && item.AddedToFridge)
        {
            await RemoveFromKitchenAsync(db, householdId, item.Ingredient, item.PlannedUnit, effectiveQuantity);
            item.AddedToFridge = false;
        }

        await db.SaveChangesAsync();
        return Results.Ok(ToItemDto(item));
    }

    private static async Task<IResult> UpdateQuantity(
        int weekId, int itemId, UpdateQuantityRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var item = await db.GroceryListItems
            .Include(i => i.GroceryList)
            .Include(i => i.Ingredient)
            .FirstOrDefaultAsync(i => i.Id == itemId &&
                                      i.GroceryList.WeekId == weekId &&
                                      i.GroceryList.HouseholdId == householdId);
        if (item == null) return Results.NotFound();

        var previousQuantity = item.PurchasedQuantity ?? item.PlannedQuantity;
        item.PurchasedQuantity = req.PurchasedQuantity;

        if (item.IsChecked && item.AddedToFridge)
        {
            var delta = req.PurchasedQuantity - previousQuantity;
            if (delta > 0)
            {
                await MergeIntoKitchenAsync(db, householdId, item.Ingredient, item.PlannedUnit, delta);
            }
            else if (delta < 0)
            {
                await RemoveFromKitchenAsync(db, householdId, item.Ingredient, item.PlannedUnit, Math.Abs(delta));
            }
        }

        await db.SaveChangesAsync();
        return Results.Ok(ToItemDto(item));
    }

    private static async Task<IResult> DeleteItem(
        int weekId, int itemId, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var item = await db.GroceryListItems
            .Include(i => i.GroceryList)
            .FirstOrDefaultAsync(i => i.Id == itemId &&
                                      i.GroceryList.WeekId == weekId &&
                                      i.GroceryList.HouseholdId == householdId);
        if (item == null) return Results.NotFound();

        db.GroceryListItems.Remove(item);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    private static GroceryListResponse ToDto(GroceryList g) => new(
        g.Id, g.WeekId, g.HouseholdId, g.GeneratedAt, g.Status, g.CompletedAt,
        g.Items.OrderBy(i => i.StoreSection).Select(ToItemDto).ToList());

    private static GroceryListItemResponse ToItemDto(GroceryListItem i) => new(
        i.Id, i.GroceryListId, i.IngredientId, i.Ingredient?.Name ?? string.Empty,
        i.PlannedQuantity, i.PlannedUnit, i.PurchasedQuantity,
        i.StoreSection, i.IsChecked, i.AddedToFridge, i.RecipeIds);

    private static async Task MergeIntoKitchenAsync(
        AppDbContext db,
        int householdId,
        Ingredient ingredient,
        string unit,
        decimal quantity)
    {
        if (quantity <= 0) return;

        var location = (FridgeLocation)(int)ingredient.DefaultLocation;
        var existing = await db.FridgeItems
            .Where(f =>
                f.HouseholdId == householdId &&
                f.IngredientId == ingredient.Id &&
                f.Unit == unit &&
                f.Location == location)
            .OrderByDescending(f => f.PurchasedAt)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            existing.Quantity += quantity;
            return;
        }

        db.FridgeItems.Add(new FridgeItem
        {
            HouseholdId = householdId,
            IngredientId = ingredient.Id,
            Quantity = quantity,
            Unit = unit,
            Location = location,
            PurchasedAt = DateTime.UtcNow,
            ExpiresAt = ingredient.IsPerishable
                ? DateTime.UtcNow.AddDays(ingredient.ShelfLifeDays)
                : null,
            AddedVia = AddedVia.GroceryList
        });
    }

    private static async Task RemoveFromKitchenAsync(
        AppDbContext db,
        int householdId,
        Ingredient ingredient,
        string unit,
        decimal quantity)
    {
        if (quantity <= 0) return;

        var location = (FridgeLocation)(int)ingredient.DefaultLocation;
        var matches = await db.FridgeItems
            .Where(f =>
                f.HouseholdId == householdId &&
                f.IngredientId == ingredient.Id &&
                f.Unit == unit &&
                f.Location == location)
            .OrderByDescending(f => f.AddedVia == AddedVia.GroceryList)
            .ThenByDescending(f => f.PurchasedAt)
            .ToListAsync();

        var remaining = quantity;
        foreach (var row in matches)
        {
            if (remaining <= 0) break;
            var take = Math.Min(row.Quantity, remaining);
            row.Quantity -= take;
            remaining -= take;
            if (row.Quantity <= 0)
            {
                db.FridgeItems.Remove(row);
            }
        }
    }
}
