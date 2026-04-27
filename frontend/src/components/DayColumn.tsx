import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { MealCard } from "./MealCard";
import { cn } from "lib/utils";
import { formatGroupLabel, type DailyFoodGroupProgress, type MyPlateGroupKey, type SnackRecommendation } from "lib/plannerNutrition";
import type { Ingredient, Recipe, WeekMealSlot } from "types/models";

interface DayColumnProps {
  day: string;
  slots: WeekMealSlot[];
  recipes: Recipe[];
  ingredients?: Ingredient[];
  isToday?: boolean;
  planningMode?: boolean;
  foodProgress?: DailyFoodGroupProgress;
  snackRecommendations?: SnackRecommendation[];
  onSlotPrimaryAction: (slot: WeekMealSlot) => void;
  onSlotEdit: (slot: WeekMealSlot) => void;
  onCopyMeal?: (slot: WeekMealSlot) => void;
  onSkipSlot?: (slotId: number) => void;
  onClearSlot?: (slotId: number) => void;
  onDeleteSlot?: (slotId: number) => void;
  onAddSnack?: () => void;
  onSnackSuggestionSelect?: (suggestion: SnackRecommendation) => void;
  onDuplicateDayRequest?: (event: ReactMouseEvent<HTMLDivElement>) => void;
  dragState?: {
    draggedSlotId: number | null;
    dropTargetSlotId: number | null;
    onDragStart: (slotId: number) => void;
    onDragEnd: () => void;
    onDragOver: (slotId: number) => void;
    onDrop: (slotId: number) => void;
  };
}

export function DayColumn({
  day,
  slots,
  recipes,
  ingredients = [],
  isToday,
  planningMode = false,
  foodProgress,
  snackRecommendations = [],
  onSlotPrimaryAction,
  onSlotEdit,
  onCopyMeal,
  onSkipSlot,
  onClearSlot,
  onDeleteSlot,
  onAddSnack,
  onSnackSuggestionSelect,
  onDuplicateDayRequest,
  dragState,
}: DayColumnProps) {
  const [foodPopoverOpen, setFoodPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hasGap = foodProgress?.hasGap ?? false;
  const progressColors: Record<MyPlateGroupKey, string> = {
    grains: "#c9a56a",
    protein: "#c97045",
    vegetables: "#7ea383",
    fruit: "#df9548",
    dairy: "#dcc8a2",
  };

  useEffect(() => {
    if (!foodPopoverOpen) return;
    const close = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setFoodPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [foodPopoverOpen]);

  return (
    <div
      onContextMenu={(event) => {
        if (!planningMode || !onDuplicateDayRequest) return;
        event.preventDefault();
        onDuplicateDayRequest(event);
      }}
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-visible rounded-2xl border bg-white p-3 shadow-sm sm:p-4",
        isToday ? "border-2 border-nourish-sage bg-[#f0f4f0]" : "border-nourish-border",
      )}
    >
      <div className={cn("mb-3 flex min-w-0 items-start gap-2", foodProgress ? "justify-between" : "justify-start")}>
        {foodProgress ? (
          <div className="relative min-w-0 flex-1" ref={popoverRef}>
            <button
              type="button"
              className="flex min-w-0 w-full items-center gap-2 rounded-2xl px-1 py-1 text-left transition hover:bg-nourish-bg/70"
              onClick={() => setFoodPopoverOpen((current) => !current)}
              aria-expanded={foodPopoverOpen}
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-nourish-ink">{day.slice(0, 3)}</h3>
                {isToday ? (
                  <span className="rounded-full bg-nourish-sage/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-nourish-sage">
                    Today
                  </span>
                ) : null}
                {hasGap ? <span className="h-2 w-2 shrink-0 rounded-full bg-nourish-amber" title="Nutrition gap" aria-hidden /> : null}
              </div>
            </button>
            {foodPopoverOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-nourish-border bg-white p-4 text-xs shadow-lg">
                <p className="font-semibold text-nourish-ink">Daily food groups</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Object.entries(foodProgress.targets).map(([group, target]) => {
                    const typedGroup = group as keyof typeof foodProgress.targets;
                    const met = foodProgress.totals[typedGroup];
                    const remaining = foodProgress.remaining[typedGroup];
                    const safeTarget = target > 0 ? target : 1;
                    const ratio = Math.min(met / safeTarget, 1);
                    const radius = 18;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference * (1 - ratio);
                    return (
                      <div key={group} className="rounded-xl bg-[#fcfaf7] px-3 py-3">
                        <div className="relative mx-auto flex w-fit items-center justify-center">
                          <svg viewBox="0 0 48 48" className="h-16 w-16 -rotate-90">
                            <circle cx="24" cy="24" r={radius} fill="none" stroke="#efe5d8" strokeWidth="5" />
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              fill="none"
                              stroke={progressColors[typedGroup]}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                            />
                          </svg>
                          <div className="pointer-events-none absolute text-center">
                            <p className="text-sm font-semibold text-nourish-ink">{met.toFixed(1)}</p>
                            <p className="text-[10px] text-nourish-muted">of {target.toFixed(1)}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-center font-medium text-nourish-ink">{formatGroupLabel(typedGroup)}</p>
                        <p className={cn("mt-1 text-center text-[11px]", remaining > 0.01 ? "text-nourish-amber" : "text-nourish-sage")}>
                          {remaining > 0.01 ? `${remaining.toFixed(1)} left` : "Met"}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-nourish-ink">Snack suggestions</p>
                  {snackRecommendations.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {snackRecommendations.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="w-full rounded-xl border border-nourish-border bg-white px-3 py-2 text-left transition hover:border-nourish-sage/40 hover:bg-nourish-bg/60"
                          onClick={() => {
                            onSnackSuggestionSelect?.(suggestion);
                            setFoodPopoverOpen(false);
                          }}
                        >
                          <p className="font-medium text-nourish-ink">{suggestion.label}</p>
                          <p className="mt-0.5 text-nourish-muted">{suggestion.description}</p>
                          <p className="mt-1 text-[11px] text-nourish-muted">
                            Helps with {suggestion.foodGroups.map((group) => formatGroupLabel(group)).join(", ")}
                            {suggestion.fridgeHint ? ` · ${suggestion.fridgeHint}` : ""}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-nourish-muted">No snack gap right now.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-nourish-ink">{day.slice(0, 3)}</h3>
            {isToday ? (
              <span className="rounded-full bg-nourish-sage/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-nourish-sage">
                Today
              </span>
            ) : null}
            {hasGap ? <span className="h-2 w-2 shrink-0 rounded-full bg-nourish-amber" title="Nutrition gap" aria-hidden /> : null}
          </div>
        )}
      </div>

      <div className="relative min-h-0 flex-1 space-y-3">
        <div className="space-y-3">
          {slots.map((slot) => (
            <MealCard
              key={slot.id}
              slot={slot}
              recipe={recipes.find((recipe) => recipe.id === slot.recipeId)}
              ingredients={ingredients}
              planningMode={planningMode}
              onPrimaryAction={() => onSlotPrimaryAction(slot)}
              onSwap={() => onSlotEdit(slot)}
              onCopyMeal={onCopyMeal ? () => onCopyMeal(slot) : undefined}
              onDidntHappen={onSkipSlot ? () => onSkipSlot(slot.id) : undefined}
              onRemoveMeal={onClearSlot ? () => onClearSlot(slot.id) : undefined}
              onDeleteSlot={slot.mealType === "Snack" && slot.position > 0 && onDeleteSlot ? () => onDeleteSlot(slot.id) : undefined}
              draggable={slot.recipeId != null}
              dropActive={dragState?.dropTargetSlotId === slot.id}
              onDragStart={dragState ? () => dragState.onDragStart(slot.id) : undefined}
              onDragEnd={dragState?.onDragEnd}
              onDragOver={dragState ? () => dragState.onDragOver(slot.id) : undefined}
              onDrop={dragState ? () => dragState.onDrop(slot.id) : undefined}
            />
          ))}
          {planningMode && onAddSnack ? (
            <button
              type="button"
              className="w-full rounded-2xl border border-dashed border-nourish-sage/40 bg-nourish-sage/5 px-4 py-3 text-left text-sm font-medium text-nourish-sage transition hover:border-nourish-sage hover:bg-nourish-sage/10"
              onClick={onAddSnack}
            >
              + Add another snack
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
