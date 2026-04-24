import { ArrowLeft, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "hooks/useToast";
import { useAuthStore } from "store/authStore";
import type { ActivityLevel, CookTime, Household, HouseholdPreferences, PrepStyle, User, UserRole } from "types/models";
import { DEFAULT_MY_PLATE_TARGETS, type MyPlateTargets } from "types/models";

const ACTIVITY_LEVELS: ActivityLevel[] = ["Sedentary", "Light", "Moderate", "Active"];
const USER_ROLES: UserRole[] = ["Owner", "Member"];
const COOK_TIMES: CookTime[] = ["Under20", "Under45", "NoLimit"];
const PREP_STYLES: PrepStyle[] = ["DayOf", "OnePrepDay", "TwoPrepDays"];

function splitToList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatList(items: string[]): string {
  return items.join(", ");
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const token = useAuthStore((s) => s.token);
  const userFromStore = useAuthStore((s) => s.user);
  const householdFromStore = useAuthStore((s) => s.household);
  const prefsFromStore = useAuthStore((s) => s.householdPreferences);
  const setSession = useAuthStore((s) => s.setSession);
  const setHouseholdAndPreferences = useAuthStore((s) => s.setHouseholdAndPreferences);
  const logout = useAuthStore((s) => s.logout);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("Moderate");
  const [role, setRole] = useState<UserRole>("Owner");
  const [createdAt, setCreatedAt] = useState("");

  const [householdName, setHouseholdName] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [timezone, setTimezone] = useState("");
  const [householdCreatedAt, setHouseholdCreatedAt] = useState("");

  const [dietaryRaw, setDietaryRaw] = useState("");
  const [dislikedRaw, setDislikedRaw] = useState("");
  const [cuisineRaw, setCuisineRaw] = useState("");
  const [defaultCookTime, setDefaultCookTime] = useState<CookTime>("Under45");
  const [defaultPrepStyle, setDefaultPrepStyle] = useState<PrepStyle>("OnePrepDay");
  const [useMyPlate, setUseMyPlate] = useState(true);
  const [myPlate, setMyPlate] = useState<MyPlateTargets>({ ...DEFAULT_MY_PLATE_TARGETS });

  useEffect(() => {
    const { user, household, householdPreferences } = useAuthStore.getState();

    setDisplayName(user?.displayName ?? "Preview Household");
    setEmail(user?.email ?? "you@example.com");
    setAge(String(user?.age ?? ""));
    setSex(user?.sex ?? "");
    setActivityLevel(user?.activityLevel ?? "Moderate");
    setRole(user?.role ?? "Owner");
    setCreatedAt(user?.createdAt ?? "");

    setHouseholdName(household.name);
    setHouseholdSize(String(household.size));
    setTimezone(household.timezone);
    setHouseholdCreatedAt(household.createdAt);

    const p = householdPreferences;
    setDietaryRaw(formatList(p.dietaryRestrictions));
    setDislikedRaw(formatList(p.dislikedIngredients));
    setCuisineRaw(formatList(p.cuisinePreferences));
    setDefaultCookTime(p.defaultCookTime);
    setDefaultPrepStyle(p.defaultPrepStyle);
    const mpt = p.myPlateTargets;
    setUseMyPlate(mpt != null);
    setMyPlate(mpt ? { ...DEFAULT_MY_PLATE_TARGETS, ...mpt } : { ...DEFAULT_MY_PLATE_TARGETS });
  }, []);

  function handleSave() {
    const { user, household, householdPreferences, householdId } = useAuthStore.getState();
    const hid = householdId ?? household.id;
    const ageNum = Number.parseInt(age, 10);
    const sizeNum = Number.parseInt(householdSize, 10);

    const nextUser: User = {
      id: user?.id ?? 1,
      householdId: hid,
      displayName: displayName.trim() || "Preview Household",
      email: email.trim() || "you@example.com",
      age: Number.isFinite(ageNum) ? ageNum : user?.age ?? 30,
      sex: sex.trim() || "Unspecified",
      activityLevel,
      role,
      createdAt: user?.createdAt ?? (createdAt.trim() ? createdAt : new Date().toISOString()),
    };

    const now = new Date().toISOString();
    const nextHousehold: Household = {
      ...household,
      id: hid,
      name: householdName.trim() || "Willow Kitchen",
      size: Number.isFinite(sizeNum) && sizeNum > 0 ? sizeNum : household.size,
      timezone: timezone.trim() || "UTC",
      createdAt: household.createdAt || now,
      updatedAt: now,
    };

    const nextPrefs: HouseholdPreferences = {
      ...householdPreferences,
      householdId: nextHousehold.id,
      dietaryRestrictions: splitToList(dietaryRaw),
      dislikedIngredients: splitToList(dislikedRaw),
      cuisinePreferences: splitToList(cuisineRaw),
      defaultCookTime,
      defaultPrepStyle,
      myPlateTargets: useMyPlate ? { ...myPlate } : null,
      updatedAt: now,
    };

    setSession(token, nextUser, hid);
    setHouseholdAndPreferences(nextHousehold, nextPrefs);
    pushToast("Profile saved.");
  }

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  const createdLabel =
    createdAt && !Number.isNaN(Date.parse(createdAt))
      ? new Date(createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
      : "—";

  const householdCreatedLabel =
    householdCreatedAt && !Number.isNaN(Date.parse(householdCreatedAt))
      ? new Date(householdCreatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
      : "—";

  return (
    <div className="mx-auto max-w-2xl pb-28 lg:max-w-3xl lg:pb-10">
      <div className="mb-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-nourish-muted transition hover:text-nourish-ink"
        >
          <ArrowLeft size={18} aria-hidden />
          Back
        </Link>
        <h1 className="text-4xl">Profile</h1>
        <p className="mt-2 text-sm text-nourish-muted">
          Your account, household, and planning defaults. Passwords are never stored in the browser.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card p-6 lg:p-8">
          <h2 className="mb-4 text-xl font-medium text-nourish-ink">Your profile</h2>
          <p className="mb-4 text-xs text-nourish-muted">
            User id: <span className="font-mono text-nourish-ink">{userFromStore?.id ?? 1}</span>
            {" · "}
            Household id (FK): <span className="font-mono text-nourish-ink">{userFromStore?.householdId ?? householdFromStore.id}</span>
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-name">
                Display name
              </label>
              <input id="pf-name" className="input w-full" value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoComplete="name" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-email">
                Email
              </label>
              <input
                id="pf-email"
                type="email"
                className="input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-age">
                Age
              </label>
              <input id="pf-age" type="number" min={1} max={120} className="input w-full" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-sex">
                Sex
              </label>
              <input
                id="pf-sex"
                className="input w-full"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                placeholder="e.g. Female, Male, Unspecified"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-activity">
                Activity level
              </label>
              <select id="pf-activity" className="input w-full" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}>
                {ACTIVITY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-role">
                Role
              </label>
              <select id="pf-role" className="input w-full" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-nourish-muted">
                Member since: <span className="text-nourish-ink">{createdLabel}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="card p-6 lg:p-8">
          <h2 className="mb-4 text-xl font-medium text-nourish-ink">Household</h2>
          <p className="mb-4 text-xs text-nourish-muted">
            Household id: <span className="font-mono text-nourish-ink">{householdFromStore.id}</span>
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-hh-name">
                Name
              </label>
              <input id="pf-hh-name" className="input w-full" value={householdName} onChange={(e) => setHouseholdName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-hh-size">
                Size (people)
              </label>
              <input id="pf-hh-size" type="number" min={1} max={20} className="input w-full" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-tz">
                Timezone
              </label>
              <input
                id="pf-tz"
                className="input w-full"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="America/Los_Angeles"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <p className="text-sm text-nourish-muted">
                Created: <span className="text-nourish-ink">{householdCreatedLabel}</span>
              </p>
              <p className="text-sm text-nourish-muted">
                Last updated:{" "}
                <span className="text-nourish-ink">
                  {householdFromStore.updatedAt && !Number.isNaN(Date.parse(householdFromStore.updatedAt))
                    ? new Date(householdFromStore.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
                    : "—"}
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="card p-6 lg:p-8">
          <h2 className="mb-4 text-xl font-medium text-nourish-ink">Household preferences</h2>
          <p className="mb-4 text-xs text-nourish-muted">
            Preferences id: <span className="font-mono text-nourish-ink">{prefsFromStore.id}</span>
            {" · "}
            Linked household id: <span className="font-mono text-nourish-ink">{prefsFromStore.householdId}</span>
            {" · "}
            Updated:{" "}
            <span className="text-nourish-ink">
              {prefsFromStore.updatedAt && !Number.isNaN(Date.parse(prefsFromStore.updatedAt))
                ? new Date(prefsFromStore.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
                : "—"}
            </span>
          </p>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-diet">
                Dietary restrictions
              </label>
              <textarea
                id="pf-diet"
                className="input min-h-[88px] w-full resize-y py-2"
                value={dietaryRaw}
                onChange={(e) => setDietaryRaw(e.target.value)}
                placeholder="Comma or newline separated, e.g. Vegetarian, Nut allergy"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-dislike">
                Disliked ingredients
              </label>
              <textarea
                id="pf-dislike"
                className="input min-h-[88px] w-full resize-y py-2"
                value={dislikedRaw}
                onChange={(e) => setDislikedRaw(e.target.value)}
                placeholder="e.g. cilantro, blue cheese"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-cuisine">
                Cuisine preferences
              </label>
              <textarea
                id="pf-cuisine"
                className="input min-h-[88px] w-full resize-y py-2"
                value={cuisineRaw}
                onChange={(e) => setCuisineRaw(e.target.value)}
                placeholder="e.g. Italian, Mexican"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-cook">
                  Default cook time
                </label>
                <select id="pf-cook" className="input w-full" value={defaultCookTime} onChange={(e) => setDefaultCookTime(e.target.value as CookTime)}>
                  {COOK_TIMES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor="pf-prep">
                  Default prep style
                </label>
                <select id="pf-prep" className="input w-full" value={defaultPrepStyle} onChange={(e) => setDefaultPrepStyle(e.target.value as PrepStyle)}>
                  {PREP_STYLES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-nourish-border bg-nourish-bg/40 p-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-nourish-ink">
                <input type="checkbox" className="h-4 w-4 rounded border-nourish-border" checked={useMyPlate} onChange={(e) => setUseMyPlate(e.target.checked)} />
                Use MyPlate targets (optional)
              </label>
              {useMyPlate ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-5">
                  {(Object.keys(DEFAULT_MY_PLATE_TARGETS) as (keyof MyPlateTargets)[]).map((key) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted" htmlFor={`pf-mp-${key}`}>
                        {key}
                      </label>
                      <input
                        id={`pf-mp-${key}`}
                        type="number"
                        min={0}
                        step={0.5}
                        className="input w-full"
                        value={myPlate[key]}
                        onChange={(e) => {
                          const v = Number.parseFloat(e.target.value);
                          setMyPlate((prev) => ({ ...prev, [key]: Number.isFinite(v) ? v : 0 }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" className="button-primary sm:min-w-[200px]" onClick={handleSave}>
            Save changes
          </button>
          <button
            type="button"
            className="button-secondary inline-flex items-center justify-center gap-2 border-nourish-terracotta/40 text-nourish-terracotta hover:bg-nourish-terracotta/10 sm:ml-auto"
            onClick={handleSignOut}
          >
            <LogOut size={18} aria-hidden />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
