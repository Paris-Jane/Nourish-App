import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "components/PageHeader";
import { analyzeRecipe, createRecipe, deleteRecipe, type RecipeAnalysisResult, updateRecipe } from "api/recipes";
import { useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { estimateFoodGroupServings } from "lib/foodGroupMath";
import { useAuthStore } from "store/authStore";
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

function extractApiErrorDetail(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  for (const key of ["detail", "Detail", "message", "Message", "title", "Title"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  const errors = record.errors;
  if (errors && typeof errors === "object") {
    const messages = Object.values(errors as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}

export function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const user = useAuthStore((state) => state.user);
  const { pushToast } = useToast();
  const [rawRecipeText, setRawRecipeText] = useState("");
  const [analysisPreview, setAnalysisPreview] = useState<RecipeAnalysisResult | null>(null);
  const existing = recipes.find((recipe) => String(recipe.id) === id);
  const canDeleteRecipe = user?.email?.toLowerCase() === "pariward@icloud.com";

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
          isOptional: ingredient.isOptional || ingredient.isModifier,
          isModifier: ingredient.isModifier || ingredient.isOptional,
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
        ingredients: values.ingredients.map((ingredient) => {
          const isAddOn = ingredient.isOptional || ingredient.isModifier;
          return {
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            isOptional: isAddOn,
            isModifier: isAddOn,
          };
        }),
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
            isModifier: ingredient.isModifier || ingredient.isOptional,
            isOptional: ingredient.isOptional || ingredient.isModifier,
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

  const analyzeRecipeMutation = useMutation({
    mutationFn: (rawText: string) => analyzeRecipe(rawText),
    onSuccess: (result) => {
      if (result.createdIngredients.length > 0) {
        queryClient.setQueryData(["ingredients"], (current: unknown) => {
          const existingIngredients = Array.isArray(current) ? (current as typeof ingredients) : ingredients;
          const existingIds = new Set(existingIngredients.map((ingredient) => ingredient.id));
          const merged = [...existingIngredients];
          result.createdIngredients.forEach((ingredient) => {
            if (!existingIds.has(ingredient.id)) merged.push(ingredient);
          });
          return merged;
        });
      }
      setAnalysisPreview(result);
      pushToast("AI draft ready for review.");
    },
    onError: (error) => {
      pushToast(extractApiErrorDetail(error, "AI could not format that recipe yet."));
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(String(existing!.id)),
    onSuccess: async () => {
      queryClient.setQueryData<Recipe[]>(["recipes"], (current) => current?.filter((recipe) => recipe.id !== existing?.id) ?? current);
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      pushToast("Recipe deleted.");
      navigate("/recipes");
    },
    onError: () => {
      pushToast("Could not delete this recipe.");
    },
  });

  function applyAnalysisDraft(result: RecipeAnalysisResult) {
    const draftValues: RecipeFormValues = {
      name: result.draft.name,
      cuisine: result.draft.cuisine || "Household favorite",
      scalabilityTag: result.draft.scalabilityTag,
      timeTag: result.draft.timeTag,
      prepStyleTag: result.draft.prepStyleTag,
      isFreezerFriendly: result.draft.isFreezerFriendly,
      isCookFreshOnly: result.draft.isCookFreshOnly,
      baseYieldServings: result.draft.baseYieldServings,
      mealTypeTags: result.draft.mealTypeTags,
      ingredients: result.draft.ingredients.map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        isOptional: ingredient.isOptional ?? false,
        isModifier: ingredient.isModifier ?? false,
      })),
      steps: result.draft.steps.map((step) => ({
        instruction: step.instruction,
        timingTag: step.timingTag,
        durationMinutes: step.durationMinutes,
        prepCategory: step.prepCategory ?? "AssemblePortion",
        linkedIngredientIds: step.linkedIngredientIds ?? [],
        scaleByLinkedIngredients: step.scaleByLinkedIngredients ?? false,
      })),
    };

    form.reset(draftValues);
    ingredientFields.replace(draftValues.ingredients);
    stepFields.replace(draftValues.steps);
    setAnalysisPreview(null);
    pushToast("AI draft added to the recipe form.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-3">
        <Link
          to={existing ? `/recipes/${existing.id}` : "/recipes"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-nourish-muted transition hover:text-nourish-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          {existing ? "Back to recipe" : "Back to recipes"}
        </Link>
        <PageHeader
          title={existing ? "Edit Recipe" : "Add Recipe"}
          subtitle="Build household recipes in the same warm language as the rest of the app."
        />
      </div>

      {!existing ? (
        <section className="card overflow-hidden p-0">
          <div className="border-b border-nourish-border bg-[#f7f2ec] px-6 py-5">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-nourish-muted">
              <span className="rounded-full bg-white px-3 py-1 text-nourish-sage">1. Add source</span>
              <span className="rounded-full bg-white px-3 py-1">2. Review AI draft</span>
              <span className="rounded-full bg-white px-3 py-1">3. Edit & save</span>
            </div>
            <h2 className="mt-4 text-3xl text-nourish-ink">Format with AI</h2>
            <p className="mt-2 max-w-2xl text-sm text-nourish-muted">
              Paste a recipe, describe what you want, or include a recipe link. AI will turn it into a structured draft, then you can review and edit everything before saving.
            </p>
          </div>
          <div className="space-y-4 p-6">
            <textarea
              className="input min-h-36"
              value={rawRecipeText}
              onChange={(event) => setRawRecipeText(event.target.value)}
              placeholder="Example: a link, pasted recipe text, or 'make a high-protein avocado toast with optional ham and basil...'"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-nourish-muted">Nothing saves yet. This only creates a draft for you to inspect.</p>
              <button
                type="button"
                className="button-secondary inline-flex items-center justify-center gap-2"
                onClick={() => analyzeRecipeMutation.mutate(rawRecipeText)}
                disabled={analyzeRecipeMutation.isPending || rawRecipeText.trim().length < 10}
              >
                <Sparkles size={16} aria-hidden />
                {analyzeRecipeMutation.isPending ? "Formatting..." : "Create AI draft"}
              </button>
            </div>

          {analysisPreview ? (
            <div className="rounded-2xl border border-nourish-border bg-nourish-bg/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Preview before editing</p>
                  <h3 className="mt-1 text-2xl text-nourish-ink">{analysisPreview.draft.name}</h3>
                  <p className="mt-1 text-sm text-nourish-muted">
                    {analysisPreview.draft.cuisine} · {analysisPreview.draft.timeTag} · yields {analysisPreview.draft.baseYieldServings}
                  </p>
                </div>
                <button type="button" className="button-primary" onClick={() => applyAnalysisDraft(analysisPreview)}>
                  Edit this draft
                </button>
              </div>

              {analysisPreview.warnings.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-950">AI assumptions to check</p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-900">
                    {analysisPreview.warnings.map((warning) => (
                      <li key={warning}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {analysisPreview.createdIngredients.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-nourish-border bg-white p-3">
                  <p className="text-sm font-medium text-nourish-ink">New ingredients added for this draft</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysisPreview.createdIngredients.map((ingredient) => (
                      <span key={ingredient.id} className="rounded-full bg-nourish-sage/10 px-3 py-1 text-xs font-medium text-nourish-sage">
                        {ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-nourish-border bg-white p-4">
                  <p className="text-sm font-medium text-nourish-ink">Ingredients</p>
                  <ul className="mt-2 space-y-2 text-sm text-nourish-muted">
                    {analysisPreview.draft.ingredients.map((ingredient, index) => {
                      const ingredientMeta = [...ingredients, ...analysisPreview.createdIngredients].find((entry) => entry.id === ingredient.ingredientId);
                      return (
                        <li key={`${ingredient.ingredientId}-${index}`}>
                          <span className="font-medium text-nourish-ink">{ingredientMeta?.name ?? `Ingredient ${index + 1}`}</span>
                          <span> · {ingredient.quantity} {ingredient.unit}</span>
                          {ingredient.isModifier || ingredient.isOptional ? (
                            <span className="ml-2 rounded-full bg-nourish-terracotta/10 px-2 py-0.5 text-[11px] font-medium text-nourish-terracotta">
                              add-on
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="rounded-2xl border border-nourish-border bg-white p-4">
                  <p className="text-sm font-medium text-nourish-ink">Steps</p>
                  <ol className="mt-2 space-y-2 text-sm text-nourish-muted">
                    {analysisPreview.draft.steps.map((step) => (
                      <li key={step.stepNumber}>
                        <span className="font-medium text-nourish-ink">Step {step.stepNumber}</span>
                        <p className="mt-1">{step.instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ) : null}
          </div>
        </section>
      ) : null}

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
                    <input
                      type="checkbox"
                      checked={form.watch(`ingredients.${index}.isOptional`) || form.watch(`ingredients.${index}.isModifier`)}
                      onChange={(event) => {
                        form.setValue(`ingredients.${index}.isOptional`, event.target.checked, { shouldDirty: true, shouldValidate: true });
                        form.setValue(`ingredients.${index}.isModifier`, event.target.checked, { shouldDirty: true, shouldValidate: true });
                      }}
                    />
                    Optional add-on
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

        <button className="button-primary w-full" type="submit" disabled={saveRecipeMutation.isPending}>
          {saveRecipeMutation.isPending ? "Saving..." : "Save recipe"}
        </button>
      </form>

      {existing && canDeleteRecipe ? (
        <div className="card border-red-100 bg-red-50/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl text-red-950">Delete recipe</h2>
              <p className="mt-1 text-sm text-red-800">This removes the recipe from this household.</p>
            </div>
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={deleteRecipeMutation.isPending}
              onClick={() => {
                if (!window.confirm(`Delete "${existing.name}"? This cannot be undone.`)) return;
                deleteRecipeMutation.mutate();
              }}
            >
              <Trash2 size={16} />
              {deleteRecipeMutation.isPending ? "Deleting..." : "Delete recipe"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
