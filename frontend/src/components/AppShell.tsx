import { BookHeart, CalendarDays, ChefHat, ChevronRight, LogOut, Refrigerator, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BottomSheet } from "components/BottomSheet";
import { useToast } from "hooks/useToast";
import { useAuthStore } from "store/authStore";
import { cn } from "lib/utils";
import { ToastViewport } from "./Toast";

const KITCHEN_LABEL_KEY = "nourish-kitchen-label";

function readKitchenLabel() {
  if (typeof window === "undefined") return "Willow Kitchen";
  return window.localStorage.getItem(KITCHEN_LABEL_KEY) ?? "Willow Kitchen";
}

const navItems = [
  { to: "/", label: "Home", icon: CalendarDays },
  { to: "/grocery", label: "Grocery", icon: ShoppingBasket },
  { to: "/fridge", label: "Fridge", icon: Refrigerator },
  { to: "/recipes", label: "Recipes", icon: ChefHat },
  { to: "/saved-weeks", label: "Saved Weeks", shortLabel: "Saved", icon: BookHeart },
];

export function AppShell() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const householdId = useAuthStore((state) => state.householdId);
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);

  const [kitchenLabel, setKitchenLabel] = useState(readKitchenLabel);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [kitchenDraft, setKitchenDraft] = useState("");

  useEffect(() => {
    if (!profileOpen) return;
    setNameDraft(user?.displayName ?? "");
    setEmailDraft(user?.email ?? "");
    setKitchenDraft(readKitchenLabel());
  }, [profileOpen, user]);

  function handleSaveProfile() {
    const nextName = nameDraft.trim() || "Preview Household";
    const nextEmail = emailDraft.trim() || "you@example.com";
    const nextKitchen = kitchenDraft.trim() || "Willow Kitchen";
    window.localStorage.setItem(KITCHEN_LABEL_KEY, nextKitchen);
    setKitchenLabel(nextKitchen);
    const hid = householdId ?? 1;
    if (user) {
      setSession(token, { ...user, displayName: nextName, email: nextEmail }, hid);
    } else {
      setSession(token, { id: 1, householdId: hid, displayName: nextName, email: nextEmail }, hid);
    }
    setProfileOpen(false);
    pushToast("Profile saved.");
  }

  function handleSignOut() {
    setProfileOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-nourish-border bg-[#f7f2ec] p-6 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 text-4xl text-nourish-ink">
          Nourish
        </Link>
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  isActive ? "bg-white text-nourish-ink shadow-sm" : "text-nourish-muted hover:bg-white/70",
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="mt-auto flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent bg-white p-4 text-left text-sm text-nourish-muted shadow-sm transition hover:border-nourish-border hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-nourish-sage focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f2ec]"
          aria-haspopup="dialog"
          aria-expanded={profileOpen}
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-nourish-ink">{user?.displayName ?? "Preview Household"}</p>
            <p className="truncate">{kitchenLabel}</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-nourish-muted" aria-hidden />
          <span className="sr-only">Account and sign out</span>
        </button>
      </aside>

      <BottomSheet open={profileOpen} title="Your account" onClose={() => setProfileOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-nourish-muted">Update how you appear in Nourish, or sign out on this device.</p>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="profile-display-name">
              Display name
            </label>
            <input
              id="profile-display-name"
              className="input w-full"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="profile-email">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              className="input w-full"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="profile-kitchen">
              Kitchen / household name
            </label>
            <input
              id="profile-kitchen"
              className="input w-full"
              value={kitchenDraft}
              onChange={(e) => setKitchenDraft(e.target.value)}
              placeholder="Willow Kitchen"
            />
          </div>
          <button type="button" className="button-primary w-full" onClick={handleSaveProfile}>
            Save changes
          </button>
          <button
            type="button"
            className="button-secondary inline-flex w-full items-center justify-center gap-2 border-nourish-terracotta/40 text-nourish-terracotta hover:bg-nourish-terracotta/10"
            onClick={handleSignOut}
          >
            <LogOut size={18} aria-hidden />
            Sign out
          </button>
        </div>
      </BottomSheet>

      <main className="flex-1 px-4 pb-28 pt-4 lg:px-8 lg:pb-8 lg:pt-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-4 left-3 right-3 z-30 flex rounded-[24px] border border-nourish-border bg-white/95 p-1.5 shadow-card backdrop-blur lg:hidden">
        {navItems.map(({ to, label, shortLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-0.5 py-1 text-[10px] font-medium leading-tight transition sm:text-[11px]",
                isActive ? "bg-nourish-sage text-white" : "text-nourish-muted",
              )
            }
          >
            <Icon size={16} className="shrink-0" />
            <span className="line-clamp-2 text-center">{shortLabel ?? label}</span>
          </NavLink>
        ))}
      </nav>
      <ToastViewport />
    </div>
  );
}
