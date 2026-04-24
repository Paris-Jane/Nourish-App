import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format, parseISO } from "date-fns";
import { ArrowLeft, Clock3, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { generatePrepSheets, getPrepSheets } from "api/prepSheets";
import { useCurrentWeek, useRecipes, useWeekSlots } from "hooks/useAppData";
import { usePreviewQuery } from "hooks/usePreviewQuery";
import { useToast } from "hooks/useToast";
import type { PrepSheet } from "types/models";

function buildPreviewPrepSheets(weekStartDate: string, slots: ReturnType<typeof useWeekSlots>["slots"], recipes: ReturnType<typeof useRecipes>["recipes"]): PrepSheet[] {
  const plannedRecipes = slots
    .filter((slot) => slot.recipeId && !slot.isSkipped)
    .map((slot) => recipes.find((recipe) => recipe.id === slot.recipeId))
    .filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));

  const prepAheadSteps = plannedRecipes.flatMap((recipe) =>
    recipe.steps
      .filter((step) => step.timingTag === "PrepAhead")
      .map((step, index) => ({
        id: recipe.id * 10_000 + step.id,
        recipeStepId: step.id,
        instruction: step.instruction,
        displayOrder: index + 1,
        parallelGroup: index + 1,
        startOffsetMinutes: index * 10,
        recipeNameContext: recipe.name,
        durationMinutes: step.durationMinutes,
        isPassive: step.isPassive,
      })),
  );

  const nightOfSteps = slots
    .filter((slot) => slot.mealType === "Dinner" && slot.recipeId && !slot.isSkipped)
    .flatMap((slot) => {
      const recipe = recipes.find((entry) => entry.id === slot.recipeId);
      if (!recipe) return [];
      return recipe.steps
        .filter((step) => step.timingTag !== "PrepAhead")
        .map((step, index) => ({
          id: slot.id * 10_000 + step.id,
          recipeStepId: step.id,
          instruction: step.instruction,
          displayOrder: index + 1,
          parallelGroup: index + 1,
          startOffsetMinutes: index * 12,
          recipeNameContext: recipe.name,
          durationMinutes: step.durationMinutes,
          isPassive: step.isPassive,
        }));
    });

  const sheets: PrepSheet[] = [];

  if (prepAheadSteps.length > 0) {
    sheets.push({
      id: 1,
      weekId: 1,
      prepDay: format(addDays(parseISO(weekStartDate), -1), "yyyy-MM-dd"),
      sheetType: "BatchPrepDay",
      generatedAt: new Date().toISOString(),
      totalTimeMinutes: prepAheadSteps.reduce((total, step) => total + step.durationMinutes, 0),
      steps: prepAheadSteps,
    });
  }

  if (nightOfSteps.length > 0) {
    sheets.push({
      id: 2,
      weekId: 1,
      prepDay: weekStartDate,
      sheetType: "NightOf",
      generatedAt: new Date().toISOString(),
      totalTimeMinutes: nightOfSteps.reduce((total, step) => total + step.durationMinutes, 0),
      steps: nightOfSteps,
    });
  }

  return sheets;
}

export function PrepSheetPage() {
  const queryClient = useQueryClient();
  const { week } = useCurrentWeek();
  const { slots } = useWeekSlots();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();

  const previewSheets = useMemo(() => buildPreviewPrepSheets(week.weekStartDate, slots, recipes), [recipes, slots, week.weekStartDate]);

  const prepSheetQuery = usePreviewQuery({
    queryKey: ["prep-sheet", week.id],
    queryFn: () => getPrepSheets(week.id),
    fallbackData: previewSheets,
  });

  const generateMutation = useMutation({
    mutationFn: () => generatePrepSheets(week.id),
    onSuccess: (sheets) => {
      queryClient.setQueryData(["prep-sheet", week.id], sheets);
      pushToast("Prep plan refreshed.");
    },
    onError: () => {
      queryClient.setQueryData(["prep-sheet", week.id], previewSheets);
      pushToast("Prep plan refreshed in preview mode.");
    },
  });

  const sheets = prepSheetQuery.data ?? previewSheets;

  const prepAheadIngredients = useMemo(() => {
    const recipeIdsWithPrep = new Set(
      recipes
        .filter((recipe) => recipe.steps.some((step) => step.timingTag === "PrepAhead"))
        .map((recipe) => recipe.id),
    );

    return slots
      .filter((slot) => slot.recipeId && recipeIdsWithPrep.has(slot.recipeId) && !slot.isSkipped)
      .flatMap((slot) => recipes.find((recipe) => recipe.id === slot.recipeId)?.ingredients.filter((ingredient) => !ingredient.isModifier && !ingredient.isOptional) ?? [])
      .reduce<Record<string, number>>((acc, ingredient) => {
        acc[ingredient.ingredientName] = (acc[ingredient.ingredientName] ?? 0) + ingredient.quantity;
        return acc;
      }, {});
  }, [recipes, slots]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-ink shadow-sm transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
        >
          <ArrowLeft size={18} aria-hidden />
          Back to home
        </Link>
        <button type="button" className="button-secondary inline-flex items-center gap-2" onClick={() => generateMutation.mutate()}>
          <RefreshCcw size={16} />
          Refresh prep plan
        </button>
      </div>

      <div className="card p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Weekly meal prep</h1>
        <p className="mt-2 text-sm text-nourish-muted">
          Everything worth doing ahead for the full week, organized so you can batch prep calmly and still know what needs to happen later.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-nourish-bg px-3 py-1 text-xs font-medium text-nourish-muted">
            Week of {format(parseISO(week.weekStartDate), "MMM d")}
          </span>
          <span className="rounded-full bg-nourish-sage/10 px-3 py-1 text-xs font-medium text-nourish-sage">
            {slots.filter((slot) => slot.recipeId && !slot.isSkipped).length} planned meals
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-nourish-ink">Prep-ahead ingredients</h2>
          <p className="mt-2 text-sm text-nourish-muted">These are the items most likely to save you time later in the week.</p>
          {Object.keys(prepAheadIngredients).length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(prepAheadIngredients).map(([name, quantity]) => (
                <span key={name} className="rounded-full border border-nourish-border bg-white px-3 py-2 text-sm text-nourish-ink">
                  {name} · {quantity}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-nourish-muted">No prep-ahead ingredients yet. Once recipes with prep steps are in your week, they’ll show up here.</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-nourish-ink">How to use this page</h2>
          <ul className="mt-4 space-y-3 text-sm text-nourish-ink">
            <li>Use <strong>Batch prep day</strong> for chopping, washing, cooking grains, and other make-ahead work.</li>
            <li>Use <strong>Finish later</strong> steps as your night-of reminders when it’s time to assemble and cook.</li>
            <li>Refresh the prep plan after you make bigger changes to the week.</li>
          </ul>
        </div>
      </div>

      {sheets.length === 0 ? (
        <div className="card p-8 text-center">
          <h2 className="text-2xl text-nourish-ink">No prep steps yet</h2>
          <p className="mt-2 text-sm text-nourish-muted">Plan a few meals with prep-ahead or day-of steps, then refresh this page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">
                    {sheet.sheetType === "BatchPrepDay" ? "Batch prep day" : "Finish later"}
                  </p>
                  <h2 className="mt-1 text-2xl text-nourish-ink">{format(parseISO(sheet.prepDay), "EEEE, MMM d")}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-nourish-bg px-3 py-2 text-sm text-nourish-muted">
                  <Clock3 size={16} />
                  {sheet.totalTimeMinutes} min total
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {sheet.steps.map((step) => (
                  <div key={step.id} className="rounded-2xl border border-nourish-border bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-nourish-sage/10 px-2.5 py-1 text-[11px] font-medium text-nourish-sage">
                        {step.recipeNameContext}
                      </span>
                      <span className="rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                        Starts at +{step.startOffsetMinutes} min
                      </span>
                      {step.isPassive ? (
                        <span className="rounded-full bg-nourish-terracotta/10 px-2.5 py-1 text-[11px] font-medium text-nourish-terracotta">
                          Passive
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-nourish-ink">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
