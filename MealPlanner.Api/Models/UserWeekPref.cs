namespace MealPlanner.Api.Models;

public class UserWeekPref
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int WeekId { get; set; }
    public bool IsFavorite { get; set; }

    public User User { get; set; } = null!;
    public Week Week { get; set; } = null!;
}
