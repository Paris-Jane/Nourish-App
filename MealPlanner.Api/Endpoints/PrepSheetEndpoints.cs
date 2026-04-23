using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Extensions;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class PrepSheetEndpoints
{
    public static void MapPrepSheetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/weeks").RequireAuthorization().WithTags("PrepSheets");

        group.MapGet("/{weekId:int}/prep-sheet", GetSheets);
        group.MapPost("/{weekId:int}/prep-sheet/generate", Generate);
    }

    private static async Task<IResult> GetSheets(int weekId, AppDbContext db, ClaimsPrincipal user)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == weekId && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var sheets = await db.PrepSheets
            .Include(p => p.Steps).ThenInclude(s => s.RecipeStep)
            .Where(p => p.WeekId == weekId)
            .OrderBy(p => p.PrepDay)
            .ToListAsync();

        return Results.Ok(sheets.Select(ToDto));
    }

    private static async Task<IResult> Generate(int weekId, AppDbContext db, ClaimsPrincipal user, IPrepSheetService service)
    {
        var householdId = user.GetHouseholdId();
        var exists = await db.Weeks.AnyAsync(w => w.Id == weekId && w.HouseholdId == householdId);
        if (!exists) return Results.NotFound();

        var sheets = await service.GenerateAsync(weekId);

        // Reload with steps
        var loaded = await db.PrepSheets
            .Include(p => p.Steps).ThenInclude(s => s.RecipeStep)
            .Where(p => p.WeekId == weekId)
            .ToListAsync();

        return Results.Created($"/api/weeks/{weekId}/prep-sheet", loaded.Select(ToDto));
    }

    private static PrepSheetResponse ToDto(PrepSheet p) => new(
        p.Id, p.WeekId, p.PrepDay, p.SheetType, p.GeneratedAt, p.TotalTimeMinutes,
        p.Steps.OrderBy(s => s.DisplayOrder).Select(s => new PrepSheetStepResponse(
            s.Id, s.RecipeStepId, s.RecipeStep?.Instruction ?? string.Empty,
            s.DisplayOrder, s.ParallelGroup, s.StartOffsetMinutes,
            s.RecipeNameContext, s.RecipeStep?.DurationMinutes ?? 0,
            s.RecipeStep?.IsPassive ?? false)).ToList());
}
