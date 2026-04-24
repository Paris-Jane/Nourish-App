import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSavedWeekTemplate } from "api/savedWeeks";
import { useSavedWeeks } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { cn } from "lib/utils";
import { useWeekPrefsStore } from "store/weekPrefsStore";
import type { SavedWeekTemplate } from "types/models";

export function SavedWeeksPage() {
  const queryClient = useQueryClient();
  const { savedTemplates } = useSavedWeeks();
  const { pushToast } = useToast();
  const isFavorite = useWeekPrefsStore((state) => state.isFavorite);
  const toggleFavorite = useWeekPrefsStore((state) => state.toggleFavorite);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (import.meta.env.VITE_API_BASE_URL) {
        await deleteSavedWeekTemplate(id);
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<SavedWeekTemplate[]>(["saved-weeks"], (prev) => (prev ?? []).filter((t) => t.id !== id));
      setRenamingId((current) => (current === id ? null : current));
      pushToast("Saved week deleted.");
    },
    onError: () => {
      pushToast("Couldn’t delete this saved week. Try again.");
    },
  });

  const commitRename = (templateId: number) => {
    const name = renameDraft.trim();
    if (!name) {
      setRenamingId(null);
      return;
    }
    const list = queryClient.getQueryData<SavedWeekTemplate[]>(["saved-weeks"]);
    if (!list) {
      setRenamingId(null);
      return;
    }
    queryClient.setQueryData<SavedWeekTemplate[]>(
      ["saved-weeks"],
      list.map((w) => (w.id === templateId ? { ...w, name } : w)),
    );
    setRenamingId(null);
    pushToast("Template name updated.");
  };

  if (savedTemplates.length === 0) {
    return (
      <div className="card flex min-h-[420px] flex-col items-center justify-center p-10 text-center">
        <div className="mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-nourish-sage/20 to-nourish-terracotta/20" />
        <h1 className="mb-2 text-4xl">Saved Weeks</h1>
        <p className="text-nourish-muted">Save a week from Home when you want to reuse it later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">Saved Weeks</h1>
        <p className="text-sm text-nourish-muted">Reusable meal patterns. Tap a name to rename.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {savedTemplates.map((template) => (
          <div key={template.id} className="card p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {renamingId === template.id ? (
                  <input
                    className="input w-full max-w-md text-2xl font-semibold"
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onBlur={() => commitRename(template.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => {
                      setRenamingId(template.id);
                      setRenameDraft(template.name);
                    }}
                  >
                    <h2 className="text-3xl text-nourish-ink hover:underline">{template.name}</h2>
                  </button>
                )}
                <p className="text-sm text-nourish-muted">
                  {template.slots.filter((s) => s.recipeId).length} meals saved ·{" "}
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    isFavorite(template.id)
                      ? "border-nourish-terracotta/30 bg-nourish-terracotta/10 text-nourish-terracotta"
                      : "border-nourish-border bg-white text-nourish-muted hover:border-nourish-terracotta/30 hover:text-nourish-terracotta",
                  )}
                  onClick={() => {
                    const nextFavorite = !isFavorite(template.id);
                    toggleFavorite(template.id);
                    pushToast(nextFavorite ? "Saved to favorites." : "Removed from favorites.");
                  }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Heart size={14} className={cn(isFavorite(template.id) && "fill-current")} />
                    {isFavorite(template.id) ? "Favorited" : "Favorite"}
                  </span>
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-nourish-border text-nourish-muted transition hover:border-nourish-terracotta/40 hover:bg-nourish-terracotta/5 hover:text-nourish-terracotta disabled:opacity-50"
                  aria-label={`Delete ${template.name}`}
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (
                      !window.confirm(
                        `Delete “${template.name}”? This removes it from your saved weeks and cannot be undone.`,
                      )
                    ) {
                      return;
                    }
                    deleteMutation.mutate(template.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="mb-5 grid grid-cols-7 gap-2 text-[11px] text-nourish-muted">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="rounded-xl bg-nourish-bg px-2 py-3 text-center">
                  {day}
                </div>
              ))}
            </div>
            <p className="mb-3 line-clamp-3 text-xs text-nourish-muted">
              {template.slots
                .filter((s) => s.recipeName)
                .map((s) => s.recipeName)
                .slice(0, 6)
                .join(" · ")}
            </p>
            <button
              className="button-primary w-full"
              onClick={() => pushToast("Open Home and use ⋯ → Choose weekly template to apply this saved week.")}
            >
              How to use
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
