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
  onSelect?: (recipe: Recipe) => void;
  actionLabel?: string;
}

export function RecipeCard({ recipe, compact, onSelect, actionLabel }: RecipeCardProps) {
  const { pushToast } = useToast();
  const favorited = useRecipePrefsStore((s) => s.isFavorite(recipe.id));
  const disliked = useRecipePrefsStore((s) => s.isDisliked(recipe.id));
  const toggleFavorite = useRecipePrefsStore((s) => s.toggleFavorite);
  const toggleDisliked = useRecipePrefsStore((s) => s.toggleDisliked);

  const content = (
    <>
      <div className="mb-2 h-14 rounded-2xl bg-gradient-to-br from-nourish-sage/20 via-[#f8efe7] to-nourish-terracotta/20 sm:h-[4.25rem]" />

      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-snug text-nourish-ink">{recipe.name}</h3>
        </div>
        {!compact ? (
          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            <button
              type="button"
              className={cn(
                "rounded-full p-1.5 transition hover:bg-nourish-bg",
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
                "rounded-full p-1.5 transition hover:bg-nourish-bg",
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
      </div>

      <div className="flex flex-wrap gap-2">
        <TagPill tone="warm">{recipe.cuisine}</TagPill>
        <TagPill tone="accent">{recipe.timeTag}</TagPill>
      </div>

      {onSelect ? <div className="mt-3 text-xs font-medium text-nourish-sage">{actionLabel ?? "Use this recipe"}</div> : null}
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(recipe)}
        className="card group w-full overflow-hidden p-3 text-left transition hover:-translate-y-0.5 hover:shadow-card"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="card group overflow-hidden p-3 transition hover:-translate-y-0.5 hover:shadow-card">
      <Link to={`/recipes/${recipe.id}`} className="block">
        {content}
      </Link>
    </div>
  );
}
