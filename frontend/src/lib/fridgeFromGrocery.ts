import type { FridgeItem, FridgeLocation, GroceryListItem, Ingredient } from "types/models";

const DEFAULT_HOUSEHOLD_ID = 1;

export function defaultFridgeLocation(ingredient: Ingredient | undefined): FridgeLocation {
  const loc = ingredient?.defaultLocation;
  if (loc === "Pantry" || loc === "Freezer" || loc === "Fridge") return loc;
  return "Fridge";
}

function nextFridgeId(items: FridgeItem[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

/**
 * When a grocery line is checked off, merge its purchased quantity into kitchen inventory.
 * Merges into an existing row with the same ingredient, unit, and location when possible.
 */
export function mergeGroceryCheckIntoFridge(
  items: FridgeItem[],
  groceryItem: GroceryListItem,
  qty: number,
  ingredients: Ingredient[],
): FridgeItem[] {
  if (qty <= 0) return items;
  const ingredient = ingredients.find((i) => i.id === groceryItem.ingredientId);
  const location = defaultFridgeLocation(ingredient);
  const unit = groceryItem.plannedUnit;

  const mergeIdx = items.findIndex(
    (f) => f.ingredientId === groceryItem.ingredientId && f.unit === unit && f.location === location,
  );
  if (mergeIdx >= 0) {
    const row = items[mergeIdx];
    return items.map((f, i) => (i === mergeIdx ? { ...row, quantity: row.quantity + qty } : f));
  }

  const newRow: FridgeItem = {
    id: nextFridgeId(items),
    householdId: items[0]?.householdId ?? DEFAULT_HOUSEHOLD_ID,
    ingredientId: groceryItem.ingredientId,
    ingredientName: groceryItem.ingredientName,
    quantity: qty,
    unit,
    location,
    purchasedAt: new Date().toISOString(),
    expiresAt: null,
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "GroceryList",
  };
  return [...items, newRow];
}

/**
 * When a grocery line is unchecked, subtract the same quantity that had been merged in.
 * Prefers rows that came from the grocery list, then any matching ingredient + unit.
 */
export function removeGroceryCheckFromFridge(items: FridgeItem[], groceryItem: GroceryListItem, qty: number): FridgeItem[] {
  if (qty <= 0) return items;
  const unit = groceryItem.plannedUnit;
  const order = items
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.ingredientId === groceryItem.ingredientId && f.unit === unit)
    .sort((a, b) => {
      const pri = (x: FridgeItem) => (x.addedVia === "GroceryList" ? 0 : 1);
      return pri(a.f) - pri(b.f);
    });

  let remaining = qty;
  let next = [...items];

  for (const { f } of order) {
    if (remaining <= 0) break;
    const idx = next.findIndex((x) => x.id === f.id);
    if (idx < 0) continue;
    const row = next[idx];
    const take = Math.min(row.quantity, remaining);
    const newQ = row.quantity - take;
    remaining -= take;
    if (newQ <= 1e-6) {
      next = next.filter((x) => x.id !== row.id);
    } else {
      next[idx] = { ...row, quantity: newQ };
    }
  }

  return next;
}
