// Recipes + ingredients mirror MealPlanner.Api/Data/DbSeeder.cs (see src/lib/dbSeederMockData.ts).
import { addDays, formatISO } from "date-fns";
import { getCurrentWeekStart, weekDays } from "./utils";
import type {
  FridgeItem,
  GroceryList,
  SavedWeekTemplate,
  UserIngredientPref,
  UserRecipePref,
  UserWeekPref,
  Week,
  WeekMealSlot,
} from "types/models";
import { mockIngredientsFromDbSeeder, mockRecipesFromDbSeeder } from "./dbSeederMockData";

const baseWeekStart = getCurrentWeekStart();

export const mockWeek: Week = {
  id: 1,
  householdId: 1,
  weekStartDate: formatISO(baseWeekStart, { representation: "date" }),
  status: "Open",
  prepStyle: "OnePrepDay",
  maxCookTime: "Under45",
  isSavedTemplate: false,
  templateName: null,
  isInRotation: true,
  createdAt: new Date().toISOString(),
};

export const mockRecipes = mockRecipesFromDbSeeder;
export const mockIngredients = mockIngredientsFromDbSeeder;

const mealRotation = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, null];

export const mockSlots: WeekMealSlot[] = weekDays.flatMap((day, index) =>
  (["Breakfast", "Lunch", "Dinner", "Snack"] as const).map((mealType, mealIndex) => {
    const recipeId = mealRotation[(index + mealIndex) % mealRotation.length];
    const recipe = mockRecipes.find((entry) => entry.id === recipeId);
    const planDate = formatISO(addDays(baseWeekStart, index), { representation: "date" });

    return {
      id: index * 10 + mealIndex + 1,
      weekId: 1,
      planDate,
      recipeId,
      recipeName: recipe?.name ?? null,
      selectedModifierIngredientIds: [],
      dayOfWeek: day,
      mealType: mealType as WeekMealSlot["mealType"],
      position: 0,
      isEatingOut: false,
      isSkipped: false,
      isLocked: false,
      servingsPlanned: 2,
      assumedCompleted: false,
      markedSkippedAt: null,
    };
  }),
);

function templateSlotsFromMockSlots(): SavedWeekTemplate["slots"] {
  return mockSlots.map((s) => ({
    dayOfWeek: s.dayOfWeek,
    mealType: s.mealType,
    position: s.position,
    recipeId: s.recipeId ?? null,
    recipeName: s.recipeName ?? null,
    isEatingOut: s.isEatingOut,
    isSkipped: s.isSkipped,
  }));
}

export const mockSavedTemplates: SavedWeekTemplate[] = [
  {
    id: 2,
    householdId: 1,
    name: "Cozy Spring Rotation",
    createdAt: new Date().toISOString(),
    slots: templateSlotsFromMockSlots().map((s, i) => (i % 5 === 0 ? { ...s, recipeId: 1, recipeName: "Chicken and Rice" } : s)),
  },
  {
    id: 3,
    householdId: 1,
    name: "Busy Week Backup",
    createdAt: new Date().toISOString(),
    slots: templateSlotsFromMockSlots().map((s, i) => (i % 3 === 0 ? { ...s, recipeId: 2, recipeName: "Scrambled Eggs" } : { ...s, recipeId: null, recipeName: null })),
  },
];

export const mockGroceryList: GroceryList = {
  id: 1,
  weekId: 1,
  householdId: 1,
  generatedAt: new Date().toISOString(),
  status: "Active",
  completedAt: null,
  items: [
    {
      id: 1,
      groceryListId: 1,
      ingredientId: 1,
      ingredientName: "Chicken Breast",
      plannedQuantity: 2,
      plannedUnit: "lb",
      purchasedQuantity: null,
      storeSection: "Protein",
      isChecked: false,
      addedToFridge: false,
      recipeIds: [1],
    },
    {
      id: 2,
      groceryListId: 1,
      ingredientId: 6,
      ingredientName: "Greek Yogurt",
      plannedQuantity: 1,
      plannedUnit: "tub",
      purchasedQuantity: 1,
      storeSection: "Dairy",
      isChecked: true,
      addedToFridge: true,
      recipeIds: [4],
    },
    {
      id: 3,
      groceryListId: 1,
      ingredientId: 2,
      ingredientName: "Brown Rice",
      plannedQuantity: 1,
      plannedUnit: "bag",
      purchasedQuantity: null,
      storeSection: "Grains",
      isChecked: false,
      addedToFridge: false,
      recipeIds: [1],
    },
  ],
};

export const mockFridgeItems: FridgeItem[] = [
  {
    id: 1,
    householdId: 1,
    ingredientId: 1,
    ingredientName: "Chicken Breast",
    quantity: 1,
    unit: "lb",
    location: "Fridge",
    purchasedAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), 2).toISOString(),
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "Manual",
  },
  {
    id: 2,
    householdId: 1,
    ingredientId: 6,
    ingredientName: "Greek Yogurt",
    quantity: 1,
    unit: "tub",
    location: "Fridge",
    purchasedAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), 5).toISOString(),
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "GroceryList",
  },
  {
    id: 3,
    householdId: 1,
    ingredientId: 65,
    ingredientName: "Peas",
    quantity: 1,
    unit: "bag",
    location: "Freezer",
    purchasedAt: new Date().toISOString(),
    expiresAt: null,
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "Manual",
  },
  {
    id: 4,
    householdId: 1,
    ingredientId: 2,
    ingredientName: "Brown Rice",
    quantity: 2,
    unit: "lb",
    location: "Pantry",
    purchasedAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), 200).toISOString(),
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "Manual",
  },
  {
    id: 5,
    householdId: 1,
    ingredientId: 35,
    ingredientName: "Spinach",
    quantity: 1,
    unit: "bag",
    location: "Fridge",
    purchasedAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), 2).toISOString(),
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "GroceryList",
  },
];


/** @deprecated use mockSavedTemplates — kept for older imports during migration */
export const mockSavedWeeks: Week[] = mockSavedTemplates.map((t) => ({
  ...mockWeek,
  id: t.id,
  isSavedTemplate: true,
  templateName: t.name,
  isInRotation: t.id === 2,
}));

export const mockRecipePrefs: Record<number, UserRecipePref> = {
  1: {
    id: 1,
    recipeId: 1,
    isFavorite: true,
    isDisliked: false,
    selectedModifierIngredientIds: [],
    lastUsedAt: new Date().toISOString(),
  },
  6: {
    id: 2,
    recipeId: 6,
    isFavorite: false,
    isDisliked: false,
    selectedModifierIngredientIds: [28],
    lastUsedAt: new Date().toISOString(),
  },
};

export const mockIngredientPrefs: Record<number, UserIngredientPref> = {
  1: {
    id: 1,
    userId: 1,
    ingredientId: 1,
    isFavorite: true,
    lastUsedAt: new Date().toISOString(),
  },
  6: {
    id: 2,
    userId: 1,
    ingredientId: 6,
    isFavorite: true,
    lastUsedAt: new Date().toISOString(),
  },
};

export const mockWeekPrefs: Record<number, UserWeekPref> = {
  2: {
    id: 1,
    userId: 1,
    weekId: 2,
    isFavorite: true,
  },
};
