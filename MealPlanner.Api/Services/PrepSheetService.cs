namespace MealPlanner.Api.Services;

public interface IPrepSheetService
{
    Task<List<PrepSheet>> GenerateAsync(int weekId);
}

public class PrepSheetService : IPrepSheetService
{
    private readonly AppDbContext _db;

    public PrepSheetService(AppDbContext db) => _db = db;

    public async Task<List<PrepSheet>> GenerateAsync(int weekId)
    {
        var week = await _db.Weeks
            .Include(w => w.MealSlots.Where(s => !s.IsSkipped && !s.IsEatingOut && s.RecipeId != null))
                .ThenInclude(s => s.Recipe!)
                    .ThenInclude(r => r.Steps)
            .Include(w => w.PrepSheets)
                .ThenInclude(ps => ps.Steps)
            .FirstOrDefaultAsync(w => w.Id == weekId);

        if (week == null) return new List<PrepSheet>();

        // Remove existing prep sheets
        foreach (var ps in week.PrepSheets)
        {
            _db.PrepSheetSteps.RemoveRange(ps.Steps);
            _db.PrepSheets.Remove(ps);
        }
        await _db.SaveChangesAsync();

        var result = new List<PrepSheet>();

        // Collect all recipe steps from the week
        var allSteps = week.MealSlots
            .Where(s => s.Recipe != null)
            .SelectMany(s => s.Recipe!.Steps.Select(step => (step, s.Recipe!.Name)))
            .ToList();

        var prepAheadSteps = allSteps.Where(x => x.step.TimingTag == TimingTag.PrepAhead).ToList();

        // Batch prep day sheet (if there are PrepAhead steps)
        if (prepAheadSteps.Count > 0)
        {
            var batchSheet = BuildBatchPrepSheet(weekId, week.WeekStartDate, prepAheadSteps);
            _db.PrepSheets.Add(batchSheet);
            result.Add(batchSheet);
        }

        // Night-of sheet per dinner day
        var dinnerSlots = week.MealSlots
            .Where(s => s.MealType == MealType.Dinner && s.Recipe != null)
            .ToList();

        foreach (var dinnerSlot in dinnerSlots)
        {
            var dayOfSteps = dinnerSlot.Recipe!.Steps
                .Where(s => s.TimingTag is TimingTag.DayOfActive or TimingTag.DayOfPassive)
                .Select(s => (step: s, recipeName: dinnerSlot.Recipe.Name))
                .ToList();

            if (dayOfSteps.Count == 0) continue;

            var prepDay = week.WeekStartDate.AddDays((int)dinnerSlot.DayOfWeek);
            var nightOfSheet = BuildNightOfSheet(weekId, prepDay, dayOfSteps);
            _db.PrepSheets.Add(nightOfSheet);
            result.Add(nightOfSheet);
        }

        await _db.SaveChangesAsync();
        return result;
    }

    private static PrepSheet BuildBatchPrepSheet(
        int weekId,
        DateOnly weekStart,
        List<(RecipeStep step, string recipeName)> steps)
    {
        // Batch prep day is typically the day before the week starts
        var prepDay = weekStart.AddDays(-1);
        var sheetSteps = ScheduleSteps(steps);
        var totalTime = sheetSteps.Any()
            ? sheetSteps.Max(s => s.StartOffsetMinutes + s.RecipeStep.DurationMinutes)
            : 0;

        return new PrepSheet
        {
            WeekId = weekId,
            PrepDay = prepDay,
            SheetType = SheetType.BatchPrepDay,
            GeneratedAt = DateTime.UtcNow,
            TotalTimeMinutes = totalTime,
            Steps = sheetSteps
        };
    }

    private static PrepSheet BuildNightOfSheet(
        int weekId,
        DateOnly prepDay,
        List<(RecipeStep step, string recipeName)> steps)
    {
        var sheetSteps = ScheduleSteps(steps);
        var totalTime = sheetSteps.Any()
            ? sheetSteps.Max(s => s.StartOffsetMinutes + s.RecipeStep.DurationMinutes)
            : 0;

        return new PrepSheet
        {
            WeekId = weekId,
            PrepDay = prepDay,
            SheetType = SheetType.NightOf,
            GeneratedAt = DateTime.UtcNow,
            TotalTimeMinutes = totalTime,
            Steps = sheetSteps
        };
    }

    /// <summary>
    /// Schedules steps with parallel grouping:
    /// - Active steps run sequentially; each gets a new parallel group.
    /// - Passive steps start when the preceding active step starts, running in the background.
    ///   Multiple passive steps that overlap in time share a parallel group.
    /// </summary>
    private static List<PrepSheetStep> ScheduleSteps(List<(RecipeStep step, string recipeName)> items)
    {
        var result = new List<PrepSheetStep>();
        int displayOrder = 1;
        int parallelGroup = 1;
        int currentOffset = 0;
        int passiveGroupStart = -1;

        foreach (var (step, recipeName) in items.OrderBy(x => x.step.TimingTag == TimingTag.DayOfPassive ? 1 : 0)
                                                 .ThenBy(x => x.recipeName)
                                                 .ThenBy(x => x.step.StepNumber))
        {
            if (!step.IsPassive)
            {
                // Active steps advance the timeline
                result.Add(new PrepSheetStep
                {
                    RecipeStep = step,
                    DisplayOrder = displayOrder++,
                    ParallelGroup = parallelGroup++,
                    StartOffsetMinutes = currentOffset,
                    RecipeNameContext = recipeName
                });
                currentOffset += step.DurationMinutes;
                passiveGroupStart = -1;
            }
            else
            {
                // Passive steps share a group and run from the current offset
                if (passiveGroupStart != currentOffset)
                {
                    passiveGroupStart = currentOffset;
                    parallelGroup++;
                }

                result.Add(new PrepSheetStep
                {
                    RecipeStep = step,
                    DisplayOrder = displayOrder++,
                    ParallelGroup = parallelGroup,
                    StartOffsetMinutes = currentOffset,
                    RecipeNameContext = recipeName
                });
                // Passive steps don't advance the active timeline
            }
        }

        return result;
    }
}
