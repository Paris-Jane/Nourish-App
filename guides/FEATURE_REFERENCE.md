# Feature Reference

This guide documents intended feature behavior for Nourish.

## Weekly Meal Plan

### Purpose

Help users build a full week of meals with low-friction suggestions and reusable saved weeks.

### Behavior

- [x] a new week can start from:
  - [x] a blank manual planner
  - [x] a saved week
- [x] week contains meal slots across Monday–Sunday
- [x] meal slots include at least breakfast, lunch, dinner, and snack
- [x] slots can be:
  - [x] filled with a recipe
  - [x] marked as eating out
  - [x] skipped
  - [x] manually locked

### UX expectations

- [x] users should be able to start planning immediately
- [x] swapping should be easy and in-context
- [x] empty slots should still feel supported, not broken

## Meal Swapping

### Swap recommendations should prioritize

- [x] similar prep time
- [x] overlap with other ingredients already planned
- [x] recipes using expiring fridge items
- [ ] recipes not disliked
- [x] recipes not used too recently

### Categories to show

- [x] Expiring soon
- [x] In your fridge
- [x] Ingredient overlap
- [x] Favorites
- [x] Recent

## Manual Planning

Manual planning is part of the same experience, not a separate product mode.

### Requirements

- [x] user can intentionally start from a blank week
- [x] user can tap any slot to fill it
- [x] app surfaces context-aware recommendations
- [x] after selecting a recipe, user can apply it to multiple days
- [x] saved weeks can act as a faster reusable starting point

## Snack Suggestions

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

- [x] subtle suggestions can appear as the week/day is being built
- [x] final pass can happen at confirmation time

## Grocery List

### Requirements

- [x] grouped by store section
- [x] checkable
- [x] inline quantity confirmation on check
- [x] checked items add to fridge inventory
- [x] completed items move into a done section

### Store sections

- Produce
- Protein
- Dairy
- Grains
- Pantry
- Frozen

### Important grocery logic

- [x] quantities must be consolidated
- [x] list should think in purchase units, not only recipe units
- [x] partial overlap across recipes should reduce waste

## Fridge / Pantry / Freezer

### Requirements

- [x] track location
- [x] track quantity
- [x] track expiry or estimated shelf life
- [x] allow manual entry
- [x] allow grocery-imported entry
- [x] support “what can I make?”

### Important design rule

Fridge, pantry, and freezer must be distinct because timing and recipe logic differ across them.

### Expiry behavior

- [x] estimated expiry can default from ingredient shelf-life rules
- [x] users can edit when needed
- [x] app highlights expiring items

## What Can I Make?

This should be a top-level, highly visible fridge feature.

### Purpose

- help use what is already in the house
- reduce waste
- give immediate value even outside weekly planning

## Recipe Index

### Requirements

- [x] search by name
- [x] filter by cuisine
- [x] filter by time
- [x] filter by prep style
- [ ] filter by “in my fridge” or available ingredients later
- [x] favorite/dislike signals

## Recipe Detail

Recipe detail should clearly separate:

- [x] prep-ahead steps
- [x] day-of active steps
- [x] day-of passive steps
- [x] core ingredients
- [x] optional modifiers

## Add / Edit Recipe

Recipe entry is one of the most important foundational systems because nearly everything depends on recipe quality.

### Metadata required on recipes

- [x] name
- [x] cuisine
- [x] meal type tags
- [x] time tag
- [x] prep style tag
- [x] scalability tag
- [x] freezer-friendly flag
- [x] cook-fresh-only flag
- [x] base yield servings
- [x] ingredients with quantities and units
- [x] step list with timing tags

### AI-assisted recipe entry

AI should assist with:

- [ ] meal type tag suggestion
- [ ] step categorization into prep-ahead / day-of active / day-of passive
- [ ] ingredient standardization
- [ ] purchase-unit suggestion
- [ ] scalability tag suggestion
- [ ] optional modifier detection

Human review is still required before save.

## Saved Weeks

Saved weeks should act like reusable templates.

### Requirements

- [x] allow naming
- [x] allow in-rotation flag
- [x] allow reload into a new week
- [x] visually preview week contents

### Important behavior

Loading a saved week should create a new current-week instance, not overwrite the template itself.

## Rotation

Rotation is a natural extension of saved weeks.

### Requirements

- [x] users can mark favorite weeks as in rotation
- [x] future generation can reuse them
- [ ] app should detect conflicts:
  - [ ] disliked recipes
  - [ ] seasonal availability
  - [ ] changed preferences
- [ ] app should suggest swaps when a rotation week no longer cleanly fits

## Eating Out / Skip Support

Meal slots should support explicit “no meal generated here” behavior.

### Requirements

- [x] available directly on the slot
- [x] removes that slot from grocery generation
- [x] removes that slot from nutrition-gap logic for that meal

## Leftovers and Freezing

This is a major planned differentiator.

### Requirements

- [ ] rigid recipes can intentionally produce extra portions
- [ ] app should proactively suggest freezing leftovers
- [ ] frozen leftovers should become candidates for future planning

## Receipt Scanning

Receipt scanning is useful but should be treated as a later-phase feature.
