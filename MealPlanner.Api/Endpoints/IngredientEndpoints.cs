using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Models;
using System.Security.Claims;

namespace MealPlanner.Api.Endpoints;

public static class IngredientEndpoints
{
    public static void MapIngredientEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/ingredients").RequireAuthorization().WithTags("Ingredients");

        group.MapGet("/", GetAll);
        group.MapGet("/{id:int}", GetById);
        group.MapPost("/", Create);
        group.MapGet("/{id:int}/preferences", GetPreferences);
        group.MapPut("/{id:int}/preferences", UpsertPreferences);
    }

    private static async Task<IResult> GetAll(AppDbContext db)
    {
        var items = await db.Ingredients.ToListAsync();
        return Results.Ok(items.Select(ToDto));
    }

    private static async Task<IResult> GetById(int id, AppDbContext db)
    {
        var item = await db.Ingredients.FindAsync(id);
        return item == null ? Results.NotFound() : Results.Ok(ToDto(item));
    }

    private static async Task<IResult> Create(IngredientRequest req, AppDbContext db)
    {
        var ingredient = new Ingredient
        {
            Name = req.Name,
            FoodGroup = req.FoodGroup,
            ServingSize = req.ServingSize,
            ServingUnit = req.ServingUnit,
            PurchaseUnit = req.PurchaseUnit,
            DefaultLocation = req.DefaultLocation,
            StoreSection = req.StoreSection,
            IsPerishable = req.IsPerishable,
            IsFlexibleGroup = req.IsFlexibleGroup,
            IsMyPlateCounted = req.IsMyPlateCounted,
            ShelfLifeDays = req.ShelfLifeDays,
            TypicalPackageSize = req.TypicalPackageSize,
            PackageSizeUnit = req.PackageSizeUnit,
            IsStaple = req.IsStaple,
            Aliases = req.Aliases ?? new List<string>(),
            Notes = req.Notes
        };
        db.Ingredients.Add(ingredient);
        await db.SaveChangesAsync();
        return Results.Created($"/api/ingredients/{ingredient.Id}", ToDto(ingredient));
    }

    private static async Task<IResult> GetPreferences(int id, AppDbContext db, ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        var pref = await db.UserIngredientPrefs.FirstOrDefaultAsync(p => p.UserId == userId && p.IngredientId == id);
        if (pref == null) return Results.NotFound();
        return Results.Ok(new IngredientPreferenceResponse(pref.Id, pref.UserId, pref.IngredientId, pref.IsFavorite, pref.LastUsedAt));
    }

    private static async Task<IResult> UpsertPreferences(
        int id, IngredientPreferenceRequest req, AppDbContext db, ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        var exists = await db.Ingredients.AnyAsync(i => i.Id == id);
        if (!exists) return Results.NotFound();

        var pref = await db.UserIngredientPrefs.FirstOrDefaultAsync(p => p.UserId == userId && p.IngredientId == id);
        if (pref == null)
        {
            pref = new UserIngredientPref { UserId = userId, IngredientId = id };
            db.UserIngredientPrefs.Add(pref);
        }

        if (req.IsFavorite.HasValue) pref.IsFavorite = req.IsFavorite.Value;
        await db.SaveChangesAsync();

        return Results.Ok(new IngredientPreferenceResponse(pref.Id, pref.UserId, pref.IngredientId, pref.IsFavorite, pref.LastUsedAt));
    }

    public static IngredientResponse ToDto(Ingredient i) => new(
        i.Id, i.Name, i.FoodGroup, i.ServingSize, i.ServingUnit, i.PurchaseUnit,
        i.DefaultLocation, i.StoreSection, i.IsPerishable, i.IsFlexibleGroup,
        i.IsMyPlateCounted, i.ShelfLifeDays, i.TypicalPackageSize, i.PackageSizeUnit,
        i.IsStaple, i.Aliases, i.Notes);
}
