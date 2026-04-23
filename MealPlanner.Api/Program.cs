using System.Text;
using MealPlanner.Api.Data;
using MealPlanner.Api.Endpoints;
using MealPlanner.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────────────────────────

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Services ──────────────────────────────────────────────────────────────────

builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddScoped<IMyPlateService, MyPlateService>();
builder.Services.AddScoped<INutritionGapService, NutritionGapService>();
builder.Services.AddScoped<IPlanGeneratorService, PlanGeneratorService>();
builder.Services.AddScoped<IGroceryListService, GroceryListService>();
builder.Services.AddScoped<IFridgeService, FridgeService>();
builder.Services.AddScoped<IIngredientLookupService, IngredientLookupService>();
builder.Services.AddScoped<IPrepSheetService, PrepSheetService>();

// ── Health checks ─────────────────────────────────────────────────────────────

builder.Services.AddHealthChecks();

// ── JWT Authentication ────────────────────────────────────────────────────────

var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException(
        "Jwt:Secret is required. Set it via the Jwt__Secret environment variable in Azure App Service.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────────────────────────
// In Azure App Service set Cors__AllowedOrigins__0=https://your-app.vercel.app

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        else
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// ── Swagger / OpenAPI ─────────────────────────────────────────────────────────

var swaggerEnabled = builder.Configuration.GetValue("Swagger:Enabled", defaultValue: true);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MealPlanner API",
        Version = "v1",
        Description = "Nourish meal planning backend"
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// ── Build ─────────────────────────────────────────────────────────────────────

var app = builder.Build();

// ── Middleware ────────────────────────────────────────────────────────────────

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MealPlanner API v1"));
}

// ── Health check (Azure App Service monitors this) ────────────────────────────

app.MapHealthChecks("/health");

// ── Endpoints ─────────────────────────────────────────────────────────────────

app.MapAuthEndpoints();
app.MapHouseholdEndpoints();
app.MapIngredientEndpoints();
app.MapRecipeEndpoints();
app.MapWeekEndpoints();
app.MapGroceryEndpoints();
app.MapFridgeEndpoints();
app.MapSnackEndpoints();
app.MapPrepSheetEndpoints();

// ── Database Migration & Seed ─────────────────────────────────────────────────

using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        logger.LogInformation("Applying database migrations...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Seeding database...");
        await DbSeeder.SeedAsync(db);
        logger.LogInformation("Database ready.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database migration/seed failed. Check connection string and PostgreSQL availability.");
        throw;
    }
}

app.Run();
