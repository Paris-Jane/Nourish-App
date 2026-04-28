import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, Ruler, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login, register } from "api/auth";
import { useToast } from "hooks/useToast";
import { useAuthStore } from "store/authStore";
import { registerSchema, signInSchema, type RegisterFormValues, type SignInFormValues } from "types/forms";
import type { ActivityLevel, User } from "types/models";

const ACTIVITY_LEVELS: ActivityLevel[] = ["Sedentary", "Light", "Moderate", "Active"];
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function apiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  if (error.response?.status === 400) {
    const message = typeof error.response.data === "string" ? error.response.data : "The submitted details were not accepted.";
    return message;
  }
  if (error.response?.status === 401) return "That email/password did not match an account.";
  if (error.response) return `${fallback} Backend returned ${error.response.status}.`;
  if (error.request) return `${fallback} The frontend could not reach the backend API.`;
  return fallback;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-700">{message}</p>;
}

export function LoginPage() {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const enablePreviewMode = useAuthStore((state) => state.enablePreviewMode);
  const disablePreviewMode = useAuthStore((state) => state.disablePreviewMode);
  const setSession = useAuthStore((state) => state.setSession);
  const setHouseholdAndPreferences = useAuthStore((state) => state.setHouseholdAndPreferences);
  const { pushToast } = useToast();

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      householdName: "",
      householdSize: 2,
      age: 30,
      sex: "",
      activityLevel: "Moderate",
      heightFeet: 5,
      heightInches: 6,
      weightPounds: 160,
    },
  });

  function continueInPreview() {
    setFormError(null);
    enablePreviewMode();
    pushToast("Preview mode is on, so you can keep testing without signing in.");
    navigate("/");
  }

  function completeAuthSession(response: { token: string; userId: number; householdId: number; displayName: string; email: string }) {
    const user: User = {
      id: response.userId,
      householdId: response.householdId,
      displayName: response.displayName,
      email: response.email,
    };
    disablePreviewMode();
    setSession(response.token, user, response.householdId);
  }

  async function handleSignIn(values: SignInFormValues) {
    setFormError(null);
    if (!apiBaseUrl && !import.meta.env.DEV) {
      setFormError("The frontend is missing VITE_API_BASE_URL, so it cannot reach the backend.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await login(values);
      completeAuthSession(response);
      pushToast(`Welcome back, ${response.displayName}.`);
      navigate("/");
    } catch (error) {
      const message = apiErrorMessage(error, "Sign-in failed.");
      setFormError(message);
      pushToast(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(values: RegisterFormValues) {
    setFormError(null);
    if (!apiBaseUrl && !import.meta.env.DEV) {
      setFormError("The frontend is missing VITE_API_BASE_URL, so it cannot reach the backend.");
      return;
    }
    setIsSubmitting(true);
    try {
      const heightInches = values.heightFeet * 12 + values.heightInches;
      const timezone =
        typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" : "UTC";
      const response = await register({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        age: values.age,
        sex: values.sex,
        activityLevel: values.activityLevel,
        heightInches,
        weightPounds: values.weightPounds,
        householdName: values.householdName,
        householdSize: values.householdSize,
        timezone,
      });
      completeAuthSession(response);
      setHouseholdAndPreferences(
        {
          id: response.householdId,
          name: values.householdName,
          size: values.householdSize,
          timezone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 1,
          householdId: response.householdId,
          dietaryRestrictions: [],
          dislikedIngredients: [],
          cuisinePreferences: [],
          defaultCookTime: "NoLimit",
          defaultPrepStyle: "DayOf",
          myPlateTargets: undefined,
          updatedAt: new Date().toISOString(),
        },
      );
      pushToast(`Account ready, ${response.displayName}.`);
      navigate("/");
    } catch (error) {
      const message = apiErrorMessage(error, "Registration failed.");
      setFormError(message);
      pushToast(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5eee6_0%,#f8f4ef_45%,#fffdf9_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <section className="card w-full p-6 lg:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-nourish-bg p-1">
            <button
              type="button"
              onClick={() => setTab("signin")}
              className={`rounded-2xl px-4 py-3 text-sm ${tab === "signin" ? "bg-white text-nourish-ink shadow-sm" : "text-nourish-muted"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`rounded-2xl px-4 py-3 text-sm ${tab === "register" ? "bg-white text-nourish-ink shadow-sm" : "text-nourish-muted"}`}
            >
              Create account
            </button>
          </div>

          {tab === "signin" ? (
            <form
              className="space-y-4"
              onSubmit={signInForm.handleSubmit(handleSignIn)}
            >
              {formError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div> : null}
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Email</label>
                <input className="input" placeholder="you@example.com" {...signInForm.register("email")} />
                <FieldError message={signInForm.formState.errors.email?.message} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Password</label>
                <input className="input" type="password" placeholder="••••••••" {...signInForm.register("password")} />
                <FieldError message={signInForm.formState.errors.password?.message} />
              </div>
              <button className="button-primary w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form
              className="space-y-5"
              onSubmit={registerForm.handleSubmit(handleRegister)}
            >
              {formError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div> : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Display name</label>
                  <input className="input" placeholder="Paris" {...registerForm.register("displayName")} />
                  <FieldError message={registerForm.formState.errors.displayName?.message} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Email</label>
                  <input className="input" placeholder="you@example.com" {...registerForm.register("email")} />
                  <FieldError message={registerForm.formState.errors.email?.message} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Password</label>
                  <input className="input" type="password" placeholder="At least 8 characters" {...registerForm.register("password")} />
                  <FieldError message={registerForm.formState.errors.password?.message} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Household name</label>
                  <input className="input" placeholder="Willow Kitchen" {...registerForm.register("householdName")} />
                  <FieldError message={registerForm.formState.errors.householdName?.message} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Household size</label>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    max={6}
                    value={registerForm.watch("householdSize")}
                    onChange={(event) => registerForm.setValue("householdSize", Number(event.target.value))}
                  />
                  <FieldError message={registerForm.formState.errors.householdSize?.message} />
                </div>
              </div>

              <div className="rounded-3xl border border-nourish-border bg-[#fcfaf7] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nourish-muted">Future MyPlate intake</p>
                <p className="mt-2 text-sm leading-6 text-nourish-muted">
                  This is the intake we’ll eventually use to make the nutrition baseline more correct instead of relying on age, sex, and activity alone.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Age</label>
                    <input
                      className="input"
                      type="number"
                      min={13}
                      max={120}
                      value={registerForm.watch("age")}
                      onChange={(event) => registerForm.setValue("age", Number(event.target.value))}
                    />
                    <FieldError message={registerForm.formState.errors.age?.message} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Sex used for nutrition baseline</label>
                    <select className="input" {...registerForm.register("sex")}>
                      <option value="">Choose one</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <FieldError message={registerForm.formState.errors.sex?.message} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Height</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="input"
                        type="number"
                        min={3}
                        max={8}
                        value={registerForm.watch("heightFeet")}
                        onChange={(event) => registerForm.setValue("heightFeet", Number(event.target.value))}
                        placeholder="ft"
                      />
                      <input
                        className="input"
                        type="number"
                        min={0}
                        max={11}
                        value={registerForm.watch("heightInches")}
                        onChange={(event) => registerForm.setValue("heightInches", Number(event.target.value))}
                        placeholder="in"
                      />
                    </div>
                    <FieldError message={registerForm.formState.errors.heightFeet?.message ?? registerForm.formState.errors.heightInches?.message} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Weight (lb)</label>
                    <input
                      className="input"
                      type="number"
                      min={50}
                      max={700}
                      value={registerForm.watch("weightPounds")}
                      onChange={(event) => registerForm.setValue("weightPounds", Number(event.target.value))}
                    />
                    <FieldError message={registerForm.formState.errors.weightPounds?.message} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Activity level</label>
                    <div className="grid gap-2 sm:grid-cols-4">
                      {ACTIVITY_LEVELS.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => registerForm.setValue("activityLevel", level)}
                          className={`rounded-2xl border px-3 py-3 text-sm transition ${
                            registerForm.watch("activityLevel") === level
                              ? "border-transparent bg-nourish-sage text-white"
                              : "border-nourish-border bg-white text-nourish-ink"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button className="button-primary w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          <button type="button" className="button-secondary mt-5 w-full" onClick={continueInPreview}>
            Continue in preview mode
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-nourish-sage"
            onClick={() => navigate("/onboarding")}
          >
            Preview onboarding flow <ArrowRight size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}
