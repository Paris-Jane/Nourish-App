import { TagPill } from "./TagPill";
import type { RecipeStep } from "types/models";

function formatPrepCategory(category?: RecipeStep["prepCategory"]) {
  switch (category) {
    case "WashChop":
      return "Wash & chop";
    case "MixSauce":
      return "Mix sauce";
    case "CookStarch":
      return "Cook starch";
    case "CookProtein":
      return "Cook protein";
    case "RoastBake":
      return "Roast / bake";
    case "AssemblePortion":
      return "Assemble";
    case "FreshFinish":
      return "Fresh finish";
    default:
      return null;
  }
}

export function StepList({ steps }: { steps: RecipeStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <div key={step.id} className="rounded-2xl border border-nourish-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-nourish-ink">Step {step.stepNumber}</span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {formatPrepCategory(step.prepCategory) ? <TagPill>{formatPrepCategory(step.prepCategory)}</TagPill> : null}
              {step.timingTag !== "PrepAhead" ? <TagPill tone="accent">{step.timingTag}</TagPill> : null}
            </div>
          </div>
          <p className="text-sm leading-6 text-nourish-ink">{step.instruction}</p>
          <p className="mt-2 text-xs text-nourish-muted">{step.durationMinutes} min</p>
        </div>
      ))}
    </div>
  );
}
