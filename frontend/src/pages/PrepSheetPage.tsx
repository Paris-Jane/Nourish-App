import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Clock3, Package2, RefreshCcw, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { generatePrepSheets, getPrepSheets } from "api/prepSheets";
import { useCurrentWeek, useIngredients, useRecipes, useWeekSlots } from "hooks/useAppData";
import { usePreviewQuery } from "hooks/usePreviewQuery";
import { useToast } from "hooks/useToast";
import { cn } from "lib/utils";
import type { Ingredient, PrepSheet, PrepSheetStep, Recipe, StoreSection, WeekMealSlot } from "types/models";

type PrepCategory =
  | "Wash & chop produce"
  | "Mix sauces & prep bases"
  | "Cook grains & starches"
  | "Cook proteins"
  | "Roast & bake"
  | "Assemble & portion";

type WeeklyRecipePlan = {
  recipe: Recipe;
  slots: WeekMealSlot[];
};

type SundayTask = {
  id: string;
  category: PrepCategory;
  recipeName: string;
  instruction: string;
  durationMinutes: number;
  isPassive: boolean;
};

function buildPreviewPrepSheets(
  weekId: number,
  weekStartDate: string,
  slots: WeekMealSlot[],
  recipes: Recipe[],
): PrepSheet[] {
  const plannedRecipes = slots
    .filter((slot) => slot.recipeId && !slot.isSkipped)
    .map((slot) => recipes.find((recipe) => recipe.id === slot.recipeId))
    .filter((recipe): recipe is Recipe => Boolean(recipe));

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

  return prepAheadSteps.length > 0
    ? [
        {
          id: 1,
          weekId,
          prepDay: weekStartDate,
          sheetType: "BatchPrepDay",
          generatedAt: new Date().toISOString(),
          totalTimeMinutes: prepAheadSteps.reduce((total, step) => total + step.durationMinutes, 0),
          steps: prepAheadSteps,
        },
      ]
    : [];
}

function categorizeStep(instruction: string): PrepCategory {
  const text = instruction.toLowerCase();
  if (/(wash|chop|slice|dice|mince|peel|trim|halve|shred)/.test(text)) return "Wash & chop produce";
  if (/(whisk|mix|stir together|combine|marinate|dress|sauce|tzatziki|dressing|glaze)/.test(text)) return "Mix sauces & prep bases";
  if (/(rice|quinoa|oat|pasta|potato|sweet potato|grain|tortilla)/.test(text)) return "Cook grains & starches";
  if (/(chicken|beef|turkey|sausage|bacon|egg|gyro|protein|brown the|cook the meat|sear)/.test(text)) return "Cook proteins";
  if (/(roast|bake|oven|sheet pan)/.test(text)) return "Roast & bake";
  return "Assemble & portion";
}

function categoryDescription(category: PrepCategory) {
  switch (category) {
    case "Wash & chop produce":
      return "Start by getting knife work and produce prep out of the way.";
    case "Mix sauces & prep bases":
      return "Whisk together sauces, dressings, and flavor bases while the kitchen is still clean.";
    case "Cook grains & starches":
      return "Batch-cook the carb base for bowls, wraps, and quick assemblies.";
    case "Cook proteins":
      return "Handle the most filling parts of the week while you already have pans going.";
    case "Roast & bake":
      return "Use the oven in larger batches so several meals benefit from the same heat.";
    case "Assemble & portion":
      return "Finish by packing components into week-ready containers.";
  }
}

function countUniqueRecipes(slots: WeekMealSlot[]) {
  return new Set(slots.filter((slot) => slot.recipeId && !slot.isSkipped).map((slot) => slot.recipeId)).size;
}

function buildWeeklyRecipePlans(slots: WeekMealSlot[], recipes: Recipe[]) {
  const byRecipeId = new Map<number, WeekMealSlot[]>();
  slots
    .filter((slot) => slot.recipeId && !slot.isSkipped)
    .forEach((slot) => {
      const recipeId = slot.recipeId!;
      byRecipeId.set(recipeId, [...(byRecipeId.get(recipeId) ?? []), slot]);
    });

  return Array.from(byRecipeId.entries())
    .map(([recipeId, recipeSlots]) => {
      const recipe = recipes.find((entry) => entry.id === recipeId);
      return recipe ? ({ recipe, slots: recipeSlots } satisfies WeeklyRecipePlan) : null;
    })
    .filter((entry): entry is WeeklyRecipePlan => Boolean(entry))
    .sort((a, b) => a.recipe.name.localeCompare(b.recipe.name));
}

function buildSundayTasks(recipePlans: WeeklyRecipePlan[], sheets: PrepSheet[]): SundayTask[] {
  const generatedTasks = sheets
    .flatMap((sheet) => sheet.steps)
    .map((step) => ({
      id: `sheet-${step.id}`,
      category: categorizeStep(step.instruction),
      recipeName: step.recipeNameContext,
      instruction: step.instruction,
      durationMinutes: step.durationMinutes,
      isPassive: step.isPassive,
    }));

  if (generatedTasks.length > 0) {
    return generatedTasks.sort((a, b) => a.category.localeCompare(b.category) || a.recipeName.localeCompare(b.recipeName));
  }

  return recipePlans.flatMap(({ recipe, slots }) => [
    {
      id: `fallback-prep-${recipe.id}`,
      category: "Wash & chop produce" as const,
      recipeName: recipe.name,
      instruction: `Prep the fresh ingredients for ${recipe.name} so ${slots.map((slot) => slot.dayOfWeek).join(", ")} is easier to assemble.`,
      durationMinutes: 10,
      isPassive: false,
    },
    {
      id: `fallback-portion-${recipe.id}`,
      category: "Assemble & portion" as const,
      recipeName: recipe.name,
      instruction: `Portion out the components for ${recipe.name} into containers for the week.`,
      durationMinutes: 10,
      isPassive: false,
    },
  ]);
}

function buildIngredientGroups(recipePlans: WeeklyRecipePlan[], ingredients: Ingredient[]) {
  const ingredientLookup = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const groups = new Map<StoreSection | string, Array<{ name: string; quantity: number; unit: string }>>();

  recipePlans.forEach(({ recipe, slots }) => {
    recipe.ingredients
      .filter((ingredient) => !ingredient.isModifier && !ingredient.isOptional)
      .forEach((ingredient) => {
        const details = ingredientLookup.get(ingredient.ingredientId);
        const section = details?.storeSection ?? "Other";
        const entry = groups.get(section) ?? [];
        const existing = entry.find((item) => item.name === ingredient.ingredientName && item.unit === ingredient.unit);
        const totalQuantity = ingredient.quantity * slots.length;
        if (existing) {
          existing.quantity += totalQuantity;
        } else {
          entry.push({ name: ingredient.ingredientName, quantity: totalQuantity, unit: ingredient.unit });
        }
        groups.set(section, entry);
      });
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([section, items]) => ({
      section,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function buildFinishLaterPlans(recipePlans: WeeklyRecipePlan[]) {
  return recipePlans.flatMap(({ recipe, slots }) =>
    slots
      .map((slot) => ({
        slot,
        recipe,
        steps: recipe.steps.filter((step) => step.timingTag !== "PrepAhead"),
      }))
      .filter((entry) => entry.steps.length > 0),
  );
}

export function PrepSheetPage() {
  const queryClient = useQueryClient();
  const { week } = useCurrentWeek();
  const { slots } = useWeekSlots();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { pushToast } = useToast();

  const previewSheets = useMemo(() => buildPreviewPrepSheets(week.id, week.weekStartDate, slots, recipes), [recipes, slots, week.id, week.weekStartDate]);

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
  const recipePlans = useMemo(() => buildWeeklyRecipePlans(slots, recipes), [recipes, slots]);
  const sundayTasks = useMemo(() => buildSundayTasks(recipePlans, sheets), [recipePlans, sheets]);
  const tasksByCategory = useMemo(() => {
    const order: PrepCategory[] = [
      "Wash & chop produce",
      "Mix sauces & prep bases",
      "Cook grains & starches",
      "Cook proteins",
      "Roast & bake",
      "Assemble & portion",
    ];
    return order
      .map((category) => ({
        category,
        tasks: sundayTasks.filter((task) => task.category === category),
      }))
      .filter((entry) => entry.tasks.length > 0);
  }, [sundayTasks]);
  const ingredientGroups = useMemo(() => buildIngredientGroups(recipePlans, ingredients), [ingredients, recipePlans]);
  const finishLaterPlans = useMemo(() => buildFinishLaterPlans(recipePlans), [recipePlans]);

  const plannedMeals = slots.filter((slot) => slot.recipeId && !slot.isSkipped).length;
  const recipeCount = countUniqueRecipes(slots);
  const sundayMinutes = sundayTasks.reduce((total, task) => total + task.durationMinutes, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-24">
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Sunday meal prep</h1>
            <p className="mt-2 text-sm text-nourish-muted">
              One combined prep view for the full week. Use this page like a calm Sunday game plan: prep the shared work first, portion what you can, then leave yourself clean finish-later steps for each meal.
            </p>
          </div>
          <span className="rounded-full bg-nourish-bg px-4 py-2 text-sm font-medium text-nourish-muted">
            Week of {format(parseISO(week.weekStartDate), "MMM d")}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-nourish-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Meals to prep</p>
            <p className="mt-2 text-3xl font-semibold text-nourish-ink">{plannedMeals}</p>
          </div>
          <div className="rounded-2xl border border-nourish-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Recipes this week</p>
            <p className="mt-2 text-3xl font-semibold text-nourish-ink">{recipeCount}</p>
          </div>
          <div className="rounded-2xl border border-nourish-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Sunday prep time</p>
            <p className="mt-2 text-3xl font-semibold text-nourish-ink">{sundayMinutes} min</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Package2 className="text-nourish-sage" size={18} />
              <div>
                <h2 className="text-2xl font-semibold text-nourish-ink">Sunday prep order</h2>
                <p className="mt-1 text-sm text-nourish-muted">Organized by the kind of kitchen work you’ll want to batch together.</p>
              </div>
            </div>

            {tasksByCategory.length === 0 ? (
              <p className="text-sm text-nourish-muted">No prep tasks yet. Plan a few recipes first, then refresh this page.</p>
            ) : (
              <div className="space-y-5">
                {tasksByCategory.map(({ category, tasks }) => (
                  <section key={category} className="rounded-2xl border border-nourish-border bg-[#fcfaf7] p-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-nourish-ink">{category}</h3>
                      <p className="mt-1 text-sm text-nourish-muted">{categoryDescription(category)}</p>
                    </div>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div key={task.id} className="rounded-2xl border border-nourish-border bg-white p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              to={`/recipes/${recipePlans.find((entry) => entry.recipe.name === task.recipeName)?.recipe.id ?? ""}`}
                              className="rounded-full bg-nourish-sage/10 px-2.5 py-1 text-[11px] font-medium text-nourish-sage hover:bg-nourish-sage/15"
                            >
                              {task.recipeName}
                            </Link>
                            <span className="inline-flex items-center gap-1 rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                              <Clock3 size={12} />
                              {task.durationMinutes} min
                            </span>
                            {task.isPassive ? (
                              <span className="rounded-full bg-nourish-terracotta/10 px-2.5 py-1 text-[11px] font-medium text-nourish-terracotta">
                                Passive
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-nourish-ink">{task.instruction}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <UtensilsCrossed className="text-nourish-sage" size={18} />
              <div>
                <h2 className="text-2xl font-semibold text-nourish-ink">Finish later in the week</h2>
                <p className="mt-1 text-sm text-nourish-muted">These are the steps still worth doing closer to meal time, after your Sunday prep session is done.</p>
              </div>
            </div>

            {finishLaterPlans.length === 0 ? (
              <p className="text-sm text-nourish-muted">No finish-later steps are attached to this week yet.</p>
            ) : (
              <div className="space-y-4">
                {finishLaterPlans.map(({ slot, recipe, steps }) => (
                  <div key={slot.id} className="rounded-2xl border border-nourish-border bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/recipes/${recipe.id}`}
                        className="text-base font-semibold text-nourish-ink underline-offset-4 hover:underline"
                      >
                        {recipe.name}
                      </Link>
                      <span className="rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                        {slot.dayOfWeek} · {slot.mealType}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-nourish-ink">
                      {steps.map((step) => (
                        <li key={`${slot.id}-${step.id}`} className="rounded-xl bg-[#fcfaf7] px-3 py-2 leading-6">
                          {step.instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-nourish-ink">Recipes in this prep session</h2>
            <p className="mt-2 text-sm text-nourish-muted">Each recipe shows when you’ll use it and whether it already has true prep-ahead steps.</p>
            <div className="mt-4 space-y-3">
              {recipePlans.map(({ recipe, slots: recipeSlots }) => {
                const prepAheadCount = recipe.steps.filter((step) => step.timingTag === "PrepAhead").length;
                return (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="block rounded-2xl border border-nourish-border bg-white p-4 transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-nourish-ink">{recipe.name}</h3>
                        <p className="mt-1 text-sm text-nourish-muted">
                          {recipeSlots.map((slot) => `${slot.dayOfWeek} ${slot.mealType.toLowerCase()}`).join(" · ")}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          prepAheadCount > 0 ? "bg-nourish-sage/10 text-nourish-sage" : "bg-nourish-bg text-nourish-muted",
                        )}
                      >
                        {prepAheadCount > 0 ? `${prepAheadCount} prep step${prepAheadCount === 1 ? "" : "s"}` : "No prep-ahead steps"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-nourish-ink">Ingredients to batch-prep</h2>
            <p className="mt-2 text-sm text-nourish-muted">Rolled up across the whole week so you can tackle produce, proteins, and pantry items in larger batches.</p>
            {ingredientGroups.length === 0 ? (
              <p className="mt-4 text-sm text-nourish-muted">No planned meal ingredients yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {ingredientGroups.map(({ section, items }) => (
                  <div key={section} className="rounded-2xl border border-nourish-border bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">{section}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span key={`${section}-${item.name}-${item.unit}`} className="rounded-full border border-nourish-border bg-[#fcfaf7] px-3 py-2 text-sm text-nourish-ink">
                          {item.name} · {item.quantity} {item.unit}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
