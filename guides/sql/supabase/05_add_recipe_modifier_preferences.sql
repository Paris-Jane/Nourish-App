begin;

alter table "UserRecipePrefs"
add column if not exists "SelectedModifierIngredientIds" jsonb not null default '[]'::jsonb;

commit;
