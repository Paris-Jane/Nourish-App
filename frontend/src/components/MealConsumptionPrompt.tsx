import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlannerAnchorSlots, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import {
  consumptionKey,
  deductRecipeFromFridge,
  getPendingPastMealSlots,
  loadMealConsumptionStore,
  saveMealConsumptionStatus,
} from "lib/mealConsumption";
import { mockFridgeItems } from "lib/mockData";
import type { FridgeItem, WeekMealSlot } from "types/models";

const MAX_VISIBLE = 6;

export function MealConsumptionPrompt() {
  const queryClient = useQueryClient();
  const { slots } = usePlannerAnchorSlots();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [dayTick, setDayTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setDayTick((t) => t + 1), 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") setDayTick((t) => t + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    const nextMid = new Date(now);
    nextMid.setDate(nextMid.getDate() + 1);
    nextMid.setHours(0, 0, 0, 0);
    const ms = nextMid.getTime() - now.getTime();
    const t = window.setTimeout(() => setDayTick((x) => x + 1), Math.max(ms, 1000));
    return () => window.clearTimeout(t);
  }, [dayTick]);

  const store = useMemo(() => loadMealConsumptionStore(), [slots, dayTick]);
  const pending = useMemo(() => getPendingPastMealSlots(slots, store), [slots, store]);

  const recipeById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  const applyAte = useCallback(
    (slot: WeekMealSlot) => {
      const recipe = slot.recipeId ? recipeById.get(slot.recipeId) : undefined;
      if (!recipe) {
        pushToast("Could not find that recipe to update inventory.");
        return;
      }
      const factor = slot.servingsPlanned / Math.max(recipe.baseYieldServings, 1);
      queryClient.setQueryData<FridgeItem[]>(["fridge-items"], (prev) => {
        const list = prev ?? mockFridgeItems;
        return deductRecipeFromFridge(list, recipe, factor);
      });
      saveMealConsumptionStatus(consumptionKey(slot), "ate");
      setDayTick((t) => t + 1);
      pushToast(`Logged “ate” for ${slot.recipeName ?? recipe.name} — kitchen inventory updated.`);
    },
    [pushToast, queryClient, recipeById],
  );

  const applySkipped = useCallback(
    (slot: WeekMealSlot) => {
      saveMealConsumptionStatus(consumptionKey(slot), "skipped");
      setDayTick((t) => t + 1);
      pushToast(`Marked “didn’t eat” for ${slot.recipeName ?? "that meal"} — nothing removed from the kitchen.`);
    },
    [pushToast],
  );

  if (pending.length === 0) return null;

  const visible = pending.slice(0, MAX_VISIBLE);
  const extra = pending.length - visible.length;

  return (
    <div className="mb-4 rounded-2xl border border-nourish-sage/35 bg-nourish-sage/10 p-4 shadow-sm">
      <h2 className="font-heading text-lg text-nourish-ink">Past meals & kitchen inventory</h2>
      <p className="mt-1 text-sm text-nourish-muted">
        For days that have already passed, tell us whether you ate each planned meal. If you ate it, we remove ingredients from your
        kitchen; if you didn’t, nothing changes.
      </p>
      <ul className="mt-3 space-y-3">
        {visible.map((slot) => (
          <li
            key={consumptionKey(slot)}
            className="flex flex-col gap-2 rounded-xl border border-nourish-border bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-nourish-ink">{slot.recipeName ?? "Planned meal"}</p>
              <p className="text-xs text-nourish-muted">
                {slot.planDate} · {slot.mealType}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" className="button-primary px-3 py-2 text-sm" onClick={() => applyAte(slot)}>
                Ate it
              </button>
              <button type="button" className="button-secondary px-3 py-2 text-sm" onClick={() => applySkipped(slot)}>
                Didn’t eat
              </button>
            </div>
          </li>
        ))}
      </ul>
      {extra > 0 ? <p className="mt-2 text-xs text-nourish-muted">And {extra} more — answer these first to see the rest.</p> : null}
    </div>
  );
}
