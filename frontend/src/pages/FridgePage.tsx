import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";
import { AlertTriangle, Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BottomSheet } from "components/BottomSheet";
import { FridgeItemRow } from "components/FridgeItemRow";
import { WhatCanIMakeRecipeCard } from "components/WhatCanIMakeRecipeCard";
import { useFridgeItems, useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { countExpiringWithin, getExpiringSoonItems } from "lib/fridgeExpiry";
import { daysUntil } from "lib/utils";
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

function scrollFridgeRowIntoView(itemId: number) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById(`fridge-item-row-${itemId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

export function FridgePage() {
  const { items: queryItems } = useFridgeItems();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [localItems, setLocalItems] = useState<FridgeItem[] | null>(null);
  const items = localItems ?? queryItems;

  const [tab, setTab] = useState<(typeof tabs)[number]>("Fridge");
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<FridgeItem | null>(null);
  const [whatCanIMakeOpen, setWhatCanIMakeOpen] = useState(false);
  const [listQuery, setListQuery] = useState("");
  const [addIngredientQuery, setAddIngredientQuery] = useState("");

  const form = useForm<FridgeItemFormValues>({
    resolver: zodResolver(fridgeItemSchema),
    defaultValues: { ingredientId: 0, quantity: 1, unit: "item", location: "Fridge", expiresAt: "" },
  });

  const watchedIngredientId = useWatch({ control: form.control, name: "ingredientId" });

  const filteredItems = useMemo(() => items.filter((item) => item.location === tab), [items, tab]);

  const listFilteredItems = useMemo(() => {
    const q = listQuery.trim().toLowerCase();
    if (!q) return filteredItems;
    return filteredItems.filter(
      (item) =>
        item.ingredientName.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        String(item.quantity).includes(q),
    );
  }, [filteredItems, listQuery]);

  const listSortedItems = useMemo(() => {
    const arr = [...listFilteredItems];
    arr.sort((a, b) => {
      const ta = a.expiresAt ? parseISO(a.expiresAt).getTime() : Number.POSITIVE_INFINITY;
      const tb = b.expiresAt ? parseISO(b.expiresAt).getTime() : Number.POSITIVE_INFINITY;
      if (ta !== tb) return ta - tb;
      return a.ingredientName.localeCompare(b.ingredientName, undefined, { sensitivity: "base" });
    });
    return arr;
  }, [listFilteredItems]);

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
      .sort((a, b) => {
        const diff = b.matches.length - a.matches.length;
        if (diff !== 0) return diff;
        return a.recipe.name.localeCompare(b.recipe.name);
      });
  }, [items, recipes]);

  const nextId = useCallback(() => Math.max(0, ...items.map((i) => i.id)) + 1, [items]);

  const sheetOpen = sheetMode !== null;

  const addPickerIngredients = useMemo(() => {
    const q = addIngredientQuery.trim().toLowerCase();
    const list = !q ? ingredients : ingredients.filter((ing) => ing.name.toLowerCase().includes(q));
    return list.slice(0, 40);
  }, [addIngredientQuery, ingredients]);

  const openAddSheet = () => {
    setEditingItem(null);
    setSheetMode("add");
    setAddIngredientQuery("");
    form.reset({
      ingredientId: 0,
      quantity: 1,
      unit: "item",
      location: tab,
      expiresAt: "",
    });
  };

  const openEditSheet = (item: FridgeItem) => {
    setEditingItem(item);
    setSheetMode("edit");
    setAddIngredientQuery("");
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
    setAddIngredientQuery("");
    form.reset({ ingredientId: 0, quantity: 1, unit: "item", location: "Fridge", expiresAt: "" });
  };

  const focusExpiringItem = (item: FridgeItem) => {
    setTab(item.location);
    setListQuery("");
    scrollFridgeRowIntoView(item.id);
  };

  const handleDeleteItem = (id: number) => {
    setLocalItems((prev) => (prev ?? queryItems).filter((i) => i.id !== id));
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

  const sheetTitle = sheetMode === "edit" ? "Edit item" : "Add item";
  const selectedIngredientName = ingredients.find((i) => i.id === watchedIngredientId)?.name;

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Your Kitchen</h1>
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
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-amber-950">Expiring soon</p>
              <p className="mt-1 text-xs text-amber-900/80">Tap an item to jump to it in your list.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {expiringSoon.map((i) => {
                  const d = daysUntil(i.expiresAt);
                  const bit = d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`;
                  return (
                    <button
                      key={i.id}
                      type="button"
                      className="max-w-full truncate rounded-full border border-amber-600/35 bg-white/90 px-3 py-1.5 text-left text-xs font-medium text-amber-950 shadow-sm transition hover:bg-amber-100/90 active:scale-[0.98]"
                      onClick={() => focusExpiringItem(i)}
                    >
                      {i.ingredientName}
                      <span className="ml-1 font-normal text-amber-800/90">({bit})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl bg-nourish-bg p-1 ring-1 ring-nourish-border/60" role="tablist" aria-label="Storage location">
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
                  onClick={() => setTab(entry)}
                  className={`rounded-xl px-3 py-3 text-sm font-medium transition touch-manipulation ${
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

        {filteredItems.length > 0 ? (
          <div className="mt-5">
            <label className="sr-only" htmlFor="fridge-list-search">
              Search items in {tab}
            </label>
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nourish-muted" aria-hidden />
              <input
                id="fridge-list-search"
                className="input w-full pl-9"
                placeholder={`Search ${tab.toLowerCase()} items…`}
                value={listQuery}
                onChange={(e) => setListQuery(e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-nourish-muted">Sorted by expiration date (soonest first). Items without a date appear last.</p>
          </div>
        ) : null}

        {filteredItems.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/50 px-6 py-12 text-center">
            <p className="text-base font-medium text-nourish-ink">No {tab.toLowerCase()} items</p>
            <p className="mt-2 text-sm text-nourish-muted">Add something here or switch tabs to see other locations.</p>
            <button type="button" className="button-primary mt-5 inline-flex items-center gap-2" onClick={openAddSheet}>
              <Plus size={18} aria-hidden />
              Add item to {tab}
            </button>
          </div>
        ) : listFilteredItems.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-nourish-ink">No matches for “{listQuery.trim()}”</p>
            <button type="button" className="mt-3 text-sm font-medium text-nourish-sage underline-offset-4 hover:underline" onClick={() => setListQuery("")}>
              Clear search
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {listSortedItems.map((item) => (
              <FridgeItemRow
                key={item.id}
                rowId={`fridge-item-row-${item.id}`}
                item={item}
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
        <form
          key={sheetMode === "edit" && editingItem ? `edit-${editingItem.id}` : "add"}
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="fridge-add-ingredient-search">
              Ingredient
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nourish-muted" aria-hidden />
              <input
                id="fridge-add-ingredient-search"
                className="input w-full pl-9"
                placeholder="Search ingredients…"
                value={addIngredientQuery}
                onChange={(e) => setAddIngredientQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            {watchedIngredientId >= 1 && selectedIngredientName ? (
              <p className="mt-2 text-sm font-medium text-nourish-ink">
                Selected: <span className="text-nourish-sage">{selectedIngredientName}</span>
              </p>
            ) : sheetMode === "add" ? (
              <p className="mt-2 text-xs text-nourish-muted">Pick an ingredient from the list below.</p>
            ) : null}
            {form.formState.errors.ingredientId ? (
              <p className="mt-1 text-xs text-red-700">{form.formState.errors.ingredientId.message}</p>
            ) : null}
            <Controller
              control={form.control}
              name="ingredientId"
              render={({ field }) => (
                <div className="mt-2 max-h-48 overflow-y-auto overscroll-contain rounded-2xl border border-nourish-border bg-nourish-bg/40 p-1">
                  {addPickerIngredients.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-nourish-muted">No ingredients match.</p>
                  ) : (
                    <ul className="space-y-0.5">
                      {addPickerIngredients.map((ing) => {
                        const picked = field.value === ing.id;
                        return (
                          <li key={ing.id}>
                            <button
                              type="button"
                              className={`flex w-full rounded-xl px-3 py-2.5 text-left text-sm transition touch-manipulation ${
                                picked ? "bg-nourish-sage text-white" : "text-nourish-ink hover:bg-white"
                              }`}
                              onClick={() => {
                                field.onChange(ing.id);
                                form.clearErrors("ingredientId");
                              }}
                            >
                              {ing.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-nourish-muted">Quantity</label>
            <input className="input mt-1" type="number" step="0.1" {...form.register("quantity", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-nourish-muted">Unit</label>
            <input className="input mt-1" placeholder="e.g. cups, bag" {...form.register("unit")} />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-nourish-muted">Location</label>
            <select className="input mt-1" {...form.register("location")}>
              {tabs.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-nourish-muted">Expiry (optional)</label>
            <input className="input mt-1" type="date" {...form.register("expiresAt")} />
          </div>
          <button className="button-primary w-full" type="submit">
            {sheetMode === "edit" ? "Save changes" : "Save item"}
          </button>
        </form>
      </BottomSheet>

      <BottomSheet open={whatCanIMakeOpen} title="What can I make?" onClose={() => setWhatCanIMakeOpen(false)}>
        {makeableRecipes.length === 0 ? (
          <p className="text-sm text-nourish-muted">No recipes match what’s in your kitchen yet. Add a few staples or recipes with overlapping ingredients.</p>
        ) : (
          <div className="flex max-h-[min(70vh,520px)] flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
            {makeableRecipes.map(({ recipe, matches }) => (
              <WhatCanIMakeRecipeCard
                key={recipe.id}
                recipe={recipe}
                matchedIngredientNames={matches}
                onBeforeNavigate={() => setWhatCanIMakeOpen(false)}
              />
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
