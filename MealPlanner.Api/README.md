# MealPlanner.Api

.NET 8 minimal API backend for the Nourish meal planning app.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- PostgreSQL 14+

## Setup

### 1. Configure the connection string

Edit `appsettings.json` (or use user secrets / environment variables):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mealplanner;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Secret": "your-super-secret-jwt-key-at-least-32-characters-long!!",
    "Issuer": "MealPlanner.Api",
    "Audience": "MealPlanner.App",
    "ExpiryHours": 24
  }
}
```

For development, you can use .NET user secrets to keep credentials out of source control:

```bash
cd MealPlanner.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=mealplanner;Username=postgres;Password=your_password"
dotnet user-secrets set "Jwt:Secret" "your-super-secret-jwt-key-at-least-32-characters-long!!"
```

### 2. Install dependencies

```bash
dotnet restore
```

### 3. Apply migrations

The app runs `dotnet ef database update` automatically on startup via `MigrateAsync()`.

To create the initial migration manually (required before first run):

```bash
dotnet ef migrations add InitialCreate --output-dir Data/Migrations
```

Or run EF CLI migrations at any time:

```bash
dotnet ef database update
```

### 4. Run

```bash
dotnet run
```

The API starts on `https://localhost:5001` / `http://localhost:5000` by default.

Swagger UI is available at: `http://localhost:5000/swagger`

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require a JWT bearer token.

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Jane Smith",
  "age": 35,
  "sex": "Female",
  "activityLevel": "Moderate",
  "householdName": "Smith Family",
  "householdSize": 4,
  "timezone": "America/New_York"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Both return a token. Include it in subsequent requests:

```http
Authorization: Bearer <token>
```

## Seed data

On first startup, the database is seeded with:
- 1 household (`Smith Family`, 4 members)
- 1 owner user (`owner@example.com` / `password123`)
- 5 ingredients (Chicken Breast, Brown Rice, Broccoli, Eggs, Black Beans)
- 3 recipes with steps and ingredients (Chicken and Rice, Scrambled Eggs, Black Bean Tacos)

## Project structure

```
MealPlanner.Api/
├── Models/          EF Core entities and enums
├── DTOs/            Request and response records
├── Data/            AppDbContext, DbSeeder
├── Services/        Business logic
│   ├── JwtService
│   ├── MyPlateService         USDA MyPlate targets
│   ├── NutritionGapService    Daily gap analysis
│   ├── PlanGeneratorService   Automated plan generation
│   ├── GroceryListService     Grocery list generation
│   ├── FridgeService          Fridge inventory management
│   ├── IngredientLookupService
│   └── PrepSheetService       Prep sheet generation
├── Endpoints/       Minimal API endpoint groups
└── Extensions/      ClaimsPrincipal helpers
```

## Key design decisions

- **Minimal API** — all endpoints use `IEndpointRouteBuilder` extension methods organized by domain
- **JSON columns** — `List<string>`, `List<int>`, `Dictionary<string, decimal>`, and JSON objects are stored as `jsonb` in PostgreSQL using EF Core value converters
- **Enum storage** — all enums stored as strings for readability and migration safety
- **Household isolation** — all data-access queries filter by `HouseholdId` extracted from JWT claims
- **Fridge depletion** — when a meal slot is assumed completed, `FridgeService` depletes matching fridge items FIFO by expiry date and logs each depletion; skipping a slot reverses those logs
- **Plan generation** — uses a scoring heuristic: expiring fridge items (+5), ingredient overlap (+2), not recently used (+3), favorite (+4), fills nutrition gap (+3), plus a small random jitter to prevent repeated identical weeks
- **Prep sheets** — active steps run sequentially with cumulative offset; passive steps (baking, marinating) share a parallel group and don't advance the active timeline

## NuGet packages

| Package | Purpose |
|---|---|
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL EF Core provider |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | JWT bearer authentication |
| `System.IdentityModel.Tokens.Jwt` | JWT generation |
| `BCrypt.Net-Next` | Password hashing |
| `Swashbuckle.AspNetCore` | Swagger / OpenAPI |
| `Microsoft.EntityFrameworkCore.Design` | EF CLI tooling |
