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
  { to: "/saved-weeks", label: "Saved Weeks", icon: BookHeart },
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

      <nav className="fixed bottom-4 left-4 right-4 z-30 flex rounded-[24px] border border-nourish-border bg-white/95 p-2 shadow-card backdrop-blur lg:hidden">
        {navItems.slice(0, 4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] transition",
                isActive ? "bg-nourish-sage text-white" : "text-nourish-muted",
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <ToastViewport />
    </div>
  );
}
