alter table "RecipeSteps"
  add column if not exists "PrepCategory" text not null default 'AssemblePortion';

alter table "RecipeSteps"
  add column if not exists "LinkedIngredientIds" jsonb not null default '[]'::jsonb;

alter table "RecipeSteps"
  add column if not exists "ScaleByLinkedIngredients" boolean not null default false;
