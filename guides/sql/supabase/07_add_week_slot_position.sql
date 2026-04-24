ALTER TABLE "WeekMealSlots"
ADD COLUMN IF NOT EXISTS "Position" integer NOT NULL DEFAULT 0;

DROP INDEX IF EXISTS "IX_WeekMealSlots_WeekId_DayOfWeek_MealType";

CREATE UNIQUE INDEX IF NOT EXISTS "IX_WeekMealSlots_WeekId_DayOfWeek_MealType_Position"
ON "WeekMealSlots" ("WeekId", "DayOfWeek", "MealType", "Position");
