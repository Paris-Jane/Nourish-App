import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "hooks/useToast";
import { useAuthStore } from "store/authStore";
import { registerSchema, signInSchema, type RegisterFormValues, type SignInFormValues } from "types/forms";

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
    },
  });

  function continueInPreview() {
    enablePreviewMode();
    pushToast("Preview mode is on, so you can keep testing without signing in.");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="card w-full max-w-xl p-6 lg:p-10">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-5xl">Nourish</h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-nourish-muted">
            The full login flow is intentionally deferred while you test. The UI is here so we can style and validate it,
            but the working path right now is preview mode.
          </p>
        </div>

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
            onSubmit={signInForm.handleSubmit(() => pushToast("Auth is paused for now. Use preview mode below."))}
          >
            <input className="input" placeholder="Email" {...signInForm.register("email")} />
            <input className="input" type="password" placeholder="Password" {...signInForm.register("password")} />
            <button className="button-primary w-full" type="submit">
              Sign in later
            </button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={registerForm.handleSubmit(() => pushToast("Registration is also deferred until you’re ready for auth."))}
          >
            <input className="input" placeholder="Display name" {...registerForm.register("displayName")} />
            <input className="input" placeholder="Email" {...registerForm.register("email")} />
            <input className="input" type="password" placeholder="Password" {...registerForm.register("password")} />
            <input className="input" placeholder="Household name" {...registerForm.register("householdName")} />
            <div className="rounded-2xl border border-nourish-border p-4">
              <div className="mb-2 text-sm text-nourish-muted">Household size</div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="button-secondary h-10 w-10 p-0"
                  onClick={() => registerForm.setValue("householdSize", Math.max(1, registerForm.getValues("householdSize") - 1))}
                >
                  -
                </button>
                <span className="text-3xl font-heading">{registerForm.watch("householdSize")}</span>
                <button
                  type="button"
                  className="button-secondary h-10 w-10 p-0"
                  onClick={() => registerForm.setValue("householdSize", Math.min(6, registerForm.getValues("householdSize") + 1))}
                >
                  +
                </button>
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
      </div>
    </div>
  );
}
