import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "lib/utils";
import type { Recipe } from "types/models";

interface WhatCanIMakeRecipeCardProps {
  recipe: Recipe;
  matchedIngredientNames: string[];
}

export function WhatCanIMakeRecipeCard({ recipe, matchedIngredientNames }: WhatCanIMakeRecipeCardProps) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className={cn(
        "flex gap-3 rounded-2xl border border-nourish-border bg-white p-2.5 pr-3 text-left shadow-sm transition",
        "hover:border-nourish-sage/40 hover:shadow-md active:scale-[0.99]",
      )}
    >
      <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-nourish-sage/20 via-[#f8efe7] to-nourish-terracotta/20" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          <ChefHat size={14} className="mt-0.5 shrink-0 text-nourish-sage" aria-hidden />
          <p className="text-sm font-semibold leading-snug text-nourish-ink">{recipe.name}</p>
        </div>
        {matchedIngredientNames.length > 0 ? (
          <p className="mt-1 text-xs leading-relaxed text-nourish-muted">
            <span className="font-medium text-nourish-ink/80">Uses from your kitchen: </span>
            {matchedIngredientNames.join(", ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
