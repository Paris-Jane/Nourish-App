begin;

alter table "Users"
  add column if not exists "HeightInches" integer not null default 0;

alter table "Users"
  add column if not exists "WeightPounds" numeric not null default 0;

commit;
