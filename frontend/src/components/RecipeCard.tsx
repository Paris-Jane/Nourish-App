import { Heart, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { TagPill } from "./TagPill";
import { cn } from "lib/utils";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import type { Recipe } from "types/models";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export function RecipeCard({ recipe, compact }: RecipeCardProps) {
  const favorited = useRecipePrefsStore((s) => s.isFavorite(recipe.id));

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="card group block overflow-hidden p-3 transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="mb-3 h-16 rounded-2xl bg-gradient-to-br from-nourish-sage/20 via-[#f8efe7] to-nourish-terracotta/20 sm:h-20" />
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg leading-tight text-nourish-ink">{recipe.name}</h3>
        {!compact && (
          <div className="flex gap-2 text-nourish-muted" aria-hidden>
            <Heart size={16} className={cn(favorited && "fill-nourish-terracotta text-nourish-terracotta")} />
            <ThumbsDown size={16} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <TagPill tone="warm">{recipe.cuisine}</TagPill>
        <TagPill tone="accent">{recipe.timeTag}</TagPill>
      </div>
    </Link>
  );
}
