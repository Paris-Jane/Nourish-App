import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "components/AppShell";
import { useAuthStore } from "store/authStore";
import { HomePage } from "pages/HomePage";
import { FridgePage } from "pages/FridgePage";
import { GroceryPage } from "pages/GroceryPage";
import { LoginPage } from "pages/LoginPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { OnboardingPage } from "pages/OnboardingPage";
import { RecipeDetailPage } from "pages/RecipeDetailPage";
import { RecipeFormPage } from "pages/RecipeFormPage";
import { RecipesPage } from "pages/RecipesPage";
import { PrepSheetPage } from "pages/PrepSheetPage";
import { SavedWeeksPage } from "pages/SavedWeeksPage";
import { ProfilePage } from "pages/ProfilePage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const previewMode = useAuthStore((state) => state.previewMode);
  const location = useLocation();

  if (!token && !previewMode) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/grocery" element={<GroceryPage />} />
        <Route path="/fridge" element={<FridgePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/new" element={<RecipeFormPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
        <Route path="/saved-weeks" element={<SavedWeeksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/prep-sheet" element={<PrepSheetPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
