import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, format, formatISO, parseISO, subDays } from "date-fns";
import { ArrowLeft, CheckCircle2, ChevronDown, Circle, Clock3, Package2, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentWeek, useIngredients, useRecipes, useWeekSlots } from "hooks/useAppData";
import { cn } from "lib/utils";
import { useWeekStore } from "store/weekStore";
import type { Ingredient, PrepStepCategory, Recipe, RecipeIngredient, RecipeStep, StoreSection, WeekMealSlot } from "types/models";

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

type AggregatedIngredientQuantity = {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  quantity: number;
  isModifierDriven: boolean;
};

type SundayTask = {
  id: string;
  category: PrepCategory;
  instruction: string;
  durationMinutes: number;
  isPassive: boolean;
  recipeNames: string[];
  ingredientSummaries: AggregatedIngredientQuantity[];
};

type FinishLaterPlan = {
  slot: WeekMealSlot;
  recipe: Recipe;
  steps: Array<{
    id: string;
    instruction: string;
    durationMinutes: number;
    isPassive: boolean;
    prepCategory?: PrepStepCategory;
  }>;
};

const PREP_CATEGORY_LABELS: Record<PrepStepCategory, PrepCategory> = {
  WashChop: "Wash & chop produce",
  MixSauce: "Mix sauces & prep bases",
  CookStarch: "Cook grains & starches",
  CookProtein: "Cook proteins",
  RoastBake: "Roast & bake",
  AssemblePortion: "Assemble & portion",
  FreshFinish: "Assemble & portion",
};

const PREP_CATEGORY_ORDER: PrepCategory[] = [
  "Wash & chop produce",
  "Mix sauces & prep bases",
  "Cook grains & starches",
  "Cook proteins",
  "Roast & bake",
  "Assemble & portion",
];

const PLURAL_MAP: Record<string, string> = {
  cup: "cups",
  tablespoon: "tablespoons",
  teaspoon: "teaspoons",
  ounce: "ounces",
  pound: "pounds",
  gram: "grams",
  liter: "liters",
  litre: "litres",
  clove: "cloves",
  can: "cans",
  bunch: "bunches",
  head: "heads",
  sprig: "sprigs",
  stalk: "stalks",
  slice: "slices",
  fillet: "fillets",
  strip: "strips",
  egg: "eggs",
};

function parseFraction(s: string): number {
  const parts = s.split("/");
  return parts.length === 2 ? Number(parts[0]) / Number(parts[1]) : Number(parts[0]);
}

function formatQuantity(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const fracs: [number, string][] = [
    [0.125, "⅛"],
    [0.25, "¼"],
    [0.33, "⅓"],
    [0.5, "½"],
    [0.67, "⅔"],
    [0.75, "¾"],
  ];
  const whole = Math.floor(n);
  const rem = n - whole;
  for (const [v, f] of fracs) {
    if (Math.abs(rem - v) < 0.04) return whole > 0 ? `${whole} ${f}` : f;
  }
  return Number(n.toFixed(2)).toString();
}

function pluralUnit(unit: string, qty: number): string {
  const lower = unit.toLowerCase();
  if (Math.abs(qty - 1) < 0.01) {
    const singular = Object.entries(PLURAL_MAP).find(([, pl]) => pl === lower)?.[0];
    return singular ?? unit;
  }
  return PLURAL_MAP[lower] ?? unit;
}

function scaleInstruction(instruction: string, multiplier: number): string {
  if (Math.abs(multiplier - 1) < 0.01) return instruction;
  let foundNumber = false;
  const scaled = instruction.replace(/\b(\d+(?:\/\d+)?(?:\.\d+)?)\s+([a-zA-Z]+)/g, (match, numStr, unit) => {
    foundNumber = true;
    const qty = parseFraction(numStr) * multiplier;
    return `${formatQuantity(qty)} ${pluralUnit(unit, qty)}`;
  });

  if (foundNumber) return scaled;
  const servings = formatQuantity(multiplier);
  return `${instruction} (${servings} planned serving${Math.abs(multiplier - 1) < 0.01 ? "" : "s"})`;
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

function getSlotMultiplier(slot: WeekMealSlot, recipe: Recipe) {
  const planned = slot.servingsPlanned && slot.servingsPlanned > 0 ? slot.servingsPlanned : 1;
  const yieldServings = recipe.baseYieldServings > 0 ? recipe.baseYieldServings : 1;
  return planned / yieldServings;
}

function getLinkedIngredients(recipe: Recipe, step: RecipeStep) {
  const linkedIds = step.linkedIngredientIds ?? [];
  if (linkedIds.length === 0) return [];
  return recipe.ingredients.filter((ingredient) => linkedIds.includes(ingredient.ingredientId));
}

function isSelectedOptionalIngredient(slot: WeekMealSlot, ingredient: RecipeIngredient) {
  if (!(ingredient.isModifier || ingredient.isOptional)) return true;
  return (slot.selectedModifierIngredientIds ?? []).includes(ingredient.ingredientId);
}

function stepAppliesToSlot(recipe: Recipe, step: RecipeStep, slot: WeekMealSlot) {
  const linkedIngredients = getLinkedIngredients(recipe, step);
  if (linkedIngredients.length === 0) return true;

  const hasCoreLinkedIngredient = linkedIngredients.some((ingredient) => !ingredient.isModifier && !ingredient.isOptional);
  if (hasCoreLinkedIngredient) return true;

  return linkedIngredients.some((ingredient) => isSelectedOptionalIngredient(slot, ingredient));
}

function accumulateIngredientQuantities(
  current: Map<string, AggregatedIngredientQuantity>,
  ingredients: RecipeIngredient[],
  slot: WeekMealSlot,
  recipe: Recipe,
) {
  const multiplier = getSlotMultiplier(slot, recipe);

  ingredients.forEach((ingredient) => {
    if (!isSelectedOptionalIngredient(slot, ingredient)) return;
    const key = `${ingredient.ingredientId}:${ingredient.unit}`;
    const existing = current.get(key);
    const quantityToAdd = ingredient.quantity * multiplier;
    if (existing) {
      existing.quantity += quantityToAdd;
      existing.isModifierDriven = existing.isModifierDriven || ingredient.isModifier || ingredient.isOptional;
      return;
    }
    current.set(key, {
      ingredientId: ingredient.ingredientId,
      ingredientName: ingredient.ingredientName,
      unit: ingredient.unit,
      quantity: quantityToAdd,
      isModifierDriven: ingredient.isModifier || ingredient.isOptional,
    });
  });
}

function buildIngredientSummaryText(summaries: AggregatedIngredientQuantity[]) {
  return summaries
    .map((summary) => `${formatQuantity(summary.quantity)} ${pluralUnit(summary.unit, summary.quantity)} ${summary.ingredientName.toLowerCase()}`)
    .join(", ");
}

function replaceToken(text: string, token: string, replacement: string) {
  return text.split(token).join(replacement);
}

function renderStepInstruction(
  instruction: string,
  summaries: AggregatedIngredientQuantity[],
  multiplier: number,
) {
  if (summaries.length === 0) return scaleInstruction(instruction, multiplier);

  const summaryText = buildIngredientSummaryText(summaries);
  if (summaries.length === 1) {
    const [summary] = summaries;
    let rendered = replaceToken(instruction, "{quantity}", formatQuantity(summary.quantity));
    rendered = replaceToken(rendered, "{unit}", pluralUnit(summary.unit, summary.quantity));
    rendered = replaceToken(rendered, "{ingredient}", summary.ingredientName.toLowerCase());
    rendered = replaceToken(
      rendered,
      "{ingredients}",
      `${formatQuantity(summary.quantity)} ${pluralUnit(summary.unit, summary.quantity)} ${summary.ingredientName.toLowerCase()}`,
    );

    if (rendered === instruction) {
      rendered = `${instruction} (${formatQuantity(summary.quantity)} ${pluralUnit(summary.unit, summary.quantity)} ${summary.ingredientName.toLowerCase()})`;
    }
    return rendered;
  }

  const rendered = replaceToken(instruction, "{ingredients}", summaryText);
  return rendered === instruction ? `${instruction} (${summaryText})` : rendered;
}

function buildSundayTasks(recipePlans: WeeklyRecipePlan[]) {
  const aggregates = new Map<
    string,
    {
      category: PrepCategory;
      templateInstruction: string;
      durationMinutes: number;
      isPassive: boolean;
      recipeNames: Set<string>;
      ingredientQuantities: Map<string, AggregatedIngredientQuantity>;
      multiplierTotal: number;
    }
  >();

  recipePlans.forEach(({ recipe, slots }) => {
    recipe.steps
      .filter((step) => step.timingTag === "PrepAhead")
      .forEach((step) => {
        const applicableSlots = slots.filter((slot) => stepAppliesToSlot(recipe, step, slot));
        if (applicableSlots.length === 0) return;

        const linkedIngredients = getLinkedIngredients(recipe, step);
        const stepKeyIngredients =
          linkedIngredients.length > 0
            ? linkedIngredients.map((ingredient) => ingredient.ingredientName.toLowerCase()).sort().join("|")
            : "recipe";
        const key = [
          PREP_CATEGORY_LABELS[step.prepCategory ?? "AssemblePortion"],
          step.instruction,
          step.scaleByLinkedIngredients ? "scaled" : "unscaled",
          stepKeyIngredients,
          step.isPassive ? "passive" : "active",
        ].join("::");

        const aggregate =
          aggregates.get(key) ??
          {
            category: PREP_CATEGORY_LABELS[step.prepCategory ?? "AssemblePortion"],
            templateInstruction: step.instruction,
            durationMinutes: step.durationMinutes,
            isPassive: step.isPassive,
            recipeNames: new Set<string>(),
            ingredientQuantities: new Map<string, AggregatedIngredientQuantity>(),
            multiplierTotal: 0,
          };

        aggregate.recipeNames.add(recipe.name);
        aggregate.durationMinutes = Math.max(aggregate.durationMinutes, step.durationMinutes);
        aggregate.multiplierTotal += applicableSlots.reduce((sum, slot) => sum + getSlotMultiplier(slot, recipe), 0);

        if (step.scaleByLinkedIngredients && linkedIngredients.length > 0) {
          applicableSlots.forEach((slot) => {
            accumulateIngredientQuantities(aggregate.ingredientQuantities, linkedIngredients, slot, recipe);
          });
        }

        aggregates.set(key, aggregate);
      });
  });

  return Array.from(aggregates.entries())
    .map(([key, aggregate]) => {
      const ingredientSummaries = Array.from(aggregate.ingredientQuantities.values()).sort((a, b) =>
        a.ingredientName.localeCompare(b.ingredientName),
      );

      return {
        id: key,
        category: aggregate.category,
        instruction: renderStepInstruction(aggregate.templateInstruction, ingredientSummaries, aggregate.multiplierTotal),
        durationMinutes: aggregate.durationMinutes,
        isPassive: aggregate.isPassive,
        recipeNames: Array.from(aggregate.recipeNames).sort((a, b) => a.localeCompare(b)),
        ingredientSummaries,
      } satisfies SundayTask;
    })
    .sort((a, b) => PREP_CATEGORY_ORDER.indexOf(a.category) - PREP_CATEGORY_ORDER.indexOf(b.category) || a.instruction.localeCompare(b.instruction));
}

function buildFinishLaterPlans(recipePlans: WeeklyRecipePlan[]) {
  return recipePlans.flatMap(({ recipe, slots }) =>
    slots
      .map((slot) => {
        const steps = recipe.steps
          .filter((step) => step.timingTag !== "PrepAhead")
          .filter((step) => stepAppliesToSlot(recipe, step, slot))
          .map((step) => {
            const linkedIngredients = getLinkedIngredients(recipe, step);
            const ingredientMap = new Map<string, AggregatedIngredientQuantity>();
            if (step.scaleByLinkedIngredients && linkedIngredients.length > 0) {
              accumulateIngredientQuantities(ingredientMap, linkedIngredients, slot, recipe);
            }
            const summaries = Array.from(ingredientMap.values());
            return {
              id: `${slot.id}-${step.id}`,
              instruction: renderStepInstruction(step.instruction, summaries, getSlotMultiplier(slot, recipe)),
              durationMinutes: step.durationMinutes,
              isPassive: step.isPassive,
              prepCategory: step.prepCategory,
            };
          });

        return {
          slot,
          recipe,
          steps,
        } satisfies FinishLaterPlan;
      })
      .filter((entry) => entry.steps.length > 0),
  );
}

function buildIngredientGroups(recipePlans: WeeklyRecipePlan[], ingredients: Ingredient[]) {
  const ingredientLookup = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const groups = new Map<StoreSection | string, Array<{ name: string; quantity: number; unit: string; isModifierDriven: boolean }>>();

  recipePlans.forEach(({ recipe, slots }) => {
    const prepAheadSteps = recipe.steps.filter((step) => step.timingTag === "PrepAhead");
    const prepLinkedIngredientIds = new Set(prepAheadSteps.flatMap((step) => step.linkedIngredientIds ?? []));

    const candidateIngredients =
      prepLinkedIngredientIds.size > 0
        ? recipe.ingredients.filter((ingredient) => prepLinkedIngredientIds.has(ingredient.ingredientId))
        : recipe.ingredients.filter((ingredient) => !ingredient.isModifier && !ingredient.isOptional);

    slots.forEach((slot) => {
      candidateIngredients.forEach((ingredient) => {
        if (!isSelectedOptionalIngredient(slot, ingredient)) return;

        const meta = ingredientLookup.get(ingredient.ingredientId);
        const section = meta?.storeSection ?? "Other";
        const entry = groups.get(section) ?? [];
        const existing = entry.find((item) => item.name === ingredient.ingredientName && item.unit === ingredient.unit);
        const quantityToAdd = ingredient.quantity * getSlotMultiplier(slot, recipe);

        if (existing) {
          existing.quantity += quantityToAdd;
          existing.isModifierDriven = existing.isModifierDriven || ingredient.isModifier || ingredient.isOptional;
        } else {
          entry.push({
            name: ingredient.ingredientName,
            quantity: quantityToAdd,
            unit: ingredient.unit,
            isModifierDriven: ingredient.isModifier || ingredient.isOptional,
          });
        }

        groups.set(section, entry);
      });
    });
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([section, items]) => ({
      section,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

export function PrepSheetPage() {
  const { week } = useCurrentWeek();
  const { slots } = useWeekSlots();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const setVisibleWeekStartDate = useWeekStore((state) => state.setVisibleWeekStartDate);

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

  const recipePlans = useMemo(() => buildWeeklyRecipePlans(slots, recipes), [recipes, slots]);
  const sundayTasks = useMemo(() => buildSundayTasks(recipePlans), [recipePlans]);

  const tasksByCategory = useMemo(
    () =>
      PREP_CATEGORY_ORDER.map((category) => ({
        category,
        tasks: sundayTasks.filter((task) => task.category === category),
      })).filter((entry) => entry.tasks.length > 0),
    [sundayTasks],
  );

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
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-ink shadow-sm transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to home
          </Link>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setVisibleWeekStartDate(formatISO(subDays(parseISO(week.weekStartDate), 7), { representation: "date" }))}
          >
            Previous week
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setVisibleWeekStartDate(formatISO(addDays(parseISO(week.weekStartDate), 7), { representation: "date" }))}
          >
            Next week
          </button>
          <button type="button" className="button-secondary" onClick={() => setVisibleWeekStartDate(null)}>
            Current week
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Sunday meal prep</h1>
            <p className="mt-1 text-sm text-nourish-muted">Week of {format(parseISO(week.weekStartDate), "MMMM d, yyyy")}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-nourish-muted">
              This plan only includes prep-ahead tasks that make sense for the week you actually built. Modifier steps show up only when
              you selected that add-on, and fresh-finish items stay out of Sunday prep unless the recipe explicitly marks them as prep-ahead.
            </p>
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
          <div className="card p-6">
            <div className="mb-5 flex items-start gap-3">
              <Package2 className="mt-1 shrink-0 text-nourish-sage" size={18} />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-nourish-ink">Sunday prep order</h2>
                <p className="mt-1 text-sm text-nourish-muted">
                  Tap a task to check it off. Similar prep from multiple meals is merged together, so repeated things like boiling eggs or cooking grains only show once.
                </p>
              </div>
            </div>

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
                  <div className="h-full rounded-full bg-nourish-sage transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}

            {tasksByCategory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-nourish-border p-8 text-center">
                <p className="text-sm font-medium text-nourish-ink">No prep tasks yet</p>
                <p className="mt-1 text-sm text-nourish-muted">Plan a few recipes this week, then add detailed prep steps to those recipes.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {tasksByCategory.map(({ category, tasks }) => {
                  const doneTasks = tasks.filter((t) => completedIds.has(t.id)).length;
                  return (
                    <section key={category} className="rounded-2xl border border-nourish-border bg-[#fcfaf7] p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-nourish-ink">{category}</h3>
                        <span className="text-xs text-nourish-muted">
                          {doneTasks}/{tasks.length}
                        </span>
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
                                <button
                                  type="button"
                                  onClick={() => toggleTask(task.id)}
                                  className="flex min-h-[52px] min-w-[52px] shrink-0 items-center justify-center rounded-l-2xl transition hover:bg-nourish-sage/5 active:bg-nourish-sage/10"
                                  aria-label={done ? `Mark "${task.instruction.slice(0, 40)}…" as not done` : `Mark "${task.instruction.slice(0, 40)}…" as done`}
                                >
                                  {done ? <CheckCircle2 size={20} className="text-nourish-sage" /> : <Circle size={20} className="text-nourish-border" />}
                                </button>

                                <div className="min-w-0 flex-1 py-3 pr-4">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {task.recipeNames.map((recipeName) => (
                                      <span
                                        key={`${task.id}-${recipeName}`}
                                        className="rounded-full bg-nourish-sage/10 px-2.5 py-1 text-[11px] font-medium text-nourish-sage"
                                      >
                                        {recipeName}
                                      </span>
                                    ))}
                                    <span className="inline-flex items-center gap-1 rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                                      <Clock3 size={11} />
                                      {task.durationMinutes} min
                                    </span>
                                    {task.isPassive && (
                                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700">Hands-off</span>
                                    )}
                                  </div>
                                  <p className={cn("mt-2 text-sm leading-relaxed text-nourish-ink", done && "line-through decoration-nourish-muted/50")}>
                                    {task.instruction}
                                  </p>
                                  {task.ingredientSummaries.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {task.ingredientSummaries.map((summary) => (
                                        <span
                                          key={`${task.id}-${summary.ingredientId}-${summary.unit}`}
                                          className={cn(
                                            "rounded-full border px-2.5 py-1 text-[11px]",
                                            summary.isModifierDriven
                                              ? "border-amber-200 bg-amber-50 text-amber-800"
                                              : "border-nourish-border bg-[#fcfaf7] text-nourish-muted",
                                          )}
                                        >
                                          {formatQuantity(summary.quantity)} {pluralUnit(summary.unit, summary.quantity)} {summary.ingredientName.toLowerCase()}
                                          {summary.isModifierDriven ? " · modifier" : ""}
                                        </span>
                                      ))}
                                    </div>
                                  )}
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
              <ChevronDown size={17} className={cn("shrink-0 text-nourish-muted transition-transform duration-200", finishLaterOpen && "rotate-180")} />
            </button>

            {finishLaterOpen && finishLaterPlans.length > 0 && (
              <div className="space-y-3 border-t border-nourish-border px-5 pb-5 pt-4">
                {finishLaterPlans.map(({ slot, recipe, steps }) => (
                  <div key={slot.id} className="rounded-2xl border border-nourish-border bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/recipes/${recipe.id}`} className="text-sm font-semibold text-nourish-ink underline-offset-4 hover:underline">
                        {recipe.name}
                      </Link>
                      <span className="rounded-full bg-nourish-bg px-2.5 py-1 text-[11px] text-nourish-muted">
                        {slot.dayOfWeek} · {slot.mealType}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-nourish-ink">
                      {steps.map((step) => (
                        <li key={step.id} className="rounded-xl bg-[#fcfaf7] px-3 py-2 leading-relaxed">
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
            <h2 className="text-lg font-semibold text-nourish-ink">Ingredients to batch-prep</h2>
            <p className="mt-1 text-sm text-nourish-muted">
              These totals come from prep-ahead steps when a recipe is detailed enough to support it. Modifier ingredients only appear when you actually picked them.
            </p>
            {ingredientGroups.length === 0 ? (
              <p className="mt-4 text-sm text-nourish-muted">No prep-linked ingredients yet. Add linked ingredients to recipe steps to make this smarter.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {ingredientGroups.map(({ section, items }) => (
                  <div key={section}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">{section}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={`${section}-${item.name}-${item.unit}`}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm",
                            item.isModifierDriven
                              ? "border-amber-200 bg-amber-50 text-amber-800"
                              : "border-nourish-border bg-[#fcfaf7] text-nourish-ink",
                          )}
                        >
                          {item.name} · {formatQuantity(item.quantity)} {pluralUnit(item.unit, item.quantity)}
                          {item.isModifierDriven ? " · modifier" : ""}
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
