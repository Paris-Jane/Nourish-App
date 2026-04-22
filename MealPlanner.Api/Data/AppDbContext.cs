using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MealPlanner.Api.Data;

public class AppDbContext : DbContext
{
    private static readonly JsonSerializerOptions JsonOptions = new();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Household> Households => Set<Household>();
    public DbSet<User> Users => Set<User>();
    public DbSet<HouseholdPreferences> HouseholdPreferences => Set<HouseholdPreferences>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();
    public DbSet<RecipeStep> RecipeSteps => Set<RecipeStep>();
    public DbSet<UserRecipePref> UserRecipePrefs => Set<UserRecipePref>();
    public DbSet<Week> Weeks => Set<Week>();
    public DbSet<WeekMealSlot> WeekMealSlots => Set<WeekMealSlot>();
    public DbSet<SnackSuggestion> SnackSuggestions => Set<SnackSuggestion>();
    public DbSet<GroceryList> GroceryLists => Set<GroceryList>();
    public DbSet<GroceryListItem> GroceryListItems => Set<GroceryListItem>();
    public DbSet<FridgeItem> FridgeItems => Set<FridgeItem>();
    public DbSet<FridgeDepletionLog> FridgeDepletionLogs => Set<FridgeDepletionLog>();
    public DbSet<PrepSheet> PrepSheets => Set<PrepSheet>();
    public DbSet<PrepSheetStep> PrepSheetSteps => Set<PrepSheetStep>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var stringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>()
        );

        var intListConverter = new ValueConverter<List<int>, string>(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v)
                ? new List<int>()
                : JsonSerializer.Deserialize<List<int>>(v, JsonOptions) ?? new List<int>()
        );

        var dictDecimalConverter = new ValueConverter<Dictionary<string, decimal>, string>(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v)
                ? new Dictionary<string, decimal>()
                : JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, JsonOptions) ?? new Dictionary<string, decimal>()
        );

        var myPlateConverter = new ValueConverter<MyPlateTargets?, string?>(
            v => v == null ? null : JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v) ? null : JsonSerializer.Deserialize<MyPlateTargets>(v, JsonOptions)
        );

        // Household one-to-one with Preferences
        modelBuilder.Entity<Household>(b =>
        {
            b.HasOne(h => h.Preferences)
                .WithOne(p => p.Household)
                .HasForeignKey<HouseholdPreferences>(p => p.HouseholdId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // User
        modelBuilder.Entity<User>(b =>
        {
            b.HasIndex(u => u.Email).IsUnique();
            b.Property(u => u.ActivityLevel).HasConversion<string>();
            b.Property(u => u.Role).HasConversion<string>();
        });

        // HouseholdPreferences
        modelBuilder.Entity<HouseholdPreferences>(b =>
        {
            b.Property(p => p.DietaryRestrictions).HasColumnType("jsonb").HasConversion(stringListConverter);
            b.Property(p => p.DislikedIngredients).HasColumnType("jsonb").HasConversion(stringListConverter);
            b.Property(p => p.CuisinePreferences).HasColumnType("jsonb").HasConversion(stringListConverter);
            b.Property(p => p.MyPlateTargets).HasColumnType("jsonb").HasConversion(myPlateConverter);
            b.Property(p => p.DefaultCookTime).HasConversion<string>();
            b.Property(p => p.DefaultPrepStyle).HasConversion<string>();
        });

        // Ingredient
        modelBuilder.Entity<Ingredient>(b =>
        {
            b.Property(i => i.FoodGroup).HasConversion<string>();
        });

        // Recipe
        modelBuilder.Entity<Recipe>(b =>
        {
            b.Property(r => r.FoodGroupServings).HasColumnType("jsonb").HasConversion(dictDecimalConverter);
            b.Property(r => r.ScalabilityTag).HasConversion<string>();
            b.Property(r => r.TimeTag).HasConversion<string>();
            b.Property(r => r.PrepStyleTag).HasConversion<string>();
        });

        // RecipeIngredient
        modelBuilder.Entity<RecipeIngredient>(b =>
        {
            b.Property(ri => ri.SubstituteIngredientIds).HasColumnType("jsonb").HasConversion(intListConverter);
        });

        // RecipeStep
        modelBuilder.Entity<RecipeStep>(b =>
        {
            b.Property(s => s.TimingTag).HasConversion<string>();
        });

        // UserRecipePref
        modelBuilder.Entity<UserRecipePref>(b =>
        {
            b.HasIndex(p => new { p.HouseholdId, p.RecipeId }).IsUnique();
        });

        // Week
        modelBuilder.Entity<Week>(b =>
        {
            b.Property(w => w.Status).HasConversion<string>();
            b.Property(w => w.PrepStyle).HasConversion<string>();
            b.Property(w => w.MaxCookTime).HasConversion<string>();
        });

        // WeekMealSlot
        modelBuilder.Entity<WeekMealSlot>(b =>
        {
            b.Property(s => s.DayOfWeek).HasConversion<string>();
            b.Property(s => s.MealType).HasConversion<string>();
            b.HasOne(s => s.Recipe)
                .WithMany(r => r.MealSlots)
                .HasForeignKey(s => s.RecipeId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // SnackSuggestion
        modelBuilder.Entity<SnackSuggestion>(b =>
        {
            b.Property(s => s.DayOfWeek).HasConversion<string>();
        });

        // GroceryList — one per week
        modelBuilder.Entity<GroceryList>(b =>
        {
            b.HasIndex(g => g.WeekId).IsUnique();
            b.Property(g => g.Status).HasConversion<string>();
        });

        // GroceryListItem
        modelBuilder.Entity<GroceryListItem>(b =>
        {
            b.Property(i => i.RecipeIds).HasColumnType("jsonb").HasConversion(intListConverter);
        });

        // FridgeItem
        modelBuilder.Entity<FridgeItem>(b =>
        {
            b.Property(f => f.Location).HasConversion<string>();
            b.Property(f => f.AddedVia).HasConversion<string>();
        });

        // FridgeDepletionLog
        modelBuilder.Entity<FridgeDepletionLog>(b =>
        {
            b.HasOne(d => d.WeekMealSlot)
                .WithMany(s => s.DepletionLogs)
                .HasForeignKey(d => d.WeekMealSlotId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // PrepSheet
        modelBuilder.Entity<PrepSheet>(b =>
        {
            b.Property(p => p.SheetType).HasConversion<string>();
        });
    }
}
