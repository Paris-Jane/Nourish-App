# Schema Reference

This guide is the implementation-ready schema reference for Nourish.

It is meant to answer:

- what tables/entities exist
- what each field stores
- which fields are required
- what the keys and relationships are
- which fields are enums or JSON
- which constraints and indexes matter

## Conventions

### Primary keys

- all primary keys are `int`
- all primary keys are named `Id`

### Foreign keys

- foreign keys use the `<EntityName>Id` convention
- required relationships use non-nullable foreign keys
- optional relationships use nullable foreign keys

### Time fields

- `DateTime` is used for timestamps
- `DateOnly` is used for week and prep-day calendar values

### JSON fields

The current backend design stores some flexible structures in `jsonb`, especially:

- string lists
- int lists
- MyPlate target objects
- recipe food-group serving maps
- meal type tags

### Enum storage

Enums are intended to be stored as strings in PostgreSQL for readability and stability.

## Enum Reference

### ActivityLevel

- `Sedentary`
- `Light`
- `Moderate`
- `Active`

### UserRole

- `Owner`
- `Member`

### PrepStyle

- `DayOf`
- `OnePrepDay`
- `TwoPrepDays`

### CookTime

- `Under20`
- `Under45`
- `NoLimit`

### FoodGroup

- `Grains`
- `Protein`
- `Vegetable`
- `Fruit`
- `Dairy`
- `Legume`

### ScalabilityTag

- `Flexible`
- `Rigid`
- `Portioned`

### TimeTag

- `Quick`
- `Medium`
- `Involved`

### RecipePrepStyleTag

- `BatchFriendly`
- `CookFresh`
- `FreezerFriendly`

### WeekDay

- `Monday`
- `Tuesday`
- `Wednesday`
- `Thursday`
- `Friday`
- `Saturday`
- `Sunday`

### MealType

- `Breakfast`
- `Lunch`
- `Dinner`
- `Snack`

### WeekStatus

- `Draft`
- `Active`
- `Completed`

### GroceryListStatus

- `Active`
- `Completed`

### FridgeLocation

- `Fridge`
- `Pantry`
- `Freezer`

### AddedVia

- `GroceryList`
- `ReceiptScan`
- `Manual`
- `Leftover`

### SheetType

- `BatchPrepDay`
- `NightOf`

### TimingTag

- `PrepAhead`
- `DayOfActive`
- `DayOfPassive`

## MyPlate Serving Reference Design

### Short answer

For the current design, **you do not need a separate table just to store “food type = one MyPlate serving”**.

The current intended source of truth is the `Ingredient` table itself.

### Why

Each ingredient already carries the fields needed for the first version of serving lookup:

- `FoodGroup`
- `ServingSize`
- `ServingUnit`
- `IsFlexibleGroup`

That means the ingredient row is doing two jobs:

1. ingredient master data
2. MyPlate serving reference data

### Current recommended approach

Use `Ingredient` as the serving reference source.

Example:

- `Avocado`
  - `FoodGroup = Vegetable`
  - `ServingSize = 1`
  - `ServingUnit = whole`

- `Brown Rice`
  - `FoodGroup = Grains`
  - `ServingSize = 0.5`
  - `ServingUnit = cup cooked`

- `Black Beans`
  - `FoodGroup = Legume`
  - `ServingSize = 0.5`
  - `ServingUnit = cup`
  - `IsFlexibleGroup = true`

### When a separate table would help later

A separate table becomes useful if you want:

- multiple serving conversions per ingredient
- multiple acceptable units per ingredient
- USDA-source traceability
- more advanced conversions like raw vs cooked
- category-level defaults separate from ingredient-level overrides

If that becomes necessary later, a future table might look like:

- `IngredientServingReference`
  - `Id`
  - `IngredientId`
  - `FoodGroup`
  - `ServingSize`
  - `ServingUnit`
  - `PreparationState`
  - `Priority`
  - `Source`

But for the current phase, that is extra complexity you do not need yet.

## Core Entities

## Household

Purpose:

- groups users into a shared planning unit
- owns weeks, fridge inventory, grocery planning context, and household preferences

Fields:

- `Id: int` — PK
- `Name: string` — required
- `Size: int` — required
- `Timezone: string` — required
- `CreatedAt: DateTime` — required
- `UpdatedAt: DateTime` — required

Relationships:

- one-to-many with `User`
- one-to-one with `HouseholdPreferences`
- one-to-many with `Recipe`
- one-to-many with `Week`
- one-to-many with `FridgeItem`
- one-to-many with `GroceryList`

Notes:

- `Size` is the base household serving multiplier unless overridden by week/slot behavior later

## User

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required
- `Email: string` — required
- `DisplayName: string` — required
- `Age: int` — required
- `Sex: string` — required
- `ActivityLevel: ActivityLevel` — enum, required
- `Role: UserRole` — enum, required
- `CreatedAt: DateTime` — required
- `PasswordHash: string` — required

Relationships:

- many-to-one with `Household`

Indexes / constraints:

- unique index on `Email`

## HouseholdPreferences

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required, unique
- `DietaryRestrictions: List<string>` — required, stored as `jsonb`
- `DislikedIngredients: List<string>` — required, stored as `jsonb`
- `CuisinePreferences: List<string>` — required, stored as `jsonb`
- `DefaultCookTime: CookTime` — enum, required
- `DefaultPrepStyle: PrepStyle` — enum, required
- `MyPlateTargets: MyPlateTargets?` — optional object, stored as `jsonb`
- `UpdatedAt: DateTime` — required

Relationships:

- one-to-one with `Household`

Deletion behavior:

- cascade delete from `Household`

## Supporting Value Object: MyPlateTargets

Stored inside `HouseholdPreferences.MyPlateTargets`.

Fields:

- `Grains: decimal`
- `Protein: decimal`
- `Vegetables: decimal`
- `Fruit: decimal`
- `Dairy: decimal`

## Ingredient and Recipe Entities

## Ingredient

Purpose:

- ingredient master list
- MyPlate serving reference source
- purchase-unit and shelf-life reference source

Fields:

- `Id: int` — PK
- `Name: string` — required
- `FoodGroup: FoodGroup` — enum, required
- `ServingSize: decimal` — required
- `ServingUnit: string` — required
- `PurchaseUnit: string` — required
- `IsPerishable: bool` — required
- `IsFlexibleGroup: bool` — required
- `ShelfLifeDays: int` — required

Relationships:

- one-to-many with `RecipeIngredient`
- one-to-many with `FridgeItem`
- one-to-many with `GroceryListItem`

Recommended future indexes:

- non-unique index on `Name`
- optionally unique index on normalized `Name` if the ingredient list becomes curated and controlled

## Recipe

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required
- `Name: string` — required
- `Cuisine: string` — required
- `ScalabilityTag: ScalabilityTag` — enum, required
- `TimeTag: TimeTag` — enum, required
- `PrepStyleTag: RecipePrepStyleTag` — enum, required
- `IsFreezerFriendly: bool` — required
- `IsCookFreshOnly: bool` — required
- `BaseYieldServings: int` — required
- `MealTypeTags: List<MealType>` — required, stored as `jsonb`
- `ImageUrl: string?` — optional
- `SourceUrl: string?` — optional
- `FoodGroupServings: Dictionary<string, decimal>` — required, stored as `jsonb`
- `CreatedAt: DateTime` — required

Relationships:

- many-to-one with `Household`
- one-to-many with `RecipeIngredient`
- one-to-many with `RecipeStep`
- one-to-many with `UserRecipePref`
- one-to-many with `WeekMealSlot`

Storage notes:

- `FoodGroupServings` is a denormalized serving summary used by planning logic
- `MealTypeTags` is soft metadata for recommendation quality, not a hard constraint

Recommended future indexes:

- non-unique index on `HouseholdId`
- non-unique index on `Cuisine`
- optionally composite indexes if search/filter grows significantly

## RecipeIngredient

Fields:

- `Id: int` — PK
- `RecipeId: int` — FK → `Recipe.Id`, required
- `IngredientId: int` — FK → `Ingredient.Id`, required
- `Quantity: decimal` — required
- `Unit: string` — required
- `IsModifier: bool` — required
- `IsOptional: bool` — required
- `SubstituteIngredientIds: List<int>` — required, stored as `jsonb`
- `Notes: string?` — optional

Relationships:

- many-to-one with `Recipe`
- many-to-one with `Ingredient`

Notes:

- this is where core-vs-modifier behavior lives at the ingredient level

## RecipeStep

Fields:

- `Id: int` — PK
- `RecipeId: int` — FK → `Recipe.Id`, required
- `StepNumber: int` — required
- `Instruction: string` — required
- `TimingTag: TimingTag` — enum, required
- `DurationMinutes: int` — required
- `IsPassive: bool` — required

Relationships:

- many-to-one with `Recipe`

Recommended future indexes:

- composite index on `(RecipeId, StepNumber)` if step ordering queries become frequent

## UserRecipePref

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required
- `RecipeId: int` — FK → `Recipe.Id`, required
- `IsFavorite: bool` — required
- `IsDisliked: bool` — required
- `LastUsedAt: DateTime?` — optional

Relationships:

- many-to-one with `Household`
- many-to-one with `Recipe`

Indexes / constraints:

- unique composite index on `(HouseholdId, RecipeId)`

## Week Entities

## Week

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required
- `WeekStartDate: DateOnly` — required
- `Status: WeekStatus` — enum, required
- `PrepStyle: PrepStyle` — enum, required
- `MaxCookTime: CookTime` — enum, required
- `IsSavedTemplate: bool` — required
- `TemplateName: string?` — optional
- `IsInRotation: bool` — required
- `CreatedAt: DateTime` — required

Relationships:

- many-to-one with `Household`
- one-to-many with `WeekMealSlot`
- one-to-many with `SnackSuggestion`
- one-to-one with `GroceryList`
- one-to-many with `PrepSheet`

Notes:

- this table acts as both a live week and a saved template source

## WeekMealSlot

Fields:

- `Id: int` — PK
- `WeekId: int` — FK → `Week.Id`, required
- `RecipeId: int?` — FK → `Recipe.Id`, optional
- `DayOfWeek: WeekDay` — enum, required
- `MealType: MealType` — enum, required
- `IsEatingOut: bool` — required
- `IsSkipped: bool` — required
- `IsLocked: bool` — required
- `ServingsPlanned: int` — required
- `AssumedCompleted: bool` — required
- `MarkedSkippedAt: DateTime?` — optional

Relationships:

- many-to-one with `Week`
- many-to-one with `Recipe` (optional)
- one-to-many with `FridgeDepletionLog`

Deletion behavior:

- `RecipeId` should be set null if the referenced recipe is deleted

Recommended future constraints:

- ideally unique on `(WeekId, DayOfWeek, MealType)` if every slot should appear only once per week

## SnackSuggestion

Fields:

- `Id: int` — PK
- `WeekId: int` — FK → `Week.Id`, required
- `DayOfWeek: WeekDay` — enum, required
- `SuggestionText: string` — required
- `FoodGroupTarget: string` — required
- `UsesFridgeItemId: int?` — FK → `FridgeItem.Id`, optional
- `IsAccepted: bool` — required
- `CreatedAt: DateTime` — required

Relationships:

- many-to-one with `Week`
- optional relationship to `FridgeItem`

## Grocery Entities

## GroceryList

Fields:

- `Id: int` — PK
- `WeekId: int` — FK → `Week.Id`, required, unique
- `HouseholdId: int` — FK → `Household.Id`, required
- `GeneratedAt: DateTime` — required
- `Status: GroceryListStatus` — enum, required
- `CompletedAt: DateTime?` — optional

Relationships:

- one-to-one with `Week`
- many-to-one with `Household`
- one-to-many with `GroceryListItem`

Indexes / constraints:

- unique index on `WeekId`

## GroceryListItem

Fields:

- `Id: int` — PK
- `GroceryListId: int` — FK → `GroceryList.Id`, required
- `IngredientId: int` — FK → `Ingredient.Id`, required
- `PlannedQuantity: decimal` — required
- `PlannedUnit: string` — required
- `PurchasedQuantity: decimal?` — optional
- `StoreSection: string` — required
- `IsChecked: bool` — required
- `AddedToFridge: bool` — required
- `RecipeIds: List<int>` — required, stored as `jsonb`

Relationships:

- many-to-one with `GroceryList`
- many-to-one with `Ingredient`

Notes:

- `RecipeIds` is a denormalized convenience field showing which recipes drove the item

## Fridge Entities

## FridgeItem

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required
- `IngredientId: int` — FK → `Ingredient.Id`, required
- `Quantity: decimal` — required
- `Unit: string` — required
- `Location: FridgeLocation` — enum, required
- `PurchasedAt: DateTime?` — optional
- `ExpiresAt: DateTime?` — optional
- `IsLeftover: bool` — required
- `SourceRecipeId: int?` — FK → `Recipe.Id`, optional
- `AddedVia: AddedVia` — enum, required

Relationships:

- many-to-one with `Household`
- many-to-one with `Ingredient`
- optional relationship to `Recipe`
- one-to-many with `FridgeDepletionLog`

Recommended future indexes:

- non-unique index on `(HouseholdId, ExpiresAt)`
- non-unique index on `(HouseholdId, Location)`

## FridgeDepletionLog

Fields:

- `Id: int` — PK
- `FridgeItemId: int` — FK → `FridgeItem.Id`, required
- `WeekMealSlotId: int` — FK → `WeekMealSlot.Id`, required
- `QuantityUsed: decimal` — required
- `DepletedAt: DateTime` — required
- `WasAssumed: bool` — required
- `OverriddenByUser: bool` — required

Relationships:

- many-to-one with `FridgeItem`
- many-to-one with `WeekMealSlot`

Deletion behavior:

- `WeekMealSlotId` should use restricted delete behavior so depletion history is not silently broken

## Prep Sheet Entities

## PrepSheet

Fields:

- `Id: int` — PK
- `WeekId: int` — FK → `Week.Id`, required
- `PrepDay: DateOnly` — required
- `SheetType: SheetType` — enum, required
- `GeneratedAt: DateTime` — required
- `TotalTimeMinutes: int` — required

Relationships:

- many-to-one with `Week`
- one-to-many with `PrepSheetStep`

## PrepSheetStep

Fields:

- `Id: int` — PK
- `PrepSheetId: int` — FK → `PrepSheet.Id`, required
- `RecipeStepId: int` — FK → `RecipeStep.Id`, required
- `DisplayOrder: int` — required
- `ParallelGroup: int` — required
- `StartOffsetMinutes: int` — required
- `RecipeNameContext: string` — required

Relationships:

- many-to-one with `PrepSheet`
- many-to-one with `RecipeStep`

## High-Value Constraints and Indexes Summary

These are the most important schema-level constraints to keep.

### Must-have unique constraints

- `User.Email`
- `UserRecipePref(HouseholdId, RecipeId)`
- `GroceryList.WeekId`
- `HouseholdPreferences.HouseholdId`

### Strongly recommended future uniqueness

- `WeekMealSlot(WeekId, DayOfWeek, MealType)`

### Helpful performance indexes later

- `Recipe(HouseholdId)`
- `FridgeItem(HouseholdId, ExpiresAt)`
- `FridgeItem(HouseholdId, Location)`
- optionally `Ingredient(Name)` or normalized ingredient-name search

## Final Recommendation on Serving Reference Table

For the current phase:

- **do not add a separate table yet**
- use `Ingredient` as the serving reference source

That keeps the system simple and matches the actual backend model already being built.

Revisit a dedicated serving-reference table only when:

- unit conversion gets more advanced
- the ingredient catalog becomes much larger
- you need multiple serving definitions per ingredient
- you need source attribution or auditability beyond the current design
