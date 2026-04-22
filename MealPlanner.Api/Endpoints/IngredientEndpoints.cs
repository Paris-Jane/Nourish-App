using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Models;

namespace MealPlanner.Api.Endpoints;

public static class IngredientEndpoints
{
    public static void MapIngredientEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/ingredients").RequireAuthorization().WithTags("Ingredients").WithOpenApi();

        group.MapGet("/", GetAll);
        group.MapGet("/{id:int}", GetById);
        group.MapPost("/", Create);
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
            IsPerishable = req.IsPerishable,
            IsFlexibleGroup = req.IsFlexibleGroup,
            ShelfLifeDays = req.ShelfLifeDays
        };
        db.Ingredients.Add(ingredient);
        await db.SaveChangesAsync();
        return Results.Created($"/api/ingredients/{ingredient.Id}", ToDto(ingredient));
    }

    private static IngredientResponse ToDto(Ingredient i) => new(
        i.Id, i.Name, i.FoodGroup, i.ServingSize, i.ServingUnit,
        i.PurchaseUnit, i.IsPerishable, i.IsFlexibleGroup, i.ShelfLifeDays);
}
