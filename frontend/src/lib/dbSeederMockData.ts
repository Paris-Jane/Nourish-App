import type { Ingredient, Recipe } from "types/models";

/** Snapshot of MealPlanner.Api/Data/DbSeeder.cs seed order (Ids 1–72) + recipes 1–18. Regenerate: `node scripts/generate-dbseeder-mock.mjs > src/lib/dbSeederMockData.ts`. */
export const mockIngredientsFromDbSeeder: Ingredient[] = [
  {
    id: 1,
    name: "Chicken Breast",
    foodGroup: "Protein",
    servingSize: 3,
    servingUnit: "oz",
    purchaseUnit: "lb",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 3,
  },
  {
    id: 2,
    name: "Brown Rice",
    foodGroup: "Grains",
    servingSize: 0.5,
    servingUnit: "cup cooked",
    purchaseUnit: "lb",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 3,
    name: "Broccoli",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "head",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 4,
    name: "Eggs",
    foodGroup: "Protein",
    servingSize: 1,
    servingUnit: "large egg",
    purchaseUnit: "dozen",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 21,
  },
  {
    id: 5,
    name: "Black Beans",
    foodGroup: "Legume",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "can",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: true,
    shelfLifeDays: 730,
  },
  {
    id: 6,
    name: "Greek Yogurt",
    foodGroup: "Dairy",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "tub",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 10,
  },
  {
    id: 7,
    name: "Mixed Berries",
    foodGroup: "Fruit",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "bag",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 8,
    name: "Granola",
    foodGroup: "Grains",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "bag",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 180,
  },
  {
    id: 9,
    name: "Honey",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "bottle",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 10,
    name: "Banana",
    foodGroup: "Fruit",
    servingSize: 1,
    servingUnit: "whole",
    purchaseUnit: "bunch",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 11,
    name: "Whipped Cream",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "can",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 14,
  },
  {
    id: 12,
    name: "Jam",
    foodGroup: "Fruit",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 13,
    name: "Walnuts",
    foodGroup: "Protein",
    servingSize: 1,
    servingUnit: "oz",
    purchaseUnit: "bag",
    defaultLocation: "Pantry",
    storeSection: "Protein",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 180,
  },
  {
    id: 14,
    name: "Peanut Butter",
    foodGroup: "Protein",
    servingSize: 2,
    servingUnit: "tbsp",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Protein",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 180,
  },
  {
    id: 15,
    name: "Oatmeal Packet",
    foodGroup: "Grains",
    servingSize: 1,
    servingUnit: "packet",
    purchaseUnit: "box",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 16,
    name: "Butter",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "box",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 90,
  },
  {
    id: 17,
    name: "Maple Syrup",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "bottle",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 18,
    name: "Cinnamon",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tsp",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 19,
    name: "Whole Grain Bread",
    foodGroup: "Grains",
    servingSize: 1,
    servingUnit: "slice",
    purchaseUnit: "loaf",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 20,
    name: "Avocado",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "whole",
    purchaseUnit: "each",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 21,
    name: "Salt",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tsp",
    purchaseUnit: "container",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 22,
    name: "Black Pepper",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tsp",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 23,
    name: "Cottage Cheese",
    foodGroup: "Dairy",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "tub",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 24,
    name: "Pico de Gallo",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "container",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 25,
    name: "Tomatoes",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "each",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 26,
    name: "Balsamic Glaze",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "bottle",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 27,
    name: "Basil",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "bunch",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 28,
    name: "Bacon",
    foodGroup: "Protein",
    servingSize: 2,
    servingUnit: "slices",
    purchaseUnit: "package",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 29,
    name: "Flour Tortilla",
    foodGroup: "Grains",
    servingSize: 1,
    servingUnit: "tortilla",
    purchaseUnit: "package",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 14,
  },
  {
    id: 30,
    name: "Cheddar Cheese",
    foodGroup: "Dairy",
    servingSize: 1.5,
    servingUnit: "oz",
    purchaseUnit: "block",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 21,
  },
  {
    id: 31,
    name: "Potato",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup cooked",
    purchaseUnit: "each",
    defaultLocation: "Pantry",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 32,
    name: "Salsa",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 33,
    name: "Breakfast Sausage",
    foodGroup: "Protein",
    servingSize: 3,
    servingUnit: "oz",
    purchaseUnit: "package",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 3,
  },
  {
    id: 34,
    name: "Ham",
    foodGroup: "Protein",
    servingSize: 3,
    servingUnit: "oz",
    purchaseUnit: "lb",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 35,
    name: "Spinach",
    foodGroup: "Vegetable",
    servingSize: 2,
    servingUnit: "cups raw",
    purchaseUnit: "bag",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 36,
    name: "Bell Pepper",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "each",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 37,
    name: "Onion",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "each",
    defaultLocation: "Pantry",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 38,
    name: "Olive Oil",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "bottle",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 39,
    name: "Smoked Paprika",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tsp",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 40,
    name: "Garlic Powder",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tsp",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 41,
    name: "Green Onions",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "bunch",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 42,
    name: "Hot Sauce",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tsp",
    purchaseUnit: "bottle",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 730,
  },
  {
    id: 43,
    name: "Romaine Lettuce",
    foodGroup: "Vegetable",
    servingSize: 2,
    servingUnit: "cups chopped",
    purchaseUnit: "head",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 44,
    name: "Cucumber",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup sliced",
    purchaseUnit: "each",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 45,
    name: "Red Onion",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "each",
    defaultLocation: "Pantry",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 46,
    name: "Feta Cheese",
    foodGroup: "Dairy",
    servingSize: 1.5,
    servingUnit: "oz",
    purchaseUnit: "container",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 14,
  },
  {
    id: 47,
    name: "Mozzarella Cheese",
    foodGroup: "Dairy",
    servingSize: 1.5,
    servingUnit: "oz",
    purchaseUnit: "package",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 14,
  },
  {
    id: 48,
    name: "Dill",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "bunch",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 49,
    name: "Ground Beef",
    foodGroup: "Protein",
    servingSize: 3,
    servingUnit: "oz",
    purchaseUnit: "lb",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 2,
  },
  {
    id: 50,
    name: "Chickpeas",
    foodGroup: "Legume",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "can",
    defaultLocation: "Pantry",
    storeSection: "Protein",
    isPerishable: false,
    isFlexibleGroup: true,
    shelfLifeDays: 730,
  },
  {
    id: 51,
    name: "Spaghetti",
    foodGroup: "Grains",
    servingSize: 0.5,
    servingUnit: "cup cooked",
    purchaseUnit: "box",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 52,
    name: "Marinara Sauce",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 53,
    name: "Pesto",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "jar",
    defaultLocation: "Fridge",
    storeSection: "Pantry",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 54,
    name: "Alfredo Sauce",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "jar",
    defaultLocation: "Fridge",
    storeSection: "Pantry",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 55,
    name: "Parmesan Cheese",
    foodGroup: "Dairy",
    servingSize: 1.5,
    servingUnit: "oz",
    purchaseUnit: "wedge",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 56,
    name: "Corn",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "bag",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 57,
    name: "Sour Cream",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "tub",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 14,
  },
  {
    id: 58,
    name: "Pita Bread",
    foodGroup: "Grains",
    servingSize: 1,
    servingUnit: "pita",
    purchaseUnit: "package",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 59,
    name: "Naan",
    foodGroup: "Grains",
    servingSize: 1,
    servingUnit: "piece",
    purchaseUnit: "package",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 7,
  },
  {
    id: 60,
    name: "Gyro Meat",
    foodGroup: "Protein",
    servingSize: 3,
    servingUnit: "oz",
    purchaseUnit: "package",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 61,
    name: "Tzatziki",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "container",
    defaultLocation: "Fridge",
    storeSection: "Dairy",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 10,
  },
  {
    id: 62,
    name: "Cream Sauce",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "batch",
    defaultLocation: "Fridge",
    storeSection: "Pantry",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 4,
  },
  {
    id: 63,
    name: "Pineapple",
    foodGroup: "Fruit",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "each",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 64,
    name: "Chow Mein Noodles",
    foodGroup: "Grains",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "can",
    defaultLocation: "Pantry",
    storeSection: "Grains",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 65,
    name: "Peas",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "bag",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 5,
  },
  {
    id: 66,
    name: "Celery",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup chopped",
    purchaseUnit: "bunch",
    defaultLocation: "Fridge",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 14,
  },
  {
    id: 67,
    name: "Taco Seasoning",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "packet",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 68,
    name: "V8 Juice",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup",
    purchaseUnit: "bottle",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 69,
    name: "Sweet Potato",
    foodGroup: "Vegetable",
    servingSize: 1,
    servingUnit: "cup cooked",
    purchaseUnit: "each",
    defaultLocation: "Pantry",
    storeSection: "Produce",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 30,
  },
  {
    id: 70,
    name: "Olives",
    foodGroup: "Vegetable",
    servingSize: 0.5,
    servingUnit: "cup",
    purchaseUnit: "jar",
    defaultLocation: "Pantry",
    storeSection: "Pantry",
    isPerishable: false,
    isFlexibleGroup: false,
    shelfLifeDays: 365,
  },
  {
    id: 71,
    name: "Mayonnaise",
    foodGroup: "Other",
    servingSize: 0,
    servingUnit: "tbsp",
    purchaseUnit: "jar",
    defaultLocation: "Fridge",
    storeSection: "Pantry",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 90,
  },
  {
    id: 72,
    name: "Turkey Breast",
    foodGroup: "Protein",
    servingSize: 3,
    servingUnit: "oz",
    purchaseUnit: "lb",
    defaultLocation: "Fridge",
    storeSection: "Protein",
    isPerishable: true,
    isFlexibleGroup: false,
    shelfLifeDays: 3,
  }
];

export const mockRecipesFromDbSeeder = [
  {
    "id": 1,
    "householdId": 1,
    "name": "Chicken and Rice",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Medium",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": true,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.333Z",
    "ingredients": [
      {
        "id": 1,
        "ingredientId": 1,
        "ingredientName": "Chicken Breast",
        "quantity": 1.5,
        "unit": "lb",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 2,
        "ingredientId": 2,
        "ingredientName": "Brown Rice",
        "quantity": 1,
        "unit": "cup dry",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 3,
        "ingredientId": 3,
        "ingredientName": "Broccoli",
        "quantity": 2,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 1,
        "stepNumber": 1,
        "instruction": "Cook {ingredients} until tender.",
        "timingTag": "PrepAhead",
        "durationMinutes": 40,
        "isPassive": true,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          2
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 2,
        "stepNumber": 2,
        "instruction": "Season and cook {ingredients} until done, then slice for easy reheating.",
        "timingTag": "PrepAhead",
        "durationMinutes": 15,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          1
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 3,
        "stepNumber": 3,
        "instruction": "Steam {ingredients} until crisp-tender.",
        "timingTag": "PrepAhead",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "RoastBake",
        "linkedIngredientIds": [
          3
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 4,
        "stepNumber": 4,
        "instruction": "Reheat the rice, chicken, and broccoli together before serving.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          2,
          1,
          3
        ]
      }
    ]
  },
  {
    "id": 2,
    "householdId": 1,
    "name": "Scrambled Eggs",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 2,
    "mealTypeTags": [
      "Breakfast",
      "Snack"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "protein": 2,
      "dairy": 0.5
    },
    "createdAt": "2026-04-28T18:54:28.343Z",
    "ingredients": [
      {
        "id": 4,
        "ingredientId": 4,
        "ingredientName": "Eggs",
        "quantity": 4,
        "unit": "large eggs",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 5,
        "stepNumber": 1,
        "instruction": "Whisk {ingredients} with salt and pepper.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          4
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 6,
        "stepNumber": 2,
        "instruction": "Cook the eggs over medium-low heat, stirring gently until just set.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          4
        ]
      }
    ]
  },
  {
    "id": 3,
    "householdId": 1,
    "name": "Black Bean Tacos",
    "cuisine": "Mexican",
    "scalabilityTag": "Flexible",
    "timeTag": "Medium",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.343Z",
    "ingredients": [
      {
        "id": 5,
        "ingredientId": 5,
        "ingredientName": "Black Beans",
        "quantity": 2,
        "unit": "cans",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 6,
        "ingredientId": 3,
        "ingredientName": "Broccoli",
        "quantity": 1,
        "unit": "cup",
        "isModifier": false,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 7,
        "stepNumber": 1,
        "instruction": "Drain, rinse, and season {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          5
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 8,
        "stepNumber": 2,
        "instruction": "Warm the beans before serving.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          5
        ]
      },
      {
        "id": 9,
        "stepNumber": 3,
        "instruction": "Warm tortillas and assemble tacos with beans and your chosen toppings.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "AssemblePortion"
      }
    ]
  },
  {
    "id": 4,
    "householdId": 1,
    "name": "Yogurt Parfait",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 1,
    "mealTypeTags": [
      "Breakfast",
      "Snack"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "dairy": 1,
      "fruit": 1,
      "grains": 1
    },
    "createdAt": "2026-04-28T18:54:28.343Z",
    "ingredients": [
      {
        "id": 7,
        "ingredientId": 6,
        "ingredientName": "Greek Yogurt",
        "quantity": 1,
        "unit": "cup",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 8,
        "ingredientId": 7,
        "ingredientName": "Mixed Berries",
        "quantity": 1,
        "unit": "cup",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 9,
        "ingredientId": 8,
        "ingredientName": "Granola",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 10,
        "ingredientId": 9,
        "ingredientName": "Honey",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 11,
        "ingredientId": 10,
        "ingredientName": "Banana",
        "quantity": 0.5,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 12,
        "ingredientId": 13,
        "ingredientName": "Walnuts",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 13,
        "ingredientId": 12,
        "ingredientName": "Jam",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 14,
        "ingredientId": 11,
        "ingredientName": "Whipped Cream",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 10,
        "stepNumber": 1,
        "instruction": "Portion {ingredients} into jars or bowls.",
        "timingTag": "PrepAhead",
        "durationMinutes": 4,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          6,
          7
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 11,
        "stepNumber": 2,
        "instruction": "Keep granola separate so it stays crisp, then add it just before serving.",
        "timingTag": "DayOfActive",
        "durationMinutes": 1,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          8
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 12,
        "stepNumber": 3,
        "instruction": "Add any selected extras: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 1,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          9,
          10,
          13,
          12,
          11
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 5,
    "householdId": 1,
    "name": "Oatmeal",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 1,
    "mealTypeTags": [
      "Breakfast",
      "Snack"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 15,
        "ingredientId": 15,
        "ingredientName": "Oatmeal Packet",
        "quantity": 1,
        "unit": "packet",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 16,
        "ingredientId": 16,
        "ingredientName": "Butter",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 17,
        "ingredientId": 17,
        "ingredientName": "Maple Syrup",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 18,
        "ingredientId": 18,
        "ingredientName": "Cinnamon",
        "quantity": 0.5,
        "unit": "tsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 19,
        "ingredientId": 7,
        "ingredientName": "Mixed Berries",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 20,
        "ingredientId": 10,
        "ingredientName": "Banana",
        "quantity": 0.5,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 21,
        "ingredientId": 14,
        "ingredientName": "Peanut Butter",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 22,
        "ingredientId": 13,
        "ingredientName": "Walnuts",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 23,
        "ingredientId": 11,
        "ingredientName": "Whipped Cream",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 13,
        "stepNumber": 1,
        "instruction": "Microwave {ingredients} according to package directions.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          15
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 14,
        "stepNumber": 2,
        "instruction": "Stir in {ingredients} while the oats are hot.",
        "timingTag": "DayOfActive",
        "durationMinutes": 1,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          16
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 15,
        "stepNumber": 3,
        "instruction": "Finish with any selected toppings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 1,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          17,
          18,
          7,
          10,
          14,
          13,
          11
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 6,
    "householdId": 1,
    "name": "Avocado Toast",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 1,
    "mealTypeTags": [
      "Breakfast",
      "Lunch"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 24,
        "ingredientId": 19,
        "ingredientName": "Whole Grain Bread",
        "quantity": 2,
        "unit": "slices",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 25,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 1,
        "unit": "whole",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 26,
        "ingredientId": 21,
        "ingredientName": "Salt",
        "quantity": 0.25,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 27,
        "ingredientId": 22,
        "ingredientName": "Black Pepper",
        "quantity": 0.25,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 28,
        "ingredientId": 4,
        "ingredientName": "Eggs",
        "quantity": 1,
        "unit": "large egg",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 29,
        "ingredientId": 28,
        "ingredientName": "Bacon",
        "quantity": 2,
        "unit": "slices",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 30,
        "ingredientId": 23,
        "ingredientName": "Cottage Cheese",
        "quantity": 0.25,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 31,
        "ingredientId": 24,
        "ingredientName": "Pico de Gallo",
        "quantity": 0.25,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 32,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 0.5,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 33,
        "ingredientId": 26,
        "ingredientName": "Balsamic Glaze",
        "quantity": 1,
        "unit": "tsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 34,
        "ingredientId": 27,
        "ingredientName": "Basil",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 16,
        "stepNumber": 1,
        "instruction": "Boil {ingredients}, cool them, and refrigerate until needed.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": true,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          4
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 17,
        "stepNumber": 2,
        "instruction": "Cook {ingredients} until crisp, then refrigerate for the week.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          28
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 18,
        "stepNumber": 3,
        "instruction": "Toast {ingredients} until golden and crisp.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          19
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 19,
        "stepNumber": 4,
        "instruction": "Mash {ingredients} with salt and pepper, then spread over the toast.",
        "timingTag": "DayOfActive",
        "durationMinutes": 4,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          20
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 20,
        "stepNumber": 5,
        "instruction": "Add any selected toppings: {ingredients}. Serve right away.",
        "timingTag": "DayOfActive",
        "durationMinutes": 2,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          4,
          28,
          23,
          24,
          25,
          26,
          27
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 7,
    "householdId": 1,
    "name": "Breakfast Burrito",
    "cuisine": "American",
    "scalabilityTag": "Portioned",
    "timeTag": "Medium",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": true,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Breakfast",
      "Lunch"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "vegetables": 1,
      "dairy": 0.5
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 35,
        "ingredientId": 29,
        "ingredientName": "Flour Tortilla",
        "quantity": 4,
        "unit": "tortillas",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 36,
        "ingredientId": 4,
        "ingredientName": "Eggs",
        "quantity": 8,
        "unit": "large eggs",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 37,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 4,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 38,
        "ingredientId": 31,
        "ingredientName": "Potato",
        "quantity": 4,
        "unit": "medium potatoes",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 39,
        "ingredientId": 28,
        "ingredientName": "Bacon",
        "quantity": 8,
        "unit": "slices",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 40,
        "ingredientId": 5,
        "ingredientName": "Black Beans",
        "quantity": 1,
        "unit": "can",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 41,
        "ingredientId": 32,
        "ingredientName": "Salsa",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 42,
        "ingredientId": 33,
        "ingredientName": "Breakfast Sausage",
        "quantity": 8,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 43,
        "ingredientId": 35,
        "ingredientName": "Spinach",
        "quantity": 2,
        "unit": "cups raw",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 44,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 1,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 45,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 46,
        "ingredientId": 36,
        "ingredientName": "Bell Pepper",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 47,
        "ingredientId": 37,
        "ingredientName": "Onion",
        "quantity": 0.5,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 21,
        "stepNumber": 1,
        "instruction": "Roast or saute {ingredients} until tender and crisp at the edges.",
        "timingTag": "PrepAhead",
        "durationMinutes": 20,
        "isPassive": false,
        "prepCategory": "RoastBake",
        "linkedIngredientIds": [
          31
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 22,
        "stepNumber": 2,
        "instruction": "Cook {ingredients} until browned and cooked through.",
        "timingTag": "PrepAhead",
        "durationMinutes": 12,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          28,
          33
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 23,
        "stepNumber": 3,
        "instruction": "Scramble {ingredients} until just set.",
        "timingTag": "PrepAhead",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          4
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 24,
        "stepNumber": 4,
        "instruction": "Cook any selected filling vegetables or beans: {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "WashChop",
        "linkedIngredientIds": [
          5,
          35,
          36,
          37
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 25,
        "stepNumber": 5,
        "instruction": "Fill each tortilla with the cooked potatoes, eggs, bacon, cheddar, and any cooked add-ins you chose.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          29,
          4,
          30,
          31,
          28,
          33,
          5,
          35,
          36,
          37
        ]
      },
      {
        "id": 26,
        "stepNumber": 6,
        "instruction": "Wrap tightly and refrigerate or freeze the burritos.",
        "timingTag": "PrepAhead",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          29
        ]
      },
      {
        "id": 27,
        "stepNumber": 7,
        "instruction": "Reheat the burritos and finish with any fresh toppings you selected: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          32,
          20,
          25
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 8,
    "householdId": 1,
    "name": "Country Breakfast Bowl",
    "cuisine": "American",
    "scalabilityTag": "Portioned",
    "timeTag": "Involved",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": true,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Breakfast",
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": "https://www.budgetbytes.com/country-breakfast-bowls-freezable/",
    "foodGroupServings": {
      "protein": 2,
      "vegetables": 1.5,
      "dairy": 0.5
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 48,
        "ingredientId": 31,
        "ingredientName": "Potato",
        "quantity": 6,
        "unit": "medium potatoes",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 49,
        "ingredientId": 38,
        "ingredientName": "Olive Oil",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 50,
        "ingredientId": 39,
        "ingredientName": "Smoked Paprika",
        "quantity": 1,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 51,
        "ingredientId": 40,
        "ingredientName": "Garlic Powder",
        "quantity": 1,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 52,
        "ingredientId": 21,
        "ingredientName": "Salt",
        "quantity": 1,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 53,
        "ingredientId": 22,
        "ingredientName": "Black Pepper",
        "quantity": 0.5,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 54,
        "ingredientId": 4,
        "ingredientName": "Eggs",
        "quantity": 8,
        "unit": "large eggs",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 55,
        "ingredientId": 16,
        "ingredientName": "Butter",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 56,
        "ingredientId": 32,
        "ingredientName": "Salsa",
        "quantity": 1,
        "unit": "cup",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 57,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 4,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 58,
        "ingredientId": 33,
        "ingredientName": "Breakfast Sausage",
        "quantity": 8,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 59,
        "ingredientId": 28,
        "ingredientName": "Bacon",
        "quantity": 8,
        "unit": "slices",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 60,
        "ingredientId": 41,
        "ingredientName": "Green Onions",
        "quantity": 0.5,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 61,
        "ingredientId": 34,
        "ingredientName": "Ham",
        "quantity": 8,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 62,
        "ingredientId": 36,
        "ingredientName": "Bell Pepper",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 63,
        "ingredientId": 42,
        "ingredientName": "Hot Sauce",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 64,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 28,
        "stepNumber": 1,
        "instruction": "Dice and roast {ingredients} with olive oil and seasonings until browned and tender.",
        "timingTag": "PrepAhead",
        "durationMinutes": 35,
        "isPassive": true,
        "prepCategory": "RoastBake",
        "linkedIngredientIds": [
          31
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 29,
        "stepNumber": 2,
        "instruction": "Cook any selected add-in proteins: {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          33,
          28,
          34
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 30,
        "stepNumber": 3,
        "instruction": "Cook any selected vegetables you want packed into the bowls: {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 6,
        "isPassive": false,
        "prepCategory": "WashChop",
        "linkedIngredientIds": [
          36
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 31,
        "stepNumber": 4,
        "instruction": "Scramble {ingredients} in butter until softly set.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          4
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 32,
        "stepNumber": 5,
        "instruction": "Divide the potatoes, eggs, salsa, cheddar, and any cooked add-ins between containers.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          31,
          4,
          32,
          30,
          33,
          28,
          34,
          36
        ]
      },
      {
        "id": 33,
        "stepNumber": 6,
        "instruction": "Reheat and finish with any fresh toppings you selected: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          41,
          42,
          25
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 9,
    "householdId": 1,
    "name": "Bruschetta Toast",
    "cuisine": "Italian",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 2,
    "mealTypeTags": [
      "Lunch",
      "Dinner",
      "Snack"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 65,
        "ingredientId": 19,
        "ingredientName": "Whole Grain Bread",
        "quantity": 4,
        "unit": "slices",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 66,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 2,
        "unit": "cups chopped",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 67,
        "ingredientId": 27,
        "ingredientName": "Basil",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 68,
        "ingredientId": 38,
        "ingredientName": "Olive Oil",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 69,
        "ingredientId": 21,
        "ingredientName": "Salt",
        "quantity": 0.25,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 70,
        "ingredientId": 22,
        "ingredientName": "Black Pepper",
        "quantity": 0.25,
        "unit": "tsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 71,
        "ingredientId": 26,
        "ingredientName": "Balsamic Glaze",
        "quantity": 1,
        "unit": "tsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 72,
        "ingredientId": 47,
        "ingredientName": "Mozzarella Cheese",
        "quantity": 2,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 73,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 1,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 34,
        "stepNumber": 1,
        "instruction": "Toast {ingredients} until crisp.",
        "timingTag": "DayOfActive",
        "durationMinutes": 4,
        "isPassive": false,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          19
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 35,
        "stepNumber": 2,
        "instruction": "Toss {ingredients} with olive oil, salt, and pepper right before serving.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          25,
          27
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 36,
        "stepNumber": 3,
        "instruction": "Spoon the tomato mixture over the toast and finish with any selected toppings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          26,
          47,
          20
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 10,
    "householdId": 1,
    "name": "BLT Sandwich",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 2,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 1,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 74,
        "ingredientId": 19,
        "ingredientName": "Whole Grain Bread",
        "quantity": 4,
        "unit": "slices",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 75,
        "ingredientId": 28,
        "ingredientName": "Bacon",
        "quantity": 8,
        "unit": "slices",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 76,
        "ingredientId": 43,
        "ingredientName": "Romaine Lettuce",
        "quantity": 2,
        "unit": "cups chopped",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 77,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 78,
        "ingredientId": 71,
        "ingredientName": "Mayonnaise",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 79,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 1,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 80,
        "ingredientId": 72,
        "ingredientName": "Turkey Breast",
        "quantity": 4,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 81,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 2,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 37,
        "stepNumber": 1,
        "instruction": "Cook {ingredients} until crisp and refrigerate for quick assembly.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          28
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 38,
        "stepNumber": 2,
        "instruction": "Toast {ingredients} and spread with mayonnaise.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          19
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 39,
        "stepNumber": 3,
        "instruction": "Layer the bacon with lettuce, tomatoes, and any selected add-ins: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          43,
          25,
          20,
          72,
          30
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 11,
    "householdId": 1,
    "name": "Greek Salad",
    "cuisine": "Greek",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 2,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "vegetables": 2,
      "dairy": 0.5
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 82,
        "ingredientId": 44,
        "ingredientName": "Cucumber",
        "quantity": 2,
        "unit": "cups sliced",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 83,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 2,
        "unit": "cups chopped",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 84,
        "ingredientId": 45,
        "ingredientName": "Red Onion",
        "quantity": 0.5,
        "unit": "cup sliced",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 85,
        "ingredientId": 46,
        "ingredientName": "Feta Cheese",
        "quantity": 3,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 86,
        "ingredientId": 38,
        "ingredientName": "Olive Oil",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 87,
        "ingredientId": 48,
        "ingredientName": "Dill",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 88,
        "ingredientId": 1,
        "ingredientName": "Chicken Breast",
        "quantity": 6,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 89,
        "ingredientId": 50,
        "ingredientName": "Chickpeas",
        "quantity": 1,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 90,
        "ingredientId": 58,
        "ingredientName": "Pita Bread",
        "quantity": 2,
        "unit": "pitas",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 91,
        "ingredientId": 36,
        "ingredientName": "Bell Pepper",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 40,
        "stepNumber": 1,
        "instruction": "Cook {ingredients} so it can be chilled for the salad.",
        "timingTag": "PrepAhead",
        "durationMinutes": 12,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          1
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 41,
        "stepNumber": 2,
        "instruction": "Rinse and drain {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          50
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 42,
        "stepNumber": 3,
        "instruction": "Chop {ingredients} right before serving so the salad stays crisp.",
        "timingTag": "DayOfActive",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          44,
          25,
          45,
          36
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 43,
        "stepNumber": 4,
        "instruction": "Toss the vegetables with feta, olive oil, dill, and any chilled proteins or chickpeas you selected: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 4,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          46,
          1,
          50
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 44,
        "stepNumber": 5,
        "instruction": "Warm or plate any selected pita and serve immediately.",
        "timingTag": "DayOfActive",
        "durationMinutes": 2,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          58
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 12,
    "householdId": 1,
    "name": "Pasta with Marinara",
    "cuisine": "Italian",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": true,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 92,
        "ingredientId": 51,
        "ingredientName": "Spaghetti",
        "quantity": 16,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 93,
        "ingredientId": 52,
        "ingredientName": "Marinara Sauce",
        "quantity": 3,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 94,
        "ingredientId": 53,
        "ingredientName": "Pesto",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 95,
        "ingredientId": 54,
        "ingredientName": "Alfredo Sauce",
        "quantity": 2,
        "unit": "cups",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 96,
        "ingredientId": 49,
        "ingredientName": "Ground Beef",
        "quantity": 12,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 97,
        "ingredientId": 35,
        "ingredientName": "Spinach",
        "quantity": 3,
        "unit": "cups raw",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 98,
        "ingredientId": 55,
        "ingredientName": "Parmesan Cheese",
        "quantity": 2,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 45,
        "stepNumber": 1,
        "instruction": "Cook {ingredients} if you want it ready to reheat later in the week.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          49
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 46,
        "stepNumber": 2,
        "instruction": "Boil {ingredients} according to package directions.",
        "timingTag": "DayOfActive",
        "durationMinutes": 12,
        "isPassive": true,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          51
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 47,
        "stepNumber": 3,
        "instruction": "Warm the sauce you chose and stir in any cooked protein add-ins: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "MixSauce",
        "linkedIngredientIds": [
          52,
          53,
          54,
          49
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 48,
        "stepNumber": 4,
        "instruction": "Toss the cooked pasta with the sauce and finish with any selected toppings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          35,
          55
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 13,
    "householdId": 1,
    "name": "Burrito Bowl",
    "cuisine": "Mexican",
    "scalabilityTag": "Flexible",
    "timeTag": "Medium",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "vegetables": 1.5
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 99,
        "ingredientId": 2,
        "ingredientName": "Brown Rice",
        "quantity": 2,
        "unit": "cups cooked",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 100,
        "ingredientId": 5,
        "ingredientName": "Black Beans",
        "quantity": 2,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 101,
        "ingredientId": 49,
        "ingredientName": "Ground Beef",
        "quantity": 16,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 102,
        "ingredientId": 67,
        "ingredientName": "Taco Seasoning",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 103,
        "ingredientId": 56,
        "ingredientName": "Corn",
        "quantity": 1.5,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 104,
        "ingredientId": 32,
        "ingredientName": "Salsa",
        "quantity": 1,
        "unit": "cup",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 105,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 2,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 106,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 4,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 107,
        "ingredientId": 24,
        "ingredientName": "Pico de Gallo",
        "quantity": 1,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 108,
        "ingredientId": 43,
        "ingredientName": "Romaine Lettuce",
        "quantity": 4,
        "unit": "cups chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 109,
        "ingredientId": 57,
        "ingredientName": "Sour Cream",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 110,
        "ingredientId": 36,
        "ingredientName": "Bell Pepper",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 49,
        "stepNumber": 1,
        "instruction": "Cook {ingredients} until the beef is browned and seasoned.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          49,
          67
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 50,
        "stepNumber": 2,
        "instruction": "Portion {ingredients} as the grain base.",
        "timingTag": "PrepAhead",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          2
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 51,
        "stepNumber": 3,
        "instruction": "Drain, rinse, and portion {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          5
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 52,
        "stepNumber": 4,
        "instruction": "Thaw or drain, then portion {ingredients} without warming it.",
        "timingTag": "PrepAhead",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          56
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 53,
        "stepNumber": 5,
        "instruction": "Pack {ingredients} separately or spoon it into each bowl.",
        "timingTag": "PrepAhead",
        "durationMinutes": 2,
        "isPassive": false,
        "prepCategory": "MixSauce",
        "linkedIngredientIds": [
          32
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 54,
        "stepNumber": 6,
        "instruction": "Slice selected pepper add-ins and store separately: {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 6,
        "isPassive": false,
        "prepCategory": "WashChop",
        "linkedIngredientIds": [
          36
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 55,
        "stepNumber": 7,
        "instruction": "Reheat the prepared bowl base if you want it warm.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          2,
          5,
          49,
          56
        ]
      },
      {
        "id": 56,
        "stepNumber": 8,
        "instruction": "Finish with any fresh toppings you selected: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 2,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          20,
          30,
          24,
          43,
          57
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 14,
    "householdId": 1,
    "name": "Greek Gyro Wrap",
    "cuisine": "Greek",
    "scalabilityTag": "Flexible",
    "timeTag": "Medium",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 111,
        "ingredientId": 59,
        "ingredientName": "Naan",
        "quantity": 4,
        "unit": "pieces",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 112,
        "ingredientId": 60,
        "ingredientName": "Gyro Meat",
        "quantity": 16,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 113,
        "ingredientId": 61,
        "ingredientName": "Tzatziki",
        "quantity": 1,
        "unit": "cup",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 114,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 1.5,
        "unit": "cups chopped",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 115,
        "ingredientId": 44,
        "ingredientName": "Cucumber",
        "quantity": 1.5,
        "unit": "cups chopped",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 116,
        "ingredientId": 45,
        "ingredientName": "Red Onion",
        "quantity": 0.5,
        "unit": "cup sliced",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 117,
        "ingredientId": 46,
        "ingredientName": "Feta Cheese",
        "quantity": 3,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 118,
        "ingredientId": 43,
        "ingredientName": "Romaine Lettuce",
        "quantity": 2,
        "unit": "cups chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 119,
        "ingredientId": 70,
        "ingredientName": "Olives",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 57,
        "stepNumber": 1,
        "instruction": "Warm {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 6,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          59,
          60
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 58,
        "stepNumber": 2,
        "instruction": "Chop the fresh vegetables right before serving: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          25,
          44,
          45
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 59,
        "stepNumber": 3,
        "instruction": "Assemble the wraps with tzatziki and any selected toppings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          46,
          43,
          70
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 15,
    "householdId": 1,
    "name": "Hawaiian Haystacks",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Medium",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "fruit": 0.5
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 120,
        "ingredientId": 2,
        "ingredientName": "Brown Rice",
        "quantity": 2,
        "unit": "cups cooked",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 121,
        "ingredientId": 1,
        "ingredientName": "Chicken Breast",
        "quantity": 16,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 122,
        "ingredientId": 62,
        "ingredientName": "Cream Sauce",
        "quantity": 3,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 123,
        "ingredientId": 63,
        "ingredientName": "Pineapple",
        "quantity": 1.5,
        "unit": "cups chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 124,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 3,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 125,
        "ingredientId": 64,
        "ingredientName": "Chow Mein Noodles",
        "quantity": 2,
        "unit": "cups",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 126,
        "ingredientId": 41,
        "ingredientName": "Green Onions",
        "quantity": 0.5,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 127,
        "ingredientId": 65,
        "ingredientName": "Peas",
        "quantity": 1,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 128,
        "ingredientId": 66,
        "ingredientName": "Celery",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 60,
        "stepNumber": 1,
        "instruction": "Cook {ingredients} ahead of time for the haystack base.",
        "timingTag": "PrepAhead",
        "durationMinutes": 25,
        "isPassive": true,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          2,
          1
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 61,
        "stepNumber": 2,
        "instruction": "Warm {ingredients} and combine with the cooked chicken.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "MixSauce",
        "linkedIngredientIds": [
          62,
          1
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 62,
        "stepNumber": 3,
        "instruction": "Prep any selected toppings so they are ready for serving: {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          63,
          30,
          64,
          41,
          65,
          66
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 63,
        "stepNumber": 4,
        "instruction": "Serve the chicken mixture over rice and add any prepped toppings you chose.",
        "timingTag": "DayOfActive",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "FreshFinish"
      }
    ]
  },
  {
    "id": 16,
    "householdId": 1,
    "name": "Ground Beef Tacos",
    "cuisine": "Mexican",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "protein": 2,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 129,
        "ingredientId": 29,
        "ingredientName": "Flour Tortilla",
        "quantity": 8,
        "unit": "tortillas",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 130,
        "ingredientId": 49,
        "ingredientName": "Ground Beef",
        "quantity": 16,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 131,
        "ingredientId": 67,
        "ingredientName": "Taco Seasoning",
        "quantity": 1,
        "unit": "packet",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 132,
        "ingredientId": 43,
        "ingredientName": "Romaine Lettuce",
        "quantity": 2,
        "unit": "cups chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 133,
        "ingredientId": 25,
        "ingredientName": "Tomatoes",
        "quantity": 1,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 134,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 4,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 135,
        "ingredientId": 32,
        "ingredientName": "Salsa",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 136,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 1,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 137,
        "ingredientId": 5,
        "ingredientName": "Black Beans",
        "quantity": 1,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 138,
        "ingredientId": 57,
        "ingredientName": "Sour Cream",
        "quantity": 0.5,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 64,
        "stepNumber": 1,
        "instruction": "Brown {ingredients}, then stir in taco seasoning.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          49
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 65,
        "stepNumber": 2,
        "instruction": "Warm the tortillas.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          29
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 66,
        "stepNumber": 3,
        "instruction": "Add any selected fresh toppings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 3,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          43,
          25,
          30,
          32,
          20,
          5,
          57
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 67,
        "stepNumber": 4,
        "instruction": "Fill the tortillas with seasoned beef and the toppings you picked.",
        "timingTag": "DayOfActive",
        "durationMinutes": 2,
        "isPassive": false,
        "prepCategory": "AssemblePortion"
      }
    ]
  },
  {
    "id": 17,
    "householdId": 1,
    "name": "Grilled Cheese and V8",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Quick",
    "prepStyleTag": "CookFresh",
    "isFreezerFriendly": false,
    "isCookFreshOnly": true,
    "baseYieldServings": 2,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "grains": 2,
      "dairy": 1,
      "vegetables": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 139,
        "ingredientId": 19,
        "ingredientName": "Whole Grain Bread",
        "quantity": 4,
        "unit": "slices",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 140,
        "ingredientId": 30,
        "ingredientName": "Cheddar Cheese",
        "quantity": 4,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 141,
        "ingredientId": 16,
        "ingredientName": "Butter",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 142,
        "ingredientId": 68,
        "ingredientName": "V8 Juice",
        "quantity": 2,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 143,
        "ingredientId": 27,
        "ingredientName": "Basil",
        "quantity": 1,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 144,
        "ingredientId": 47,
        "ingredientName": "Mozzarella Cheese",
        "quantity": 2,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 145,
        "ingredientId": 34,
        "ingredientName": "Ham",
        "quantity": 4,
        "unit": "oz",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 68,
        "stepNumber": 1,
        "instruction": "Butter the bread and build the sandwiches with cheddar and any selected fillings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 4,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          30,
          27,
          47,
          34
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 69,
        "stepNumber": 2,
        "instruction": "Grill the sandwiches until the bread is golden and the cheese is melted.",
        "timingTag": "DayOfActive",
        "durationMinutes": 8,
        "isPassive": false,
        "prepCategory": "CookStarch",
        "linkedIngredientIds": [
          19
        ]
      },
      {
        "id": 70,
        "stepNumber": 3,
        "instruction": "Pour {ingredients} and serve alongside the sandwiches.",
        "timingTag": "DayOfActive",
        "durationMinutes": 1,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          68
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  },
  {
    "id": 18,
    "householdId": 1,
    "name": "Sweet Potato Beef Cottage Cheese Bowl",
    "cuisine": "American",
    "scalabilityTag": "Flexible",
    "timeTag": "Medium",
    "prepStyleTag": "BatchFriendly",
    "isFreezerFriendly": false,
    "isCookFreshOnly": false,
    "baseYieldServings": 4,
    "mealTypeTags": [
      "Lunch",
      "Dinner"
    ],
    "imageUrl": null,
    "sourceUrl": null,
    "foodGroupServings": {
      "protein": 2,
      "vegetables": 1.5,
      "dairy": 1
    },
    "createdAt": "2026-04-28T18:54:28.344Z",
    "ingredients": [
      {
        "id": 146,
        "ingredientId": 69,
        "ingredientName": "Sweet Potato",
        "quantity": 4,
        "unit": "medium sweet potatoes",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 147,
        "ingredientId": 49,
        "ingredientName": "Ground Beef",
        "quantity": 16,
        "unit": "oz",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 148,
        "ingredientId": 23,
        "ingredientName": "Cottage Cheese",
        "quantity": 2,
        "unit": "cups",
        "isModifier": false,
        "isOptional": false,
        "substituteIngredientIds": []
      },
      {
        "id": 149,
        "ingredientId": 20,
        "ingredientName": "Avocado",
        "quantity": 1,
        "unit": "whole",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 150,
        "ingredientId": 41,
        "ingredientName": "Green Onions",
        "quantity": 0.5,
        "unit": "cup chopped",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 151,
        "ingredientId": 42,
        "ingredientName": "Hot Sauce",
        "quantity": 2,
        "unit": "tbsp",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 152,
        "ingredientId": 5,
        "ingredientName": "Black Beans",
        "quantity": 1,
        "unit": "cup",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      },
      {
        "id": 153,
        "ingredientId": 35,
        "ingredientName": "Spinach",
        "quantity": 2,
        "unit": "cups raw",
        "isModifier": true,
        "isOptional": true,
        "substituteIngredientIds": []
      }
    ],
    "steps": [
      {
        "id": 71,
        "stepNumber": 1,
        "instruction": "Roast {ingredients} until tender.",
        "timingTag": "PrepAhead",
        "durationMinutes": 35,
        "isPassive": true,
        "prepCategory": "RoastBake",
        "linkedIngredientIds": [
          69
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 72,
        "stepNumber": 2,
        "instruction": "Brown and season {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 10,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          49
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 73,
        "stepNumber": 3,
        "instruction": "Warm any selected beans before serving: {ingredients}.",
        "timingTag": "PrepAhead",
        "durationMinutes": 4,
        "isPassive": false,
        "prepCategory": "CookProtein",
        "linkedIngredientIds": [
          5
        ],
        "scaleByLinkedIngredients": true
      },
      {
        "id": 74,
        "stepNumber": 4,
        "instruction": "Assemble bowls with the roasted sweet potato, beef, and cottage cheese.",
        "timingTag": "PrepAhead",
        "durationMinutes": 5,
        "isPassive": false,
        "prepCategory": "AssemblePortion",
        "linkedIngredientIds": [
          69,
          49,
          23
        ]
      },
      {
        "id": 75,
        "stepNumber": 5,
        "instruction": "Finish with any selected toppings: {ingredients}.",
        "timingTag": "DayOfActive",
        "durationMinutes": 2,
        "isPassive": false,
        "prepCategory": "FreshFinish",
        "linkedIngredientIds": [
          20,
          41,
          42,
          5,
          35
        ],
        "scaleByLinkedIngredients": true
      }
    ]
  }
] as unknown as Recipe[];
