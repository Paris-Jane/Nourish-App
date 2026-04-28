import type { PrepStepCategory, Recipe, RecipeIngredient, RecipeStep, TimingTag, WeekMealSlot } from "types/models";

export type AggregatedIngredientQuantity = {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  quantity: number;
  isModifierDriven: boolean;
};

export const PREP_CATEGORY_LABELS: Record<PrepStepCategory, string> = {
  WashChop: "Wash & chop produce",
  MixSauce: "Mix sauces & prep bases",
  CookStarch: "Cook grains & starches",
  CookProtein: "Cook proteins",
  RoastBake: "Roast & bake",
  AssemblePortion: "Assemble & portion",
  FreshFinish: "Assemble & portion",
};

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
  whole: "whole",
};

function parseFraction(input: string): number {
  const parts = input.split("/");
  return parts.length === 2 ? Number(parts[0]) / Number(parts[1]) : Number(parts[0]);
}

export function formatQuantity(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const fractions: Array<[number, string]> = [
    [0.125, "⅛"],
    [0.25, "¼"],
    [0.33, "⅓"],
    [0.375, "⅜"],
    [0.5, "½"],
    [0.625, "⅝"],
    [0.67, "⅔"],
    [0.75, "¾"],
    [0.875, "⅞"],
  ];
  const whole = Math.floor(value);
  const remainder = value - whole;
  for (const [fraction, token] of fractions) {
    if (Math.abs(remainder - fraction) < 0.04) {
      return whole > 0 ? `${whole} ${token}` : token;
    }
  }
  return Number(value.toFixed(2)).toString();
}

export function pluralUnit(unit: string, quantity: number): string {
  const lower = unit.toLowerCase();
  if (Math.abs(quantity - 1) < 0.01) {
    const singular = Object.entries(PLURAL_MAP).find(([, plural]) => plural === lower)?.[0];
    return singular ?? unit;
  }
  return PLURAL_MAP[lower] ?? unit;
}

export function getRecipeServingMultiplier(recipe: Recipe, servingsWanted = 1) {
  const yieldServings = recipe.baseYieldServings > 0 ? recipe.baseYieldServings : 1;
  return servingsWanted / yieldServings;
}

export function getSlotMultiplier(slot: WeekMealSlot, recipe: Recipe) {
  const planned = slot.servingsPlanned && slot.servingsPlanned > 0 ? slot.servingsPlanned : 1;
  return getRecipeServingMultiplier(recipe, planned);
}

export function getLinkedIngredients(recipe: Recipe, step: RecipeStep) {
  const linkedIds = step.linkedIngredientIds ?? [];
  if (linkedIds.length === 0) return [];
  return recipe.ingredients.filter((ingredient) => linkedIds.includes(ingredient.ingredientId));
}

export function isSelectedOptionalIngredient(
  ingredient: RecipeIngredient,
  selectedModifierIngredientIds: number[] | Set<number> | undefined,
) {
  if (!(ingredient.isModifier || ingredient.isOptional)) return true;
  const selected =
    selectedModifierIngredientIds instanceof Set
      ? selectedModifierIngredientIds
      : new Set(selectedModifierIngredientIds ?? []);
  return selected.has(ingredient.ingredientId);
}

export function stepAppliesToSelection(recipe: Recipe, step: RecipeStep, selectedModifierIngredientIds: number[] | Set<number> | undefined) {
  const linkedIngredients = getLinkedIngredients(recipe, step);
  if (linkedIngredients.length === 0) return true;

  const hasCoreLinkedIngredient = linkedIngredients.some((ingredient) => !ingredient.isModifier && !ingredient.isOptional);
  if (hasCoreLinkedIngredient) return true;

  return linkedIngredients.some((ingredient) => isSelectedOptionalIngredient(ingredient, selectedModifierIngredientIds));
}

export function stepAppliesToSlot(recipe: Recipe, step: RecipeStep, slot: WeekMealSlot) {
  return stepAppliesToSelection(recipe, step, slot.selectedModifierIngredientIds);
}

export function accumulateIngredientQuantities(
  current: Map<string, AggregatedIngredientQuantity>,
  ingredients: RecipeIngredient[],
  multiplier: number,
  selectedModifierIngredientIds?: number[] | Set<number>,
) {
  ingredients.forEach((ingredient) => {
    if (!isSelectedOptionalIngredient(ingredient, selectedModifierIngredientIds)) return;
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

export function buildIngredientSummaryText(summaries: AggregatedIngredientQuantity[]) {
  return summaries
    .map((summary) => `${formatQuantity(summary.quantity)} ${pluralUnit(summary.unit, summary.quantity)} ${summary.ingredientName.toLowerCase()}`)
    .join(", ");
}

function replaceToken(text: string, token: string, replacement: string) {
  return text.split(token).join(replacement);
}

export function scaleInstruction(instruction: string, multiplier: number): string {
  if (Math.abs(multiplier - 1) < 0.01) return instruction;
  let foundNumber = false;
  const scaled = instruction.replace(/\b(\d+(?:\/\d+)?(?:\.\d+)?)\s+([a-zA-Z]+)/g, (_match, numStr, unit) => {
    foundNumber = true;
    const quantity = parseFraction(numStr) * multiplier;
    return `${formatQuantity(quantity)} ${pluralUnit(unit, quantity)}`;
  });

  if (foundNumber) return scaled;
  return instruction;
}

export function renderStepInstruction(
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

function buildSyntheticModifierStep(
  ingredient: RecipeIngredient,
  stepNumber: number,
  multiplier: number,
  timingTag: TimingTag,
): RecipeStep {
  const quantity = ingredient.quantity * multiplier;
  const quantityText = `${formatQuantity(quantity)} ${pluralUnit(ingredient.unit, quantity)} ${ingredient.ingredientName.toLowerCase()}`;
  const prepCategory: PrepStepCategory = timingTag === "PrepAhead" ? "AssemblePortion" : "FreshFinish";
  return {
    id: -1 * (ingredient.ingredientId * 100 + stepNumber),
    stepNumber,
    instruction:
      timingTag === "PrepAhead"
        ? `Prep ${quantityText} and store it for the week.`
        : `Add ${quantityText} when assembling or serving.`,
    timingTag,
    durationMinutes: 2,
    isPassive: false,
    prepCategory,
    linkedIngredientIds: [ingredient.ingredientId],
    scaleByLinkedIngredients: true,
  };
}

export function buildRenderedRecipeSteps(
  recipe: Recipe,
  selectedModifierIngredientIds: number[] = [],
  servingsWanted = 1,
  timingTagFilter?: (step: RecipeStep) => boolean,
) {
  const selectedModifierSet = new Set(selectedModifierIngredientIds);
  const multiplier = getRecipeServingMultiplier(recipe, servingsWanted);
  const applicableSteps = recipe.steps
    .filter((step) => (timingTagFilter ? timingTagFilter(step) : true))
    .filter((step) => stepAppliesToSelection(recipe, step, selectedModifierSet))
    .map((step) => {
      const linkedIngredients = getLinkedIngredients(recipe, step);
      const ingredientMap = new Map<string, AggregatedIngredientQuantity>();
      if (step.scaleByLinkedIngredients && linkedIngredients.length > 0) {
        accumulateIngredientQuantities(ingredientMap, linkedIngredients, multiplier, selectedModifierSet);
      }
      const summaries = Array.from(ingredientMap.values());
      return {
        ...step,
        instruction: renderStepInstruction(step.instruction, summaries, multiplier),
      } satisfies RecipeStep;
    });

  const explicitlyCoveredModifierIds = new Set(
    applicableSteps.flatMap((step) => getLinkedIngredients(recipe, step).filter((ingredient) => ingredient.isModifier || ingredient.isOptional).map((ingredient) => ingredient.ingredientId)),
  );

  const syntheticSteps = recipe.ingredients
    .filter((ingredient) => (ingredient.isModifier || ingredient.isOptional) && selectedModifierSet.has(ingredient.ingredientId))
    .filter((ingredient) => !explicitlyCoveredModifierIds.has(ingredient.ingredientId))
    .map((ingredient, index) => {
      const syntheticStep = buildSyntheticModifierStep(
        ingredient,
        applicableSteps.length + index + 1,
        multiplier,
        ingredient.notes?.toLowerCase().includes("prep") ? "PrepAhead" : "DayOfActive",
      );
      return syntheticStep;
    })
    .filter((step) => (timingTagFilter ? timingTagFilter(step) : true));

  return [...applicableSteps, ...syntheticSteps].sort((a, b) => a.stepNumber - b.stepNumber);
}
