using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
    public DbSet<UserIngredientPref> UserIngredientPrefs => Set<UserIngredientPref>();
    public DbSet<UserWeekPref> UserWeekPrefs => Set<UserWeekPref>();
    public DbSet<Week> Weeks => Set<Week>();
    public DbSet<WeekMealSlot> WeekMealSlots => Set<WeekMealSlot>();
    public DbSet<SnackSuggestion> SnackSuggestions => Set<SnackSuggestion>();
    public DbSet<GroceryList> GroceryLists => Set<GroceryList>();
    public DbSet<GroceryListItem> GroceryListItems => Set<GroceryListItem>();
    public DbSet<FridgeItem> FridgeItems => Set<FridgeItem>();
    public DbSet<FridgeDepletionLog> FridgeDepletionLogs => Set<FridgeDepletionLog>();
    public DbSet<PrepSheet> PrepSheets => Set<PrepSheet>();
    public DbSet<PrepSheetStep> PrepSheetSteps => Set<PrepSheetStep>();

    // ── Static helpers for value converters (expression trees cannot use `out var`) ──

    private static bool DictDecimalEquals(Dictionary<string, decimal> c1, Dictionary<string, decimal> c2)
    {
        if (c1.Count != c2.Count) return false;
        foreach (var kv in c1)
        {
            if (!c2.TryGetValue(kv.Key, out var v) || v != kv.Value)
                return false;
        }
        return true;
    }

    private static string SerializeMealTypes(List<MealType> v) =>
        JsonSerializer.Serialize(v.Select(t => t.ToString()).ToList(), JsonOptions);

    private static List<MealType> DeserializeMealTypes(string v)
    {
        if (string.IsNullOrEmpty(v)) return new List<MealType>();
        var strings = JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>();
        var result = new List<MealType>(strings.Count);
        foreach (var s in strings)
        {
            if (Enum.TryParse<MealType>(s, out var t))
                result.Add(t);
        }
        return result;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Value converters ──────────────────────────────────────────────────

        var stringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>()
        );
        var stringListComparer = new ValueComparer<List<string>>(
            (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        var intListConverter = new ValueConverter<List<int>, string>(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v)
                ? new List<int>()
                : JsonSerializer.Deserialize<List<int>>(v, JsonOptions) ?? new List<int>()
        );
        var intListComparer = new ValueComparer<List<int>>(
            (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v)),
            c => c.ToList()
        );

        var dictDecimalConverter = new ValueConverter<Dictionary<string, decimal>, string>(
            v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v)
                ? new Dictionary<string, decimal>()
                : JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, JsonOptions) ?? new Dictionary<string, decimal>()
        );
        var dictDecimalComparer = new ValueComparer<Dictionary<string, decimal>>(
            (c1, c2) => c1 != null && c2 != null && DictDecimalEquals(c1, c2),
            c => c.Aggregate(0, (a, kv) => HashCode.Combine(a, kv.Key.GetHashCode(), kv.Value.GetHashCode())),
            c => new Dictionary<string, decimal>(c)
        );

        // Static method references avoid `out var` in Expression<Func<...>>
        var mealTypeListConverter = new ValueConverter<List<MealType>, string>(
            v => SerializeMealTypes(v),
            v => DeserializeMealTypes(v)
        );
        var mealTypeListComparer = new ValueComparer<List<MealType>>(
            (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        var myPlateConverter = new ValueConverter<MyPlateTargets?, string?>(
            v => v == null ? null : JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrEmpty(v) ? null : JsonSerializer.Deserialize<MyPlateTargets>(v, JsonOptions)
        );

        // ── Household ─────────────────────────────────────────────────────────

        modelBuilder.Entity<Household>(b =>
        {
            b.HasOne(h => h.Preferences)
                .WithOne(p => p.Household)
                .HasForeignKey<HouseholdPreferences>(p => p.HouseholdId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── User ──────────────────────────────────────────────────────────────

        modelBuilder.Entity<User>(b =>
        {
            b.HasIndex(u => u.Email).IsUnique();
            b.Property(u => u.ActivityLevel).HasConversion<string>();
            b.Property(u => u.Role).HasConversion<string>();
        });

        // ── HouseholdPreferences ──────────────────────────────────────────────

        modelBuilder.Entity<HouseholdPreferences>(b =>
        {
            b.HasIndex(p => p.HouseholdId).IsUnique();
            b.Property(p => p.DietaryRestrictions).HasColumnType("jsonb").HasConversion(stringListConverter, stringListComparer);
            b.Property(p => p.DislikedIngredients).HasColumnType("jsonb").HasConversion(stringListConverter, stringListComparer);
            b.Property(p => p.CuisinePreferences).HasColumnType("jsonb").HasConversion(stringListConverter, stringListComparer);
            b.Property(p => p.MyPlateTargets).HasColumnType("jsonb").HasConversion(myPlateConverter);
            b.Property(p => p.DefaultCookTime).HasConversion<string>();
            b.Property(p => p.DefaultPrepStyle).HasConversion<string>();
        });

        // ── Ingredient ────────────────────────────────────────────────────────

        modelBuilder.Entity<Ingredient>(b =>
        {
            b.HasIndex(i => i.Name);
            b.Property(i => i.FoodGroup).HasConversion<string>();
            b.Property(i => i.DefaultLocation).HasConversion<string>();
            b.Property(i => i.StoreSection).HasConversion<string>();
            b.Property(i => i.Aliases).HasColumnType("jsonb").HasConversion(stringListConverter, stringListComparer);
        });

        // ── Recipe ────────────────────────────────────────────────────────────

        modelBuilder.Entity<Recipe>(b =>
        {
            b.HasIndex(r => r.HouseholdId);
            b.HasIndex(r => r.Cuisine);
            b.Property(r => r.MealTypeTags).HasColumnType("jsonb").HasConversion(mealTypeListConverter, mealTypeListComparer);
            b.Property(r => r.FoodGroupServings).HasColumnType("jsonb").HasConversion(dictDecimalConverter, dictDecimalComparer);
            b.Property(r => r.ScalabilityTag).HasConversion<string>();
            b.Property(r => r.TimeTag).HasConversion<string>();
            b.Property(r => r.PrepStyleTag).HasConversion<string>();
        });

        // ── RecipeIngredient ──────────────────────────────────────────────────

        modelBuilder.Entity<RecipeIngredient>(b =>
        {
            b.Property(ri => ri.SubstituteIngredientIds).HasColumnType("jsonb").HasConversion(intListConverter, intListComparer);
        });

        // ── RecipeStep ────────────────────────────────────────────────────────

        modelBuilder.Entity<RecipeStep>(b =>
        {
            b.HasIndex(s => new { s.RecipeId, s.StepNumber });
            b.Property(s => s.TimingTag).HasConversion<string>();
        });

        // ── UserRecipePref ────────────────────────────────────────────────────

        modelBuilder.Entity<UserRecipePref>(b =>
        {
            b.HasIndex(p => new { p.HouseholdId, p.RecipeId }).IsUnique();
        });

        // ── UserIngredientPref ───────────────────────────────────────────────

        modelBuilder.Entity<UserIngredientPref>(b =>
        {
            b.HasIndex(p => new { p.UserId, p.IngredientId }).IsUnique();
        });

        // ── UserWeekPref ─────────────────────────────────────────────────────

        modelBuilder.Entity<UserWeekPref>(b =>
        {
            b.HasIndex(p => new { p.UserId, p.WeekId }).IsUnique();
        });

        // ── Week ──────────────────────────────────────────────────────────────

        modelBuilder.Entity<Week>(b =>
        {
            b.Property(w => w.Status).HasConversion<string>();
            b.Property(w => w.PrepStyle).HasConversion<string>();
            b.Property(w => w.MaxCookTime).HasConversion<string>();
        });

        // ── WeekMealSlot ──────────────────────────────────────────────────────

        modelBuilder.Entity<WeekMealSlot>(b =>
        {
            b.HasIndex(s => new { s.WeekId, s.DayOfWeek, s.MealType }).IsUnique();
            b.Property(s => s.DayOfWeek).HasConversion<string>();
            b.Property(s => s.MealType).HasConversion<string>();
            b.HasOne(s => s.Recipe)
                .WithMany(r => r.MealSlots)
                .HasForeignKey(s => s.RecipeId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── SnackSuggestion ───────────────────────────────────────────────────

        modelBuilder.Entity<SnackSuggestion>(b =>
        {
            b.Property(s => s.DayOfWeek).HasConversion<string>();
        });

        // ── GroceryList ───────────────────────────────────────────────────────

        modelBuilder.Entity<GroceryList>(b =>
        {
            b.HasIndex(g => g.WeekId).IsUnique();
            b.Property(g => g.Status).HasConversion<string>();
        });

        // ── GroceryListItem ───────────────────────────────────────────────────

        modelBuilder.Entity<GroceryListItem>(b =>
        {
            b.Property(i => i.RecipeIds).HasColumnType("jsonb").HasConversion(intListConverter, intListComparer);
        });

        // ── FridgeItem ────────────────────────────────────────────────────────

        modelBuilder.Entity<FridgeItem>(b =>
        {
            b.HasIndex(f => new { f.HouseholdId, f.ExpiresAt });
            b.HasIndex(f => new { f.HouseholdId, f.Location });
            b.Property(f => f.Location).HasConversion<string>();
            b.Property(f => f.AddedVia).HasConversion<string>();
        });

        // ── FridgeDepletionLog ────────────────────────────────────────────────

        modelBuilder.Entity<FridgeDepletionLog>(b =>
        {
            b.HasOne(d => d.WeekMealSlot)
                .WithMany(s => s.DepletionLogs)
                .HasForeignKey(d => d.WeekMealSlotId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── PrepSheet ─────────────────────────────────────────────────────────

        modelBuilder.Entity<PrepSheet>(b =>
        {
            b.Property(p => p.SheetType).HasConversion<string>();
        });
    }
}
