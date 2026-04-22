namespace MealPlanner.Api.Models;

public class GroceryList
{
    public int Id { get; set; }
    public int WeekId { get; set; }
    public int HouseholdId { get; set; }
    public DateTime GeneratedAt { get; set; }
    public GroceryListStatus Status { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Week Week { get; set; } = null!;
    public Household Household { get; set; } = null!;
    public ICollection<GroceryListItem> Items { get; set; } = new List<GroceryListItem>();
}
