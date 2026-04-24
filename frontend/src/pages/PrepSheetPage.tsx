import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft, CheckCircle2, ChevronDown, Circle, Clock3, Package2, RefreshCcw, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { generatePrepSheets, getPrepSheets } from "api/prepSheets";
import { useCurrentWeek, useIngredients, useRecipes, useWeekSlots } from "hooks/useAppData";
import { usePreviewQuery } from "hooks/usePreviewQuery";
import { useToast } from "hooks/useToast";
import { cn } from "lib/utils";
import type { Ingredient, PrepSheet, Recipe, StoreSection, WeekMealSlot } from "types/models";

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
  batches: number;
};

function parseFraction(s: string): number {
  const parts = s.split('/');
  return parts.length === 2 ? Number(parts[0]) / Number(parts[1]) : Number(parts[0]);
}

function formatQuantity(n: number): string {
  if (n === Math.floor(n)) return String(n);
  const fracs: [number, string][] = [
    [0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾'],
  ];
  const whole = Math.floor(n);
  const rem = n - whole;
  for (const [v, f] of fracs) {
    if (Math.abs(rem - v) < 0.04) return whole > 0 ? `${whole} ${f}` : f;
  }
  return n.toFixed(1);
}

const SCALABLE_UNITS = new Set([
  'cup', 'cups', 'tablespoon', 'tablespoons', 'tbsp',
  'teaspoon', 'teaspoons', 'tsp',
  'ounce', 'ounces', 'oz',
  'pound', 'pounds', 'lb', 'lbs',
  'gram', 'grams', 'kg', 'ml',
  'liter', 'liters', 'litre', 'litres',
  'clove', 'cloves',
  'can', 'cans',
  'bunch', 'bunches',
  'head', 'heads',
  'sprig', 'sprigs',
  'stalk', 'stalks',
  'slice', 'slices',
  'fillet', 'fillets',
  'strip', 'strips',
  'egg', 'eggs',
]);

const PLURAL_MAP: Record<string, string> = {
  cup: 'cups', tablespoon: 'tablespoons', teaspoon: 'teaspoons',
  ounce: 'ounces', pound: 'pounds', gram: 'grams',
  liter: 'liters', litre: 'litres',
  clove: 'cloves', can: 'cans', bunch: 'bunches', head: 'heads',
  sprig: 'sprigs', stalk: 'stalks', slice: 'slices',
  fillet: 'fillets', strip: 'strips', egg: 'eggs',
};

function pluralUnit(unit: string, qty: number): string {
  const lower = unit.toLowerCase();
  if (qty === 1) {
    const singular = Object.entries(PLURAL_MAP).find(([, pl]) => pl === lower)?.[0];
    return singular ?? unit;
  }
  return PLURAL_MAP[lower] ?? unit;
}

function scaleInstruction(instruction: string, multiplier: number): string {
  if (multiplier <= 1) return instruction;
  return instruction.replace(/\b(\d+(?:\/\d+)?)\s+([a-zA-Z]+)/g, (match, numStr, unit) => {
    if (!SCALABLE_UNITS.has(unit.toLowerCase())) return match;
    const qty = parseFraction(numStr) * multiplier;
    return `${formatQuantity(qty)} ${pluralUnit(unit, qty)}`;
  });
}

function buildPreviewPrepSheets(
  weekId: number,
  weekStartDate: string,
  slots: WeekMealSlot[],
  recipes: Recipe[],
): PrepSheet[] {
  // Group slots by recipe so each recipe's steps are emitted once, scaled to batch count
  const byRecipeId = new Map<number, WeekMealSlot[]>();
  slots
    .filter((slot) => slot.recipeId && !slot.isSkipped)
    .forEach((slot) => {
      byRecipeId.set(slot.recipeId!, [...(byRecipeId.get(slot.recipeId!) ?? []), slot]);
    });

  const prepAheadSteps = Array.from(byRecipeId.entries()).flatMap(([recipeId, recipeSlots]) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return [];
    const batches = recipeSlots.length;
    return recipe.steps
      .filter((step) => step.timingTag === "PrepAhead")
      .map((step, index) => ({
        id: recipe.id * 10_000 + step.id,
        recipeStepId: step.id,
        instruction: scaleInstruction(step.instruction, batches),
        displayOrder: index + 1,
        parallelGroup: index + 1,
        startOffsetMinutes: index * 10,
        recipeNameContext: recipe.name,
        durationMinutes: step.durationMinutes,
        isPassive: step.isPassive,
      }));
  });

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
  const allSteps = sheets.flatMap((sheet) => sheet.steps);

  if (allSteps.length > 0) {
    // Deduplicate by recipe + step identity, counting how many times each appears
    const groups = new Map<string, { step: (typeof allSteps)[0]; count: number }>();
    for (const step of allSteps) {
      const key = `${step.recipeNameContext}::${step.recipeStepId}`;
      const existing = groups.get(key);
      if (existing) {
        existing.count++;
      } else {
        groups.set(key, { step, count: 1 });
      }
    }

    return Array.from(groups.values())
      .map(({ step, count }) => ({
        id: `sheet-${step.id}`,
        category: categorizeStep(step.instruction),
        recipeName: step.recipeNameContext,
        instruction: scaleInstruction(step.instruction, count),
        durationMinutes: step.durationMinutes,
        isPassive: step.isPassive,
        batches: count,
      }))
      .sort((a, b) => a.category.localeCompare(b.category) || a.recipeName.localeCompare(b.recipeName));
  }

  return recipePlans.flatMap(({ recipe, slots }) => [
    {
      id: `fallback-prep-${recipe.id}`,
      category: "Wash & chop produce" as const,
      recipeName: recipe.name,
      instruction: `Prep the fresh ingredients for ${recipe.name} — you'll use it ${slots.length > 1 ? `${slots.length}× this week` : "once this week"}.`,
      durationMinutes: 10,
      isPassive: false,
      batches: slots.length,
    },
    {
      id: `fallback-portion-${recipe.id}`,
      category: "Assemble & portion" as const,
      recipeName: recipe.name,
      instruction: `Portion out the components for ${recipe.name} into ${slots.length} container${slots.length !== 1 ? "s" : ""}.`,
      durationMinutes: 10,
      isPassive: false,
      batches: slots.length,
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

  // Task completion — persisted per week ID
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`prep-done-${week.id}`);
      return stored ? new Set<string>(JSON.parse(stored) as string[]) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const prevWeekIdRef = useRef(week.id);
  useEffect(() => {
    if (prevWeekIdRef.current !== week.id) {
      prevWeekIdRef.current = week.id;
      try {
        const stored = localStorage.getItem(`prep-done-${week.id}`);
        setCompletedIds(stored ? new Set<string>(JSON.parse(stored) as string[]) : new Set<string>());
      } catch {
        setCompletedIds(new Set<string>());
      }
    } else {
      localStorage.setItem(`prep-done-${week.id}`, JSON.stringify([...completedIds]));
    }
  }, [completedIds, week.id]);

  const toggleTask = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetProgress = () => setCompletedIds(new Set());

  const [finishLaterOpen, setFinishLaterOpen] = useState(false);

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
  const activeMinutes = sundayTasks.filter((t) => !t.isPassive).reduce((sum, t) => sum + t.durationMinutes, 0);
  const passiveMinutes = sundayTasks.filter((t) => t.isPassive).reduce((sum, t) => sum + t.durationMinutes, 0);

  const totalTasks = sundayTasks.length;
  const completedCount = sundayTasks.filter((t) => completedIds.has(t.id)).length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const allDone = totalTasks > 0 && completedCount === totalTasks;

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
        <button
          type="button"
          className="button-secondary inline-flex items-center gap-2 text-xs"
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
        >
          <RefreshCcw size={14} className={generateMutation.isPending ? "animate-spin" : ""} />
          Refresh prep plan
        </button>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Sunday meal prep</h1>
            <p className="mt-1 text-sm text-nourish-muted">Week of {format(parseISO(week.weekStartDate), "MMMM d, yyyy")}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-nourish-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Meals planned</p>
            <p className="mt-2 text-3xl font-semibold text-nourish-ink">{plannedMeals}</p>
            <p className="mt-1 text-xs text-nourish-muted">{recipeCount} unique recipe{recipeCount !== 1 ? "s" : ""}</p>
          </div>
          <div className="rounded-2xl border border-nourish-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Active prep time</p>
            <p className="mt-2 text-3xl font-semibold text-nourish-ink">{activeMinutes} min</p>
            <p className="mt-1 text-xs text-nourish-muted">hands-on work</p>
          </div>
          <div className="rounded-2xl border border-nourish-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Hands-off time</p>
            <p className="mt-2 text-3xl font-semibold text-nourish-ink">{passiveMinutes > 0 ? `${passiveMinutes} min` : "—"}</p>
            <p className="mt-1 text-xs text-nourish-muted">oven, simmering, resting</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          {/* Sunday prep order */}
          <div className="card p-6">
            <div className="mb-5 flex items-start gap-3">
              <Package2 className="mt-1 shrink-0 text-nourish-sage" size={18} />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-nourish-ink">Sunday prep order</h2>
                <p className="mt-1 text-sm text-nourish-muted">Tap a task to check it off. Batch work of the same kind to save time and cleanup.</p>
              </div>
            </div>

            {/* Progress */}
            {totalTasks > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("text-sm font-medium", allDone ? "text-nourish-sage" : "text-nourish-ink")}>
                    {allDone ? "All done — great session!" : `${completedCount} of ${totalTasks} tasks done`}
                  </span>
                  {completedCount > 0 && (
                    <button
                      type="button"
                      onClick={resetProgress}
                      className="text-xs text-nourish-muted underline-offset-2 hover:text-nourish-ink hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-nourish-border">
                  <div
                    className="h-full rounded-full bg-nourish-sage transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {tasksByCategory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-nourish-border p-8 text-center">
                <p className="text-sm font-medium text-nourish-ink">No prep tasks yet</p>
                <p className="mt-1 text-sm text-nourish-muted">Plan a few recipes this week, then hit "Refresh prep plan" above.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {tasksByCategory.map(({ category, tasks }) => {
                  const doneTasks = tasks.filter((t) => completedIds.has(t.id)).length;
                  return (
                    <section key={category} className="rounded-2xl border border-nourish-border bg-[#fcfaf7] p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-nourish-ink">{category}</h3>
                        <span className="text-xs text-nourish-muted">{doneTasks}/{tasks.length}</span>
                      </div>
                      <div className="space-y-2">
                        {tasks.map((task) => {
                          const done = completedIds.has(task.id);
                          return (
                            <div
                              key={task.id}
                              className={cn(
                                "rounded-2xl border transition-all",
                                done
                                  ? "border-nourish-border/40 bg-nourish-bg/50 opacity-55"
                                  : task.isPassive
                                  ? "border-amber-200/60 bg-amber-50/50"
                                  : "border-nourish-border bg-white",
                              )}
                            >
                              <div className="flex items-start gap-0">
                                {/* Checkbox button — full-height, min 44px wide tap target */}
                                <button
                                  type="button"
                                  onClick={() => toggleTask(task.id)}
                                  className="flex min-h-[52px] min-w-[52px] shrink-0 items-center justify-center rounded-l-2xl transition hover:bg-nourish-sage/5 active:bg-nourish-sage/10"
                                  aria-label={done ? `Mark "${task.instruction.slice(0, 40)}…" as not done` : `Mark "${task.instruction.slice(0, 40)}…" as done`}
                                >
                                  {done ? (
                                    <CheckCircle2 size={20} className="text-nourish-sage" />
                                  ) : (
                                    <Circle size={20} className="text-nourish-border" />
                                  )}
                                </button>

                                {/* Content */}
                                <div className="min-w-0 flex-1 py-3 pr-4">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <Link
                                      to={`/recipes/${recipePlans.find((entry) => entry.recipe.name === task.recipeName)?.recipe.id ?? ""}`}
                                      className="rounded-full bg-nourish-sage/10 px-2.5 py-1 text-[11px] font-medium text-nourish-sage hover:bg-nourish-sage/20"
                                    >
                                      {task.recipeName}
                                    </Link>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                                      <Clock3 size={11} />
                                      {task.durationMinutes} min
                                    </span>
                                    {task.batches > 1 && (
                                      <span className="rounded-full bg-nourish-ink/5 px-2.5 py-1 text-[11px] font-medium text-nourish-ink">
                                        ×{task.batches} batches
                                      </span>
                                    )}
                                    {task.isPassive && (
                                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                                        Hands-off
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className={cn(
                                      "mt-2 text-sm leading-relaxed text-nourish-ink",
                                      done && "line-through decoration-nourish-muted/50",
                                    )}
                                  >
                                    {task.instruction}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          {/* Finish later — collapsible, closed by default */}
          <div className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setFinishLaterOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-3 p-5 text-left transition hover:bg-nourish-bg/60"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="shrink-0 text-nourish-sage" size={17} />
                <div>
                  <h2 className="text-lg font-semibold text-nourish-ink">Finish later in the week</h2>
                  <p className="mt-0.5 text-sm text-nourish-muted">
                    {finishLaterPlans.length > 0
                      ? `${finishLaterPlans.length} meal${finishLaterPlans.length !== 1 ? "s" : ""} with steps to do closer to meal time`
                      : "No finish-later steps this week"}
                  </p>
                </div>
              </div>
              <ChevronDown
                size={17}
                className={cn("shrink-0 text-nourish-muted transition-transform duration-200", finishLaterOpen && "rotate-180")}
              />
            </button>

            {finishLaterOpen && finishLaterPlans.length > 0 && (
              <div className="space-y-3 border-t border-nourish-border px-5 pb-5 pt-4">
                {finishLaterPlans.map(({ slot, recipe, steps }) => (
                  <div key={slot.id} className="rounded-2xl border border-nourish-border bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/recipes/${recipe.id}`}
                        className="text-sm font-semibold text-nourish-ink underline-offset-4 hover:underline"
                      >
                        {recipe.name}
                      </Link>
                      <span className="rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                        {slot.dayOfWeek} · {slot.mealType}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-nourish-ink">
                      {steps.map((step) => (
                        <li key={`${slot.id}-${step.id}`} className="rounded-xl bg-[#fcfaf7] px-3 py-2 leading-relaxed">
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

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-nourish-ink">This week's recipes</h2>
            <p className="mt-1 text-sm text-nourish-muted">Tap to view full recipe.</p>
            <div className="mt-4 space-y-2">
              {recipePlans.length === 0 ? (
                <p className="text-sm text-nourish-muted">No recipes planned yet.</p>
              ) : (
                recipePlans.map(({ recipe, slots: recipeSlots }) => {
                  const prepAheadCount = recipe.steps.filter((step) => step.timingTag === "PrepAhead").length;
                  return (
                    <Link
                      key={recipe.id}
                      to={`/recipes/${recipe.id}`}
                      className="flex items-start justify-between gap-3 rounded-xl border border-nourish-border bg-white p-3 transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-nourish-ink">{recipe.name}</p>
                        <p className="mt-0.5 text-xs text-nourish-muted">
                          {recipeSlots.map((slot) => `${slot.dayOfWeek} ${slot.mealType.toLowerCase()}`).join(" · ")}
                        </p>
                      </div>
                      {prepAheadCount > 0 && (
                        <span className="shrink-0 rounded-full bg-nourish-sage/10 px-2 py-0.5 text-[10px] font-medium text-nourish-sage">
                          {prepAheadCount} prep
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-nourish-ink">Ingredient quantities</h2>
            <p className="mt-1 text-sm text-nourish-muted">Total amounts across all recipes — prep the full quantity at once.</p>
            {ingredientGroups.length === 0 ? (
              <p className="mt-4 text-sm text-nourish-muted">No planned meal ingredients yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {ingredientGroups.map(({ section, items }) => (
                  <div key={section}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">{section}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={`${section}-${item.name}-${item.unit}`}
                          className="rounded-full border border-nourish-border bg-[#fcfaf7] px-3 py-1.5 text-sm text-nourish-ink"
                        >
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
