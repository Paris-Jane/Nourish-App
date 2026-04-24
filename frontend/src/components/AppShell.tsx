import type { LucideIcon } from "lucide-react";
import { CalendarDays, ChefHat, ChevronRight, Refrigerator, ShoppingBasket, Soup, UserCircle } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import { cn } from "lib/utils";
import { ToastViewport } from "./Toast";

type ShellNavItem = { to: string; label: string; icon: LucideIcon; shortLabel?: string };

const mainNavItems: ShellNavItem[] = [
  { to: "/", label: "Home", icon: CalendarDays },
  { to: "/grocery", label: "Grocery", icon: ShoppingBasket },
  { to: "/fridge", label: "Fridge", icon: Refrigerator },
  { to: "/recipes", label: "Recipes", icon: ChefHat },
  { to: "/prep-sheet", label: "Prep", icon: Soup },
];

const mobileNavItems: ShellNavItem[] = [...mainNavItems, { to: "/profile", label: "Profile", shortLabel: "Account", icon: UserCircle }];

export function AppShell() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const household = useAuthStore((state) => state.household);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-nourish-border bg-[#f7f2ec] p-6 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 font-heading text-4xl tracking-tight text-nourish-ink">
          Nourish
        </Link>
        <nav className="space-y-2">
          {mainNavItems.map(({ to, label, icon: Icon }) => (
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
          onClick={() => navigate("/profile")}
          className="mt-auto flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent bg-white p-4 text-left text-sm text-nourish-muted shadow-sm transition hover:border-nourish-border hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-nourish-sage focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f2ec]"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-nourish-ink">{user?.displayName ?? "Preview Household"}</p>
            <p className="truncate">{household.name}</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-nourish-muted" aria-hidden />
          <span className="sr-only">Open profile</span>
        </button>
      </aside>

      <main className="flex-1 px-4 pb-28 pt-4 lg:px-8 lg:pb-8 lg:pt-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-4 left-3 right-3 z-30 flex rounded-[24px] border border-nourish-border bg-white/95 p-1.5 shadow-card backdrop-blur lg:hidden">
        {mobileNavItems.map(({ to, label, shortLabel, icon: Icon }) => (
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
