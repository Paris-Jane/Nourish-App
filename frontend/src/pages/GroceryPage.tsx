import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BottomSheet } from "components/BottomSheet";
import { GroceryListItemRow } from "components/GroceryListItemRow";
import { ProgressBar } from "components/ProgressBar";
import { SectionHeader } from "components/SectionHeader";
import { useGroceryList, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
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
  ingredientName: z.string().min(1, "Name is required"),
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

export function GroceryPage() {
  const { groceryList } = useGroceryList();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [localItems, setLocalItems] = useState<GroceryListItem[] | null>(null);
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

  useEffect(() => {
    setChecked((prev) => {
      const next = { ...prev };
      const ids = new Set(items.map((i) => i.id));
      for (const item of items) {
        if (next[item.id] === undefined) next[item.id] = item.isChecked;
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
        if (next[item.id] === undefined) next[item.id] = item.purchasedQuantity ?? item.plannedQuantity;
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
      setQtyStatus((s) => ({ ...s, [id]: "saved" }));
      setTimeout(() => {
        setQtyStatus((s) => ({ ...s, [id]: "idle" }));
      }, 2200);
    }, 450);
  }, [items]);

  const toggleItem = useCallback((id: number) => {
    setChecked((current) => {
      const next = !current[id];
      return { ...current, [id]: next };
    });
    setDeleteRevealedId(null);
  }, []);

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
    defaultValues: { ingredientName: "", storeSection: "Produce", plannedQuantity: 1, plannedUnit: "item" },
  });

  const nextId = useCallback(() => Math.max(0, ...items.map((i) => i.id)) + 1, [items]);

  const handleDeleteItem = (id: number) => {
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
    const newItem: GroceryListItem = {
      id: nextId(),
      groceryListId: groceryList.id,
      ingredientId: 0,
      ingredientName: values.ingredientName.trim(),
      plannedQuantity: values.plannedQuantity,
      plannedUnit: values.plannedUnit.trim(),
      purchasedQuantity: null,
      storeSection: values.storeSection,
      isChecked: false,
      addedToFridge: false,
      recipeIds: [],
    };
    setLocalItems((prev) => [...(prev ?? groceryList.items), newItem]);
    setChecked((c) => ({ ...c, [newItem.id]: false }));
    setActualQty((q) => ({ ...q, [newItem.id]: newItem.plannedQuantity }));
    setAddOpen(false);
    addForm.reset({ ingredientName: "", storeSection: "Produce", plannedQuantity: 1, plannedUnit: "item" });
    pushToast(`${newItem.ingredientName} added to ${values.storeSection}.`);
  };

  return (
    <div className="space-y-6 pb-36 lg:pb-10">
      <div className="card p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl">Grocery List</h1>
            <p className="text-sm text-nourish-muted">A calm little sweep through the store.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="button-secondary inline-flex items-center gap-2" onClick={() => setAddOpen(true)}>
              <Plus size={18} aria-hidden />
              Add item
            </button>
            <button
              type="button"
              className="button-secondary inline-flex items-center gap-2 border-dashed opacity-95"
              onClick={() =>
                pushToast("Receipt scanning isn’t available in this preview — we’ll add camera capture in a future release.")
              }
            >
              Scan receipt
              <span className="rounded-full bg-nourish-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-nourish-muted">
                Unavailable
              </span>
            </button>
          </div>
        </div>
        <ProgressBar value={checkedCount} total={items.length} />
      </div>

      {allDone ? (
        <div className="rounded-2xl border border-nourish-sage/40 bg-nourish-sage/10 px-5 py-4 text-center shadow-sm">
          <p className="text-lg font-semibold text-nourish-ink">You’re all set</p>
          <p className="mt-1 text-sm text-nourish-muted">Everything on this list is checked off. Nice work — enjoy the cooking.</p>
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
        <form className="space-y-3" onSubmit={addForm.handleSubmit(onAddSubmit)}>
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Name</label>
          <input className="input" placeholder="e.g. Olive oil" {...addForm.register("ingredientName")} />
          {addForm.formState.errors.ingredientName ? (
            <p className="text-xs text-red-600">{addForm.formState.errors.ingredientName.message}</p>
          ) : null}
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Store section</label>
          <select className="input" {...addForm.register("storeSection")}>
            {sectionOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Quantity</label>
          <input className="input" type="number" step="0.25" {...addForm.register("plannedQuantity", { valueAsNumber: true })} />
          <label className="block text-xs font-medium uppercase tracking-wide text-nourish-muted">Unit</label>
          <input className="input" placeholder="e.g. bottle, lb" {...addForm.register("plannedUnit")} />
          {addForm.formState.errors.plannedUnit ? (
            <p className="text-xs text-red-600">{addForm.formState.errors.plannedUnit.message}</p>
          ) : null}
          <button className="button-primary w-full" type="submit">
            Add to list
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
