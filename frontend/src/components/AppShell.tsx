import { BookHeart, CalendarDays, ChefHat, Refrigerator, ShoppingBasket } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import { cn } from "lib/utils";
import { ToastViewport } from "./Toast";

const navItems = [
  { to: "/", label: "Home", icon: CalendarDays },
  { to: "/grocery", label: "Grocery", icon: ShoppingBasket },
  { to: "/fridge", label: "Fridge", icon: Refrigerator },
  { to: "/recipes", label: "Recipes", icon: ChefHat },
  { to: "/saved-weeks", label: "Saved Weeks", shortLabel: "Saved", icon: BookHeart },
];

export function AppShell() {
  const user = useAuthStore((state) => state.user);

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
        <div className="mt-auto rounded-2xl bg-white p-4 text-sm text-nourish-muted">
          <p className="text-nourish-ink">{user?.displayName ?? "Preview Household"}</p>
          <p>Willow Kitchen</p>
        </div>
      </aside>

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
