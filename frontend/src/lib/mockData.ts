import { addDays, formatISO } from "date-fns";
import { getCurrentWeekStart, weekDays } from "./utils";
import type {
  FridgeItem,
  GroceryList,
  Ingredient,
  Recipe,
  UserRecipePref,
  Week,
  WeekMealSlot,
} from "types/models";

const baseWeekStart = getCurrentWeekStart();

export const mockWeek: Week = {
  id: 1,
  householdId: 1,
  weekStartDate: formatISO(baseWeekStart, { representation: "date" }),
  status: "Draft",
  prepStyle: "OnePrepDay",
  maxCookTime: "Under45",
  isSavedTemplate: false,
  templateName: null,
  isInRotation: true,
  createdAt: new Date().toISOString(),
};

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    householdId: 1,
    name: "Herby Chickpea Bowls",
    cuisine: "Mediterranean",
    scalabilityTag: "Flexible",
    timeTag: "Quick",
    prepStyleTag: "BatchFriendly",
    isFreezerFriendly: false,
    isCookFreshOnly: false,
    baseYieldServings: 4,
    imageUrl: null,
    sourceUrl: null,
    foodGroupServings: { Protein: 1, Vegetable: 2, Grains: 1 },
    createdAt: new Date().toISOString(),
    ingredients: [],
    steps: [
      {
        id: 1,
        stepNumber: 1,
        instruction: "Roast the chickpeas until crisp.",
        timingTag: "PrepAhead",
        durationMinutes: 20,
        isPassive: true,
      },
      {
        id: 2,
        stepNumber: 2,
        instruction: "Toss with herbs, lemon, and warm grains.",
        timingTag: "DayOfActive",
        durationMinutes: 10,
        isPassive: false,
      },
    ],
  },
  {
    id: 2,
    householdId: 1,
    name: "Tomato Butter Pasta",
    cuisine: "Italian",
    scalabilityTag: "Portioned",
    timeTag: "Medium",
    prepStyleTag: "CookFresh",
    isFreezerFriendly: false,
    isCookFreshOnly: true,
    baseYieldServings: 3,
    imageUrl: null,
    sourceUrl: null,
    foodGroupServings: { Grains: 2, Vegetable: 1 },
    createdAt: new Date().toISOString(),
    ingredients: [],
    steps: [
      {
        id: 3,
        stepNumber: 1,
        instruction: "Simmer tomatoes, butter, and garlic.",
        timingTag: "DayOfPassive",
        durationMinutes: 20,
        isPassive: true,
      },
    ],
  },
  {
    id: 3,
    householdId: 1,
    name: "Sheet Pan Fajita Tacos",
    cuisine: "Mexican",
    scalabilityTag: "Flexible",
    timeTag: "Quick",
    prepStyleTag: "BatchFriendly",
    isFreezerFriendly: true,
    isCookFreshOnly: false,
    baseYieldServings: 4,
    imageUrl: null,
    sourceUrl: null,
    foodGroupServings: { Protein: 1, Vegetable: 2, Grains: 1 },
    createdAt: new Date().toISOString(),
    ingredients: [],
    steps: [],
  },
];

const mealRotation = [1, 2, null, 3];

export const mockSlots: WeekMealSlot[] = weekDays.flatMap((day, index) =>
  ["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType, mealIndex) => {
    const recipeId = mealRotation[(index + mealIndex) % mealRotation.length];
    const recipe = mockRecipes.find((entry) => entry.id === recipeId);

    return {
      id: index * 10 + mealIndex + 1,
      weekId: 1,
      recipeId,
      recipeName: recipe?.name ?? null,
      dayOfWeek: day,
      mealType: mealType as WeekMealSlot["mealType"],
      isEatingOut: false,
      isSkipped: false,
      isLocked: false,
      servingsPlanned: 2,
      assumedCompleted: false,
      markedSkippedAt: null,
    };
  }),
);

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
      ingredientName: "Baby spinach",
      plannedQuantity: 2,
      plannedUnit: "bags",
      purchasedQuantity: null,
      storeSection: "Produce",
      isChecked: false,
      addedToFridge: false,
      recipeIds: [1, 3],
    },
    {
      id: 2,
      groceryListId: 1,
      ingredientId: 2,
      ingredientName: "Greek yogurt",
      plannedQuantity: 1,
      plannedUnit: "tub",
      purchasedQuantity: 1,
      storeSection: "Dairy",
      isChecked: true,
      addedToFridge: true,
      recipeIds: [1],
    },
    {
      id: 3,
      groceryListId: 1,
      ingredientId: 3,
      ingredientName: "Brown rice",
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
    ingredientName: "Baby spinach",
    quantity: 1,
    unit: "bag",
    location: "Fridge",
    purchasedAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), 1).toISOString(),
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "Manual",
  },
  {
    id: 2,
    householdId: 1,
    ingredientId: 2,
    ingredientName: "Greek yogurt",
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
    ingredientId: 3,
    ingredientName: "Frozen peas",
    quantity: 1,
    unit: "bag",
    location: "Freezer",
    purchasedAt: new Date().toISOString(),
    expiresAt: null,
    isLeftover: false,
    sourceRecipeId: null,
    addedVia: "Manual",
  },
];

export const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Baby spinach",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "bag",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 4,
  },
  {
    id: 2,
    name: "Greek yogurt",
    foodGroup: "Dairy",
    servingSize: 0.75,
    servingUnit: "cup",
    purchaseUnit: "tub",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 3,
    name: "Brown rice",
    foodGroup: "Grains",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "bag",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 180,
  },
];

export const mockSavedWeeks: Week[] = [
  {
    ...mockWeek,
    id: 2,
    isSavedTemplate: true,
    templateName: "Cozy Spring Rotation",
  },
  {
    ...mockWeek,
    id: 3,
    isSavedTemplate: true,
    templateName: "Busy Week Backup",
    isInRotation: false,
  },
];

export const mockRecipePrefs: Record<number, UserRecipePref> = {
  1: {
    id: 1,
    recipeId: 1,
    isFavorite: true,
    isDisliked: false,
    lastUsedAt: new Date().toISOString(),
  },
};
