# Schema Reference

This guide documents the target Nourish schema, including entities, fields, data types, keys, relationships, constraints, and storage notes.

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
- `Other`

### DefaultLocation

- `Fridge`
- `Pantry`
- `Freezer`

### StoreSection

- `Produce`
- `Protein`
- `Dairy`
- `Grains`
- `Pantry`
- `Frozen`
- `Bakery`
- `Other`

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

### PrepStepCategory

- `WashChop`
- `MixSauce`
- `CookStarch`
- `CookProtein`
- `RoastBake`
- `AssemblePortion`
- `FreshFinish`

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

## User

Fields:

- `Id: int` — PK
- `HouseholdId: int` — FK → `Household.Id`, required
- `Email: string` — required
- `DisplayName: string` — required
- `Age: int` — required
- `Sex: string` — required
- `ActivityLevel: ActivityLevel` — enum, required
- `HeightInches: int` — required
- `WeightPounds: decimal` — required
- `Role: UserRole` — enum, required
- `CreatedAt: DateTime` — required
- `PasswordHash: string` — required

Relationships:

- many-to-one with `Household`
- one-to-many with `UserIngredientPref`
- one-to-many with `UserWeekPref`

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

Target generation notes:

- adult targets can be derived from age, sex, activity level, height, and weight
- fallback lookup targets can be used when body metrics are unavailable

## Ingredient and Recipe Entities

## Ingredient

Fields:

- `Id: int` — PK
- `Name: string` — required
- `FoodGroup: FoodGroup` — enum, required
- `ServingSize: decimal` — required
- `ServingUnit: string` — required
- `PurchaseUnit: string` — required
- `DefaultLocation: DefaultLocation` — enum, required
- `StoreSection: StoreSection` — enum, required
- `IsPerishable: bool` — required
- `IsFlexibleGroup: bool` — required
- `IsMyPlateCounted: bool` — required
- `ShelfLifeDays: int` — required
- `TypicalPackageSize: decimal?` — optional
- `PackageSizeUnit: string?` — optional
- `IsStaple: bool` — required
- `Aliases: List<string>` — optional, stored as `jsonb`
- `Notes: string?` — optional

Relationships:

- one-to-many with `RecipeIngredient`
- one-to-many with `FridgeItem`
- one-to-many with `GroceryListItem`
- one-to-many with `UserIngredientPref`

Indexes:

- non-unique index on `Name`

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

- `FoodGroupServings` is stored as `jsonb`
- `MealTypeTags` is stored as `jsonb`

Indexes:

- non-unique index on `HouseholdId`
- non-unique index on `Cuisine`

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

## RecipeStep

Fields:

- `Id: int` — PK
- `RecipeId: int` — FK → `Recipe.Id`, required
- `StepNumber: int` — required
- `Instruction: string` — required
- `TimingTag: TimingTag` — enum, required
- `DurationMinutes: int` — required
- `IsPassive: bool` — required
- `PrepCategory: PrepStepCategory` — enum, required
- `LinkedIngredientIds: List<int>` — required, stored as `jsonb`
- `ScaleByLinkedIngredients: bool` — required

Relationships:

- many-to-one with `Recipe`

Indexes:

- composite index on `(RecipeId, StepNumber)`

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

## UserIngredientPref

Fields:

- `Id: int` — PK
- `UserId: int` — FK → `User.Id`, required
- `IngredientId: int` — FK → `Ingredient.Id`, required
- `IsFavorite: bool` — required
- `LastUsedAt: DateTime?` — optional

Relationships:

- many-to-one with `User`
- many-to-one with `Ingredient`

Indexes / constraints:

- unique composite index on `(UserId, IngredientId)`

## UserWeekPref

Fields:

- `Id: int` — PK
- `UserId: int` — FK → `User.Id`, required
- `WeekId: int` — FK → `Week.Id`, required
- `IsFavorite: bool` — required

Relationships:

- many-to-one with `User`
- many-to-one with `Week`

Indexes / constraints:

- unique composite index on `(UserId, WeekId)`

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
- one-to-many with `UserWeekPref`

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

- `RecipeId` uses set-null behavior if the referenced recipe is deleted

Constraints:

- unique on `(WeekId, DayOfWeek, MealType)` when each week contains one slot per meal type per day

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

Indexes:

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

- `WeekMealSlotId` uses restricted delete behavior

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

## Constraints and Indexes Summary

These are the main schema-level constraints and indexes.

### Must-have unique constraints

- `User.Email`
- `UserRecipePref(HouseholdId, RecipeId)`
- `UserIngredientPref(UserId, IngredientId)`
- `UserWeekPref(UserId, WeekId)`
- `GroceryList.WeekId`
- `HouseholdPreferences.HouseholdId`

### Additional uniqueness

- `WeekMealSlot(WeekId, DayOfWeek, MealType)`

### Additional indexes

- `Recipe(HouseholdId)`
- `FridgeItem(HouseholdId, ExpiresAt)`
- `FridgeItem(HouseholdId, Location)`
- `Ingredient(Name)`
- `UserIngredientPref(IngredientId)`
- `UserWeekPref(WeekId)`
