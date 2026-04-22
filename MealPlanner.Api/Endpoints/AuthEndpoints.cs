using System.Security.Claims;
using MealPlanner.Api.Data;
using MealPlanner.Api.DTOs;
using MealPlanner.Api.Models;
using MealPlanner.Api.Services;

namespace MealPlanner.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth").WithOpenApi();

        group.MapPost("/register", Register);
        group.MapPost("/login", Login);
    }

    private static async Task<IResult> Register(
        RegisterRequest req,
        AppDbContext db,
        IJwtService jwt,
        IMyPlateService myPlate)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return Results.BadRequest("Email already in use.");

        var household = new Household
        {
            Name = req.HouseholdName,
            Size = req.HouseholdSize,
            Timezone = req.Timezone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Households.Add(household);
        await db.SaveChangesAsync();

        var targets = myPlate.Calculate(req.Age, req.Sex, req.ActivityLevel);
        var prefs = new HouseholdPreferences
        {
            HouseholdId = household.Id,
            DietaryRestrictions = new List<string>(),
            DislikedIngredients = new List<string>(),
            CuisinePreferences = new List<string>(),
            DefaultCookTime = CookTime.NoLimit,
            DefaultPrepStyle = PrepStyle.DayOf,
            MyPlateTargets = targets,
            UpdatedAt = DateTime.UtcNow
        };
        db.HouseholdPreferences.Add(prefs);

        var user = new User
        {
            HouseholdId = household.Id,
            Email = req.Email,
            DisplayName = req.DisplayName,
            Age = req.Age,
            Sex = req.Sex,
            ActivityLevel = req.ActivityLevel,
            Role = UserRole.Owner,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = jwt.GenerateToken(user.Id, household.Id, user.Email);
        return Results.Created("/api/auth/register",
            new AuthResponse(token, user.Id, household.Id, user.DisplayName, user.Email));
    }

    private static async Task<IResult> Login(
        LoginRequest req,
        AppDbContext db,
        IJwtService jwt)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Results.Unauthorized();

        var token = jwt.GenerateToken(user.Id, user.HouseholdId, user.Email);
        return Results.Ok(new AuthResponse(token, user.Id, user.HouseholdId, user.DisplayName, user.Email));
    }
}
