import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BottomSheet } from "components/BottomSheet";
import { FridgeItemRow } from "components/FridgeItemRow";
import { WhatCanIMakeRecipeCard } from "components/WhatCanIMakeRecipeCard";
import { useFridgeItems, useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { countExpiringWithin, getExpiringSoonItems } from "lib/fridgeExpiry";
import { daysUntil } from "lib/utils";
import { useIngredientPrefsStore } from "store/ingredientPrefsStore";
import { fridgeItemSchema, type FridgeItemFormValues } from "types/forms";
import type { FridgeItem, FridgeLocation, Recipe } from "types/models";

const tabs = ["Fridge", "Pantry", "Freezer"] as const;

function recipeFridgeMatches(recipe: Recipe, fridgeItems: FridgeItem[]): string[] {
  const ids = new Set(fridgeItems.map((f) => f.ingredientId));
  const names = new Map<number, string>();
  fridgeItems.forEach((f) => names.set(f.ingredientId, f.ingredientName));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ing of recipe.ingredients) {
    if (!ids.has(ing.ingredientId)) continue;
    const label = names.get(ing.ingredientId) ?? ing.ingredientName;
    if (!seen.has(label)) {
      seen.add(label);
      out.push(label);
    }
  }
  return out;
}

export function FridgePage() {
  const { items: queryItems } = useFridgeItems();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const isIngredientFavorite = useIngredientPrefsStore((state) => state.isFavorite);
  const toggleIngredientFavorite = useIngredientPrefsStore((state) => state.toggleFavorite);
  const [localItems, setLocalItems] = useState<FridgeItem[] | null>(null);
  const items = localItems ?? queryItems;

  const [tab, setTab] = useState<(typeof tabs)[number]>("Fridge");
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<FridgeItem | null>(null);
  const [whatCanIMakeOpen, setWhatCanIMakeOpen] = useState(false);
  const [deleteRevealedId, setDeleteRevealedId] = useState<number | null>(null);

  const form = useForm<FridgeItemFormValues>({
    resolver: zodResolver(fridgeItemSchema),
    defaultValues: { ingredientId: 1, quantity: 1, unit: "item", location: "Fridge", expiresAt: "" },
  });

  const filteredItems = useMemo(() => items.filter((item) => item.location === tab), [items, tab]);

  const expiringSoon = useMemo(() => getExpiringSoonItems(items, 2), [items]);
  const expiringWithin3 = useMemo(() => countExpiringWithin(items, 3), [items]);

  const countsByLocation = useMemo(() => {
    const base: Record<FridgeLocation, number> = { Fridge: 0, Pantry: 0, Freezer: 0 };
    for (const item of items) base[item.location] += 1;
    return base;
  }, [items]);

  const makeableRecipes = useMemo(() => {
    return recipes
      .map((recipe) => ({ recipe, matches: recipeFridgeMatches(recipe, items) }))
      .filter((x) => x.matches.length > 0)
      .sort((a, b) => b.matches.length - a.matches.length);
  }, [items, recipes]);

  const nextId = useCallback(() => Math.max(0, ...items.map((i) => i.id)) + 1, [items]);

  const openAddSheet = () => {
    setEditingItem(null);
    setSheetMode("add");
    form.reset({
      ingredientId: ingredients[0]?.id ?? 1,
      quantity: 1,
      unit: "item",
      location: tab,
      expiresAt: "",
    });
  };

  const openEditSheet = (item: FridgeItem) => {
    setEditingItem(item);
    setSheetMode("edit");
    form.reset({
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      expiresAt: item.expiresAt?.split("T")[0] ?? "",
    });
  };

  const closeSheet = () => {
    setSheetMode(null);
    setEditingItem(null);
    form.reset({ ingredientId: ingredients[0]?.id ?? 1, quantity: 1, unit: "item", location: "Fridge", expiresAt: "" });
  };

  const handleDeleteItem = (id: number) => {
    setLocalItems((prev) => (prev ?? queryItems).filter((i) => i.id !== id));
    setDeleteRevealedId(null);
    pushToast("Item removed from your kitchen list.");
  };

  const onSubmit = (values: FridgeItemFormValues) => {
    const ing = ingredients.find((i) => i.id === values.ingredientId);
    const expiresAtIso = values.expiresAt ? `${values.expiresAt}T12:00:00.000Z` : null;

    if (sheetMode === "add") {
      const newItem: FridgeItem = {
        id: nextId(),
        householdId: 1,
        ingredientId: values.ingredientId,
        ingredientName: ing?.name ?? "Unknown",
        quantity: values.quantity,
        unit: values.unit,
        location: values.location,
        purchasedAt: new Date().toISOString(),
        expiresAt: expiresAtIso,
        isLeftover: false,
        sourceRecipeId: null,
        addedVia: "Manual",
      };
      setLocalItems((prev) => [...(prev ?? queryItems), newItem]);
      pushToast(`${newItem.ingredientName} added to ${values.location}.`);
    } else if (sheetMode === "edit" && editingItem) {
      setLocalItems((prev) =>
        (prev ?? queryItems).map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                ingredientId: values.ingredientId,
                ingredientName: ing?.name ?? i.ingredientName,
                quantity: values.quantity,
                unit: values.unit,
                location: values.location,
                expiresAt: expiresAtIso,
              }
            : i,
        ),
      );
      pushToast("Item updated.");
    }
    closeSheet();
  };

  const sheetOpen = sheetMode !== null;
  const sheetTitle = sheetMode === "edit" ? "Edit item" : "Add item";

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Your Kitchen</h1>
            <p className="mt-1 text-sm text-nourish-muted">See what’s ready to use before anything goes to waste.</p>
            <p className="mt-2 text-sm font-medium text-nourish-ink">
              {items.length} {items.length === 1 ? "item" : "items"}
              <span className="mx-2 text-nourish-muted">·</span>
              <span className="font-normal text-nourish-muted">
                Fridge {countsByLocation.Fridge}, Pantry {countsByLocation.Pantry}, Freezer {countsByLocation.Freezer}
              </span>
            </p>
            <p className="mt-1 text-xs text-nourish-muted">
              {expiringWithin3 > 0 ? (
                <>
                  <span className="font-semibold text-orange-800">{expiringWithin3} expiring within 3 days</span>
                  <span> — check dates below.</span>
                </>
              ) : (
                "Nothing expiring in the next few days."
              )}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-2xl bg-nourish-terracotta px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-nourish-terracotta/90"
            onClick={() => setWhatCanIMakeOpen(true)}
          >
            What can I make?
          </button>
        </div>

        {expiringSoon.length > 0 ? (
          <div
            className="mb-5 flex gap-3 rounded-2xl border border-amber-400/80 bg-gradient-to-r from-amber-50 to-orange-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm ring-1 ring-amber-300/50"
            role="status"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div>
              <p className="font-semibold text-amber-950">Expiring soon</p>
              <p className="mt-0.5 leading-relaxed text-amber-900/90">
                {expiringSoon.map((i) => {
                  const d = daysUntil(i.expiresAt);
                  const bit =
                    d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`;
                  return `${i.ingredientName} (${bit})`;
                }).join(" · ")}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mb-5 rounded-2xl bg-nourish-bg p-1 ring-1 ring-nourish-border/60" role="tablist" aria-label="Storage location">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((entry) => {
              const active = tab === entry;
              return (
                <button
                  key={entry}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  id={`fridge-tab-${entry}`}
                  onClick={() => {
                    setTab(entry);
                    setDeleteRevealedId(null);
                  }}
                  className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white text-nourish-ink shadow-sm ring-2 ring-nourish-sage/35"
                      : "text-nourish-muted hover:text-nourish-ink"
                  }`}
                >
                  {entry}
                  <span className="mt-0.5 block text-xs font-normal text-nourish-muted">{countsByLocation[entry]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/50 px-6 py-12 text-center">
            <p className="text-base font-medium text-nourish-ink">No {tab.toLowerCase()} items</p>
            <p className="mt-2 text-sm text-nourish-muted">Add something here or switch tabs to see other locations.</p>
            <button type="button" className="button-primary mt-5 inline-flex items-center gap-2" onClick={openAddSheet}>
              <Plus size={18} aria-hidden />
              Add item to {tab}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <FridgeItemRow
                key={item.id}
                item={item}
                isFavorite={isIngredientFavorite(item.ingredientId)}
                onToggleFavorite={() => {
                  const nextFavorite = !isIngredientFavorite(item.ingredientId);
                  toggleIngredientFavorite(item.ingredientId);
                  pushToast(nextFavorite ? `${item.ingredientName} saved to favorite foods.` : `${item.ingredientName} removed from favorite foods.`);
                }}
                deleteRevealed={deleteRevealedId === item.id}
                onRevealDelete={() => setDeleteRevealedId(item.id)}
                onHideDelete={() => setDeleteRevealedId(null)}
                onEdit={() => openEditSheet(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}

        {filteredItems.length > 0 ? (
          <button type="button" className="button-secondary mt-5 w-full lg:w-auto" onClick={openAddSheet}>
            Add item
          </button>
        ) : null}
      </div>

      <BottomSheet open={sheetOpen} title={sheetTitle} onClose={closeSheet}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Ingredient</label>
          <select className="input" {...form.register("ingredientId", { valueAsNumber: true })}>
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Quantity</label>
          <input className="input" type="number" step="0.1" {...form.register("quantity", { valueAsNumber: true })} />
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Unit</label>
          <input className="input" placeholder="e.g. cups, bag" {...form.register("unit")} />
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Location</label>
          <select className="input" {...form.register("location")}>
            {tabs.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Expiry (optional)</label>
          <input className="input" type="date" {...form.register("expiresAt")} />
          <button className="button-primary w-full" type="submit">
            {sheetMode === "edit" ? "Save changes" : "Save item"}
          </button>
        </form>
      </BottomSheet>

      <BottomSheet open={whatCanIMakeOpen} title="What can I make?" onClose={() => setWhatCanIMakeOpen(false)}>
        {makeableRecipes.length === 0 ? (
          <p className="text-sm text-nourish-muted">No recipes match what’s in your kitchen yet. Add a few staples or recipes with overlapping ingredients.</p>
        ) : (
          <div className="flex max-h-[min(70vh,520px)] flex-col gap-2 overflow-y-auto pr-1">
            {makeableRecipes.map(({ recipe, matches }) => (
              <WhatCanIMakeRecipeCard key={recipe.id} recipe={recipe} matchedIngredientNames={matches} />
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
