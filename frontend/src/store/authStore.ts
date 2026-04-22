import { create } from "zustand";
import { isPreviewModeEnabled, setPreviewMode } from "lib/preview";
import type { User } from "types/models";

interface AuthState {
  token: string | null;
  user: User | null;
  householdId: number | null;
  previewMode: boolean;
  setSession: (token: string | null, user: User | null, householdId: number | null) => void;
  enablePreviewMode: () => void;
  disablePreviewMode: () => void;
  logout: () => void;
}

const token = localStorage.getItem("nourish-token");
const householdId = localStorage.getItem("nourish-household-id");
const userJson = localStorage.getItem("nourish-user");

export const useAuthStore = create<AuthState>((set) => ({
  token,
  householdId: householdId ? Number(householdId) : null,
  user: userJson ? (JSON.parse(userJson) as User) : null,
  previewMode: isPreviewModeEnabled(),
  setSession: (nextToken, user, nextHouseholdId) => {
    if (nextToken) {
      localStorage.setItem("nourish-token", nextToken);
    } else {
      localStorage.removeItem("nourish-token");
    }

    if (user) {
      localStorage.setItem("nourish-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nourish-user");
    }

    if (nextHouseholdId) {
      localStorage.setItem("nourish-household-id", String(nextHouseholdId));
    } else {
      localStorage.removeItem("nourish-household-id");
    }

    set({ token: nextToken, user, householdId: nextHouseholdId });
  },
  enablePreviewMode: () => {
    setPreviewMode(true);
    set({ previewMode: true });
  },
  disablePreviewMode: () => {
    setPreviewMode(false);
    set({ previewMode: false });
  },
  logout: () => {
    localStorage.removeItem("nourish-token");
    localStorage.removeItem("nourish-user");
    localStorage.removeItem("nourish-household-id");
    setPreviewMode(true);
    set({ token: null, user: null, householdId: null, previewMode: true });
  },
}));
