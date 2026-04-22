## Feature Specification

## 1. Weekly meal plan

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

## 2. Meal swapping

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

## 3. Manual planning

Manual planning is part of the same experience, not a separate product mode.

### Requirements

- user can intentionally start from a blank week
- user can tap any slot to fill it
- app surfaces context-aware recommendations
- after selecting a recipe, user can apply it to multiple days
- app can fill only the remaining slots afterward

## 4. Snack suggestions

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

## 5. Grocery list

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

## 6. Fridge / pantry / freezer

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

## 7. What can I make?

This should be a top-level, highly visible fridge feature.

### Purpose

- help use what is already in the house
- reduce waste
- give immediate value even outside weekly planning

## 8. Recipe index

### Requirements

- search by name
- filter by cuisine
- filter by time
- filter by prep style
- filter by “in my fridge” or available ingredients later
- favorite/dislike signals

## 9. Recipe detail

Recipe detail should clearly separate:

- prep-ahead steps
- day-of active steps
- day-of passive steps
- core ingredients
- optional modifiers

## 10. Add/edit recipe

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

## 11. Saved weeks

Saved weeks should act like reusable templates.

### Requirements

- allow naming
- allow in-rotation flag
- allow reload into a new week
- visually preview week contents

### Important behavior

Loading a saved week should create a new current-week instance, not overwrite the template itself.

## 12. Rotation

Rotation is a natural extension of saved weeks.

### Requirements

- users can mark favorite weeks as in rotation
- future generation can reuse them
- app should detect conflicts:
  - disliked recipes
  - seasonal availability
  - changed preferences
- app should suggest swaps when a rotation week no longer cleanly fits

## 13. Eating out / skip support

Meal slots should support explicit “no meal generated here” behavior.

### Requirements

- available directly on the slot
- removes that slot from grocery generation
- removes that slot from nutrition-gap logic for that meal

## 14. Leftovers and freezing

This is a major planned differentiator.

### Requirements

- rigid recipes can intentionally produce extra portions
- app should proactively suggest freezing leftovers
- frozen leftovers should become candidates for future planning

## 15. Receipt scanning

Receipt scanning is useful but should be treated as a later-phase feature.