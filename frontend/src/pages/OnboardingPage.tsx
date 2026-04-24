import { ArrowLeft, ArrowRight, Check, Scale, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TagPill } from "components/TagPill";
import type { ActivityLevel } from "types/models";

const restrictionOptions = ["Gluten-free", "Dairy-free", "Vegetarian", "Vegan", "Nut allergy", "Shellfish allergy", "Halal", "Kosher"];
const cuisineOptions = ["Mediterranean", "Mexican", "Asian", "American", "Middle Eastern", "Italian", "Indian", "Other"];
const prepOptions = ["Under 20 min", "Around 45 min", "No limit"];
const activityOptions: ActivityLevel[] = ["Sedentary", "Light", "Moderate", "Active"];

type StepId = "nutrition" | "household" | "preferences" | "planning" | "review";

const steps: Array<{ id: StepId; eyebrow: string; title: string; body: string }> = [
  {
    id: "nutrition",
    eyebrow: "Step 1 of 5",
    title: "Let’s build your nutrition baseline",
    body: "This future intake will let Nourish estimate a more correct MyPlate starting point instead of relying on age and activity alone.",
  },
  {
    id: "household",
    eyebrow: "Step 2 of 5",
    title: "Tell us about your household",
    body: "Household details shape serving sizes, weekly planning scale, and defaults.",
  },
  {
    id: "preferences",
    eyebrow: "Step 3 of 5",
    title: "Food preferences and restrictions",
    body: "This will help the planner avoid obvious misses before you start building weeks.",
  },
  {
    id: "planning",
    eyebrow: "Step 4 of 5",
    title: "How do you like to plan your week?",
    body: "We’ll use these as defaults for the first planning experience.",
  },
  {
    id: "review",
    eyebrow: "Step 5 of 5",
    title: "Review your starting profile",
    body: "This is still a scaffold, but it shows the full shape of the future onboarding flow.",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [householdName, setHouseholdName] = useState("Willow Kitchen");
  const [householdSize, setHouseholdSize] = useState(2);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("Moderate");
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(6);
  const [weightPounds, setWeightPounds] = useState(160);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [dislikeInput, setDislikeInput] = useState("");
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [cookTime, setCookTime] = useState<string>("Around 45 min");
  const [weeklyPrepDay, setWeeklyPrepDay] = useState("Sunday");

  const step = steps[stepIndex];
  const complete = stepIndex === steps.length;

  function toggle(list: string[], value: string, setter: (items: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  return (
    <div className="mx-auto max-w-4xl py-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-nourish-muted transition hover:text-nourish-ink"
        >
          <ArrowLeft size={18} aria-hidden />
          Back to login
        </Link>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-nourish-muted shadow-sm">
          Non-live scaffold
        </span>
      </div>

      <div className="mb-6 flex items-center gap-2">
        {steps.map((item, index) => (
          <div key={item.id} className={`h-2 flex-1 rounded-full ${index <= stepIndex ? "bg-nourish-sage" : "bg-[#e8dfd6]"}`} />
        ))}
      </div>

      <div className="card p-6 lg:p-8">
        {complete ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-nourish-sage text-white">
              <Check />
            </div>
            <h1 className="mb-3 text-5xl">Flow scaffolded</h1>
            <p className="mb-6 max-w-2xl text-nourish-muted">
              This onboarding flow is now shaped for the real product. It collects the nutrition and planning inputs we’ll want once auth and onboarding are fully implemented.
            </p>
            <button className="button-primary" onClick={() => navigate("/")}>
              Back to app
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-nourish-muted">{step.eyebrow}</p>
              <h1 className="text-4xl">{step.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-nourish-muted">{step.body}</p>
            </div>

            {step.id === "nutrition" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Age</label>
                  <input className="input w-full" type="number" min={13} max={120} value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Sex used for nutrition baseline</label>
                  <select className="input w-full" value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="">Choose one</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Height</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input w-full" type="number" min={3} max={8} value={heightFeet} onChange={(e) => setHeightFeet(Number(e.target.value))} placeholder="ft" />
                    <input className="input w-full" type="number" min={0} max={11} value={heightInches} onChange={(e) => setHeightInches(Number(e.target.value))} placeholder="in" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Weight (lb)</label>
                  <input className="input w-full" type="number" min={50} max={700} value={weightPounds} onChange={(e) => setWeightPounds(Number(e.target.value))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-medium tracking-wide text-nourish-muted">Activity level</label>
                  <div className="grid gap-2 sm:grid-cols-4">
                    {activityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setActivityLevel(option)}
                        className={`rounded-2xl border px-3 py-3 text-sm transition ${
                          activityLevel === option ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white text-nourish-ink"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 rounded-3xl border border-nourish-border bg-[#fcfaf7] p-4 text-sm leading-6 text-nourish-muted">
                  <div className="mb-2 flex items-center gap-2 text-nourish-sage">
                    <UserRound size={16} />
                    <Scale size={16} />
                  </div>
                  This future flow can support a more realistic calorie and food-group baseline than the current age/sex/activity-only model.
                </div>
              </div>
            )}

            {step.id === "household" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Household name</label>
                  <input className="input w-full" value={householdName} onChange={(e) => setHouseholdName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">How many people do you cook for?</label>
                  <input className="input w-full" type="number" min={1} max={8} value={householdSize} onChange={(e) => setHouseholdSize(Number(e.target.value))} />
                </div>
              </div>
            )}

            {step.id === "preferences" && (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-nourish-ink">Dietary restrictions</p>
                  <div className="flex flex-wrap gap-3">
                    {restrictionOptions.map((option) => (
                      <TagPill key={option} active={restrictions.includes(option)} onClick={() => toggle(restrictions, option, setRestrictions)}>
                        {option}
                      </TagPill>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-nourish-ink">Foods you really dislike</p>
                  <input
                    className="input"
                    value={dislikeInput}
                    placeholder="Type an ingredient and press Enter"
                    onChange={(event) => setDislikeInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && dislikeInput.trim()) {
                        event.preventDefault();
                        setDislikes((current) => [...current, dislikeInput.trim()]);
                        setDislikeInput("");
                      }
                    }}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {dislikes.map((item) => (
                      <TagPill key={item} tone="warm" onClick={() => setDislikes((current) => current.filter((entry) => entry !== item))}>
                        {item} ×
                      </TagPill>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-nourish-ink">Favorite cuisines</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {cuisineOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggle(cuisines, option, setCuisines)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          cuisines.includes(option) ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step.id === "planning" && (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-nourish-ink">Default cooking time</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {prepOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setCookTime(option)}
                        className={`rounded-2xl border p-5 text-left transition ${
                          cookTime === option ? "border-transparent bg-nourish-terracotta text-white" : "border-nourish-border bg-white"
                        }`}
                      >
                        <div className="font-medium">{option}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium tracking-wide text-nourish-muted">Preferred weekly prep day</label>
                  <select className="input w-full max-w-sm" value={weeklyPrepDay} onChange={(e) => setWeeklyPrepDay(e.target.value)}>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                  </select>
                </div>
              </div>
            )}

            {step.id === "review" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-nourish-border bg-[#fcfaf7] p-5">
                  <h2 className="text-lg font-semibold text-nourish-ink">Nutrition profile</h2>
                  <ul className="mt-3 space-y-2 text-sm text-nourish-muted">
                    <li>Age: <span className="text-nourish-ink">{age}</span></li>
                    <li>Sex baseline: <span className="text-nourish-ink">{sex || "Not chosen"}</span></li>
                    <li>Height: <span className="text-nourish-ink">{heightFeet} ft {heightInches} in</span></li>
                    <li>Weight: <span className="text-nourish-ink">{weightPounds} lb</span></li>
                    <li>Activity: <span className="text-nourish-ink">{activityLevel}</span></li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-nourish-border bg-[#fcfaf7] p-5">
                  <h2 className="text-lg font-semibold text-nourish-ink">Planning defaults</h2>
                  <ul className="mt-3 space-y-2 text-sm text-nourish-muted">
                    <li>Household: <span className="text-nourish-ink">{householdName}</span></li>
                    <li>People cooked for: <span className="text-nourish-ink">{householdSize}</span></li>
                    <li>Cook time: <span className="text-nourish-ink">{cookTime}</span></li>
                    <li>Prep day: <span className="text-nourish-ink">{weeklyPrepDay}</span></li>
                    <li>Restrictions: <span className="text-nourish-ink">{restrictions.length > 0 ? restrictions.join(", ") : "None selected"}</span></li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-nourish-muted"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                disabled={stepIndex === 0}
              >
                Back
              </button>
              <button type="button" className="button-primary" onClick={() => setStepIndex((current) => Math.min(steps.length, current + 1))}>
                {stepIndex === steps.length - 1 ? "Finish scaffold" : "Continue"}
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
