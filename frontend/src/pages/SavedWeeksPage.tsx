import { Heart } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSavedWeeks } from "hooks/useAppData";
import { formatWeekRange } from "lib/utils";
import { useToast } from "hooks/useToast";
import { cn } from "lib/utils";
import { useWeekPrefsStore } from "store/weekPrefsStore";
import type { Week } from "types/models";

export function SavedWeeksPage() {
  const queryClient = useQueryClient();
  const { savedWeeks } = useSavedWeeks();
  const { pushToast } = useToast();
  const isFavorite = useWeekPrefsStore((state) => state.isFavorite);
  const toggleFavorite = useWeekPrefsStore((state) => state.toggleFavorite);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  const commitRename = (weekId: number) => {
    const name = renameDraft.trim();
    if (!name) {
      setRenamingId(null);
      return;
    }
    const list = queryClient.getQueryData<Week[]>(["saved-weeks"]);
    if (!list) {
      setRenamingId(null);
      return;
    }
    queryClient.setQueryData<Week[]>(
      ["saved-weeks"],
      list.map((w) => (w.id === weekId ? { ...w, templateName: name } : w)),
    );
    setRenamingId(null);
    pushToast("Week name updated.");
  };

  if (savedWeeks.length === 0) {
    return (
      <div className="card flex min-h-[420px] flex-col items-center justify-center p-10 text-center">
        <div className="mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-nourish-sage/20 to-nourish-terracotta/20" />
        <h1 className="mb-2 text-4xl">Saved Weeks</h1>
        <p className="text-nourish-muted">Save a week you love to find it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">Saved Weeks</h1>
        <p className="text-sm text-nourish-muted">Templates for the weeks you’d happily repeat. Tap a name to rename.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {savedWeeks.map((week) => (
          <div key={week.id} className="card p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {renamingId === week.id ? (
                  <input
                    className="input w-full max-w-md text-2xl font-semibold"
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onBlur={() => commitRename(week.id)}
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
                      setRenamingId(week.id);
                      setRenameDraft(week.templateName ?? "Saved week");
                    }}
                  >
                    <h2 className="text-3xl text-nourish-ink hover:underline">{week.templateName ?? "Saved week"}</h2>
                  </button>
                )}
                <p className="text-sm text-nourish-muted">{formatWeekRange(week.weekStartDate)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    isFavorite(week.id)
                      ? "border-nourish-terracotta/30 bg-nourish-terracotta/10 text-nourish-terracotta"
                      : "border-nourish-border bg-white text-nourish-muted hover:border-nourish-terracotta/30 hover:text-nourish-terracotta",
                  )}
                  onClick={() => {
                    const nextFavorite = !isFavorite(week.id);
                    toggleFavorite(week.id);
                    pushToast(nextFavorite ? "Week saved to favorites." : "Week removed from favorites.");
                  }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Heart size={14} className={cn(isFavorite(week.id) && "fill-current")} />
                    {isFavorite(week.id) ? "Favorited" : "Favorite"}
                  </span>
                </button>
                <button className={`rounded-full px-3 py-1.5 text-xs ${week.isInRotation ? "bg-nourish-sage text-white" : "bg-nourish-bg text-nourish-muted"}`}>
                  In rotation
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
            <button className="button-primary w-full" onClick={() => pushToast("Loading a saved template is the next API mutation to connect.")}>
              Load this week
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
