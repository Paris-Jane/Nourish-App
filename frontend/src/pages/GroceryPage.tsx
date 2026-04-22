import { useState } from "react";
import { ProgressBar } from "components/ProgressBar";
import { SectionHeader } from "components/SectionHeader";
import { useGroceryList } from "hooks/useAppData";
import { useToast } from "hooks/useToast";

const icons: Record<string, string> = {
  Produce: "🥦",
  Protein: "🥩",
  Dairy: "🥛",
  Grains: "🌾",
  Pantry: "🫙",
  Frozen: "🧊",
};

export function GroceryPage() {
  const { groceryList } = useGroceryList();
  const { pushToast } = useToast();
  const [checked, setChecked] = useState<Record<number, boolean>>(
    Object.fromEntries(groceryList.items.map((item) => [item.id, item.isChecked])),
  );

  const grouped = groceryList.items.reduce<Record<string, typeof groceryList.items>>((acc, item) => {
    const key = checked[item.id] ? "Done" : item.storeSection;
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl">Grocery List</h1>
            <p className="text-sm text-nourish-muted">A calm little sweep through the store.</p>
          </div>
          <button className="button-secondary" onClick={() => pushToast("Receipt scanning is coming soon.")}>
            Scan receipt
          </button>
        </div>
        <ProgressBar value={checkedCount} total={groceryList.items.length} />
      </div>

      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="card p-5">
          <SectionHeader icon={icons[section] ?? "✓"} title={section} />
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#fcfaf7] px-4 py-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checked[item.id] ?? false}
                    onChange={(event) => {
                      setChecked((current) => ({ ...current, [item.id]: event.target.checked }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-nourish-border text-nourish-sage focus:ring-nourish-sage"
                  />
                  <div className="flex-1">
                    <p className={`transition ${checked[item.id] ? "text-nourish-muted line-through" : "text-nourish-ink"}`}>
                      {item.ingredientName}
                    </p>
                    <p className="text-sm text-nourish-muted">
                      {item.plannedQuantity} {item.plannedUnit}
                    </p>
                    {checked[item.id] && (
                      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-3 py-2 text-sm">
                        <span className="text-nourish-muted">Got it. How many?</span>
                        <button className="button-secondary h-8 w-8 p-0">-</button>
                        <span>2</span>
                        <button className="button-secondary h-8 w-8 p-0">+</button>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
