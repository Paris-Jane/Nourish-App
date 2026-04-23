insert into "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
values ('20260423000354_InitialCreate', '10.0.0')
on conflict ("MigrationId") do nothing;
