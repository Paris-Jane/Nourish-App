import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BottomSheet } from "components/BottomSheet";
import { ExpiryDot } from "components/ExpiryDot";
import { RecipeCard } from "components/RecipeCard";
import { useFridgeItems, useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { daysUntil } from "lib/utils";
import { fridgeItemSchema, type FridgeItemFormValues } from "types/forms";

const tabs = ["Fridge", "Pantry", "Freezer"] as const;

export function FridgePage() {
  const { items } = useFridgeItems();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Fridge");
  const [addOpen, setAddOpen] = useState(false);
  const [whatCanIMakeOpen, setWhatCanIMakeOpen] = useState(false);
  const form = useForm<FridgeItemFormValues>({
    resolver: zodResolver(fridgeItemSchema),
    defaultValues: { ingredientId: 1, quantity: 1, unit: "item", location: "Fridge" },
  });

  const filteredItems = useMemo(() => items.filter((item) => item.location === tab), [items, tab]);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl">Your Kitchen</h1>
            <p className="text-sm text-nourish-muted">See what’s ready to use before anything goes to waste.</p>
          </div>
          <button className="rounded-2xl bg-nourish-terracotta px-5 py-3 text-sm font-medium text-white" onClick={() => setWhatCanIMakeOpen(true)}>
            What can I make?
          </button>
        </div>
        <div className="mb-5 grid grid-cols-3 rounded-2xl bg-nourish-bg p-1">
          {tabs.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              className={`rounded-2xl px-3 py-3 text-sm ${tab === entry ? "bg-white text-nourish-ink shadow-sm" : "text-nourish-muted"}`}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const remaining = daysUntil(item.expiresAt);
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-4 ${remaining !== null && remaining < 3 ? "border-[#f5deaf] bg-[#fff7e8]" : "border-nourish-border bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <ExpiryDot expiresAt={item.expiresAt} />
                  <div>
                    <p>{item.ingredientName}</p>
                    <p className="text-sm text-nourish-muted">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-nourish-muted">
                  {remaining === null ? "No expiry set" : remaining < 1 ? "Use now" : `${remaining} days left`}
                </span>
              </div>
            );
          })}
        </div>

        <button className="button-secondary mt-5 w-full lg:w-auto" onClick={() => setAddOpen(true)}>
          Add item
        </button>
      </div>

      <BottomSheet open={addOpen} title="Add item" onClose={() => setAddOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit(() => {
            setAddOpen(false);
            pushToast("Inline fridge adding is styled and ready for the real mutation.");
          })}
        >
          <select className="input" {...form.register("ingredientId", { valueAsNumber: true })}>
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>
          <input className="input" type="number" step="0.1" {...form.register("quantity", { valueAsNumber: true })} />
          <input className="input" placeholder="Unit" {...form.register("unit")} />
          <select className="input" {...form.register("location")}>
            {tabs.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <input className="input" type="date" {...form.register("expiresAt")} />
          <button className="button-primary w-full" type="submit">
            Save item
          </button>
        </form>
      </BottomSheet>

      <BottomSheet open={whatCanIMakeOpen} title="What can I make?" onClose={() => setWhatCanIMakeOpen(false)}>
        <div className="grid grid-cols-2 gap-3">
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
