# Nourish Product Reference

This is the high-level product guide.

For detailed supporting references, also see:

- [FEATURE_REFERENCE.md](/Users/parisward/Nourish/guides/FEATURE_REFERENCE.md)
- [SCHEMA_REFERENCE.md](/Users/parisward/Nourish/guides/SCHEMA_REFERENCE.md)
- [IMPLEMENTATION_PHASES_REFERENCE.md](/Users/parisward/Nourish/guides/IMPLEMENTATION_PHASES_REFERENCE.md)
- [TECHNICAL_REFERENCE.md](/Users/parisward/Nourish/guides/TECHNICAL_REFERENCE.md)

## Product Summary

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

## Product Positioning

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

## Product Principles

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

## Key Product Decisions From Planning

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

## User Personas

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

## User Experience Goals

The app should feel like:

- a thoughtfully designed cookbook
- a weekly household planning assistant
- a calm kitchen tool

The app should not feel like:

- a diet app
- a compliance tracker
- a clinical nutrition dashboard

## Core User Flows

### First-time user flow

1. User creates an account.
2. User completes lightweight onboarding.
3. App calculates MyPlate targets invisibly.
4. User selects week prep preferences.
5. App generates a first weekly meal plan.
6. User previews the week and can swap anything.
7. User approves the week.
8. App generates grocery list and prep guidance.

### Weekly planning flow

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

### New week start flow

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

### Manual / hybrid planning flow

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

### Grocery flow

1. User views grocery list grouped by section.
2. User checks off items while shopping.
3. On check, app asks for actual purchased quantity inline.
4. Purchased items are added to fridge inventory.
5. Checked items move into a completed section.

### Fridge flow

1. User sees fridge, pantry, and freezer items separately.
2. App highlights expiring items.
3. User can ask “What can I make?”
4. App recommends recipes based on current inventory.
5. User can manually add items or edit quantities/expiry.

### Save-and-rotate flow

1. User saves a week they liked.
2. Week gets a name and remains reloadable.
3. User can mark weeks as `in rotation`.
4. In the future, the app can use those templates repeatedly while still adapting to current fridge state and recipe conflicts.

## Onboarding Plan

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

## Weekly Preferences Before Generation

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

## Related Reference Guides

Detailed material has been split into separate guides:

- feature and logic details: [FEATURE_REFERENCE.md](/Users/parisward/Nourish/guides/FEATURE_REFERENCE.md)
- target data model: [SCHEMA_REFERENCE.md](/Users/parisward/Nourish/guides/SCHEMA_REFERENCE.md)
- implementation roadmap: [IMPLEMENTATION_PHASES_REFERENCE.md](/Users/parisward/Nourish/guides/IMPLEMENTATION_PHASES_REFERENCE.md)
- stack and deployment direction: [TECHNICAL_REFERENCE.md](/Users/parisward/Nourish/guides/TECHNICAL_REFERENCE.md)

## Open Questions Still Worth Revisiting

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

## Risks to Avoid

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

## Success Criteria for Early Versions

An early version is successful if:

- a user can get a reasonable weekly plan quickly
- they can swap meals without frustration
- the grocery list feels useful in the store
- fridge suggestions feel relevant
- the system reduces waste and repeated planning effort
- the experience feels calm, warm, and low-pressure

## Short Reference Summary

If you only remember a few things about Nourish, remember these:

- it is an autopilot meal-planning app, not a tracking app
- nutrition logic is invisible to the user
- fridge and waste-reduction logic are core, not secondary
- users should not be required to log every meal
- weeks can be saved and rotated
- recipes need structured metadata to power almost everything
- purchase-unit logic matters as much as nutrition logic
- launch should prioritize reliability and low friction over maximal feature scope
