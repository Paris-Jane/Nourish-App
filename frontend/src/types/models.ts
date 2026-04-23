export type ActivityLevel = "Sedentary" | "Light" | "Moderate" | "Active";
export type PrepStyle = "DayOf" | "OnePrepDay" | "TwoPrepDays";
export type CookTime = "Under20" | "Under45" | "NoLimit";
export type FoodGroup = "Grains" | "Protein" | "Vegetable" | "Fruit" | "Dairy" | "Legume";
export type ScalabilityTag = "Flexible" | "Rigid" | "Portioned";
export type TimeTag = "Quick" | "Medium" | "Involved";
export type RecipePrepStyleTag = "BatchFriendly" | "CookFresh" | "FreezerFriendly";
export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type WeekStatus = "Draft" | "Active" | "Completed";
export type GroceryListStatus = "Active" | "Completed";
export type FridgeLocation = "Fridge" | "Pantry" | "Freezer";
export type AddedVia = "GroceryList" | "ReceiptScan" | "Manual" | "Leftover";
export type SheetType = "BatchPrepDay" | "NightOf";
export type TimingTag = "PrepAhead" | "DayOfActive" | "DayOfPassive";

export interface User {
  id: number;
  householdId: number;
  displayName: string;
  email: string;
}

export interface Household {
  id: number;
  name: string;
  size: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdPreferences {
  id: number;
  householdId: number;
  dietaryRestrictions: string[];
  dislikedIngredients: string[];
  cuisinePreferences: string[];
  defaultCookTime: CookTime;
  defaultPrepStyle: PrepStyle;
  myPlateTargets?: Record<string, number> | null;
  updatedAt: string;
}

export interface Ingredient {
  id: number;
  name: string;
  foodGroup: FoodGroup;
  servingSize: number;
  servingUnit: string;
  purchaseUnit: string;
  isPerishable: boolean;
  isFlexibleGroup: boolean;
  shelfLifeDays: number;
}

export interface UserIngredientPref {
  id: number;
  userId: number;
  ingredientId: number;
  isFavorite: boolean;
  lastUsedAt?: string | null;
}

export interface RecipeIngredient {
  id: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  isModifier: boolean;
  isOptional: boolean;
  substituteIngredientIds: number[];
  notes?: string | null;
}

export interface RecipeStep {
  id: number;
  stepNumber: number;
  instruction: string;
  timingTag: TimingTag;
  durationMinutes: number;
  isPassive: boolean;
}

export interface Recipe {
  id: number;
  householdId: number;
  name: string;
  cuisine: string;
  scalabilityTag: ScalabilityTag;
  timeTag: TimeTag;
  prepStyleTag: RecipePrepStyleTag;
  isFreezerFriendly: boolean;
  isCookFreshOnly: boolean;
  baseYieldServings: number;
  mealTypeTags: MealType[];
  imageUrl?: string | null;
  sourceUrl?: string | null;
  foodGroupServings: Record<string, number>;
  createdAt: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface UserRecipePref {
  id: number;
  recipeId: number;
  isFavorite: boolean;
  isDisliked: boolean;
  lastUsedAt?: string | null;
}

export interface Week {
  id: number;
  householdId: number;
  weekStartDate: string;
  status: WeekStatus;
  prepStyle: PrepStyle;
  maxCookTime: CookTime;
  isSavedTemplate: boolean;
  templateName?: string | null;
  isInRotation: boolean;
  createdAt: string;
}

export interface UserWeekPref {
  id: number;
  userId: number;
  weekId: number;
  isFavorite: boolean;
}

export interface WeekMealSlot {
  id: number;
  weekId: number;
  recipeId?: number | null;
  recipeName?: string | null;
  dayOfWeek: WeekDay;
  mealType: MealType;
  isEatingOut: boolean;
  isSkipped: boolean;
  isLocked: boolean;
  servingsPlanned: number;
  assumedCompleted: boolean;
  markedSkippedAt?: string | null;
}

export interface SnackSuggestion {
  id: number;
  weekId: number;
  dayOfWeek: WeekDay;
  suggestionText: string;
  foodGroupTarget: string;
  usesFridgeItemId?: number | null;
  isAccepted: boolean;
  createdAt: string;
}

export interface GroceryListItem {
  id: number;
  groceryListId: number;
  ingredientId: number;
  ingredientName: string;
  plannedQuantity: number;
  plannedUnit: string;
  purchasedQuantity?: number | null;
  storeSection: string;
  isChecked: boolean;
  addedToFridge: boolean;
  recipeIds: number[];
}

export interface GroceryList {
  id: number;
  weekId: number;
  householdId: number;
  generatedAt: string;
  status: GroceryListStatus;
  completedAt?: string | null;
  items: GroceryListItem[];
}

export interface FridgeItem {
  id: number;
  householdId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  location: FridgeLocation;
  purchasedAt?: string | null;
  expiresAt?: string | null;
  isLeftover: boolean;
  sourceRecipeId?: number | null;
  addedVia: AddedVia;
}

export interface FridgeDepletionLog {
  id: number;
  fridgeItemId: number;
  weekMealSlotId: number;
  quantityUsed: number;
  createdAt: string;
}

export interface PrepSheetStep {
  id: number;
  recipeStepId: number;
  instruction: string;
  displayOrder: number;
  parallelGroup: number;
  startOffsetMinutes: number;
  recipeNameContext: string;
  durationMinutes: number;
  isPassive: boolean;
}

export interface PrepSheet {
  id: number;
  weekId: number;
  prepDay: string;
  sheetType: SheetType;
  generatedAt: string;
  totalTimeMinutes: number;
  steps: PrepSheetStep[];
}

export interface AuthResponse {
  token: string;
  userId: number;
  householdId: number;
  displayName: string;
  email: string;
}

export interface RecipeCandidate {
  id: number;
  name: string;
  cuisine: string;
  timeTag: TimeTag;
  baseYieldServings: number;
}
