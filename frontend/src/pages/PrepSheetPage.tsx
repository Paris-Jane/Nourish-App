import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const prepAhead = [
  "Wash and chop vegetables for Tuesday’s sheet pan.",
  "Cook a batch of grains for bowls later in the week.",
];

const dayOf = [
  "Warm components and assemble plates.",
  "Finish with fresh herbs and a quick dressing.",
];

export function PrepSheetPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      <Link
        to="/"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-ink shadow-sm transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
      >
        <ArrowLeft size={18} aria-hidden />
        Back to home
      </Link>
      <div className="card p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl">Your prep plan</h1>
        <p className="mt-2 text-sm text-nourish-muted">A simple preview of how prep can line up with your week.</p>
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-nourish-ink">Prep ahead</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-nourish-ink">
          {prepAhead.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-nourish-ink">Day of</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-nourish-ink">
          {dayOf.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
