namespace MealPlanner.Api.Models;

public class MyPlateTargets
{
    public decimal Grains { get; set; }
    public decimal Protein { get; set; }
    public decimal Vegetables { get; set; }
    public decimal Fruit { get; set; }
    public decimal Dairy { get; set; }
}

public class HouseholdPreferences
{
    public int Id { get; set; }
    public int HouseholdId { get; set; }
    public List<string> DietaryRestrictions { get; set; } = new();
    public List<string> DislikedIngredients { get; set; } = new();
    public List<string> CuisinePreferences { get; set; } = new();
    public CookTime DefaultCookTime { get; set; }
    public PrepStyle DefaultPrepStyle { get; set; }
    public MyPlateTargets? MyPlateTargets { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Household Household { get; set; } = null!;
}
