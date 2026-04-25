import type { FridgeItem, Ingredient, MyPlateTargets, Recipe, WeekDay, WeekMealSlot } from "types/models";

export type MyPlateGroupKey = "grains" | "protein" | "vegetables" | "fruit" | "dairy";

export type DailyFoodGroupProgress = {
  totals: Record<MyPlateGroupKey, number>;
  targets: Record<MyPlateGroupKey, number>;
  remaining: Record<MyPlateGroupKey, number>;
  hasGap: boolean;
};

export type SnackRecommendation = {
  id: string;
  label: string;
  description: string;
  foodGroups: MyPlateGroupKey[];
  fridgeHint?: string | null;
};

type SnackCatalogItem = {
  name: string;
  servingDescription: string;
  doubleServingDescription?: string | null;
  myPlateServings: Partial<Record<MyPlateGroupKey, number>>;
};

const GROUP_ORDER: MyPlateGroupKey[] = ["grains", "protein", "vegetables", "fruit", "dairy"];

const SNACK_CATALOG: SnackCatalogItem[] = [
  { name: "Apple", servingDescription: "1 medium apple", doubleServingDescription: "2 medium apples", myPlateServings: { fruit: 1 } },
  { name: "Banana", servingDescription: "1 medium banana", doubleServingDescription: "2 medium bananas", myPlateServings: { fruit: 1 } },
  { name: "Orange", servingDescription: "1 medium orange", doubleServingDescription: "2 medium oranges", myPlateServings: { fruit: 1 } },
  { name: "Grapes", servingDescription: "1 cup grapes", doubleServingDescription: "2 cups grapes", myPlateServings: { fruit: 1 } },
  { name: "Mixed berries", servingDescription: "3/4 cup mixed berries", doubleServingDescription: "1 1/2 cups mixed berries", myPlateServings: { fruit: 1 } },
  { name: "Baby carrots", servingDescription: "1/2 cup baby carrots", doubleServingDescription: "1 cup baby carrots", myPlateServings: { vegetables: 0.5 } },
  { name: "Snap peas", servingDescription: "1 cup snap peas", doubleServingDescription: "2 cups snap peas", myPlateServings: { vegetables: 1 } },
  { name: "Cherry tomatoes", servingDescription: "1 cup cherry tomatoes", doubleServingDescription: "2 cups cherry tomatoes", myPlateServings: { vegetables: 1 } },
  { name: "Hard-boiled egg", servingDescription: "1 hard-boiled egg", doubleServingDescription: "2 hard-boiled eggs", myPlateServings: { protein: 1 } },
  { name: "Beef jerky", servingDescription: "1 oz beef jerky", doubleServingDescription: "2 oz beef jerky", myPlateServings: { protein: 1 } },
  { name: "Almonds", servingDescription: "1 oz almonds", doubleServingDescription: "2 oz almonds", myPlateServings: { protein: 1 } },
  { name: "Whole-grain crackers", servingDescription: "6 whole-grain crackers (1 oz)", doubleServingDescription: "12 whole-grain crackers (2 oz)", myPlateServings: { grains: 1 } },
  { name: "Popcorn", servingDescription: "3 cups air-popped popcorn", doubleServingDescription: "6 cups air-popped popcorn", myPlateServings: { grains: 1 } },
  { name: "String cheese", servingDescription: "1 string cheese stick", doubleServingDescription: "2 string cheese sticks", myPlateServings: { dairy: 1 } },
  { name: "Milk", servingDescription: "1 cup milk", doubleServingDescription: "2 cups milk", myPlateServings: { dairy: 1 } },
  { name: "Apple with peanut butter", servingDescription: "1 medium apple + 2 tbsp peanut butter", myPlateServings: { fruit: 1, protein: 1.5 } },
  { name: "Crackers with string cheese", servingDescription: "6 whole-grain crackers + 1 string cheese stick", myPlateServings: { grains: 1, dairy: 1 } },
  { name: "Carrots with hummus", servingDescription: "1/2 cup carrots + 3 tbsp hummus", myPlateServings: { vegetables: 0.5, protein: 0.5 } },
  { name: "Greek yogurt with berries", servingDescription: "6 oz Greek yogurt + 1/2 cup berries", myPlateServings: { dairy: 1, protein: 1.5, fruit: 0.5 } },
  { name: "Cheese and apple slices", servingDescription: "1.5 oz cheddar + 1 medium apple", myPlateServings: { dairy: 1, fruit: 1 } },
  { name: "Almond butter on rice cakes", servingDescription: "2 rice cakes + 2 tbsp almond butter", myPlateServings: { grains: 1, protein: 1.5 } },
  { name: "Celery with peanut butter", servingDescription: "2 celery stalks + 2 tbsp peanut butter", myPlateServings: { vegetables: 0.5, protein: 1.5 } },
  { name: "Trail mix", servingDescription: "1/4 cup trail mix", myPlateServings: { protein: 1, fruit: 0.5 } },
  { name: "Cottage cheese with fruit", servingDescription: "1/2 cup cottage cheese + 1/2 cup fruit", myPlateServings: { protein: 1, dairy: 0.5, fruit: 0.5 } },
  { name: "Hummus with pita", servingDescription: "3 tbsp hummus + 1 small whole-wheat pita", myPlateServings: { protein: 0.5, grains: 1 } },
];

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeGroupKey(group: string | Ingredient["foodGroup"]): MyPlateGroupKey | null {
  switch (group) {
    case "Grains":
    case "grains":
    case "grain":
      return "grains";
    case "Protein":
    case "protein":
      return "protein";
    case "Vegetable":
    case "vegetables":
    case "vegetable":
      return "vegetables";
    case "Fruit":
    case "fruit":
      return "fruit";
    case "Dairy":
    case "dairy":
      return "dairy";
    case "Legume":
    case "legume":
    case "legumes":
      return "protein";
    default:
      return null;
  }
}

export function myPlateTargetsToDailyRecord(targets?: MyPlateTargets | null): Record<MyPlateGroupKey, number> {
  return {
    grains: targets?.Grains ?? 0,
    protein: targets?.Protein ?? 0,
    vegetables: targets?.Vegetables ?? 0,
    fruit: targets?.Fruit ?? 0,
    dairy: targets?.Dairy ?? 0,
  };
}

export function calculateSlotFoodGroupServings(
  slot: WeekMealSlot,
  recipe: Recipe | undefined,
  ingredients: Ingredient[],
): Record<MyPlateGroupKey, number> {
  const totals: Record<MyPlateGroupKey, number> = { grains: 0, protein: 0, vegetables: 0, fruit: 0, dairy: 0 };
  if (!recipe || slot.isSkipped) return totals;

  const scale = recipe.baseYieldServings > 0 ? (slot.servingsPlanned || 1) / recipe.baseYieldServings : 1;

  Object.entries(recipe.foodGroupServings).forEach(([group, servings]) => {
    const key = normalizeGroupKey(group);
    if (!key) return;
    totals[key] = round2(totals[key] + Number(servings) * scale);
  });

  const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const selectedModifierIds = new Set(slot.selectedModifierIngredientIds ?? []);

  recipe.ingredients
    .filter((ingredient) => selectedModifierIds.has(ingredient.ingredientId))
    .forEach((ingredient) => {
      const details = ingredientMap.get(ingredient.ingredientId);
      if (!details || details.isMyPlateCounted === false || details.servingSize <= 0) return;
      const key = normalizeGroupKey(details.foodGroup);
      if (!key) return;
      const servings = (ingredient.quantity / details.servingSize) * scale;
      if (!Number.isFinite(servings) || servings <= 0) return;
      totals[key] = round2(totals[key] + servings);
    });

  return totals;
}

export function calculateDayFoodGroupProgress(
  daySlots: WeekMealSlot[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  targets?: MyPlateTargets | null,
): DailyFoodGroupProgress {
  const dailyTargets = myPlateTargetsToDailyRecord(targets);
  const totals: Record<MyPlateGroupKey, number> = { grains: 0, protein: 0, vegetables: 0, fruit: 0, dairy: 0 };

  daySlots.forEach((slot) => {
    if (!slot.recipeId || slot.isSkipped) return;
    const recipe = recipes.find((entry) => entry.id === slot.recipeId);
    const slotTotals = calculateSlotFoodGroupServings(slot, recipe, ingredients);
    GROUP_ORDER.forEach((group) => {
      totals[group] = round2(totals[group] + slotTotals[group]);
    });
  });

  const remaining = GROUP_ORDER.reduce<Record<MyPlateGroupKey, number>>((acc, group) => {
    acc[group] = round2(Math.max(0, dailyTargets[group] - totals[group]));
    return acc;
  }, { grains: 0, protein: 0, vegetables: 0, fruit: 0, dairy: 0 });

  return {
    totals,
    targets: dailyTargets,
    remaining,
    hasGap: GROUP_ORDER.some((group) => remaining[group] > 0.01),
  };
}

function fridgeHintForSnack(item: SnackCatalogItem, fridgeItems: FridgeItem[]) {
  const names = fridgeItems.map((entry) => entry.ingredientName.toLowerCase());
  if (item.name.toLowerCase().includes("apple") && names.some((name) => name.includes("apple"))) return "You already have apples";
  if (item.name.toLowerCase().includes("berries") && names.some((name) => name.includes("berry"))) return "You already have berries";
  if (item.name.toLowerCase().includes("carrot") && names.some((name) => name.includes("carrot"))) return "You already have carrots";
  if (item.name.toLowerCase().includes("egg") && names.some((name) => name.includes("egg"))) return "You already have eggs";
  if (item.name.toLowerCase().includes("cheese") && names.some((name) => name.includes("cheese"))) return "You already have cheese";
  if (item.name.toLowerCase().includes("yogurt") && names.some((name) => name.includes("yogurt"))) return "You already have yogurt";
  return null;
}

function selectSnackMultiplier(item: SnackCatalogItem, remaining: Record<MyPlateGroupKey, number>) {
  const groups = Object.keys(item.myPlateServings) as MyPlateGroupKey[];
  if (groups.length > 1) return 1;
  const group = groups[0];
  const provided = item.myPlateServings[group] ?? 0;
  const gap = remaining[group];
  if (provided <= 0 || gap <= 0) return 1;
  return Math.min(2, Math.max(1, Math.ceil(gap / provided)));
}

function reduceRemaining(remaining: Record<MyPlateGroupKey, number>, item: SnackCatalogItem, multiplier: number) {
  GROUP_ORDER.forEach((group) => {
    const provided = item.myPlateServings[group] ?? 0;
    if (!provided) return;
    remaining[group] = round2(Math.max(0, remaining[group] - provided * multiplier));
  });
}

function scoreSnack(item: SnackCatalogItem, remaining: Record<MyPlateGroupKey, number>) {
  return Object.entries(item.myPlateServings).reduce((sum, [group, servings]) => {
    const key = group as MyPlateGroupKey;
    const gap = remaining[key];
    return sum + Math.min(gap, servings ?? 0);
  }, 0);
}

export function generateSnackRecommendations(
  progress: DailyFoodGroupProgress,
  fridgeItems: FridgeItem[],
): SnackRecommendation[] {
  const remaining = { ...progress.remaining };
  const selected = new Set<string>();
  const output: SnackRecommendation[] = [];

  while (GROUP_ORDER.some((group) => remaining[group] > 0.01) && output.length < 3) {
    const best = SNACK_CATALOG
      .filter((item) => !selected.has(item.name))
      .map((item) => ({ item, score: scoreSnack(item, remaining) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || Object.keys(b.item.myPlateServings).length - Object.keys(a.item.myPlateServings).length)[0];

    if (!best) break;

    const multiplier = selectSnackMultiplier(best.item, remaining);
    selected.add(best.item.name);
    reduceRemaining(remaining, best.item, multiplier);

    output.push({
      id: `${best.item.name}-${multiplier}`,
      label: best.item.name,
      description: multiplier > 1 ? best.item.doubleServingDescription ?? `${multiplier}× ${best.item.servingDescription}` : best.item.servingDescription,
      foodGroups: Object.keys(best.item.myPlateServings) as MyPlateGroupKey[],
      fridgeHint: fridgeHintForSnack(best.item, fridgeItems),
    });
  }

  return output;
}

export function buildWeeklyFoodProgress(
  slots: WeekMealSlot[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  targets?: MyPlateTargets | null,
) {
  return slots.reduce<Record<WeekDay, DailyFoodGroupProgress>>((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = calculateDayFoodGroupProgress(
        slots.filter((entry) => entry.dayOfWeek === slot.dayOfWeek),
        recipes,
        ingredients,
        targets,
      );
    }
    return acc;
  }, {} as Record<WeekDay, DailyFoodGroupProgress>);
}

export function formatGroupLabel(group: MyPlateGroupKey) {
  switch (group) {
    case "grains":
      return "Grains";
    case "protein":
      return "Protein";
    case "vegetables":
      return "Vegetables";
    case "fruit":
      return "Fruit";
    case "dairy":
      return "Dairy";
  }
}
