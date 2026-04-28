import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMatchMedia } from "hooks/useMatchMedia";
import { getSelectedMealFoodGroups } from "lib/foodGroupMath";
import { calculateSlotFoodGroupServings, formatGroupLabel } from "lib/plannerNutrition";
import { cn } from "lib/utils";
import { NutritionDots } from "./NutritionDots";
import type { Ingredient, MealType, Recipe, WeekMealSlot } from "types/models";

interface MealCardProps {
  slot: WeekMealSlot;
  recipe?: Recipe;
  onPrimaryAction: () => void;
  onSwap?: () => void;
  onCopyMeal?: () => void;
  onDidntHappen?: () => void;
  onRemoveMeal?: () => void;
  onDeleteSlot?: () => void;
  ingredients?: Ingredient[];
  planningMode?: boolean;
  dropActive?: boolean;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
}

function mealLabel(mealType: MealType) {
  return mealType === "Snack" ? "Snack" : mealType;
}

export function MealCard({
  slot,
  recipe,
  onPrimaryAction,
  onSwap,
  onCopyMeal,
  onDidntHappen,
  onRemoveMeal,
  onDeleteSlot,
  ingredients = [],
  planningMode = false,
  dropActive = false,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: MealCardProps) {
  const empty = !recipe;
  const skipped = slot.isSkipped && !recipe;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 10, y: 10 });
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const nutritionRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMatchMedia("(min-width: 1024px)");

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  useEffect(() => {
    if (!nutritionOpen) return;
    const close = (e: MouseEvent) => {
      if (nutritionRef.current && !nutritionRef.current.contains(e.target as Node)) setNutritionOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [nutritionOpen]);

  const filled = !empty && !skipped;
  const showActions = planningMode && Boolean(onDidntHappen || onRemoveMeal || onCopyMeal || onDeleteSlot);
  const selectedFoodGroups = getSelectedMealFoodGroups(recipe, slot.selectedModifierIngredientIds ?? [], ingredients);
  const foodGroupServings = useMemo(() => calculateSlotFoodGroupServings(slot, recipe, ingredients), [slot, recipe, ingredients]);

  function closeActions() {
    setMenuOpen(false);
  }

  return (
    <div
      onContextMenu={(event) => {
        if (!planningMode || !showActions || !isDesktop) return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
          x: Math.max(8, Math.min(event.clientX - rect.left, rect.width - 188)),
          y: Math.max(8, Math.min(event.clientY - rect.top, rect.height - 132)),
        });
        setMenuOpen(true);
      }}
      draggable={planningMode && draggable && filled}
      onDragStart={() => onDragStart?.()}
      onDragEnd={() => onDragEnd?.()}
      onDragOver={(event) => {
        if (!planningMode || !onDragOver) return;
        event.preventDefault();
        onDragOver();
      }}
      onDrop={(event) => {
        if (!planningMode || !onDrop) return;
        event.preventDefault();
        onDrop();
      }}
      className={cn(
        "group relative w-full rounded-2xl border text-left transition",
        empty && !skipped ? "border-dashed border-nourish-border bg-[#fdfaf6]" : "border-nourish-border bg-white",
        slot.mealType === "Snack" && "bg-[#fffaf5]",
        skipped && "border-nourish-border/80 bg-nourish-bg/60",
        dropActive && "border-nourish-sage bg-nourish-sage/10 shadow-sm",
      )}
    >
      <button
        type="button"
        onClick={onPrimaryAction}
        className="min-h-[44px] w-full rounded-2xl p-3 text-left transition hover:shadow-sm"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="text-xs font-medium tracking-wide text-nourish-muted">{mealLabel(slot.mealType)}</span>
        </div>

        {skipped ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-nourish-muted line-through decoration-nourish-muted/80">Didn’t happen</p>
            <p className="text-xs text-nourish-muted">Not on this week’s grocery list.</p>
          </div>
        ) : empty ? (
          <div className="flex items-center gap-2 text-sm text-nourish-muted">
            <Plus size={14} />
            Add Meal
          </div>
        ) : (
          <>
            <h4 className="mb-2 text-sm leading-snug text-nourish-ink line-clamp-2">{recipe.name}</h4>
            <div className="relative w-fit" ref={nutritionRef}>
              <button
                type="button"
                className="rounded-full p-1 transition hover:bg-nourish-bg"
                onClick={(event) => {
                  event.stopPropagation();
                  setNutritionOpen((current) => !current);
                }}
                aria-expanded={nutritionOpen}
              >
                <NutritionDots foodGroups={selectedFoodGroups} />
              </button>
              {nutritionOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 min-w-[11rem] rounded-xl border border-nourish-border bg-white p-3 text-left text-xs shadow-lg">
                  <p className="font-semibold text-nourish-ink">This meal counts toward</p>
                  <div className="mt-2 space-y-1.5">
                    {Object.entries(foodGroupServings)
                      .filter(([, servings]) => servings > 0)
                      .map(([group, servings]) => (
                        <div key={group} className="flex items-center justify-between gap-3 text-nourish-muted">
                          <span>{formatGroupLabel(group as Parameters<typeof formatGroupLabel>[0])}</span>
                          <span className="font-medium text-nourish-ink">{servings.toFixed(1)} servings</span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </button>

      {menuOpen ? (
        <div
          ref={menuRef}
          role="menu"
          className="absolute z-30 w-48 overflow-hidden rounded-xl border border-nourish-border bg-white py-1 text-sm shadow-lg"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          {filled && onCopyMeal ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2.5 text-left text-nourish-ink hover:bg-nourish-bg"
              onClick={() => {
                closeActions();
                onCopyMeal();
              }}
            >
              Add to other days
            </button>
          ) : null}
          {filled && onDidntHappen ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2.5 text-left text-nourish-ink hover:bg-nourish-bg"
              onClick={() => {
                closeActions();
                onDidntHappen();
              }}
            >
              Didn’t happen
            </button>
          ) : null}
          {(filled && onRemoveMeal) || onDeleteSlot ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2.5 text-left text-nourish-ink hover:bg-nourish-bg"
              onClick={() => {
                closeActions();
                if (filled) onRemoveMeal?.();
                else onDeleteSlot?.();
              }}
            >
              {filled ? "Remove meal" : "Remove snack row"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
