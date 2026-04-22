namespace MealPlanner.Api.Models;

public class FridgeDepletionLog
{
    public int Id { get; set; }
    public int FridgeItemId { get; set; }
    public int WeekMealSlotId { get; set; }
    public decimal QuantityUsed { get; set; }
    public DateTime DepletedAt { get; set; }
    public bool WasAssumed { get; set; }
    public bool OverriddenByUser { get; set; }

    public FridgeItem FridgeItem { get; set; } = null!;
    public WeekMealSlot WeekMealSlot { get; set; } = null!;
}
