import { create } from "zustand";
import { isPreviewModeEnabled, setPreviewMode } from "lib/preview";
import type { CookTime, Household, HouseholdPreferences, PrepStyle, User } from "types/models";
import { DEFAULT_MY_PLATE_TARGETS, type MyPlateTargets } from "types/models";

const TOKEN_KEY = "nourish-token";
const HH_ID_KEY = "nourish-household-id";
const USER_KEY = "nourish-user";
const HOUSEHOLD_KEY = "nourish-household";
const PREFS_KEY = "nourish-household-preferences";
const KITCHEN_LABEL_KEY = "nourish-kitchen-label";

function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function persistHousehold(h: Household) {
  localStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(h));
}

function persistPrefs(p: HouseholdPreferences) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p));
}

function legacyKitchenName(): string | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KITCHEN_LABEL_KEY)?.trim();
  return v && v.length > 0 ? v : null;
}

function defaultHousehold(resolvedId: number): Household {
  const now = new Date().toISOString();
  return {
    id: resolvedId,
    name: legacyKitchenName() ?? "Willow Kitchen",
    size: 2,
    timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" : "UTC",
    createdAt: now,
    updatedAt: now,
  };
}

function defaultPreferences(householdId: number): HouseholdPreferences {
  const now = new Date().toISOString();
  return {
    id: 1,
    householdId,
    dietaryRestrictions: [],
    dislikedIngredients: [],
    cuisinePreferences: [],
    defaultCookTime: "Under45",
    defaultPrepStyle: "OnePrepDay",
    myPlateTargets: { ...DEFAULT_MY_PLATE_TARGETS },
    updatedAt: now,
  };
}

function mergeMyPlate(partial: MyPlateTargets | Record<string, number> | null | undefined): MyPlateTargets {
  return { ...DEFAULT_MY_PLATE_TARGETS, ...(partial ?? {}) };
}

function bootstrap() {
  const token = localStorage.getItem(TOKEN_KEY);
  const householdIdStr = localStorage.getItem(HH_ID_KEY);
  const userJson = localStorage.getItem(USER_KEY);
  const user = userJson ? (JSON.parse(userJson) as User) : null;
  const householdIdFromKey = householdIdStr ? Number(householdIdStr) : null;

  const parsedH = loadJson<Household>(HOUSEHOLD_KEY);
  const parsedP = loadJson<HouseholdPreferences>(PREFS_KEY);

  const resolvedId = householdIdFromKey ?? user?.householdId ?? parsedH?.id ?? parsedP?.householdId ?? 1;

  const household: Household = parsedH ? { ...parsedH, id: resolvedId } : defaultHousehold(resolvedId);

  const preferences: HouseholdPreferences = parsedP
    ? {
        ...defaultPreferences(household.id),
        ...parsedP,
        id: parsedP.id ?? 1,
        householdId: household.id,
        dietaryRestrictions: parsedP.dietaryRestrictions ?? [],
        dislikedIngredients: parsedP.dislikedIngredients ?? [],
        cuisinePreferences: parsedP.cuisinePreferences ?? [],
        defaultCookTime: (parsedP.defaultCookTime as CookTime) ?? "Under45",
        defaultPrepStyle: (parsedP.defaultPrepStyle as PrepStyle) ?? "OnePrepDay",
        myPlateTargets: mergeMyPlate(parsedP.myPlateTargets),
        updatedAt: parsedP.updatedAt ?? new Date().toISOString(),
      }
    : defaultPreferences(household.id);

  const stateHouseholdId = householdIdFromKey ?? user?.householdId ?? household.id;

  let finalHousehold = household;
  let finalPrefs = preferences;
  if (household.id !== stateHouseholdId) {
    const now = new Date().toISOString();
    finalHousehold = { ...household, id: stateHouseholdId, updatedAt: now };
    finalPrefs = { ...preferences, householdId: stateHouseholdId };
  }

  if (!parsedH || !parsedP) {
    persistHousehold(finalHousehold);
    persistPrefs(finalPrefs);
  }

  return {
    token,
    user,
    householdId: stateHouseholdId,
    household: finalHousehold,
    householdPreferences: finalPrefs,
    previewMode: isPreviewModeEnabled(),
  };
}

const initial = bootstrap();

export interface AuthState {
  token: string | null;
  user: User | null;
  householdId: number | null;
  household: Household;
  householdPreferences: HouseholdPreferences;
  previewMode: boolean;
  setSession: (token: string | null, user: User | null, householdId: number | null) => void;
  setHouseholdAndPreferences: (household: Household, prefs: HouseholdPreferences) => void;
  enablePreviewMode: () => void;
  disablePreviewMode: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  householdId: initial.householdId,
  household: initial.household,
  householdPreferences: initial.householdPreferences,
  previewMode: initial.previewMode,

  setSession: (nextToken, user, nextHouseholdId) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    if (nextHouseholdId) {
      localStorage.setItem(HH_ID_KEY, String(nextHouseholdId));
    } else {
      localStorage.removeItem(HH_ID_KEY);
    }

    set((state) => {
      const hid = nextHouseholdId ?? state.householdId;
      let household = state.household;
      let prefs = state.householdPreferences;
      if (hid != null && household.id !== hid) {
        const now = new Date().toISOString();
        household = { ...household, id: hid, updatedAt: now };
        prefs = { ...prefs, householdId: hid };
        persistHousehold(household);
        persistPrefs(prefs);
      }
      return { token: nextToken, user, householdId: nextHouseholdId, household, householdPreferences: prefs };
    });
  },

  setHouseholdAndPreferences: (household, prefs) => {
    const now = new Date().toISOString();
    const h = { ...household, updatedAt: now };
    const p = {
      ...prefs,
      updatedAt: now,
      myPlateTargets: prefs.myPlateTargets == null ? null : mergeMyPlate(prefs.myPlateTargets),
    };
    persistHousehold(h);
    persistPrefs(p);
    localStorage.setItem(KITCHEN_LABEL_KEY, h.name);
    localStorage.setItem(HH_ID_KEY, String(h.id));
    set({ household: h, householdPreferences: p, householdId: h.id });
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HH_ID_KEY);
    localStorage.removeItem(HOUSEHOLD_KEY);
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(KITCHEN_LABEL_KEY);
    setPreviewMode(true);

    const hid = 1;
    const household = defaultHousehold(hid);
    const householdPreferences = defaultPreferences(hid);
    persistHousehold(household);
    persistPrefs(householdPreferences);

    set({
      token: null,
      user: null,
      householdId: null,
      household,
      householdPreferences,
      previewMode: true,
    });
  },
}));
