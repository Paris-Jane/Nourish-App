using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Models;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class FridgeEndpoints
{
    public static void MapFridgeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/fridge").RequireAuthorization().WithTags("Fridge");

        group.MapGet("/", GetAll);
        group.MapPost("/", Add);
        group.MapPut("/{id:int}", Update);
        group.MapDelete("/{id:int}", Delete);
        group.MapGet("/expiring", GetExpiring);
        group.MapGet("/what-can-i-make", WhatCanIMake);
    }

    private static async Task<IResult> GetAll(AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var items = await db.FridgeItems
            .Include(f => f.Ingredient)
            .Where(f => f.HouseholdId == householdId && f.Quantity > 0)
            .ToListAsync();
        return Results.Ok(items.Select(ToDto));
    }

    private static async Task<IResult> Add(AddFridgeItemRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var ingredient = await db.Ingredients.FindAsync(req.IngredientId);
        if (ingredient == null) return Results.BadRequest("Ingredient not found.");

        var item = new FridgeItem
        {
            HouseholdId = householdId,
            IngredientId = req.IngredientId,
            Quantity = req.Quantity,
            Unit = req.Unit,
            // Use ingredient's DefaultLocation if caller didn't specify one explicitly
            Location = req.Location,
            PurchasedAt = req.PurchasedAt,
            ExpiresAt = req.ExpiresAt,
            IsLeftover = req.IsLeftover,
            SourceRecipeId = req.SourceRecipeId,
            AddedVia = req.AddedVia
        };
        db.FridgeItems.Add(item);
        await db.SaveChangesAsync();
        await db.Entry(item).Reference(i => i.Ingredient).LoadAsync();
        return Results.Created($"/api/fridge/{item.Id}", ToDto(item));
    }

    private static async Task<IResult> Update(int id, UpdateFridgeItemRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var item = await db.FridgeItems
            .Include(f => f.Ingredient)
            .FirstOrDefaultAsync(f => f.Id == id && f.HouseholdId == householdId);
        if (item == null) return Results.NotFound();

        if (req.Quantity.HasValue) item.Quantity = req.Quantity.Value;
        if (req.Unit != null) item.Unit = req.Unit;
        if (req.Location.HasValue) item.Location = req.Location.Value;
        if (req.ExpiresAt.HasValue) item.ExpiresAt = req.ExpiresAt.Value;
        await db.SaveChangesAsync();
        return Results.Ok(ToDto(item));
    }

    private static async Task<IResult> Delete(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var item = await db.FridgeItems.FirstOrDefaultAsync(f => f.Id == id && f.HouseholdId == householdId);
        if (item == null) return Results.NotFound();
        db.FridgeItems.Remove(item);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> GetExpiring(AppDbContext db, ClaimsPrincipal user, IFridgeService fridge)
    {
        var householdId = user.GetHouseholdId();
        var items = await fridge.GetExpiringAsync(householdId);
        return Results.Ok(items.Select(ToDto));
    }

    private static async Task<IResult> WhatCanIMake(AppDbContext db, ClaimsPrincipal user, IFridgeService fridge)
    {
        var householdId = user.GetHouseholdId();
        var recipes = await fridge.GetWhatCanIMakeAsync(householdId);
        return Results.Ok(recipes.Select(r => new { r.Id, r.Name, r.Cuisine, r.TimeTag, r.BaseYieldServings }));
    }

    private static FridgeItemResponse ToDto(FridgeItem f) => new(
        f.Id, f.HouseholdId, f.IngredientId, f.Ingredient?.Name ?? string.Empty,
        f.Quantity, f.Unit, f.Location, f.PurchasedAt, f.ExpiresAt,
        f.IsLeftover, f.SourceRecipeId, f.AddedVia);
}
