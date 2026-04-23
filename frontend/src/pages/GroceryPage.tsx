import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Plus, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addGroceryItem, checkGroceryItem, deleteGroceryItem, generateGroceryList, updateGroceryItemQuantity } from "api/groceryList";
import { BottomSheet } from "components/BottomSheet";
import { GroceryListItemRow } from "components/GroceryListItemRow";
import { ProgressBar } from "components/ProgressBar";
import { SectionHeader } from "components/SectionHeader";
import { useGroceryList, useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { cn } from "lib/utils";
import type { GroceryListItem } from "types/models";

const icons: Record<string, string> = {
  Produce: "🥦",
  Protein: "🥩",
  Dairy: "🥛",
  Grains: "🌾",
  Pantry: "🫙",
  Frozen: "🧊",
};

const sectionOptions = ["Produce", "Dairy", "Grains", "Protein", "Pantry", "Frozen"] as const;

const groceryAddSchema = z.object({
  ingredientId: z.coerce.number().min(1, "Choose an ingredient"),
  storeSection: z.enum(["Produce", "Dairy", "Grains", "Protein", "Pantry", "Frozen"]),
  plannedQuantity: z.number().positive(),
  plannedUnit: z.string().min(1, "Unit is required"),
});

type GroceryAddValues = z.infer<typeof groceryAddSchema>;

function recipeNamesForItem(item: GroceryListItem, recipeNamesById: Map<number, string>): string {
  const names = item.recipeIds.map((id) => recipeNamesById.get(id)).filter(Boolean) as string[];
  if (names.length === 0) return "No recipe linked yet";
  return names.join(", ");
}

function sourceHintForItem(item: GroceryListItem) {
  if (item.addedToFridge) return "Added to kitchen";
  if (item.recipeIds.length === 0) return "Manual item";
  return null;
}

export function GroceryPage() {
  const queryClient = useQueryClient();
  const { groceryList } = useGroceryList();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { pushToast } = useToast();
  const [localItems, setLocalItems] = useState<GroceryListItem[] | null>(null);
  const [ingredientQuery, setIngredientQuery] = useState("");
  const items = localItems ?? groceryList.items;

  const recipeNamesById = useMemo(() => new Map(recipes.map((r) => [r.id, r.name])), [recipes]);

  const [checked, setChecked] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(groceryList.items.map((item) => [item.id, item.isChecked])),
  );

  const [actualQty, setActualQty] = useState<Record<number, number>>(() => {
    const o: Record<number, number> = {};
    for (const item of groceryList.items) {
      o[item.id] = item.purchasedQuantity ?? item.plannedQuantity;
    }
    return o;
  });

  const [qtyStatus, setQtyStatus] = useState<Record<number, "idle" | "saved">>({});
  const qtyDebounceRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const [deleteRevealedId, setDeleteRevealedId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const generateMutation = useMutation({
    mutationFn: () => generateGroceryList(groceryList.weekId),
    onSuccess: (data) => {
      queryClient.setQueryData(["grocery-list", groceryList.weekId], data);
      setLocalItems(data.items);
      pushToast("Fresh grocery list generated from this week.");
    },
    onError: () => {
      pushToast("Grocery list refreshed in preview mode.");
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (payload: { ingredientId: number; plannedQuantity: number; plannedUnit: string; storeSection: string }) =>
      addGroceryItem(groceryList.weekId, payload),
  });

  const checkMutation = useMutation({
    mutationFn: ({ itemId, isChecked }: { itemId: number; isChecked: boolean }) =>
      checkGroceryItem(groceryList.weekId, itemId, isChecked),
  });

  const quantityMutation = useMutation({
    mutationFn: ({ itemId, purchasedQuantity }: { itemId: number; purchasedQuantity: number }) =>
      updateGroceryItemQuantity(groceryList.weekId, itemId, purchasedQuantity),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteGroceryItem(groceryList.weekId, itemId),
  });

  useEffect(() => {
    setChecked((prev) => {
      const next = { ...prev };
      const ids = new Set(items.map((i) => i.id));
      for (const item of items) {
        next[item.id] = item.isChecked;
      }
      for (const key of Object.keys(next)) {
        const id = Number(key);
        if (!ids.has(id)) delete next[id];
      }
      return next;
    });
  }, [items]);

  useEffect(() => {
    setActualQty((prev) => {
      const next = { ...prev };
      for (const item of items) {
        next[item.id] = item.purchasedQuantity ?? item.plannedQuantity;
      }
      return next;
    });
  }, [items]);

  useEffect(
    () => () => {
      for (const t of Object.values(qtyDebounceRef.current)) clearTimeout(t);
    },
    [],
  );

  const activeItems = useMemo(() => items.filter((item) => !checked[item.id]), [items, checked]);
  const doneItems = useMemo(() => items.filter((item) => checked[item.id]), [items, checked]);

  const groupedActive = useMemo(() => {
    return activeItems.reduce<Record<string, GroceryListItem[]>>((acc, item) => {
      acc[item.storeSection] ??= [];
      acc[item.storeSection].push(item);
      return acc;
    }, {});
  }, [activeItems]);

  const sectionKeys = useMemo(() => Object.keys(groupedActive).sort(), [groupedActive]);

  const checkedCount = useMemo(() => items.filter((item) => checked[item.id]).length, [items, checked]);
  const allDone = items.length > 0 && checkedCount === items.length;

  const addForm = useForm<GroceryAddValues>({
    resolver: zodResolver(groceryAddSchema),
    defaultValues: { ingredientId: 0, storeSection: "Produce", plannedQuantity: 1, plannedUnit: "item" },
  });

  const nextId = useCallback(() => Math.max(0, ...items.map((i) => i.id)) + 1, [items]);

  const filteredIngredients = useMemo(() => {
    const q = ingredientQuery.trim().toLowerCase();
    if (!q) return ingredients.slice(0, 12);
    return ingredients.filter((ingredient) => ingredient.name.toLowerCase().includes(q)).slice(0, 12);
  }, [ingredientQuery, ingredients]);

  const selectedIngredientId = addForm.watch("ingredientId");
  const selectedIngredient = ingredients.find((ingredient) => ingredient.id === selectedIngredientId);

  useEffect(() => {
    if (!selectedIngredient) return;
    addForm.setValue("storeSection", selectedIngredient.storeSection as GroceryAddValues["storeSection"]);
    addForm.setValue("plannedUnit", selectedIngredient.purchaseUnit || "item");
  }, [addForm, selectedIngredient]);

  const bumpQty = useCallback((id: number, delta: number) => {
    setActualQty((prev) => {
      const row = items.find((i) => i.id === id);
      const cur = prev[id] ?? row?.purchasedQuantity ?? row?.plannedQuantity ?? 1;
      const raw = cur + delta;
      const next = Math.max(0.25, Math.round(raw * 4) / 4);
      return { ...prev, [id]: next };
    });
    const existing = qtyDebounceRef.current[id];
    if (existing) clearTimeout(existing);
    qtyDebounceRef.current[id] = setTimeout(() => {
      const nextValue = (() => {
        const row = items.find((i) => i.id === id);
        const cur = actualQty[id] ?? row?.purchasedQuantity ?? row?.plannedQuantity ?? 1;
        return Math.max(0.25, Math.round(cur * 4) / 4);
      })();

      quantityMutation.mutate(
        { itemId: id, purchasedQuantity: nextValue },
        {
          onSuccess: (updated) => {
            setLocalItems((prev) => (prev ?? groceryList.items).map((item) => (item.id === id ? { ...item, ...updated } : item)));
            setQtyStatus((s) => ({ ...s, [id]: "saved" }));
            setTimeout(() => {
              setQtyStatus((s) => ({ ...s, [id]: "idle" }));
            }, 2200);
          },
          onError: () => {
            setQtyStatus((s) => ({ ...s, [id]: "saved" }));
            setTimeout(() => {
              setQtyStatus((s) => ({ ...s, [id]: "idle" }));
            }, 2200);
          },
        },
      );
    }, 450);
  }, [actualQty, groceryList.items, items, quantityMutation]);

  const toggleItem = useCallback((id: number) => {
    const nextChecked = !checked[id];
    setChecked((current) => ({ ...current, [id]: nextChecked }));
    setDeleteRevealedId(null);

    checkMutation.mutate(
      { itemId: id, isChecked: nextChecked },
      {
        onSuccess: (updated) => {
          setLocalItems((prev) => (prev ?? groceryList.items).map((item) => (item.id === id ? { ...item, ...updated } : item)));
          pushToast(nextChecked ? `${updated.ingredientName} checked off and added to your kitchen.` : `${updated.ingredientName} moved back to your active list.`);
        },
        onError: () => {
          pushToast(nextChecked ? "Checked off in preview mode." : "Unchecked in preview mode.");
        },
      },
    );
  }, [checkMutation, checked, groceryList.items, pushToast]);

  const handleDeleteItem = (id: number) => {
    deleteMutation.mutate(id, {
      onError: () => {
        pushToast("Removed in preview mode.");
      },
    });

    setLocalItems((prev) => (prev ?? groceryList.items).filter((i) => i.id !== id));
    setChecked((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
    setActualQty((q) => {
      const next = { ...q };
      delete next[id];
      return next;
    });
    setDeleteRevealedId(null);
    pushToast("Removed from your list.");
  };

  const onAddSubmit = (values: GroceryAddValues) => {
    const ingredient = ingredients.find((entry) => entry.id === values.ingredientId);
    if (!ingredient) {
      pushToast("Choose an ingredient first.");
      return;
    }

    addItemMutation.mutate(
      {
        ingredientId: ingredient.id,
        plannedQuantity: values.plannedQuantity,
        plannedUnit: values.plannedUnit.trim(),
        storeSection: values.storeSection,
      },
      {
        onSuccess: (savedItem) => {
          setLocalItems((prev) => [...(prev ?? items), savedItem]);
          setChecked((c) => ({ ...c, [savedItem.id]: false }));
          setActualQty((q) => ({ ...q, [savedItem.id]: savedItem.plannedQuantity }));
          setAddOpen(false);
          setIngredientQuery("");
          addForm.reset({ ingredientId: 0, storeSection: "Produce", plannedQuantity: 1, plannedUnit: "item" });
          pushToast(`${savedItem.ingredientName} added to your list.`);
        },
        onError: () => {
          const newItem: GroceryListItem = {
            id: nextId(),
            groceryListId: groceryList.id,
            ingredientId: ingredient.id,
            ingredientName: ingredient.name,
            plannedQuantity: values.plannedQuantity,
            plannedUnit: values.plannedUnit.trim(),
            purchasedQuantity: null,
            storeSection: values.storeSection,
            isChecked: false,
            addedToFridge: false,
            recipeIds: [],
          };
          setLocalItems((prev) => [...(prev ?? items), newItem]);
          setChecked((c) => ({ ...c, [newItem.id]: false }));
          setActualQty((q) => ({ ...q, [newItem.id]: newItem.plannedQuantity }));
          setAddOpen(false);
          setIngredientQuery("");
          addForm.reset({ ingredientId: 0, storeSection: "Produce", plannedQuantity: 1, plannedUnit: "item" });
          pushToast(`${newItem.ingredientName} added in preview mode.`);
        },
      },
    );
  };

  return (
    <div className="space-y-5 pb-28 lg:pb-10">
      <div className="card space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl">Grocery List</h1>
            <p className="mt-2 text-sm text-nourish-muted">Check items as you shop. Checked items are added into your kitchen inventory.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="button-secondary inline-flex items-center gap-2" onClick={() => setAddOpen(true)}>
              <Plus size={18} aria-hidden />
              Add item
            </button>
            <button type="button" className="button-secondary inline-flex items-center gap-2" onClick={() => generateMutation.mutate()}>
              <RefreshCcw size={16} aria-hidden />
              Refresh list
            </button>
            <button
              type="button"
              className="button-secondary inline-flex items-center gap-2 border-dashed opacity-95"
              onClick={() =>
                pushToast("Receipt scanning isn’t available in this preview — we’ll add camera capture in a future release.")
              }
            >
              Scan receipt
              <span className="rounded-full bg-nourish-bg px-2 py-0.5 text-[10px] font-semibold tracking-wide text-nourish-muted">
                Unavailable
              </span>
            </button>
          </div>
        </div>

        <ProgressBar value={checkedCount} total={items.length} />

        {!import.meta.env.VITE_API_BASE_URL ? (
          <div className="rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/60 px-4 py-3 text-sm text-nourish-muted">
            Preview mode is on right now. Once the backend is deployed and connected, grocery changes will persist across refreshes.
          </div>
        ) : null}
      </div>

      {allDone ? (
        <div className="rounded-2xl border border-nourish-sage/40 bg-nourish-sage/10 px-5 py-4 text-center shadow-sm">
          <p className="text-lg font-semibold text-nourish-ink">You’re all set</p>
          <p className="mt-1 text-sm text-nourish-muted">Everything on this list is checked off. Nice work — enjoy the cooking.</p>
        </div>
      ) : null}

      {sectionKeys.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-lg font-semibold text-nourish-ink">No grocery list yet</p>
          <p className="mt-2 text-sm text-nourish-muted">Generate the list from your current week, or add a few manual items to get started.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button type="button" className="button-primary" onClick={() => generateMutation.mutate()}>
              Generate from this week
            </button>
            <button type="button" className="button-secondary" onClick={() => setAddOpen(true)}>
              Add an item
            </button>
          </div>
        </div>
      ) : null}

      {sectionKeys.map((section) => (
        <div key={section} className="card p-5">
          <SectionHeader icon={icons[section] ?? "🛒"} title={section} />
          <div className="mt-4 space-y-3">
            {groupedActive[section].map((item) => (
              <GroceryListItemRow
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                recipeNote={recipeNamesForItem(item, recipeNamesById)}
                sourceHint={sourceHintForItem(item)}
                actualQty={actualQty[item.id] ?? item.plannedQuantity}
                qtyStatus={qtyStatus[item.id] ?? "idle"}
                deleteRevealed={deleteRevealedId === item.id}
                onToggleChecked={() => toggleItem(item.id)}
                onQtyDelta={(delta) => bumpQty(item.id, delta)}
                onDelete={() => handleDeleteItem(item.id)}
                onRevealDelete={() => setDeleteRevealedId(item.id)}
                onHideDelete={() => setDeleteRevealedId(null)}
              />
            ))}
          </div>
        </div>
      ))}

      {doneItems.length > 0 ? (
        <details className="group card p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl py-1 font-semibold text-nourish-ink outline-none ring-nourish-sage marker:content-none focus-visible:ring-2 [&::-webkit-details-marker]:hidden">
            <span>Done ({doneItems.length})</span>
            <ChevronDown size={20} className="shrink-0 text-nourish-muted transition group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-4 space-y-3 border-t border-nourish-border pt-4">
            {doneItems.map((item) => (
              <GroceryListItemRow
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                recipeNote={recipeNamesForItem(item, recipeNamesById)}
                sourceHint={sourceHintForItem(item)}
                actualQty={actualQty[item.id] ?? item.plannedQuantity}
                qtyStatus={qtyStatus[item.id] ?? "idle"}
                deleteRevealed={deleteRevealedId === item.id}
                onToggleChecked={() => toggleItem(item.id)}
                onQtyDelta={(delta) => bumpQty(item.id, delta)}
                onDelete={() => handleDeleteItem(item.id)}
                onRevealDelete={() => setDeleteRevealedId(item.id)}
                onHideDelete={() => setDeleteRevealedId(null)}
              />
            ))}
          </div>
        </details>
      ) : null}

      <BottomSheet open={addOpen} title="Add grocery item" onClose={() => setAddOpen(false)}>
        <form className="space-y-4" onSubmit={addForm.handleSubmit(onAddSubmit)}>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Search ingredients</label>
            <input
              className="input"
              value={ingredientQuery}
              onChange={(event) => setIngredientQuery(event.target.value)}
              placeholder="Spinach, yogurt, tortillas..."
            />
            <div className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-nourish-border bg-nourish-bg/40 p-2">
              <div className="space-y-1">
                {filteredIngredients.map((ingredient) => {
                  const active = selectedIngredientId === ingredient.id;
                  return (
                    <button
                      key={ingredient.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition",
                        active ? "bg-white text-nourish-ink shadow-sm" : "text-nourish-muted hover:bg-white",
                      )}
                      onClick={() => {
                        addForm.setValue("ingredientId", ingredient.id, { shouldValidate: true });
                        setIngredientQuery(ingredient.name);
                      }}
                    >
                      <span>{ingredient.name}</span>
                      <span className="text-xs text-nourish-muted">{ingredient.storeSection}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {addForm.formState.errors.ingredientId ? <p className="mt-1 text-xs text-red-600">{addForm.formState.errors.ingredientId.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Store section</label>
              <select className="input" {...addForm.register("storeSection")}>
                {sectionOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Quantity</label>
              <input className="input" type="number" step="0.25" {...addForm.register("plannedQuantity", { valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Unit</label>
            <input className="input" placeholder="bag, lb, bottle..." {...addForm.register("plannedUnit")} />
            {addForm.formState.errors.plannedUnit ? <p className="mt-1 text-xs text-red-600">{addForm.formState.errors.plannedUnit.message}</p> : null}
          </div>

          <button className="button-primary w-full" type="submit">
            Add to list
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
