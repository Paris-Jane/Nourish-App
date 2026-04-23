import { z } from "zod";

export const registerSchema = z.object({
  displayName: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
  householdName: z.string().min(2, "Add a household name."),
  householdSize: z.number().min(1).max(6),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export const recipeFormSchema = z.object({
  name: z.string().min(2),
  cuisine: z.string().min(2),
  scalabilityTag: z.enum(["Flexible", "Rigid", "Portioned"]),
  timeTag: z.enum(["Quick", "Medium", "Involved"]),
  prepStyleTag: z.enum(["BatchFriendly", "CookFresh", "FreezerFriendly"]),
  isFreezerFriendly: z.boolean(),
  isCookFreshOnly: z.boolean(),
  baseYieldServings: z.number().min(1).max(12),
  mealTypeTags: z.array(z.enum(["Breakfast", "Lunch", "Dinner", "Snack"])).min(1),
  ingredients: z.array(
    z.object({
      ingredientId: z.number().min(1),
      quantity: z.number().positive(),
      unit: z.string().min(1),
      isOptional: z.boolean(),
      isModifier: z.boolean(),
    }),
  ),
  steps: z.array(
    z.object({
      instruction: z.string().min(3),
      timingTag: z.enum(["PrepAhead", "DayOfActive", "DayOfPassive"]),
      durationMinutes: z.number().min(0),
    }),
  ),
});

export const fridgeItemSchema = z.object({
  ingredientId: z.number().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  location: z.enum(["Fridge", "Pantry", "Freezer"]),
  expiresAt: z
    .string()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val : undefined)),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type FridgeItemFormValues = z.infer<typeof fridgeItemSchema>;
