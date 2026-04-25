namespace MealPlanner.Api.DTOs;

public record RegisterRequest(
    string Email,
    string Password,
    string DisplayName,
    int Age,
    string Sex,
    ActivityLevel ActivityLevel,
    int HeightInches,
    decimal WeightPounds,
    string HouseholdName,
    int HouseholdSize,
    string Timezone = "UTC"
);

public record LoginRequest(string Email, string Password);

public record AuthResponse(
    string Token,
    int UserId,
    int HouseholdId,
    string DisplayName,
    string Email
);
