import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createRecipe, updateRecipe } from "api/recipes";
import { useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { estimateFoodGroupServings } from "lib/foodGroupMath";
import { recipeFormSchema, type RecipeFormValues } from "types/forms";
import type { MealType, Recipe } from "types/models";

const mealTypeOptions: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
const prepCategoryOptions = [
  { value: "WashChop", label: "Wash & chop" },
  { value: "MixSauce", label: "Mix sauces / bases" },
  { value: "CookStarch", label: "Cook grains / starches" },
  { value: "CookProtein", label: "Cook proteins" },
  { value: "RoastBake", label: "Roast / bake" },
  { value: "AssemblePortion", label: "Assemble / portion" },
  { value: "FreshFinish", label: "Fresh finish" },
] as const;

export function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [rawRecipeText, setRawRecipeText] = useState("");
  const existing = recipes.find((recipe) => String(recipe.id) === id);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: existing?.name ?? "",
      cuisine: existing?.cuisine ?? "",
      scalabilityTag: existing?.scalabilityTag ?? "Flexible",
      timeTag: existing?.timeTag ?? "Quick",
      prepStyleTag: existing?.prepStyleTag ?? "BatchFriendly",
      isFreezerFriendly: existing?.isFreezerFriendly ?? false,
      isCookFreshOnly: existing?.isCookFreshOnly ?? false,
      baseYieldServings: existing?.baseYieldServings ?? 4,
      mealTypeTags: existing?.mealTypeTags ?? ["Dinner"],
      ingredients:
        existing?.ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          isOptional: ingredient.isOptional,
          isModifier: ingredient.isModifier,
        })) ?? [{ ingredientId: ingredients[0]?.id ?? 1, quantity: 1, unit: "cup", isOptional: false, isModifier: false }],
      steps:
        existing?.steps.map((step) => ({
          instruction: step.instruction,
          timingTag: step.timingTag,
          durationMinutes: step.durationMinutes,
          prepCategory: step.prepCategory ?? "AssemblePortion",
          linkedIngredientIds: step.linkedIngredientIds ?? [],
          scaleByLinkedIngredients: step.scaleByLinkedIngredients ?? false,
        })) ?? [{ instruction: "", timingTag: "PrepAhead", durationMinutes: 10, prepCategory: "AssemblePortion", linkedIngredientIds: [], scaleByLinkedIngredients: false }],
    },
  });

  const ingredientFields = useFieldArray({ control: form.control, name: "ingredients" });
  const stepFields = useFieldArray({ control: form.control, name: "steps" });

  const fallbackFoodGroupServings = useMemo(
    () =>
      existing?.foodGroupServings &&
      Object.keys(existing.foodGroupServings).length > 0
        ? existing.foodGroupServings
        : undefined,
    [existing],
  );

  const saveRecipeMutation = useMutation({
    mutationFn: async (values: RecipeFormValues) => {
      const payload = {
        name: values.name,
        cuisine: values.cuisine,
        scalabilityTag: values.scalabilityTag,
        timeTag: values.timeTag,
        prepStyleTag: values.prepStyleTag,
        isFreezerFriendly: values.isFreezerFriendly,
        isCookFreshOnly: values.isCookFreshOnly,
        baseYieldServings: values.baseYieldServings,
        mealTypeTags: values.mealTypeTags,
        foodGroupServings:
          Object.keys(estimateFoodGroupServings(values, ingredients)).length > 0
            ? estimateFoodGroupServings(values, ingredients)
            : fallbackFoodGroupServings ?? {},
        ingredients: values.ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          isOptional: ingredient.isOptional,
          isModifier: ingredient.isModifier,
        })),
        steps: values.steps.map((step, index) => ({
          stepNumber: index + 1,
          instruction: step.instruction,
          timingTag: step.timingTag,
          durationMinutes: step.durationMinutes,
          isPassive: step.timingTag === "PrepAhead" || step.timingTag === "DayOfPassive",
          prepCategory: step.prepCategory,
          linkedIngredientIds: step.linkedIngredientIds,
          scaleByLinkedIngredients: step.scaleByLinkedIngredients,
        })),
      };

      if (existing) {
        return updateRecipe(String(existing.id), payload);
      }

      return createRecipe(payload);
    },
    onSuccess: (savedRecipe, values) => {
      queryClient.setQueryData<Recipe[]>(["recipes"], (current) => {
        const next = current ? [...current] : [...recipes];
        const index = next.findIndex((recipe) => recipe.id === savedRecipe.id);
        if (index >= 0) next[index] = savedRecipe;
        else next.unshift(savedRecipe);
        return next;
      });

      pushToast(existing ? "Recipe updated." : "Recipe created.");
      navigate(`/recipes/${savedRecipe.id}`);
    },
    onError: (_error, values) => {
      const tempId = existing?.id ?? Math.max(0, ...recipes.map((recipe) => recipe.id)) + 1;
      const optimisticRecipe: Recipe = {
        id: tempId,
        householdId: existing?.householdId ?? 1,
        name: values.name,
        cuisine: values.cuisine,
        scalabilityTag: values.scalabilityTag,
        timeTag: values.timeTag,
        prepStyleTag: values.prepStyleTag,
        isFreezerFriendly: values.isFreezerFriendly,
        isCookFreshOnly: values.isCookFreshOnly,
        baseYieldServings: values.baseYieldServings,
        mealTypeTags: values.mealTypeTags,
        imageUrl: existing?.imageUrl ?? null,
        sourceUrl: existing?.sourceUrl ?? null,
        foodGroupServings:
          Object.keys(estimateFoodGroupServings(values, ingredients)).length > 0
            ? estimateFoodGroupServings(values, ingredients)
            : fallbackFoodGroupServings ?? {},
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        ingredients: values.ingredients.map((ingredient, index) => {
          const ingredientMeta = ingredients.find((item) => item.id === ingredient.ingredientId);
          return {
            id: existing?.ingredients[index]?.id ?? tempId * 100 + index + 1,
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredientMeta?.name ?? "Unknown ingredient",
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            isModifier: ingredient.isModifier,
            isOptional: ingredient.isOptional,
            substituteIngredientIds: [],
            notes: null,
          };
        }),
        steps: values.steps.map((step, index) => ({
          id: existing?.steps[index]?.id ?? tempId * 1000 + index + 1,
          stepNumber: index + 1,
          instruction: step.instruction,
          timingTag: step.timingTag,
          durationMinutes: step.durationMinutes,
          isPassive: step.timingTag === "PrepAhead" || step.timingTag === "DayOfPassive",
          prepCategory: step.prepCategory,
          linkedIngredientIds: step.linkedIngredientIds,
          scaleByLinkedIngredients: step.scaleByLinkedIngredients,
        })),
      };

      queryClient.setQueryData<Recipe[]>(["recipes"], (current) => {
        const next = current ? [...current] : [...recipes];
        const index = next.findIndex((recipe) => recipe.id === optimisticRecipe.id);
        if (index >= 0) next[index] = optimisticRecipe;
        else next.unshift(optimisticRecipe);
        return next;
      });

      pushToast(existing ? "Recipe updated in preview mode." : "Recipe created in preview mode.");
      navigate(`/recipes/${optimisticRecipe.id}`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl">{existing ? "Edit Recipe" : "Add Recipe"}</h1>
        <p className="text-sm text-nourish-muted">Build household recipes in the same warm language as the rest of the app.</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => saveRecipeMutation.mutate(values))}
      >
        <div className="card p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <input className="input" placeholder="Recipe name" {...form.register("name")} />
            <input className="input" placeholder="Cuisine" {...form.register("cuisine")} />
            <select className="input" {...form.register("scalabilityTag")}>
              <option value="Flexible">Flexible</option>
              <option value="Rigid">Rigid</option>
              <option value="Portioned">Portioned</option>
            </select>
            <select className="input" {...form.register("timeTag")}>
              <option value="Quick">Quick</option>
              <option value="Medium">Medium</option>
              <option value="Involved">Involved</option>
            </select>
            <select className="input" {...form.register("prepStyleTag")}>
              <option value="BatchFriendly">Batch-friendly</option>
              <option value="CookFresh">Cook fresh</option>
              <option value="FreezerFriendly">Freezer-friendly</option>
            </select>
            <input className="input" type="number" {...form.register("baseYieldServings", { valueAsNumber: true })} />
          </div>
          <div className="mt-4">
            <p className="mb-3 text-sm text-nourish-muted">Best fit meal types</p>
            <div className="flex flex-wrap gap-2">
              {mealTypeOptions.map((mealType) => {
                const selected = form.watch("mealTypeTags").includes(mealType);
                return (
                  <button
                    key={mealType}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm transition ${selected ? "bg-nourish-sage text-white" : "border border-nourish-border bg-white text-nourish-muted"}`}
                    onClick={() => {
                      const current = form.getValues("mealTypeTags");
                      const next = current.includes(mealType)
                        ? current.filter((entry) => entry !== mealType)
                        : [...current, mealType];
                      form.setValue("mealTypeTags", next, { shouldValidate: true, shouldDirty: true });
                    }}
                  >
                    {mealType}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-nourish-muted">
              These guide recommendations for breakfast, lunch, dinner, and snack slots without locking the recipe to one use.
            </p>
          </div>
          <div className="mt-4 flex gap-6 text-sm text-nourish-muted">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("isFreezerFriendly")} />
              Freezer friendly
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("isCookFreshOnly")} />
              Cook fresh only
            </label>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl">Ingredients</h2>
            <button
              type="button"
              className="button-secondary"
              onClick={() => ingredientFields.append({ ingredientId: ingredients[0]?.id ?? 1, quantity: 1, unit: "cup", isOptional: false, isModifier: false })}
            >
              Add ingredient
            </button>
          </div>
          <div className="space-y-3">
            {ingredientFields.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-2xl bg-nourish-bg p-4 lg:grid-cols-4">
                <select className="input" {...form.register(`ingredients.${index}.ingredientId`, { valueAsNumber: true })}>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
                </select>
                <input className="input" type="number" step="0.1" {...form.register(`ingredients.${index}.quantity`, { valueAsNumber: true })} />
                <input className="input" placeholder="Unit" {...form.register(`ingredients.${index}.unit`)} />
                <div className="flex items-center gap-4 text-sm text-nourish-muted">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...form.register(`ingredients.${index}.isOptional`)} />
                    Optional
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...form.register(`ingredients.${index}.isModifier`)} />
                    Modifier
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl">Steps</h2>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                stepFields.append({
                  instruction: "",
                  timingTag: "DayOfActive",
                  durationMinutes: 10,
                  prepCategory: "AssemblePortion",
                  linkedIngredientIds: [],
                  scaleByLinkedIngredients: false,
                })
              }
            >
              Add step
            </button>
          </div>
          <div className="space-y-3">
            {stepFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-2xl bg-nourish-bg p-4">
                <textarea className="input min-h-24" placeholder="Instruction" {...form.register(`steps.${index}.instruction`)} />
                <div className="mt-3 grid gap-3 lg:grid-cols-3">
                  <select className="input" {...form.register(`steps.${index}.timingTag`)}>
                    <option value="PrepAhead">Prep-ahead</option>
                    <option value="DayOfActive">Day-of active</option>
                    <option value="DayOfPassive">Day-of passive</option>
                  </select>
                  <select className="input" {...form.register(`steps.${index}.prepCategory`)}>
                    {prepCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input className="input" type="number" {...form.register(`steps.${index}.durationMinutes`, { valueAsNumber: true })} />
                </div>
                <div className="mt-3 rounded-2xl border border-nourish-border/70 bg-white p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Linked ingredients</p>
                  <p className="mt-1 text-xs text-nourish-muted">
                    Link this step to the ingredients it prepares. If it uses a modifier ingredient, it will only show in the weekly prep plan when that modifier is selected.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.watch("ingredients").map((ingredient, ingredientIndex) => {
                      const ingredientMeta = ingredients.find((item) => item.id === ingredient.ingredientId);
                      const currentLinks = form.watch(`steps.${index}.linkedIngredientIds`) ?? [];
                      const linked = currentLinks.includes(ingredient.ingredientId);
                      return (
                        <button
                          key={`${field.id}-${ingredient.ingredientId}-${ingredientIndex}`}
                          type="button"
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            linked
                              ? "bg-nourish-sage text-white"
                              : "border border-nourish-border bg-white text-nourish-muted"
                          }`}
                          onClick={() => {
                            const next = linked
                              ? currentLinks.filter((id) => id !== ingredient.ingredientId)
                              : [...currentLinks, ingredient.ingredientId];
                            form.setValue(`steps.${index}.linkedIngredientIds`, next, { shouldDirty: true, shouldValidate: true });
                          }}
                        >
                          {ingredientMeta?.name ?? `Ingredient ${ingredientIndex + 1}`}
                          {ingredient.isModifier || ingredient.isOptional ? " (modifier)" : ""}
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm text-nourish-muted">
                    <input type="checkbox" {...form.register(`steps.${index}.scaleByLinkedIngredients`)} />
                    Scale this step using the linked ingredient quantities for the whole week
                  </label>
                  <p className="mt-2 text-xs text-nourish-muted">
                    Tip: for combined prep, write instructions like <span className="font-medium text-nourish-ink">“Boil {'{quantity}'} {'{ingredient}'}”</span> or <span className="font-medium text-nourish-ink">“Chop {'{ingredients}'}”</span>.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-3xl">AI assist</h2>
          <textarea
            className="input min-h-32"
            value={rawRecipeText}
            onChange={(event) => setRawRecipeText(event.target.value)}
            placeholder="Paste raw recipe text here for future analysis."
          />
          <button type="button" className="button-secondary mt-4" onClick={() => pushToast("The frontend hook is ready. The backend analyze endpoint just doesn’t exist yet.")}>
            AI assist
          </button>
        </div>

        <button className="button-primary w-full" type="submit" disabled={saveRecipeMutation.isPending}>
          {saveRecipeMutation.isPending ? "Saving..." : "Save recipe"}
        </button>
      </form>
    </div>
  );
}
