# Supabase SQL Setup

These scripts create the Nourish backend schema in Supabase PostgreSQL without relying on EF Core to create the tables on first boot.

Run them in this order in the Supabase SQL editor:

1. `01_schema.sql`
2. `02_mark_ef_migration.sql`
3. `03_seed_all_ingredients.sql`
4. `04_add_favorites_tables.sql`
5. `05_add_recipe_modifier_preferences.sql`
6. `06_add_slot_modifier_preferences.sql`
7. `07_add_week_slot_position.sql`

After that, start the backend normally.

What happens next:

- the backend will still call `db.Database.MigrateAsync()` on startup
- because the migration history row is already present, EF Core will treat the initial migration as applied
- the backend will still run `DbSeeder.SeedAsync(db)` and insert seed data if the database is empty
- `03_seed_all_ingredients.sql` updates or inserts the full ingredient reference library from `guides/seed_data`

Important:

- these scripts do **not** create the database itself; Supabase already provides the database
- these scripts do **not** include Row Level Security setup because the current app uses the custom .NET backend as the API layer
- if you later add a new EF migration, either let the backend apply it or generate a matching SQL script for Supabase
- the current recipe library is still sourced from `MealPlanner.Api/Data/DbSeeder.cs`

Incremental updates for an existing Supabase project:

- `04_add_favorites_tables.sql` adds user-level favorites tables for ingredients and weeks without recreating the base schema
- `05_add_recipe_modifier_preferences.sql` adds persistent selected add-on storage for recipe preferences
- `07_add_week_slot_position.sql` adds slot ordering so a single day can hold multiple snack rows
