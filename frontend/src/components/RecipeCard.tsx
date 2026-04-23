import { Heart, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { TagPill } from "./TagPill";
import { cn } from "lib/utils";
import { useToast } from "hooks/useToast";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import type { Recipe } from "types/models";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export function RecipeCard({ recipe, compact }: RecipeCardProps) {
  const { pushToast } = useToast();
  const favorited = useRecipePrefsStore((s) => s.isFavorite(recipe.id));
  const disliked = useRecipePrefsStore((s) => s.isDisliked(recipe.id));
  const toggleFavorite = useRecipePrefsStore((s) => s.toggleFavorite);
  const toggleDisliked = useRecipePrefsStore((s) => s.toggleDisliked);

  return (
    <div className="card group relative overflow-hidden p-3 transition hover:-translate-y-0.5 hover:shadow-card">
      {!compact ? (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
          <button
            type="button"
            className={cn(
              "rounded-full p-2 transition hover:bg-nourish-bg",
              favorited ? "text-nourish-terracotta" : "text-nourish-muted hover:text-nourish-ink",
            )}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(recipe.id);
              const now = useRecipePrefsStore.getState().isFavorite(recipe.id);
              pushToast(now ? "Saved to favorites." : "Removed from favorites.");
            }}
          >
            <Heart size={17} className={cn(favorited && "fill-current")} />
          </button>
          <button
            type="button"
            className={cn(
              "rounded-full p-2 transition hover:bg-nourish-bg",
              disliked ? "text-nourish-terracotta" : "text-nourish-muted hover:text-nourish-ink",
            )}
            aria-label={disliked ? "Remove not-for-me flag" : "Not for me"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleDisliked(recipe.id);
              const now = useRecipePrefsStore.getState().isDisliked(recipe.id);
              pushToast(now ? "We’ll show fewer picks like this (preview)." : "Cleared not-for-me for this recipe.");
            }}
          >
            <ThumbsDown size={17} className={cn(disliked && "fill-current")} />
          </button>
        </div>
      ) : null}

      <Link to={`/recipes/${recipe.id}`} className={cn("block", !compact && "pr-14")}>
        <div className="mb-2 h-11 rounded-2xl bg-gradient-to-br from-nourish-sage/20 via-[#f8efe7] to-nourish-terracotta/20 sm:h-12" />
        <h3 className="mb-2 text-lg leading-tight text-nourish-ink">{recipe.name}</h3>
        <div className="flex flex-wrap gap-2">
          <TagPill tone="warm">{recipe.cuisine}</TagPill>
          <TagPill tone="accent">{recipe.timeTag}</TagPill>
        </div>
      </Link>
    </div>
  );
}
