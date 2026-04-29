namespace MealPlanner.Api.Services;

public interface IMyPlateService
{
    MyPlateTargets Calculate(int age, string sex, ActivityLevel activityLevel, int? heightInches = null, decimal? weightPounds = null);
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

    private static readonly (int Calories, decimal Grains, decimal Protein, decimal Vegetables, decimal Fruit, decimal Dairy)[] AdultCalorieBands =
    [
        (1600, 5m, 5m, 2m,   1.5m, 3m),
        (1800, 6m, 5m, 2.5m, 1.5m, 3m),
        (2000, 6m, 5.5m, 2.5m, 2m, 3m),
        (2200, 7m, 6m, 3m,   2m, 3m),
        (2400, 8m, 6.5m, 3m, 2m, 3m),
        (2600, 9m, 6.5m, 3.5m, 2m, 3m),
        (2800, 10m, 7m, 3.5m, 2.5m, 3m),
        (3000, 10m, 7m, 4m,   2.5m, 3m),
        (3200, 10m, 7m, 4m,   2.5m, 3m),
    ];

    public MyPlateTargets Calculate(int age, string sex, ActivityLevel activityLevel, int? heightInches = null, decimal? weightPounds = null)
    {
        var normalizedSex = sex.Trim().ToLower() switch
        {
            "male" or "m" => "Male",
            _ => "Female"
        };

        if (age >= 18 && heightInches.GetValueOrDefault() > 0 && weightPounds.GetValueOrDefault() > 0)
        {
            var calories = EstimateAdultCalories(age, normalizedSex, activityLevel, heightInches!.Value, weightPounds!.Value);
            return TargetsForCalories(calories);
        }

        var row = BaseLookup.FirstOrDefault(r =>
            r.Sex == normalizedSex && age >= r.MinAge && age <= r.MaxAge);

        // Fall back to adult female if no match
        if (row == default)
            row = BaseLookup.First(r => r.Sex == "Female" && r.MinAge == 19);

        return new MyPlateTargets
        {
            Grains     = row.Grains,
            Protein    = row.Protein,
            Vegetables = row.Vegetables,
            Fruit      = row.Fruit,
            Dairy      = row.Dairy,
        };
    }

    private static int EstimateAdultCalories(int age, string sex, ActivityLevel activityLevel, int heightInches, decimal weightPounds)
    {
        var weightKg = (double)weightPounds * 0.45359237d;
        var heightMeters = heightInches * 0.0254d;

        // USDA MyPlate describes adult plans as EER-based. These are the IOM adult EER equations
        // used by Dietary Guidelines-style calorie estimates, then mapped to MyPlate calorie bands.
        var physicalActivityCoefficient = sex == "Male"
            ? activityLevel switch
            {
                ActivityLevel.Sedentary => 1.00d,
                ActivityLevel.Light => 1.11d,
                ActivityLevel.Moderate => 1.25d,
                ActivityLevel.Active => 1.48d,
                _ => 1.00d
            }
            : activityLevel switch
            {
                ActivityLevel.Sedentary => 1.00d,
                ActivityLevel.Light => 1.12d,
                ActivityLevel.Moderate => 1.27d,
                ActivityLevel.Active => 1.45d,
                _ => 1.00d
            };

        var estimated = sex == "Male"
            ? 662d - (9.53d * age) + physicalActivityCoefficient * ((15.91d * weightKg) + (539.6d * heightMeters))
            : 354d - (6.91d * age) + physicalActivityCoefficient * ((9.36d * weightKg) + (726d * heightMeters));

        return Math.Max(1600, Math.Min(3200, (int)Math.Round(estimated / 200d) * 200));
    }

    private static MyPlateTargets TargetsForCalories(int calories)
    {
        var band = AdultCalorieBands.OrderBy(entry => Math.Abs(entry.Calories - calories)).First();
        return new MyPlateTargets
        {
            Grains = band.Grains,
            Protein = band.Protein,
            Vegetables = band.Vegetables,
            Fruit = band.Fruit,
            Dairy = band.Dairy,
        };
    }
}
