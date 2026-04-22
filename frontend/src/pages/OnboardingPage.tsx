import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TagPill } from "components/TagPill";

const restrictionOptions = ["Gluten-free", "Dairy-free", "Vegetarian", "Vegan", "Nut allergy", "Shellfish allergy", "Halal", "Kosher"];
const cuisineOptions = ["🫒 Mediterranean", "🌮 Mexican", "🍜 Asian", "🍔 American", "🧆 Middle Eastern", "🍝 Italian", "🫕 Indian", "🥗 Other"];
const prepOptions = ["Under 20 min", "Around 45 min", "No limit"];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [dislikeInput, setDislikeInput] = useState("");
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [cookTime, setCookTime] = useState<string>("Around 45 min");
  const [servings, setServings] = useState(2);

  function toggle(list: string[], value: string, setter: (items: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const complete = step === 5;

  return (
    <div className="mx-auto max-w-3xl py-6 lg:py-10">
      <div className="mb-6 flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className={`h-2 flex-1 rounded-full ${index <= step ? "bg-nourish-sage" : "bg-[#e8dfd6]"}`} />
        ))}
      </div>

      <div className="card p-6 lg:p-8">
        {complete ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-nourish-sage text-white">
              <Check />
            </div>
            <h1 className="mb-3 text-5xl">You&apos;re all set</h1>
            <p className="mb-6 max-w-md text-nourish-muted">Let&apos;s build your first week with a warm, flexible starting point.</p>
            <button className="button-primary" onClick={() => navigate("/")}>
              Let&apos;s build your first week
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-nourish-muted">Step {step + 1} of 5</p>
              <h1 className="text-4xl">
                {
                  [
                    "Any dietary restrictions?",
                    "Foods you really dislike?",
                    "What cuisines do you love?",
                    "How much time do you want to spend cooking?",
                    "How many people are you cooking for?",
                  ][step]
                }
              </h1>
            </div>

            {step === 0 && (
              <div className="flex flex-wrap gap-3">
                {restrictionOptions.map((option) => (
                  <TagPill key={option} active={restrictions.includes(option)} onClick={() => toggle(restrictions, option, setRestrictions)}>
                    {option}
                  </TagPill>
                ))}
              </div>
            )}

            {step === 1 && (
              <div>
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
            )}

            {step === 2 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cuisineOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(cuisines, option, setCuisines)}
                    className={`rounded-2xl border p-4 text-left transition ${cuisines.includes(option) ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-3 md:grid-cols-3">
                {prepOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCookTime(option)}
                    className={`rounded-2xl border p-5 text-left transition ${cookTime === option ? "border-transparent bg-nourish-terracotta text-white" : "border-nourish-border bg-white"}`}
                  >
                    <div className="mb-2 text-2xl">{option === "Under 20 min" ? "⏱️" : option === "Around 45 min" ? "🍲" : "🌿"}</div>
                    <div className="font-medium">{option}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex items-center justify-center gap-6 rounded-[28px] bg-nourish-bg px-6 py-10">
                <button type="button" className="button-secondary h-12 w-12 p-0" onClick={() => setServings((count) => Math.max(1, count - 1))}>
                  -
                </button>
                <span className="text-6xl">{servings}</span>
                <button type="button" className="button-secondary h-12 w-12 p-0" onClick={() => setServings((count) => Math.min(6, count + 1))}>
                  +
                </button>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between">
              <button type="button" className="text-sm text-nourish-muted" onClick={() => setStep((current) => Math.min(5, current + 1))}>
                Skip
              </button>
              <button type="button" className="button-primary" onClick={() => setStep((current) => Math.min(5, current + 1))}>
                Continue <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
