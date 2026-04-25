import { formatISO } from "date-fns";
import type { FridgeItem, Recipe, RecipeIngredient, WeekMealSlot } from "types/models";

const STORAGE_KEY = "nourish:meal-consumption:v1";

export type MealConsumptionStatus = "ate" | "skipped";

export interface MealConsumptionEntry {
  status: MealConsumptionStatus;
  recordedAt: string;
}

export function consumptionKey(slot: Pick<WeekMealSlot, "weekId" | "planDate" | "id">): string {
  return `${slot.weekId}::${slot.planDate}::${slot.id}`;
}

export function loadMealConsumptionStore(): Record<string, MealConsumptionEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, MealConsumptionEntry>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveMealConsumptionStatus(key: string, status: MealConsumptionStatus): void {
  const store = loadMealConsumptionStore();
  store[key] = { status, recordedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function todayDateString(): string {
  return formatISO(new Date(), { representation: "date" });
}

/** Planned meals before today that still need a logged outcome. */
export function getPendingPastMealSlots(
  slots: WeekMealSlot[],
  store: Record<string, MealConsumptionEntry>,
): WeekMealSlot[] {
  const today = todayDateString();
  return slots
    .filter((slot) => {
      if (!slot.recipeId) return false;
      if (slot.isEatingOut || slot.isSkipped) return false;
      if (slot.planDate >= today) return false;
      const key = consumptionKey(slot);
      return !store[key];
    })
    .sort((a, b) => {
      const d = a.planDate.localeCompare(b.planDate);
      if (d !== 0) return d;
      const mealOrder = (m: WeekMealSlot["mealType"]) =>
        ["Breakfast", "Lunch", "Dinner", "Snack"].indexOf(m);
      return mealOrder(a.mealType) - mealOrder(b.mealType);
    });
}

function deductOneIngredient(next: FridgeItem[], ing: RecipeIngredient, need: number): FridgeItem[] {
  if (need <= 0) return next;
  let remaining = need;
  const candidates = next
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.ingredientId === ing.ingredientId && f.unit === ing.unit)
    .sort((a, b) => a.f.quantity - b.f.quantity);

  let result = [...next];
  for (const { f } of candidates) {
    if (remaining <= 0) break;
    const idx = result.findIndex((x) => x.id === f.id);
    if (idx < 0) continue;
    const row = result[idx];
    const take = Math.min(row.quantity, remaining);
    const newQ = row.quantity - take;
    remaining -= take;
    if (newQ <= 1e-6) {
      result = result.filter((x) => x.id !== row.id);
    } else {
      result[idx] = { ...row, quantity: newQ };
    }
  }
  return result;
}

/**
 * Remove quantities for a cooked meal, scaled to planned servings vs recipe base yield.
 * Skips optional/modifier lines so we only consume "core" recipe ingredients.
 */
export function deductRecipeFromFridge(items: FridgeItem[], recipe: Recipe, servingsFactor: number): FridgeItem[] {
  if (servingsFactor <= 0) return items;
  let next = [...items];
  for (const ing of recipe.ingredients) {
    if (ing.isModifier || ing.isOptional) continue;
    const need = ing.quantity * servingsFactor;
    next = deductOneIngredient(next, ing, need);
  }
  return next;
}
