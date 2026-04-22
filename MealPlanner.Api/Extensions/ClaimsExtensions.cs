using System.Security.Claims;

namespace MealPlanner.Api.Extensions;

public static class ClaimsExtensions
{
    public static int GetUserId(this ClaimsPrincipal user) =>
        int.TryParse(user.FindFirst("userId")?.Value, out var id) ? id : 0;

    public static int GetHouseholdId(this ClaimsPrincipal user) =>
        int.TryParse(user.FindFirst("householdId")?.Value, out var id) ? id : 0;
}
