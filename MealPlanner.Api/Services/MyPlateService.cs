namespace MealPlanner.Api.Services;

public interface IMyPlateService
{
    MyPlateTargets Calculate(int age, string sex, ActivityLevel activityLevel);
}

public class MyPlateService : IMyPlateService
{
    // USDA MyPlate daily serving targets. Grains in oz-eq, Protein in oz-eq,
    // Vegetables/Fruit/Dairy in cups. Based on 2020-2025 Dietary Guidelines.
    private static readonly (int MinAge, int MaxAge, string Sex, decimal Grains, decimal Protein, decimal Vegetables, decimal Fruit, decimal Dairy)[]
        BaseLookup =
        [
            (2,  3,  "Female", 3m,   2m,   1m,   1m,   2m),
            (4,  8,  "Female", 5m,   4m,   1.5m, 1.5m, 2.5m),
            (9,  13, "Female", 5m,   5m,   2m,   1.5m, 3m),
            (14, 18, "Female", 6m,   5m,   2.5m, 1.5m, 3m),
            (19, 30, "Female", 6m,   5.5m, 2.5m, 2m,   3m),
            (31, 50, "Female", 6m,   5m,   2.5m, 1.5m, 3m),
            (51, 99, "Female", 5m,   5m,   2m,   1.5m, 3m),
            (2,  3,  "Male",   3m,   2m,   1m,   1m,   2m),
            (4,  8,  "Male",   5m,   4m,   1.5m, 1.5m, 2.5m),
            (9,  13, "Male",   6m,   5m,   2.5m, 1.5m, 3m),
            (14, 18, "Male",   8m,   6.5m, 3m,   2m,   3m),
            (19, 30, "Male",   8m,   6.5m, 3m,   2m,   3m),
            (31, 50, "Male",   7m,   6m,   3m,   2m,   3m),
            (51, 99, "Male",   6m,   5.5m, 2.5m, 2m,   3m),
        ];

    private static readonly Dictionary<ActivityLevel, decimal> ActivityMultipliers = new()
    {
        [ActivityLevel.Sedentary] = 1.0m,
        [ActivityLevel.Light]     = 1.1m,
        [ActivityLevel.Moderate]  = 1.2m,
        [ActivityLevel.Active]    = 1.35m,
    };

    public MyPlateTargets Calculate(int age, string sex, ActivityLevel activityLevel)
    {
        var normalizedSex = sex.Trim().ToLower() switch
        {
            "male" or "m" => "Male",
            _ => "Female"
        };

        var row = BaseLookup.FirstOrDefault(r =>
            r.Sex == normalizedSex && age >= r.MinAge && age <= r.MaxAge);

        // Fall back to adult female if no match
        if (row == default)
            row = BaseLookup.First(r => r.Sex == "Female" && r.MinAge == 19);

        var mult = ActivityMultipliers.GetValueOrDefault(activityLevel, 1.0m);

        return new MyPlateTargets
        {
            Grains     = Math.Round(row.Grains     * mult, 1),
            Protein    = Math.Round(row.Protein    * mult, 1),
            Vegetables = Math.Round(row.Vegetables * mult, 1),
            Fruit      = Math.Round(row.Fruit      * mult, 1),
            Dairy      = Math.Round(row.Dairy      * mult, 1),
        };
    }
}
