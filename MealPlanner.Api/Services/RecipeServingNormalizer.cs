using MealPlanner.Api.DTOs;
using MealPlanner.Api.Models;

namespace MealPlanner.Api.Services;

public static class RecipeServingNormalizer
{
    public static RecipeRequest NormalizeRequestToSingleServing(RecipeRequest request)
    {
        var divisor = request.BaseYieldServings > 0 ? request.BaseYieldServings : 1;
        var normalizedIngredients = request.Ingredients
            .Select(ingredient => ingredient with
            {
                Quantity = NormalizeQuantity(ingredient.Quantity, divisor)
            })
            .ToList();

        return request with
        {
            BaseYieldServings = 1,
            Ingredients = normalizedIngredients
        };
    }

    public static bool NormalizeRecipeEntityToSingleServing(Recipe recipe)
    {
        var divisor = recipe.BaseYieldServings;
        if (divisor <= 1) return false;

        foreach (var ingredient in recipe.Ingredients)
        {
            if (WasAlreadyStoredAsSingleServingAddOn(ingredient)) continue;
            ingredient.Quantity = NormalizeQuantity(ingredient.Quantity, divisor);
        }

        recipe.BaseYieldServings = 1;
        return true;
    }

    private static decimal NormalizeQuantity(decimal quantity, int divisor)
    {
        if (divisor <= 1) return quantity;
        return Math.Round(quantity / divisor, 4, MidpointRounding.AwayFromZero);
    }

    private static bool WasAlreadyStoredAsSingleServingAddOn(RecipeIngredient ingredient)
    {
        if (!ingredient.IsModifier && !ingredient.IsOptional) return false;
        var notes = ingredient.Notes ?? string.Empty;
        return notes.Contains("Added from recipe detail add-ons", StringComparison.OrdinalIgnoreCase) ||
               notes.Contains("Added while planning this week", StringComparison.OrdinalIgnoreCase);
    }
}
