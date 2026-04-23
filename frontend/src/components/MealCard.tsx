import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "components/BottomSheet";
import { useMatchMedia } from "hooks/useMatchMedia";
import { cn } from "lib/utils";
import { NutritionDots } from "./NutritionDots";
import type { MealType, Recipe, WeekMealSlot } from "types/models";

interface MealCardProps {
  slot: WeekMealSlot;
  recipe?: Recipe;
  onSwap: () => void;
  onDidntHappen?: () => void;
  onRemoveMeal?: () => void;
}

function mealLabel(mealType: MealType) {
  return mealType === "Snack" ? "Snack" : mealType;
}

export function MealCard({ slot, recipe, onSwap, onDidntHappen, onRemoveMeal }: MealCardProps) {
  const empty = !recipe;
  const eatingOut = slot.isEatingOut && empty;
  const skipped = slot.isSkipped && !recipe;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMatchMedia("(min-width: 1024px)");

  useEffect(() => {
    if (!menuOpen || !isDesktop) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen, isDesktop]);

  const filled = !empty && !skipped;
  const showActions = Boolean(onDidntHappen || onRemoveMeal || onSwap);

  function openActions() {
    if (isDesktop) setMenuOpen((o) => !o);
    else setSheetOpen(true);
  }

  function closeActions() {
    setMenuOpen(false);
    setSheetOpen(false);
  }

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl border text-left transition",
        empty && !eatingOut && !skipped ? "border-dashed border-nourish-border bg-[#fdfaf6]" : "border-nourish-border bg-white",
        slot.mealType === "Snack" && "bg-[#fffaf5]",
        skipped && "border-nourish-border/80 bg-nourish-bg/60",
      )}
    >
      <div className="flex min-h-[44px]">
        <button
          type="button"
          onClick={onSwap}
          className="min-h-[44px] flex-1 rounded-2xl p-3 text-left transition hover:shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className="text-xs font-medium tracking-wide text-nourish-muted">{mealLabel(slot.mealType)}</span>
            <ArrowUpDown size={14} className="shrink-0 text-nourish-muted opacity-0 transition group-hover:opacity-100" />
          </div>

          {eatingOut ? (
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-nourish-terracotta/10 px-2 py-1 text-[11px] font-medium text-nourish-terracotta">
                Eating out
              </div>
              <div className="text-sm text-nourish-muted">This slot won’t be added to grocery planning.</div>
            </div>
          ) : skipped ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-nourish-muted line-through decoration-nourish-muted/80">Didn’t happen</p>
              <p className="text-xs text-nourish-muted">Not on this week’s grocery list.</p>
            </div>
          ) : empty ? (
            <div className="flex items-center gap-2 text-sm text-nourish-muted">
              <Plus size={14} />
              Add something gentle here
            </div>
          ) : (
            <>
              <h4 className="mb-2 text-sm leading-snug text-nourish-ink line-clamp-2">{recipe.name}</h4>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-nourish-bg px-2 py-1 text-[11px] text-nourish-muted">
                  {recipe.timeTag === "Quick" ? "25 min" : recipe.timeTag === "Medium" ? "45 min" : "No limit"}
                </span>
                {slot.selectedModifierIngredientIds.length > 0 ? (
                  <span className="rounded-full bg-nourish-sage/10 px-2 py-1 text-[11px] font-medium text-nourish-sage">
                    {slot.selectedModifierIngredientIds.length} add-on{slot.selectedModifierIngredientIds.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>
              <NutritionDots foodGroups={Object.keys(recipe.foodGroupServings)} />
            </>
          )}
        </button>

        {showActions ? (
          <div className="relative shrink-0 pr-1 pt-1" ref={menuRef}>
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-nourish-muted transition hover:bg-nourish-bg hover:text-nourish-ink"
              aria-expanded={menuOpen || sheetOpen}
              aria-haspopup="menu"
              aria-label="Meal actions"
              onClick={(e) => {
                e.stopPropagation();
                openActions();
              }}
            >
              <MoreHorizontal size={20} />
            </button>
            {menuOpen && isDesktop ? (
              <div
                role="menu"
                className="absolute right-1 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-nourish-border bg-white py-1 text-sm shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full px-3 py-2.5 text-left text-nourish-ink hover:bg-nourish-bg"
                  onClick={() => {
                    closeActions();
                    onSwap();
                  }}
                >
                  Swap this meal
                </button>
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
                {filled && onRemoveMeal ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-3 py-2.5 text-left text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => {
                      closeActions();
                      onRemoveMeal();
                    }}
                  >
                    Remove meal
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <BottomSheet open={sheetOpen && !isDesktop} title="Meal actions" onClose={() => setSheetOpen(false)}>
        <div className="space-y-2">
          <button
            type="button"
            className="button-secondary w-full"
            onClick={() => {
              closeActions();
              onSwap();
            }}
          >
            Swap this meal
          </button>
          {filled && onDidntHappen ? (
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                closeActions();
                onDidntHappen();
              }}
            >
              Didn’t happen
            </button>
          ) : null}
          {filled && onRemoveMeal ? (
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                closeActions();
                onRemoveMeal();
              }}
            >
              Remove meal
            </button>
          ) : null}
        </div>
      </BottomSheet>
    </div>
  );
}
