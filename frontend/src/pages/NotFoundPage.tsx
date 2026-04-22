import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="card mx-auto mt-20 max-w-xl p-10 text-center">
      <h1 className="mb-3 text-5xl">Page not found</h1>
      <p className="mb-5 text-nourish-muted">This part of the kitchen isn’t set up yet.</p>
      <Link to="/" className="button-primary">
        Back home
      </Link>
    </div>
  );
}
