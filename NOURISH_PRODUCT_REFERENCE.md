# Nourish Product Reference

## 1. Product Summary

**Nourish** is a meal planning app designed to reduce the mental load of deciding what to eat, planning meals, shopping, and using ingredients before they expire.

The core idea is:

- meal planning on autopilot
- no calorie tracking, macro tracking, weight tracking, or body-focused features
- nutrition logic happens invisibly in the backend
- users get practical outputs: weekly plans, grocery lists, prep guidance, and fridge-aware recipe suggestions

This is **not** being positioned as an eating disorder treatment tool for launch. The initial audience is broader:

- people who want help planning meals
- people who do not want to track food obsessively
- people who want to reduce decision fatigue
- people who want to waste less food and save money

## 2. Product Positioning

### Core value proposition

Meal planning that actually saves time and money without turning food into homework.

### What the app should feel like

- warm
- calm
- supportive
- practical
- flexible
- never clinical
- never fitness-tracker-like
- never diet-culture-y

### What the app is explicitly avoiding

- calorie counts
- macro counts
- weight tracking
- body measurements
- streaks tied to eating behavior
- progress photos
- moralized food language
- forced food logging after meals
- social meal comparison features

## 3. Product Principles

These are the operating rules the product should follow.

1. **Autopilot first**
   The app should do as much planning as possible by default.

2. **Flexible, not rigid**
   Users should always be able to swap, skip, eat out, or manually fill a slot.

3. **Nutrition stays in the background**
   Users should not see nutrition targets, deficits, or tracking dashboards.

4. **Future-focused, not retrospective**
   The app is for planning future meals, not tracking every past meal.

5. **Low-friction always wins**
   If a flow feels like admin work, simplify it.

6. **Waste reduction is a core feature**
   Purchase-unit logic, overlap logic, leftovers, and fridge usage are core differentiators.

## 4. Key Product Decisions From Planning

### Audience decision

The launch target is a **broader audience first**, not people in active ED recovery specifically.

Why:

- lower clinical/liability complexity
- fewer required wellbeing check-ins
- simpler onboarding and UX
- broader market
- still aligned with the original numberless philosophy

### Tracking decision

Users should **not** have to log whether they ate each meal.

Instead:

- the app assumes planned meals happened unless the user says otherwise
- fridge depletion is driven by that assumption in the background
- users can mark exceptions like `skipped` or `eating out`

### Planning mode decision

There should **not** be a big “Auto vs Manual” mode selection before a user has seen the app work.

Instead:

- the first experience can still be autopilot-first
- when starting a **new week**, the user can choose how to begin:
  - auto plan
  - manual plan
  - use a saved week
- once a week exists, the experience should stay hybrid:
  - every slot is editable
  - users can replace any meal
  - users can fill individual slots themselves
  - users can partially build a week and use “fill the rest for me”

This keeps the product consistent with autopilot positioning while still supporting planners who want a blank canvas or a saved template.

### Nutrition decision

Users should not be asked to enter food group serving targets.

Instead:

- onboarding collects inputs needed for MyPlate logic
- the backend calculates targets silently
- snack suggestions and plan generation use those targets invisibly

### Recipe logic decision

For the test phase, recipes should be curated and structured to work well with MyPlate logic rather than trying to handle every possible messy recipe from day one.

### Ingredient classification decision

For the test phase, use a **lookup-table approach**, not a full classification model.

That means:

- ingredients map to a food group, serving size, standard unit, purchase unit, and shelf life
- oils, spices, condiments, and non-meaningful contributors are ignored for nutrition logic
- legumes are flagged as flexible between protein and vegetables depending on need

### Auth decision for current development

Real login/auth is **deferred for now** during testing.

Current practical direction:

- frontend can be developed and previewed without requiring login every time
- auth is planned and should be implemented later
- the product plan still includes proper auth, but it is not the current build priority

## 5. User Personas

### Persona 1: Busy planner

- wants the app to “just handle dinner”
- wants weekly grocery help
- dislikes repetitive planning work

### Persona 2: Low-friction eater

- does not want to count calories or track every meal
- wants structure without obsessiveness
- wants suggestions, not correction

### Persona 3: Waste reducer

- cares about using what is already in the fridge
- hates buying a full bag/bunch/container for one recipe
- values ingredient overlap and expiry suggestions

### Persona 4: Household coordinator

- plans meals for more than one person
- wants to reuse successful weeks
- wants grocery and meal planning to be repeatable

## 6. User Experience Goals

The app should feel like:

- a thoughtfully designed cookbook
- a weekly household planning assistant
- a calm kitchen tool

The app should not feel like:

- a diet app
- a compliance tracker
- a clinical nutrition dashboard

## 7. Core User Flows

### 7.1 First-time user flow

1. User creates an account.
2. User completes lightweight onboarding.
3. App calculates MyPlate targets invisibly.
4. User selects week prep preferences.
5. App generates a first weekly meal plan.
6. User previews the week and can swap anything.
7. User approves the week.
8. App generates grocery list and prep guidance.

### 7.2 Weekly planning flow

1. User opens the current week.
2. User sees the current week as the main working surface.
3. User can:
   - approve the week
   - swap individual meals
   - mark a slot as eating out
   - manually fill some slots
   - use “fill the rest for me”
4. Once approved:
   - grocery list is generated
   - prep sheets can be generated
   - fridge logic can use assumed completion behavior

### 7.2A New week start flow

When a user opens a new week, they can choose one of three starting paths:

#### Auto plan

- app generates a week using stored preferences and current weekly inputs
- user can inspect meals and swap anything before approving

#### Manual plan

- app starts with a blank week
- user fills slots one by one
- recommendations are shown in context from categories like:
  - expiring soon
  - in your fridge
  - ingredient overlap
  - favorites
  - recent
- user can search existing recipes or add a new one from the slot flow

#### Use a saved week

- app starts from a previously saved week
- user can adapt that saved week for the current week before approving

### 7.3 Manual/hybrid planning flow

1. User taps a meal slot.
2. App opens recommendation options.
3. Recommendations are grouped by context:
   - expiring soon
   - in your fridge
   - ingredient overlap
   - favorites
   - recent
4. User chooses a recipe.
5. App asks whether to use it for additional days too.
6. App continues to suggest snacks gently if a day looks incomplete.
7. User can still ask the app to fill remaining empty slots.

### 7.4 Grocery flow

1. User views grocery list grouped by section.
2. User checks off items while shopping.
3. On check, app asks for actual purchased quantity inline.
4. Purchased items are added to fridge inventory.
5. Checked items move into a completed section.

### 7.5 Fridge flow

1. User sees fridge, pantry, and freezer items separately.
2. App highlights expiring items.
3. User can ask “What can I make?”
4. App recommends recipes based on current inventory.
5. User can manually add items or edit quantities/expiry.

### 7.6 Save-and-rotate flow

1. User saves a week they liked.
2. Week gets a name and remains reloadable.
3. User can mark weeks as `in rotation`.
4. In the future, the app can use those templates repeatedly while still adapting to current fridge state and recipe conflicts.

## 8. Onboarding Plan

Onboarding should be short but capture enough data to generate a good first plan.

### Required onboarding inputs

- dietary restrictions / allergies
- foods strongly disliked
- cuisines enjoyed
- number of people being cooked for
- age
- sex assigned at birth
- activity level

### Optional / preference inputs

- preferred default cooking time
- preferred default prep style

### Important note

Users should **not** be asked:

- how many servings of each food group they want
- calorie targets
- macro goals

The app should infer MyPlate targets from:

- age
- sex
- activity level

## 9. Weekly Preferences Before Generation

These are **week-level**, not permanent onboarding settings.

### Questions to ask before generating a new week

1. How do you want to prep this week?
   - Cook each night
   - One prep day
   - Two prep days

2. Max time per cooking session?
   - Under 20 min
   - Under 45 min
   - No limit

These choices should heavily influence recipe selection and prep sheet behavior.

## 10. Feature Specification

## 10.1 Weekly meal plan

### Purpose

Generate a full week of meals with minimal user effort.

### Behavior

- a new week can start from:
  - auto generation
  - a blank manual planner
  - a saved week
- week contains meal slots across Monday–Sunday
- meal slots include at least breakfast, lunch, dinner, and snack
- slots can be:
  - filled with a recipe
  - marked as eating out
  - skipped
  - manually locked

### UX expectations

- users should see a complete plan immediately
- swapping should be easy and in-context
- empty slots should still feel supported, not broken

## 10.2 Meal swapping

### Swap recommendations should prioritize

- similar prep time
- overlap with other ingredients already planned
- recipes using expiring fridge items
- recipes not disliked
- recipes not used too recently

### Categories to show

- Expiring soon
- In your fridge
- Ingredient overlap
- Favorites
- Recent

## 10.3 Manual planning

Manual planning is part of the same experience, not a separate product mode.

### Requirements

- user can intentionally start from a blank week
- user can tap any slot to fill it
- app surfaces context-aware recommendations
- after selecting a recipe, user can apply it to multiple days
- app can fill only the remaining slots afterward

## 10.4 Snack suggestions

### Purpose

Quietly smooth out nutrition gaps without showing users deficit language.

### Important UX rule

Snack suggestions must be framed as optional and additive.

Good framing:

- “You might enjoy adding a snack here.”
- “Here are a few ideas that fit what you already have.”

Avoid:

- “You are missing X servings.”
- “You failed to meet your target.”

### Timing

- subtle suggestions can appear as the week/day is being built
- final pass can happen at confirmation time

## 10.5 Grocery list

### Requirements

- grouped by store section
- checkable
- inline quantity confirmation on check
- checked items add to fridge inventory
- completed items move into a done section

### Store sections

- Produce
- Protein
- Dairy
- Grains
- Pantry
- Frozen

### Important grocery logic

- quantities must be consolidated
- list should think in purchase units, not only recipe units
- partial overlap across recipes should reduce waste

## 10.6 Fridge / pantry / freezer

### Requirements

- track location
- track quantity
- track expiry or estimated shelf life
- allow manual entry
- allow grocery-imported entry
- support “what can I make?”

### Important design rule

Fridge, pantry, and freezer must be distinct because timing and recipe logic differ across them.

### Expiry behavior

- estimated expiry can default from ingredient shelf-life rules
- users can edit when needed
- app highlights expiring items

## 10.7 What can I make?

This should be a top-level, highly visible fridge feature.

### Purpose

- help use what is already in the house
- reduce waste
- give immediate value even outside weekly planning

## 10.8 Recipe index

### Requirements

- search by name
- filter by cuisine
- filter by time
- filter by prep style
- filter by “in my fridge” or available ingredients later
- favorite/dislike signals

## 10.9 Recipe detail

Recipe detail should clearly separate:

- prep-ahead steps
- day-of active steps
- day-of passive steps
- core ingredients
- optional modifiers

## 10.10 Add/edit recipe

Recipe entry is one of the most important foundational systems because nearly everything depends on recipe quality.

### Metadata required on recipes

- name
- cuisine
- meal type tags
- time tag
- prep style tag
- scalability tag
- freezer-friendly flag
- cook-fresh-only flag
- base yield servings
- ingredients with quantities and units
- step list with timing tags

### AI-assisted recipe entry

AI should assist with:

- meal type tag suggestion
- step categorization into prep-ahead / day-of active / day-of passive
- ingredient standardization
- purchase-unit suggestion
- scalability tag suggestion
- optional modifier detection

Human review is still required before save.

## 10.11 Saved weeks

Saved weeks should act like reusable templates.

### Requirements

- allow naming
- allow in-rotation flag
- allow reload into a new week
- visually preview week contents

### Important behavior

Loading a saved week should create a new current-week instance, not overwrite the template itself.

## 10.12 Rotation

Rotation is a natural extension of saved weeks.

### Requirements

- users can mark favorite weeks as in rotation
- future generation can reuse them
- app should detect conflicts:
  - disliked recipes
  - seasonal availability
  - changed preferences
- app should suggest swaps when a rotation week no longer cleanly fits

## 10.13 Eating out / skip support

Meal slots should support explicit “no meal generated here” behavior.

### Requirements

- available directly on the slot
- removes that slot from grocery generation
- removes that slot from nutrition-gap logic for that meal

## 10.14 Leftovers and freezing

This is a major planned differentiator.

### Requirements

- rigid recipes can intentionally produce extra portions
- app should proactively suggest freezing leftovers
- frozen leftovers should become candidates for future planning

## 10.15 Receipt scanning

Receipt scanning is useful but should be treated as a later-phase feature.

### Constraints

- OCR is messy
- must include a confirmation step
- should not auto-add incorrect items silently

## 11. Nutrition System Design

## 11.1 Philosophy

Nutrition is handled invisibly.

The user benefits from:

- balanced meal plans
- gap-filling suggestions
- healthier variety

Without seeing:

- numeric daily dashboards
- deficit warnings
- calorie/macro targets

## 11.2 MyPlate usage

The backend uses MyPlate targets derived from:

- age
- sex
- activity level

These targets guide generation but are not a core UI surface.

## 11.3 Ingredient lookup approach

For the test phase:

- each ingredient has a food group
- standard serving size
- standard serving unit
- purchase unit
- shelf life
- perishable flag
- flexible-group flag for legumes

### Why this was chosen

- more reliable than freeform AI classification in early stages
- easy to audit
- works well for curated recipes

## 11.4 Legume handling

Beans and similar legumes should **not** double-count.

They count toward whichever group is more needed:

- protein
- vegetable

This assignment happens in planning logic, not at recipe entry.

## 11.5 Recipe curation strategy

Early recipe library should favor:

- recipes with clearer MyPlate mapping
- ingredient-forward meals
- recipes where components are distinct and understandable

Examples:

- bowls
- tacos
- sheet pan meals
- soups
- pasta with clearly separated components

Avoid relying heavily on:

- highly blended dishes with unclear food-group boundaries
- overly complex recipes early on

## 12. Recipe Structure Model

Recipes need to carry enough metadata to support:

- generation
- scaling
- grocery lists
- prep sheets
- leftovers
- fridge-aware modifiers

## 12.1 Scalability tags

### Flexible

Scales linearly.

Examples:

- pasta
- stir fry
- grain bowls
- soups

### Rigid

Fixed-yield recipes that do not scale neatly.

Examples:

- lasagna
- casseroles
- quiche

### Portioned

Scales in discrete units.

Examples:

- tacos
- burgers
- patties

## 12.2 Prep-style tags

- Batch-friendly
- Cook fresh
- Freezer-friendly

These are separate from scalability and can overlap.

## 12.3 Meal type tags

Recipes should support one or more recommended meal types:

- Breakfast
- Lunch
- Dinner
- Snack

These tags are **soft metadata**, not hard rules.

### Purpose

- improve auto-generated slot recommendations
- improve swap quality
- improve manual slot-filling suggestions
- improve recipe browsing and filtering later

### Important behavior

- a lunch recipe can still be used for dinner
- a breakfast recipe can still be used as a snack
- lunch/dinner crossover should be common
- the planner should score matching meal-type tags higher, not enforce them rigidly

### Examples

- avocado toast: Breakfast, Lunch
- chili: Lunch, Dinner
- yogurt bowl: Breakfast, Snack
- burrito bowl: Lunch, Dinner
- hard boiled eggs with fruit: Breakfast, Snack

## 12.4 Step timing tags

- PrepAhead
- DayOfActive
- DayOfPassive

These are required to generate useful prep sheets and to decide whether a recipe fits the selected weekly prep style.

## 12.5 Core ingredients vs modifiers

### Core ingredients

- drive food-group logic
- drive grocery list generation
- are necessary for the recipe to function

### Modifiers

- optional toppings
- substitutions
- mix-ins
- personalized finishing options

Examples:

- avocado on chili
- yogurt instead of sour cream
- toppings on bowls or oatmeal

Modifiers should pull from:

- fridge items
- ingredients already being purchased that week
- reasonable substitutions

## 13. Purchase Unit and Waste Reduction Logic

This is one of the most important product insights from planning.

The app should reason about:

- what a recipe needs
- what a user actually buys
- what portion of a purchase unit remains
- how to use the remainder before it expires

### Example

If tacos use half a bag of lettuce:

- the grocery list may still need to buy `1 bag lettuce`
- the planner should try to use the other half in another meal that week

### Rules

- purchase-unit logic matters mainly for perishables
- non-perishables do not need the same urgency
- overlap should be optimized at the purchase-unit level, not only the ingredient-name level

## 14. Planning Engine Rules

The generator should consider:

- dietary restrictions
- disliked foods
- cuisine preferences
- household size
- week-level prep preferences
- fridge inventory
- expiring items
- recipe recency
- favorites/dislikes
- ingredient overlap
- nutrition gaps
- leftovers/freezer opportunities

### Recommended preference order

1. hard restrictions and allergies
2. recipe eligibility by prep/time constraints
3. fridge and expiry opportunities
4. ingredient overlap / waste reduction
5. avoid repetition
6. nutrition balancing and snack suggestion

### Failure handling

If the app cannot generate a great plan because constraints are too tight:

- do not silently generate a poor plan
- relax constraints in a defined order
- surface helpful messaging if needed

## 15. Fridge Depletion and Assumption Logic

The app assumes planned meals happened unless corrected.

### That means

- ingredients used by planned meals should be depleted automatically
- depletion must be logged
- if the user later says the meal did not happen, depletion must be reversible

### This requires

- recipe-to-ingredient traceability
- meal-slot completion assumptions
- depletion logs

Without this, the fridge data will drift and hurt plan quality.

## 16. Saved Week and Template Model

The `week` model should support both:

- active/live weeks
- saved templates

### Important design choice

A saved week should not just be a screenshot of meal names.

It should capture:

- slots
- meals
- skip/eating-out states
- prep style
- grocery context
- snack suggestions or derived logic where relevant

When reloaded:

- create a new active week from the template
- re-run grocery and fridge adaptation as needed

## 17. Ideal Data Schema

This is the schema discussed as the target model.

## 17.1 Core entities

### Household

- Id
- Name
- Size
- Timezone
- CreatedAt
- UpdatedAt

### User

- Id
- HouseholdId
- Email
- DisplayName
- Age
- Sex
- ActivityLevel
- Role
- CreatedAt
- PasswordHash

### HouseholdPreferences

- Id
- HouseholdId
- DietaryRestrictions
- DislikedIngredients
- CuisinePreferences
- DefaultCookTime
- DefaultPrepStyle
- MyPlateTargets
- UpdatedAt

## 17.2 Ingredient and recipe entities

### Ingredient

- Id
- Name
- FoodGroup
- ServingSize
- ServingUnit
- PurchaseUnit
- IsPerishable
- IsFlexibleGroup
- ShelfLifeDays

### Recipe

- Id
- HouseholdId
- Name
- Cuisine
- ScalabilityTag
- TimeTag
- PrepStyleTag
- IsFreezerFriendly
- IsCookFreshOnly
- BaseYieldServings
- MealTypeTags
- ImageUrl
- SourceUrl
- FoodGroupServings
- CreatedAt

### RecipeIngredient

- Id
- RecipeId
- IngredientId
- Quantity
- Unit
- IsModifier
- IsOptional
- SubstituteIngredientIds
- Notes

### RecipeStep

- Id
- RecipeId
- StepNumber
- Instruction
- TimingTag
- DurationMinutes
- IsPassive

### UserRecipePref

- Id
- HouseholdId
- RecipeId
- IsFavorite
- IsDisliked
- LastUsedAt

## 17.3 Week entities

### Week

- Id
- HouseholdId
- WeekStartDate
- Status
- PrepStyle
- MaxCookTime
- IsSavedTemplate
- TemplateName
- IsInRotation
- CreatedAt

### WeekMealSlot

- Id
- WeekId
- RecipeId
- DayOfWeek
- MealType
- IsEatingOut
- IsSkipped
- IsLocked
- ServingsPlanned
- AssumedCompleted
- MarkedSkippedAt

### SnackSuggestion

- Id
- WeekId
- DayOfWeek
- SuggestionText
- FoodGroupTarget
- UsesFridgeItemId
- IsAccepted
- CreatedAt

## 17.4 Grocery entities

### GroceryList

- Id
- WeekId
- HouseholdId
- GeneratedAt
- Status
- CompletedAt

### GroceryListItem

- Id
- GroceryListId
- IngredientId
- PlannedQuantity
- PlannedUnit
- PurchasedQuantity
- StoreSection
- IsChecked
- AddedToFridge
- RecipeIds

## 17.5 Fridge entities

### FridgeItem

- Id
- HouseholdId
- IngredientId
- Quantity
- Unit
- Location
- PurchasedAt
- ExpiresAt
- IsLeftover
- SourceRecipeId
- AddedVia

### FridgeDepletionLog

- Id
- FridgeItemId
- WeekMealSlotId
- QuantityUsed
- DepletedAt
- WasAssumed
- OverriddenByUser

## 17.6 Prep sheet entities

### PrepSheet

- Id
- WeekId
- PrepDay
- SheetType
- GeneratedAt
- TotalTimeMinutes

### PrepSheetStep

- Id
- PrepSheetId
- RecipeStepId
- DisplayOrder
- ParallelGroup
- StartOffsetMinutes
- RecipeNameContext

## 18. Technical Stack

## 18.1 Preferred stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod

### Backend

- .NET 8 Web API
- Minimal APIs
- Entity Framework Core
- PostgreSQL
- JWT auth
- BCrypt password hashing

### Optional/adjacent services

- Cloudflare R2 for image storage
- LLM API for AI-assisted recipe entry
- OCR service later for receipt scanning

## 18.2 Deployment plan

### Cost-conscious deployment choice

Recommended low-cost setup:

- Vercel for frontend
- Railway for .NET API
- Railway Postgres for database

Why:

- close to existing familiarity
- cheap or free for early testing
- avoids needing Supabase unless specifically desired
- keeps backend in .NET

### Alternative

Supabase could still work, but it is not required if the backend is hosted elsewhere.

For this project, the discussed low-cost recommendation was:

- **no required Supabase dependency**
- use Railway for API + Postgres during early stages

## 18.3 Frontend development approach

The frontend does **not** need to wait for the backend to be complete.

### Recommended approach

- define API interfaces early
- create mock API responses
- use realistic seed/mock data
- switch to real API later with an env flag

This allows parallel frontend and backend development.

## 19. Current Build Direction

As of the latest development decisions in this repo:

- backend exists in `.NET`
- frontend exists as a React/Vite app
- frontend is currently set up to be testable without forcing real auth every session
- real auth/login is deferred until later

This is aligned with the current testing goal and should be treated as an intentional staging choice, not a permanent product behavior.

## 20. Implementation Phases

## Phase 1: Foundations

- set up backend project structure
- define schema and entities
- create ingredients lookup table
- support manual recipe creation
- support AI-assisted recipe metadata suggestions
- seed a small curated recipe library

## Phase 2: Fridge foundation

- manual fridge/pantry/freezer item entry
- expiry tracking
- simple “what can I make?” query
- grocery-to-fridge add flow

## Phase 3: Basic weekly planning

- create weeks and slots
- auto-generate a simple week
- support swap/skip/eating-out behavior
- support approval flow
- generate grocery list

## Phase 4: Smarter planning

- ingredient overlap logic
- expiring-soon prioritization
- nutrition-gap logic
- snack suggestions
- leftovers/freezer awareness

## Phase 5: Prep sheet intelligence

- step timing tags
- prep-ahead/day-of breakdown
- grouped prep sheets
- simple task grouping by method or parallel group

## Phase 6: Save and rotate

- save a week as template
- load saved week
- rotation support
- conflict handling for disliked or outdated items

## Phase 7: Auth and household polish

- real login/register
- household settings persistence
- onboarding completion checks
- better multi-user groundwork

## Phase 8: Advanced additions

- receipt scanning
- richer substitution logic
- better “in my fridge” recipe browsing
- shared live grocery updates
- cooking mode / step-by-step kitchen view

## 21. Open Questions Still Worth Revisiting

These were identified as important future design questions.

### Household complexity

- one household account vs multiple users in a household
- per-person restrictions later
- guest servings on specific nights

### Recipe ownership and scaling

- how user-submitted recipes are validated
- whether moderation/review is needed later

### Ingredient conversion depth

- strict standard-unit entry only
- or broader unit conversion support later

### Prep-sheet complexity

- full parallel scheduling
- or simpler grouped-by-method approach first

### Offline support

- grocery list offline use
- recipe details offline use

### Substitution behavior

- what happens when items are unavailable at the store
- how much substitution guidance to include at launch

## 22. Risks to Avoid

### Product risks

- making the app feel like tracking in disguise
- overwhelming onboarding
- repetitive or generic first-week plans
- poor swap logic
- too much manual upkeep

### Technical risks

- loose week data model
- weak purchase-unit logic
- inaccurate fridge depletion
- under-structured recipe data
- opening recipe entry too broadly before data quality is protected

## 23. Success Criteria for Early Versions

An early version is successful if:

- a user can get a reasonable weekly plan quickly
- they can swap meals without frustration
- the grocery list feels useful in the store
- fridge suggestions feel relevant
- the system reduces waste and repeated planning effort
- the experience feels calm, warm, and low-pressure

## 24. Short Reference Summary

If you only remember a few things about Nourish, remember these:

- it is an autopilot meal-planning app, not a tracking app
- nutrition logic is invisible to the user
- fridge and waste-reduction logic are core, not secondary
- users should not be required to log every meal
- weeks can be saved and rotated
- recipes need structured metadata to power almost everything
- purchase-unit logic matters as much as nutrition logic
- launch should prioritize reliability and low friction over maximal feature scope
