ALTER TABLE "WeekMealSlots"
ADD COLUMN IF NOT EXISTS "SelectedModifierIngredientIds" jsonb NOT NULL DEFAULT '[]'::jsonb;
