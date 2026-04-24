import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Ruler, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "hooks/useToast";
import { useAuthStore } from "store/authStore";
import { registerSchema, signInSchema, type RegisterFormValues, type SignInFormValues } from "types/forms";
import type { ActivityLevel } from "types/models";

const ACTIVITY_LEVELS: ActivityLevel[] = ["Sedentary", "Light", "Moderate", "Active"];

export function LoginPage() {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const navigate = useNavigate();
  const enablePreviewMode = useAuthStore((state) => state.enablePreviewMode);
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
    enablePreviewMode();
    pushToast("Preview mode is on, so you can keep testing without signing in.");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5eee6_0%,#f8f4ef_45%,#fffdf9_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <section className="rounded-[32px] border border-nourish-border/70 bg-white/75 p-6 shadow-card backdrop-blur sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-nourish-sage/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-nourish-sage">
            <Sparkles size={14} />
            Future auth flow
          </div>
          <h1 className="mt-5 font-heading text-5xl leading-none text-nourish-ink sm:text-6xl">Nourish</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-nourish-muted">
            These pages are now designed for the real product flow, but auth is still intentionally paused while you finish the planner.
            The registration experience below collects the kinds of details we’ll need for a more accurate nutrition baseline once it goes live.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-nourish-border bg-[#fcfaf7] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Account</p>
              <p className="mt-2 text-sm leading-6 text-nourish-ink">Create a household owner account with your home kitchen defaults.</p>
            </div>
            <div className="rounded-3xl border border-nourish-border bg-[#fcfaf7] p-4">
              <div className="flex items-center gap-2 text-nourish-sage">
                <Ruler size={16} />
                <Scale size={16} />
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-nourish-muted">Nutrition baseline</p>
              <p className="mt-2 text-sm leading-6 text-nourish-ink">Height, weight, age, sex, and activity are collected here for future MyPlate personalization.</p>
            </div>
            <div className="rounded-3xl border border-nourish-border bg-[#fcfaf7] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-nourish-muted">Onboarding next</p>
              <p className="mt-2 text-sm leading-6 text-nourish-ink">After account creation, onboarding will gather food preferences and planning style before the first week.</p>
            </div>
          </div>
        </section>

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
              onSubmit={signInForm.handleSubmit(() => pushToast("Sign-in is scaffolded, but still intentionally not live."))}
            >
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Email</label>
                <input className="input" placeholder="you@example.com" {...signInForm.register("email")} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Password</label>
                <input className="input" type="password" placeholder="••••••••" {...signInForm.register("password")} />
              </div>
              <button className="button-primary w-full" type="submit">
                Sign in later
              </button>
            </form>
          ) : (
            <form
              className="space-y-5"
              onSubmit={registerForm.handleSubmit(() => pushToast("Registration is scaffolded, but still intentionally not live."))}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Display name</label>
                  <input className="input" placeholder="Paris" {...registerForm.register("displayName")} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Email</label>
                  <input className="input" placeholder="you@example.com" {...registerForm.register("email")} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Password</label>
                  <input className="input" type="password" placeholder="At least 8 characters" {...registerForm.register("password")} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Household name</label>
                  <input className="input" placeholder="Willow Kitchen" {...registerForm.register("householdName")} />
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
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Sex used for nutrition baseline</label>
                    <select className="input" {...registerForm.register("sex")}>
                      <option value="">Choose one</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
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

              <button className="button-primary w-full" type="submit">
                Create account later
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
