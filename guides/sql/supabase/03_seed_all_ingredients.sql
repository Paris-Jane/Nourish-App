-- Generated from guides/seed_data/*.csv
-- Inserts missing ingredients and updates existing ones by Name
begin;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Acorn Squash') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Classified as vegetable for MyPlate planning.'
    where "Name" = 'Acorn Squash';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Acorn Squash', 'Vegetable', 1, 'cup cooked', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, 'Classified as vegetable for MyPlate planning.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Alfredo Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Prepared mixed sauce; tracked as Other rather than Dairy for MyPlate counting.'
    where "Name" = 'Alfredo Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Alfredo Sauce', 'Other', 0, 'tbsp', 'jar',
      'Fridge', 'Pantry', true, false,
      false, 30, 15, 'oz',
      false, '[]'::jsonb, 'Prepared mixed sauce; tracked as Other rather than Dairy for MyPlate counting.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'All-Purpose Flour') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '["Plain Flour"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'All-Purpose Flour';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'All-Purpose Flour', 'Other', 0, 'cup', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 365, 5, 'lb',
      true, '["Plain Flour"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Almond Butter') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Almond Butter';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Almond Butter', 'Protein', 2, 'tbsp', 'jar',
      'Pantry', 'Protein', false, false,
      true, 180, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Almond Extract') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Almond Extract';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Almond Extract', 'Other', 0, 'tsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Almonds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Almonds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Almonds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Anchovies') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'tin' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Anchovies';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Anchovies', 'Protein', 2, 'oz', 'tin',
      'Pantry', 'Protein', false, false,
      true, 365, 2, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Apple') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Apple';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Apple', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Apple Cider Vinegar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Apple Cider Vinegar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Apple Cider Vinegar', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Apple Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 64 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Apple Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Apple Juice', 'Fruit', 1, 'cup', 'bottle',
      'Fridge', 'Produce', true, false,
      true, 7, 64, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Applesauce') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 24 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Applesauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Applesauce', 'Fruit', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 24, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Apricot') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 4 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Apricot';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Apricot', 'Fruit', 4, 'whole', 'lb',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Apricots (Dried)') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Apricots (Dried)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Apricots (Dried)', 'Fruit', 0.5, 'cup', 'bag',
      'Fridge', 'Produce', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Artichoke') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'medium artichoke' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Artichoke';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Artichoke', 'Vegetable', 1, 'medium artichoke', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Artichoke Hearts') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Artichoke Hearts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Artichoke Hearts', 'Vegetable', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 14, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Arugula') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cups raw' ,
      "PurchaseUnit" = 'clamshell' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '["Rocket"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Arugula';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Arugula', 'Vegetable', 2, 'cups raw', 'clamshell',
      'Fridge', 'Produce', true, false,
      true, 5, 5, 'oz',
      false, '["Rocket"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Asparagus') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Asparagus';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Asparagus', 'Vegetable', 1, 'cup chopped', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Avocado') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Avocado';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Avocado', 'Vegetable', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Bacon') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'slices' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Bacon';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Bacon', 'Protein', 2, 'slices', 'package',
      'Fridge', 'Protein', true, false,
      true, 7, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Bagel') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'small' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Bagel';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Bagel', 'Grains', 1, 'small', 'bag',
      'Pantry', 'Grains', false, false,
      true, 7, 6, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Baguette') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'loaf' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'loaf' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Baguette';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Baguette', 'Grains', 2, 'oz', 'loaf',
      'Pantry', 'Grains', false, false,
      true, 3, 1, 'loaf',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Baked Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Baked Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Baked Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Baking Powder') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Baking Powder';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Baking Powder', 'Other', 0, 'tsp', 'container',
      'Pantry', 'Pantry', false, false,
      false, 730, 8, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Baking Soda') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Baking Soda';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Baking Soda', 'Other', 0, 'tsp', 'box',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Balsamic Vinegar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Balsamic Vinegar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Balsamic Vinegar', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Banana') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Banana';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Banana', 'Fruit', 1, 'whole', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Barbecue Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 18 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Barbecue Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Barbecue Sauce', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 18, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Barley') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Barley';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Barley', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Beef Brisket') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Beef Brisket';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Beef Brisket', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Beef Roast') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Beef Roast';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Beef Roast', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Beets') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Beets';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Beets', 'Vegetable', 1, 'cup chopped', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 14, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Bell Pepper') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '["Sweet Pepper"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Bell Pepper';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Bell Pepper', 'Vegetable', 1, 'cup chopped', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '["Sweet Pepper"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Black Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Black Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Black Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Black Olives') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Black Olives';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Black Olives', 'Vegetable', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 365, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Black Rice') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Black Rice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Black Rice', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Black-Eyed Peas') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '["Cowpeas"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Black-Eyed Peas';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Black-Eyed Peas', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '["Cowpeas"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Blackberries') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'pint' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'pint' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Blackberries';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Blackberries', 'Fruit', 1, 'cup', 'pint',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'pint',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Blueberries') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'pint' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'pint' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Blueberries';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Blueberries', 'Fruit', 1, 'cup', 'pint',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'pint',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Bouillon Cubes') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'cube' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Bouillon Cubes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Bouillon Cubes', 'Other', 0, 'cube', 'box',
      'Pantry', 'Pantry', false, false,
      false, 730, 8, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Brazil Nuts') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Brazil Nuts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Brazil Nuts', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Bread Crumbs') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Bread Crumbs';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Bread Crumbs', 'Grains', 0.5, 'cup', 'container',
      'Pantry', 'Grains', false, false,
      true, 180, 15, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Broccoli') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Broccoli';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Broccoli', 'Vegetable', 1, 'cup chopped', 'head',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Broccoli (Cooked)') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Broccoli (Cooked)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Broccoli (Cooked)', 'Vegetable', 1, 'cup cooked', 'head',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Brown Rice') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Brown Rice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Brown Rice', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Brown Rice Noodles') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Brown Rice Noodles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Brown Rice Noodles', 'Grains', 0.5, 'cup cooked', 'package',
      'Pantry', 'Grains', false, false,
      true, 365, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Brown Sugar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Brown Sugar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Brown Sugar', 'Other', 0, 'tbsp', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Brussels Sprouts') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Brussels Sprouts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Brussels Sprouts', 'Vegetable', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Buckwheat') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Buckwheat';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Buckwheat', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Burger Bun') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'bun' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Burger Bun';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Burger Bun', 'Grains', 1, 'bun', 'package',
      'Pantry', 'Grains', false, false,
      true, 7, 8, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Butter') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 90 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Tracked as Other rather than Dairy for MyPlate counting.'
    where "Name" = 'Butter';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Butter', 'Other', 0, 'tbsp', 'box',
      'Fridge', 'Pantry', true, false,
      false, 90, 16, 'oz',
      false, '[]'::jsonb, 'Tracked as Other rather than Dairy for MyPlate counting.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Buttermilk') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'carton' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Buttermilk';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Buttermilk', 'Dairy', 1, 'cup', 'carton',
      'Fridge', 'Dairy', true, false,
      true, 14, 32, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Butternut Squash') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cubed' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Butternut Squash';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Butternut Squash', 'Vegetable', 1, 'cup cubed', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cabbage') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup shredded' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cabbage';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cabbage', 'Vegetable', 1, 'cup shredded', 'head',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Chicken') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 1095 ,
      "TypicalPackageSize" = 12.5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Chicken';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Chicken', 'Protein', 3, 'oz', 'can',
      'Pantry', 'Protein', false, false,
      true, 1095, 12.5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Mandarin Oranges') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Mandarin Oranges';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Mandarin Oranges', 'Fruit', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Peaches') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Peaches';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Peaches', 'Fruit', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Pears') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Pears';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Pears', 'Fruit', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Pineapple') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 20 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Pineapple';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Pineapple', 'Fruit', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 20, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Salmon') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 1095 ,
      "TypicalPackageSize" = 14.75 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Salmon';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Salmon', 'Protein', 3, 'oz', 'can',
      'Pantry', 'Protein', false, false,
      true, 1095, 14.75, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canned Tuna') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 1095 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canned Tuna';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canned Tuna', 'Protein', 3, 'oz', 'can',
      'Pantry', 'Protein', false, false,
      true, 1095, 5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cannellini Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cannellini Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cannellini Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Canola Oil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 48 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Canola Oil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Canola Oil', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 48, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cantaloupe') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup diced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cantaloupe';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cantaloupe', 'Fruit', 1, 'cup diced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Carrots') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Carrots';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Carrots', 'Vegetable', 1, 'cup chopped', 'bag',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cashews') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cashews';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cashews', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cauliflower') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cauliflower';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cauliflower', 'Vegetable', 1, 'cup chopped', 'head',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Celery') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Celery';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Celery', 'Vegetable', 1, 'cup chopped', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 14, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cereal') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cereal';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cereal', 'Grains', 1, 'cup', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cheddar Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cheddar Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cheddar Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cherries') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cherries';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cherries', 'Fruit', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cherry Tomatoes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'pint' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'pint' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cherry Tomatoes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cherry Tomatoes', 'Vegetable', 1, 'cup', 'pint',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'pint',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Chia Seeds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Chia Seeds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Chia Seeds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Chicken Breast') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Chicken Breast';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Chicken Breast', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 3, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Chicken Drumsticks') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Chicken Drumsticks';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Chicken Drumsticks', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 3, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Chicken Sausage') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Chicken Sausage';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Chicken Sausage', 'Protein', 3, 'oz', 'package',
      'Fridge', 'Protein', true, false,
      true, 5, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Chicken Thighs') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Chicken Thighs';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Chicken Thighs', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 3, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Chickpeas') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '["Garbanzo Beans"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Chickpeas';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Chickpeas', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '["Garbanzo Beans"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Clams') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Clams';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Clams', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Clementine') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 3 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Clementine';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Clementine', 'Fruit', 2, 'whole', 'bag',
      'Fridge', 'Produce', true, false,
      true, 21, 3, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Coconut Oil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Coconut Oil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Coconut Oil', 'Other', 0, 'tbsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 14, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cod') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cod';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cod', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Colby Jack Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Colby Jack Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Colby Jack Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Collard Greens') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cups raw' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Collard Greens';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Collard Greens', 'Vegetable', 2, 'cups raw', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Corn') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = null ,
      "PackageSizeUnit" = '' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Corn';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Corn', 'Vegetable', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 5, null, '',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Corn Syrup') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Corn Syrup';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Corn Syrup', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Corn Tortilla') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'tortilla' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Corn Tortilla';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Corn Tortilla', 'Grains', 1, 'tortilla', 'package',
      'Pantry', 'Grains', false, false,
      true, 14, 12, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cornstarch') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cornstarch';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cornstarch', 'Other', 0, 'tbsp', 'box',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cottage Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'tub' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cottage Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cottage Cheese', 'Dairy', 1, 'cup', 'tub',
      'Fridge', 'Dairy', true, false,
      true, 7, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Couscous') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Couscous';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Couscous', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Crab') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Crab';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Crab', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Crackers') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Crackers';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Crackers', 'Grains', 1, 'oz', 'box',
      'Pantry', 'Grains', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cranberries (Dried)') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cranberries (Dried)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cranberries (Dried)', 'Fruit', 0.5, 'cup', 'bag',
      'Fridge', 'Produce', false, false,
      true, 180, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Crumbled Blue Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Crumbled Blue Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Crumbled Blue Cheese', 'Dairy', 1.5, 'oz', 'container',
      'Fridge', 'Dairy', true, false,
      true, 14, 5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Crushed Tomatoes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 28 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Crushed Tomatoes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Crushed Tomatoes', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 28, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Cucumber') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Cucumber';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Cucumber', 'Vegetable', 1, 'cup sliced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dates') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dates';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dates', 'Fruit', 0.5, 'cup', 'container',
      'Fridge', 'Produce', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Deli Ham') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Deli Ham';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Deli Ham', 'Protein', 3, 'oz', 'package',
      'Fridge', 'Protein', true, false,
      true, 5, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Deli Turkey') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Deli Turkey';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Deli Turkey', 'Protein', 3, 'oz', 'package',
      'Fridge', 'Protein', true, false,
      true, 5, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Diced Tomatoes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 14.5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Diced Tomatoes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Diced Tomatoes', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 14.5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dijon Mustard') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dijon Mustard';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dijon Mustard', 'Other', 0, 'tbsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 365, 12, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dried Basil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dried Basil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dried Basil', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 1, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dried Oregano') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dried Oregano';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dried Oregano', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 1, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dried Parsley') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dried Parsley';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dried Parsley', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 1, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dried Rosemary') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dried Rosemary';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dried Rosemary', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 1, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Dried Thyme') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Dried Thyme';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Dried Thyme', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 1, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Duck Breast') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Duck Breast';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Duck Breast', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 3, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Edam Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Edam Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Edam Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Edamame') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Stored as a legume so it can flex into protein or vegetable coverage.'
    where "Name" = 'Edamame';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Edamame', 'Legume', 0.5, 'cup', 'bag',
      'Fridge', 'Protein', true, true,
      true, 5, 12, 'oz',
      false, '[]'::jsonb, 'Stored as a legume so it can flex into protein or vegetable coverage.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Egg Whites') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'carton' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Egg Whites';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Egg Whites', 'Protein', 3, 'oz', 'carton',
      'Fridge', 'Protein', true, false,
      true, 7, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Eggplant') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cubed' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '["Aubergine"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Eggplant';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Eggplant', 'Vegetable', 1, 'cup cubed', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '["Aubergine"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Eggs') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'large egg' ,
      "PurchaseUnit" = 'dozen' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Eggs';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Eggs', 'Protein', 1, 'large egg', 'dozen',
      'Fridge', 'Protein', true, false,
      true, 21, 12, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'English Muffin') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'muffin' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'English Muffin';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'English Muffin', 'Grains', 1, 'muffin', 'package',
      'Pantry', 'Grains', false, false,
      true, 7, 6, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Evaporated Cane Sugar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Evaporated Cane Sugar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Evaporated Cane Sugar', 'Other', 0, 'tbsp', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Evaporated Milk') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Evaporated Milk';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Evaporated Milk', 'Dairy', 1, 'cup', 'can',
      'Pantry', 'Dairy', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Farro') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Farro';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Farro', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fava Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fava Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fava Beans', 'Legume', 0.5, 'cup', 'bag',
      'Pantry', 'Protein', false, true,
      true, 730, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fennel') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'bulb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bulb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fennel';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fennel', 'Vegetable', 1, 'cup sliced', 'bulb',
      'Fridge', 'Produce', true, false,
      true, 10, 1, 'bulb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Feta Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Feta Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Feta Cheese', 'Dairy', 1.5, 'oz', 'container',
      'Fridge', 'Dairy', true, false,
      true, 14, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Figs (Dried)') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Figs (Dried)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Figs (Dried)', 'Fruit', 0.5, 'cup', 'bag',
      'Fridge', 'Produce', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fire-Roasted Tomatoes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 14.5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fire-Roasted Tomatoes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fire-Roasted Tomatoes', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 14.5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fish Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 24 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fish Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fish Sauce', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 24, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Flank Steak') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Flank Steak';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Flank Steak', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Flax Seeds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Flax Seeds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Flax Seeds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Flour Tortilla') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'tortilla' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Flour Tortilla';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Flour Tortilla', 'Grains', 1, 'tortilla', 'package',
      'Pantry', 'Grains', false, false,
      true, 14, 10, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fontina Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fontina Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fontina Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fresh Mozzarella') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fresh Mozzarella';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fresh Mozzarella', 'Dairy', 1.5, 'oz', 'package',
      'Fridge', 'Dairy', true, false,
      true, 7, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Fruit Cup') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'cup' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'cup' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Fruit Cup';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Fruit Cup', 'Fruit', 0.5, 'cup', 'cup',
      'Pantry', 'Pantry', false, false,
      true, 365, 1, 'cup',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Garlic') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cloves' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 60 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Garlic';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Garlic', 'Vegetable', 0.5, 'cup cloves', 'head',
      'Fridge', 'Produce', true, false,
      true, 60, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Garlic Powder') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 3 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Garlic Powder';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Garlic Powder', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 3, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Giardiniera') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Giardiniera';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Giardiniera', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Gnocchi') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Stored under grains for planning simplicity.'
    where "Name" = 'Gnocchi';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Gnocchi', 'Grains', 0.5, 'cup cooked', 'package',
      'Fridge', 'Grains', true, false,
      true, 14, 16, 'oz',
      false, '[]'::jsonb, 'Stored under grains for planning simplicity.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Goat Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'log' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 4 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Goat Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Goat Cheese', 'Dairy', 1.5, 'oz', 'log',
      'Fridge', 'Dairy', true, false,
      true, 14, 4, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Gouda Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Gouda Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Gouda Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Granola') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Granola';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Granola', 'Grains', 0.5, 'cup', 'bag',
      'Pantry', 'Grains', false, false,
      true, 180, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Grapefruit') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Grapefruit';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Grapefruit', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Grapefruit Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Grapefruit Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Grapefruit Juice', 'Fruit', 1, 'cup', 'bottle',
      'Fridge', 'Produce', true, false,
      true, 7, 32, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Grapes') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Grapes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Grapes', 'Fruit', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 14, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Gravy') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Gravy';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Gravy', 'Other', 0, 'tbsp', 'jar',
      'Fridge', 'Pantry', true, false,
      false, 14, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Great Northern Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Great Northern Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Great Northern Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Greek Yogurt') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'tub' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '["Strained Yogurt"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Greek Yogurt';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Greek Yogurt', 'Dairy', 1, 'cup', 'tub',
      'Fridge', 'Dairy', true, false,
      true, 10, 32, 'oz',
      false, '["Strained Yogurt"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Green Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Green Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Green Beans', 'Vegetable', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Green Chiles') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 4 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Green Chiles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Green Chiles', 'Vegetable', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 4, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Green Onions') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '["Scallions", "Spring Onions"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Green Onions';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Green Onions', 'Vegetable', 1, 'cup chopped', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'bunch',
      false, '["Scallions", "Spring Onions"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ground Beef') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '["Minced Beef"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ground Beef';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ground Beef', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '["Minced Beef"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ground Bison') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ground Bison';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ground Bison', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ground Chicken') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ground Chicken';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ground Chicken', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ground Lamb') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ground Lamb';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ground Lamb', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ground Pork') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ground Pork';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ground Pork', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ground Turkey') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ground Turkey';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ground Turkey', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Gruyere Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Gruyere Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Gruyere Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ham') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ham';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ham', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 5, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Hazelnuts') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Hazelnuts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Hazelnuts', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Hearts of Palm') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Hearts of Palm';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Hearts of Palm', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 14, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Hemp Seeds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Hemp Seeds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Hemp Seeds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Hominy') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Hominy';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Hominy', 'Grains', 0.5, 'cup', 'can',
      'Pantry', 'Grains', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Honey') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Honey';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Honey', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 12, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Honeydew') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup diced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Honeydew';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Honeydew', 'Fruit', 1, 'cup diced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Hot Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Hot Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Hot Sauce', 'Other', 0, 'tsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 5, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Hummus') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.25 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Prepared legume dip; kept flexible for planning logic.'
    where "Name" = 'Hummus';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Hummus', 'Legume', 0.25, 'cup', 'container',
      'Fridge', 'Protein', true, true,
      true, 7, 10, 'oz',
      false, '[]'::jsonb, 'Prepared legume dip; kept flexible for planning logic.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Jalapeno') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Jalapeno';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Jalapeno', 'Vegetable', 1, 'cup sliced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Jam') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Jam';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Jam', 'Fruit', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Jarred Roasted Red Peppers') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Jarred Roasted Red Peppers';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Jarred Roasted Red Peppers', 'Vegetable', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Jasmine Rice') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Jasmine Rice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Jasmine Rice', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Jelly') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 18 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Jelly';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Jelly', 'Fruit', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 18, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Kale') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cups raw' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Kale';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Kale', 'Vegetable', 2, 'cups raw', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Kale (Cooked)') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Kale (Cooked)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Kale (Cooked)', 'Vegetable', 1, 'cup cooked', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Kefir') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Kefir';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Kefir', 'Dairy', 1, 'cup', 'bottle',
      'Fridge', 'Dairy', true, false,
      true, 14, 32, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ketchup') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 20 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ketchup';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ketchup', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 20, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Kidney Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Kidney Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Kidney Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Kimchi') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Kimchi';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Kimchi', 'Vegetable', 0.5, 'cup', 'jar',
      'Fridge', 'Produce', true, false,
      true, 30, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Kiwi') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Kiwi';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Kiwi', 'Fruit', 2, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 14, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lamb Chops') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lamb Chops';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lamb Chops', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Leeks') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Leeks';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Leeks', 'Vegetable', 1, 'cup sliced', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 14, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lemon') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lemon';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lemon', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lemon Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lemon Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lemon Juice', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lentils') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lentils';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lentils', 'Legume', 0.5, 'cup', 'bag',
      'Pantry', 'Protein', false, true,
      true, 730, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Light Brown Sugar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Light Brown Sugar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Light Brown Sugar', 'Other', 0, 'tbsp', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lima Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lima Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lima Beans', 'Legume', 0.5, 'cup', 'bag',
      'Pantry', 'Protein', false, true,
      true, 730, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lime') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lime';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lime', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lime Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lime Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lime Juice', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Lobster') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Lobster';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Lobster', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Macaroni') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Macaroni';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Macaroni', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mango') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mango';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mango', 'Fruit', 1, 'cup chopped', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Maple Syrup') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Maple Syrup';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Maple Syrup', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 12, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Marinated Artichokes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Marinated Artichokes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Marinated Artichokes', 'Vegetable', 1, 'cup', 'jar',
      'Fridge', 'Produce', true, false,
      true, 30, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Marinated Mushrooms') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Marinated Mushrooms';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Marinated Mushrooms', 'Vegetable', 1, 'cup', 'jar',
      'Fridge', 'Produce', true, false,
      true, 30, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mayonnaise') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 90 ,
      "TypicalPackageSize" = 30 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mayonnaise';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mayonnaise', 'Other', 0, 'tbsp', 'jar',
      'Fridge', 'Pantry', true, false,
      false, 90, 30, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Milk') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'gallon' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 128 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Milk';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Milk', 'Dairy', 1, 'cup', 'gallon',
      'Fridge', 'Dairy', true, false,
      true, 7, 128, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Millet') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Millet';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Millet', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mirin') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mirin';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mirin', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 10, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Miso Paste') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Miso Paste';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Miso Paste', 'Other', 0, 'tbsp', 'container',
      'Fridge', 'Pantry', true, false,
      false, 180, 14, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mixed Greens') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cups raw' ,
      "PurchaseUnit" = 'clamshell' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mixed Greens';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mixed Greens', 'Vegetable', 2, 'cups raw', 'clamshell',
      'Fridge', 'Produce', true, false,
      true, 5, 5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mixed Nuts') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mixed Nuts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mixed Nuts', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Molasses') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Molasses';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Molasses', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Monterey Jack Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Monterey Jack Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Monterey Jack Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mozzarella Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mozzarella Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mozzarella Cheese', 'Dairy', 1.5, 'oz', 'package',
      'Fridge', 'Dairy', true, false,
      true, 14, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Multigrain Bread') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'slice' ,
      "PurchaseUnit" = 'loaf' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'loaf' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Multigrain Bread';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Multigrain Bread', 'Grains', 1, 'slice', 'loaf',
      'Pantry', 'Grains', false, false,
      true, 7, 1, 'loaf',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mushrooms') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mushrooms';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mushrooms', 'Vegetable', 1, 'cup sliced', 'package',
      'Fridge', 'Produce', true, false,
      true, 7, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mushrooms (Cooked)') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mushrooms (Cooked)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mushrooms (Cooked)', 'Vegetable', 1, 'cup cooked', 'package',
      'Fridge', 'Produce', true, false,
      true, 7, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mussels') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mussels';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mussels', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Mustard') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Mustard';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Mustard', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 14, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Naan') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'piece' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 4 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Naan';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Naan', 'Grains', 1, 'piece', 'package',
      'Pantry', 'Grains', false, false,
      true, 7, 4, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Napa Cabbage') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup shredded' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Napa Cabbage';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Napa Cabbage', 'Vegetable', 1, 'cup shredded', 'head',
      'Fridge', 'Produce', true, false,
      true, 10, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Navy Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Navy Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Navy Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Nectarine') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Nectarine';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Nectarine', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Nutmeg') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Nutmeg';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Nutmeg', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Oatmeal') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 18 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Oatmeal';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Oatmeal', 'Grains', 0.5, 'cup cooked', 'container',
      'Pantry', 'Grains', false, false,
      true, 365, 18, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Oats') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup dry' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 18 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Oats';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Oats', 'Grains', 0.5, 'cup dry', 'container',
      'Pantry', 'Grains', false, false,
      true, 365, 18, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Olive Oil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Olive Oil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Olive Oil', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Olive Tapenade') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Olive Tapenade';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Olive Tapenade', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Olives') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Olives';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Olives', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Onion') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Onion';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Onion', 'Vegetable', 1, 'cup chopped', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Onion Powder') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 3 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Onion Powder';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Onion Powder', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 3, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Orange') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Orange';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Orange', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Orange Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 64 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Orange Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Orange Juice', 'Fruit', 1, 'cup', 'bottle',
      'Fridge', 'Produce', true, false,
      true, 7, 64, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Orzo') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Orzo';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Orzo', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Panko') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Panko';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Panko', 'Grains', 0.5, 'cup', 'container',
      'Pantry', 'Grains', false, false,
      true, 180, 8, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Papaya') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup diced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Papaya';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Papaya', 'Fruit', 1, 'cup diced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Paprika') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Paprika';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Paprika', 'Other', 0, 'tsp', 'jar',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Parmesan Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'wedge' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Parmesan Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Parmesan Cheese', 'Dairy', 1.5, 'oz', 'wedge',
      'Fridge', 'Dairy', true, false,
      true, 30, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Parsnips') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Parsnips';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Parsnips', 'Vegetable', 1, 'cup chopped', 'bag',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Peach') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Peach';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Peach', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Peanut Butter') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Peanut Butter';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Peanut Butter', 'Protein', 2, 'tbsp', 'jar',
      'Pantry', 'Protein', false, false,
      true, 180, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Peanut Oil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 24 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Peanut Oil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Peanut Oil', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 24, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Peanuts') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Peanuts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Peanuts', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pear') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pear';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pear', 'Fruit', 1, 'whole', 'each',
      'Fridge', 'Produce', true, false,
      true, 14, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pearled Barley') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pearled Barley';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pearled Barley', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Peas') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Peas';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Peas', 'Vegetable', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 5, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pecans') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pecans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pecans', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Penne') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Penne';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Penne', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pesto') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pesto';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pesto', 'Other', 0, 'tbsp', 'jar',
      'Fridge', 'Pantry', true, false,
      false, 30, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pickled Beets') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pickled Beets';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pickled Beets', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pickled Jalapenos') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pickled Jalapenos';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pickled Jalapenos', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pico de Gallo') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pico de Gallo';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pico de Gallo', 'Vegetable', 1, 'cup', 'container',
      'Pantry', 'Pantry', true, false,
      true, 5, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pineapple') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pineapple';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pineapple', 'Fruit', 1, 'cup chopped', 'each',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pineapple Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pineapple Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pineapple Juice', 'Fruit', 1, 'cup', 'bottle',
      'Fridge', 'Produce', true, false,
      true, 7, 32, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pinto Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pinto Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pinto Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pistachios') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pistachios';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pistachios', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pita Bread') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'pita' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pita Bread';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pita Bread', 'Grains', 1, 'pita', 'package',
      'Pantry', 'Grains', false, false,
      true, 7, 6, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pizza Dough') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Assumes refrigerated dough.'
    where "Name" = 'Pizza Dough';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pizza Dough', 'Grains', 2, 'oz', 'package',
      'Fridge', 'Grains', true, false,
      true, 5, 16, 'oz',
      false, '[]'::jsonb, 'Assumes refrigerated dough.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pizza Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pizza Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pizza Sauce', 'Vegetable', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 14, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Plain Yogurt') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'tub' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '["Regular Yogurt"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Plain Yogurt';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Plain Yogurt', 'Dairy', 1, 'cup', 'tub',
      'Fridge', 'Dairy', true, false,
      true, 10, 32, 'oz',
      false, '["Regular Yogurt"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Plum') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Plum';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Plum', 'Fruit', 2, 'whole', 'lb',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Polenta') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Polenta';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Polenta', 'Grains', 0.5, 'cup cooked', 'package',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pomegranate Arils') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pomegranate Arils';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pomegranate Arils', 'Fruit', 1, 'cup', 'container',
      'Fridge', 'Produce', true, false,
      true, 5, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Popcorn') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'cups popped' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Popcorn';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Popcorn', 'Grains', 3, 'cups popped', 'bag',
      'Pantry', 'Grains', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pork Chops') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pork Chops';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pork Chops', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pork Sausage') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pork Sausage';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pork Sausage', 'Protein', 3, 'oz', 'package',
      'Fridge', 'Protein', true, false,
      true, 3, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pork Tenderloin') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pork Tenderloin';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pork Tenderloin', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Potato') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Potato';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Potato', 'Vegetable', 1, 'cup cooked', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Powdered Sugar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '["Confectioners Sugar"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Powdered Sugar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Powdered Sugar', 'Other', 0, 'tbsp', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'lb',
      true, '["Confectioners Sugar"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Preserves') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Preserves';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Preserves', 'Fruit', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Provolone Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Provolone Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Provolone Cheese', 'Dairy', 1.5, 'oz', 'package',
      'Fridge', 'Dairy', true, false,
      true, 14, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Prunes') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Prunes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Prunes', 'Fruit', 0.5, 'cup', 'container',
      'Fridge', 'Produce', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pumpkin') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cubed' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 60 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pumpkin';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pumpkin', 'Vegetable', 1, 'cup cubed', 'each',
      'Fridge', 'Produce', true, false,
      true, 60, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pumpkin Pie Filling') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Prepared sweetened pumpkin product; vegetable classification reflects pumpkin base, not nutritional quality.'
    where "Name" = 'Pumpkin Pie Filling';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pumpkin Pie Filling', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, 'Prepared sweetened pumpkin product; vegetable classification reflects pumpkin base, not nutritional quality.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pumpkin Puree') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pumpkin Puree';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pumpkin Puree', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Pumpkin Seeds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Pumpkin Seeds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Pumpkin Seeds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Queso Fresco') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Queso Fresco';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Queso Fresco', 'Dairy', 1.5, 'oz', 'package',
      'Fridge', 'Dairy', true, false,
      true, 14, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Quinoa') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Quinoa';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Quinoa', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Radishes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'bunch' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Radishes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Radishes', 'Vegetable', 1, 'cup sliced', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 10, 1, 'bunch',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Raisins') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Raisins';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Raisins', 'Fruit', 0.5, 'cup', 'box',
      'Pantry', 'Pantry', false, false,
      true, 180, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ramen Noodles') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 3 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ramen Noodles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ramen Noodles', 'Grains', 0.5, 'cup cooked', 'package',
      'Pantry', 'Grains', false, false,
      true, 365, 3, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ranch Dressing') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 90 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ranch Dressing';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ranch Dressing', 'Other', 0, 'tbsp', 'bottle',
      'Fridge', 'Pantry', true, false,
      false, 90, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Raspberries') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'pint' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'pint' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Raspberries';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Raspberries', 'Fruit', 1, 'cup', 'pint',
      'Fridge', 'Produce', true, false,
      true, 4, 1, 'pint',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Red Cabbage') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup shredded' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Red Cabbage';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Red Cabbage', 'Vegetable', 1, 'cup shredded', 'head',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Red Wine Vinegar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Red Wine Vinegar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Red Wine Vinegar', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 12, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Refried Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Refried Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Refried Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Relish') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Relish';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Relish', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Rice Cakes') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cakes' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Rice Cakes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Rice Cakes', 'Grains', 2, 'cakes', 'package',
      'Pantry', 'Grains', false, false,
      true, 180, 14, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Rice Noodles') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Rice Noodles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Rice Noodles', 'Grains', 0.5, 'cup cooked', 'package',
      'Pantry', 'Grains', false, false,
      true, 365, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Rice Vinegar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Rice Vinegar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Rice Vinegar', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 12, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Ricotta Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'tub' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Ricotta Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Ricotta Cheese', 'Dairy', 1, 'cup', 'tub',
      'Fridge', 'Dairy', true, false,
      true, 10, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Rigatoni') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Rigatoni';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Rigatoni', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Roast Beef') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Roast Beef';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Roast Beef', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 5, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Rolled Oats') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup dry' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 18 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Rolled Oats';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Rolled Oats', 'Grains', 0.5, 'cup dry', 'container',
      'Pantry', 'Grains', false, false,
      true, 365, 18, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Romaine Lettuce') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cups chopped' ,
      "PurchaseUnit" = 'head' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'head' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Romaine Lettuce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Romaine Lettuce', 'Vegetable', 2, 'cups chopped', 'head',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'head',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Salmon') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Salmon';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Salmon', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Salsa') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Salsa';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Salsa', 'Vegetable', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Salsa Verde') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Salsa Verde';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Salsa Verde', 'Vegetable', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Salt') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'container' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 26 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Salt';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Salt', 'Other', 0, 'tsp', 'container',
      'Pantry', 'Pantry', false, false,
      false, 730, 26, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sardines') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 1095 ,
      "TypicalPackageSize" = 3.75 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sardines';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sardines', 'Protein', 3, 'oz', 'can',
      'Pantry', 'Protein', false, false,
      true, 1095, 3.75, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sauerkraut') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sauerkraut';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sauerkraut', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Scallops') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Scallops';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Scallops', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sesame Oil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sesame Oil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sesame Oil', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 10, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sesame Seeds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sesame Seeds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sesame Seeds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Shallots') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Shallots';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Shallots', 'Vegetable', 1, 'cup chopped', 'bag',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Shrimp') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Shrimp';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Shrimp', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sirloin Steak') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sirloin Steak';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sirloin Steak', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Snap Peas') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Snap Peas';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Snap Peas', 'Vegetable', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 5, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Snow Peas') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Snow Peas';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Snow Peas', 'Vegetable', 1, 'cup', 'bag',
      'Fridge', 'Produce', true, false,
      true, 5, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Soba Noodles') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Soba Noodles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Soba Noodles', 'Grains', 0.5, 'cup cooked', 'package',
      'Pantry', 'Grains', false, false,
      true, 365, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sourdough Bread') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'slice' ,
      "PurchaseUnit" = 'loaf' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'loaf' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sourdough Bread';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sourdough Bread', 'Grains', 1, 'slice', 'loaf',
      'Pantry', 'Grains', false, false,
      true, 7, 1, 'loaf',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Soy Milk') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'carton' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 64 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Soy Milk';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Soy Milk', 'Dairy', 1, 'cup', 'carton',
      'Fridge', 'Dairy', true, false,
      true, 10, 64, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Soy Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Soy Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Soy Sauce', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 15, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Spaghetti') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Spaghetti';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Spaghetti', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Spaghetti Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 24 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Prepared tomato-based sauce; counted as a vegetable ingredient in this seed model.'
    where "Name" = 'Spaghetti Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Spaghetti Sauce', 'Vegetable', 1, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 24, 'oz',
      false, '[]'::jsonb, 'Prepared tomato-based sauce; counted as a vegetable ingredient in this seed model.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Spaghetti Squash') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked strands' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Spaghetti Squash';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Spaghetti Squash', 'Vegetable', 1, 'cup cooked strands', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Spinach') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'cups raw' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Spinach';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Spinach', 'Vegetable', 2, 'cups raw', 'bag',
      'Fridge', 'Produce', true, false,
      true, 5, 5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Spinach (Cooked)') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Spinach (Cooked)';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Spinach (Cooked)', 'Vegetable', 1, 'cup cooked', 'bag',
      'Fridge', 'Produce', true, false,
      true, 5, 5, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Split Peas') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Split Peas';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Split Peas', 'Legume', 0.5, 'cup', 'bag',
      'Pantry', 'Protein', false, true,
      true, 730, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Steak Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Steak Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Steak Sauce', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 10, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Strawberries') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'pint' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 5 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Strawberries';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Strawberries', 'Fruit', 1, 'cup', 'pint',
      'Fridge', 'Produce', true, false,
      true, 5, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'String Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'String Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'String Cheese', 'Dairy', 1.5, 'oz', 'package',
      'Fridge', 'Dairy', true, false,
      true, 14, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Stuffing Mix') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup prepared' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Stuffing Mix';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Stuffing Mix', 'Grains', 0.5, 'cup prepared', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Summer Squash') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Summer Squash';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Summer Squash', 'Vegetable', 1, 'cup sliced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sun-Dried Tomato Pesto') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sun-Dried Tomato Pesto';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sun-Dried Tomato Pesto', 'Other', 0, 'tbsp', 'jar',
      'Fridge', 'Pantry', true, false,
      false, 30, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sun-Dried Tomatoes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Shelf-stable pantry form of tomatoes.'
    where "Name" = 'Sun-Dried Tomatoes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sun-Dried Tomatoes', 'Vegetable', 0.5, 'cup', 'jar',
      'Pantry', 'Pantry', false, false,
      true, 365, 8, 'oz',
      false, '[]'::jsonb, 'Shelf-stable pantry form of tomatoes.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sunflower Seed Butter') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sunflower Seed Butter';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sunflower Seed Butter', 'Protein', 2, 'tbsp', 'jar',
      'Pantry', 'Protein', false, false,
      true, 180, 16, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Sunflower Seeds') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Sunflower Seeds';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Sunflower Seeds', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Swiss Cheese') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1.5 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'block' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Swiss Cheese';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Swiss Cheese', 'Dairy', 1.5, 'oz', 'block',
      'Fridge', 'Dairy', true, false,
      true, 21, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tahini') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'jar' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Counts toward protein in the current ingredient model even though it is primarily a seed paste.'
    where "Name" = 'Tahini';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tahini', 'Protein', 2, 'tbsp', 'jar',
      'Pantry', 'Protein', false, false,
      true, 365, 16, 'oz',
      true, '[]'::jsonb, 'Counts toward protein in the current ingredient model even though it is primarily a seed paste.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tangerine') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'whole' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 3 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tangerine';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tangerine', 'Fruit', 2, 'whole', 'bag',
      'Fridge', 'Produce', true, false,
      true, 21, 3, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tilapia') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tilapia';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tilapia', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tofu') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 14 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tofu';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tofu', 'Protein', 3, 'oz', 'package',
      'Fridge', 'Protein', true, false,
      true, 7, 14, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tomatillos') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tomatillos';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tomatillos', 'Vegetable', 1, 'cup chopped', 'bag',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tomato Juice') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tomato Juice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tomato Juice', 'Vegetable', 1, 'cup', 'bottle',
      'Fridge', 'Produce', true, false,
      true, 7, 32, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tomato Paste') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 6 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tomato Paste';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tomato Paste', 'Vegetable', 0.5, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 6, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tomato Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Tomato-based pantry ingredient used as a vegetable contributor in recipes.'
    where "Name" = 'Tomato Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tomato Sauce', 'Vegetable', 1, 'cup', 'can',
      'Pantry', 'Pantry', false, false,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, 'Tomato-based pantry ingredient used as a vegetable contributor in recipes.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tomatoes') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tomatoes';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tomatoes', 'Vegetable', 1, 'cup chopped', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Tortilla Chips') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 90 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Tortilla Chips';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Tortilla Chips', 'Grains', 1, 'oz', 'bag',
      'Pantry', 'Grains', false, false,
      true, 90, 10, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Trout') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 2 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Trout';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Trout', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 2, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Turkey Bacon') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'slices' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Turkey Bacon';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Turkey Bacon', 'Protein', 2, 'slices', 'package',
      'Fridge', 'Protein', true, false,
      true, 7, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Turkey Breast') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Turkey Breast';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Turkey Breast', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 3, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Turkey Cutlets') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Turkey Cutlets';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Turkey Cutlets', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 3, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Turkey Sausage') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 3 ,
      "TypicalPackageSize" = 12 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Turkey Sausage';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Turkey Sausage', 'Protein', 3, 'oz', 'package',
      'Fridge', 'Protein', true, false,
      true, 3, 12, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Turnips') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup cubed' ,
      "PurchaseUnit" = 'bunch' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 21 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Turnips';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Turnips', 'Vegetable', 1, 'cup cubed', 'bunch',
      'Fridge', 'Produce', true, false,
      true, 21, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Udon Noodles') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Udon Noodles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Udon Noodles', 'Grains', 0.5, 'cup cooked', 'package',
      'Pantry', 'Grains', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Vanilla Extract') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 2 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Vanilla Extract';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Vanilla Extract', 'Other', 0, 'tsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 2, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Vegetable Broth') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'carton' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Vegetable Broth';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Vegetable Broth', 'Other', 0, 'cup', 'carton',
      'Pantry', 'Pantry', false, false,
      false, 365, 32, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Vegetable Oil') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 48 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Vegetable Oil';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Vegetable Oil', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 48, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Venison') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 3 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'lb' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 4 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Venison';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Venison', 'Protein', 3, 'oz', 'lb',
      'Fridge', 'Protein', true, false,
      true, 4, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Waffles') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 2 ,
      "ServingUnit" = 'waffles' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Freezer' ,
      "StoreSection" = 'Frozen' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = 'Assumes frozen packaged waffles.'
    where "Name" = 'Waffles';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Waffles', 'Grains', 2, 'waffles', 'box',
      'Freezer', 'Frozen', true, false,
      true, 180, 10, 'count',
      false, '[]'::jsonb, 'Assumes frozen packaged waffles.') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Walnuts') then
    update "Ingredients" set
      "FoodGroup" = 'Protein' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'oz' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 180 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Walnuts';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Walnuts', 'Protein', 1, 'oz', 'bag',
      'Pantry', 'Protein', false, false,
      true, 180, 8, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Watermelon') then
    update "Ingredients" set
      "FoodGroup" = 'Fruit' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup diced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Watermelon';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Watermelon', 'Fruit', 1, 'cup diced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'White Beans') then
    update "Ingredients" set
      "FoodGroup" = 'Legume' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'can' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Protein' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = true ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'White Beans';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'White Beans', 'Legume', 0.5, 'cup', 'can',
      'Pantry', 'Protein', false, true,
      true, 730, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'White Rice') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'White Rice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'White Rice', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'White Sugar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 4 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'White Sugar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'White Sugar', 'Other', 0, 'tbsp', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 730, 4, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'White Vinegar') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 730 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'White Vinegar';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'White Vinegar', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 730, 16, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Grain Bread') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'slice' ,
      "PurchaseUnit" = 'loaf' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'loaf' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Grain Bread';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Grain Bread', 'Grains', 1, 'slice', 'loaf',
      'Pantry', 'Grains', false, false,
      true, 7, 1, 'loaf',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Milk Yogurt') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'tub' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 32 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Milk Yogurt';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Milk Yogurt', 'Dairy', 1, 'cup', 'tub',
      'Fridge', 'Dairy', true, false,
      true, 10, 32, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Wheat Bread') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'slice' ,
      "PurchaseUnit" = 'loaf' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'loaf' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Wheat Bread';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Wheat Bread', 'Grains', 1, 'slice', 'loaf',
      'Pantry', 'Grains', false, false,
      true, 7, 1, 'loaf',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Wheat Couscous') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Wheat Couscous';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Wheat Couscous', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Wheat Flour') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 5 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Wheat Flour';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Wheat Flour', 'Other', 0, 'cup', 'bag',
      'Pantry', 'Pantry', false, false,
      false, 365, 5, 'lb',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Wheat Pasta') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'box' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 16 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '["Wholemeal Pasta"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Wheat Pasta';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Wheat Pasta', 'Grains', 0.5, 'cup cooked', 'box',
      'Pantry', 'Grains', false, false,
      true, 365, 16, 'oz',
      false, '["Wholemeal Pasta"]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole Wheat Tortilla') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'tortilla' ,
      "PurchaseUnit" = 'package' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 14 ,
      "TypicalPackageSize" = 8 ,
      "PackageSizeUnit" = 'count' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole Wheat Tortilla';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole Wheat Tortilla', 'Grains', 1, 'tortilla', 'package',
      'Pantry', 'Grains', false, false,
      true, 14, 8, 'count',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Whole-Milk Ricotta') then
    update "Ingredients" set
      "FoodGroup" = 'Dairy' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup' ,
      "PurchaseUnit" = 'tub' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Dairy' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 10 ,
      "TypicalPackageSize" = 15 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Whole-Milk Ricotta';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Whole-Milk Ricotta', 'Dairy', 1, 'cup', 'tub',
      'Fridge', 'Dairy', true, false,
      true, 10, 15, 'oz',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Wild Rice') then
    update "Ingredients" set
      "FoodGroup" = 'Grains' ,
      "ServingSize" = 0.5 ,
      "ServingUnit" = 'cup cooked' ,
      "PurchaseUnit" = 'bag' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Grains' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'lb' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Wild Rice';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Wild Rice', 'Grains', 0.5, 'cup cooked', 'bag',
      'Pantry', 'Grains', false, false,
      true, 365, 1, 'lb',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Worcestershire Sauce') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tbsp' ,
      "PurchaseUnit" = 'bottle' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 10 ,
      "PackageSizeUnit" = 'oz' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Worcestershire Sauce';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Worcestershire Sauce', 'Other', 0, 'tbsp', 'bottle',
      'Pantry', 'Pantry', false, false,
      false, 365, 10, 'oz',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Yeast') then
    update "Ingredients" set
      "FoodGroup" = 'Other' ,
      "ServingSize" = 0 ,
      "ServingUnit" = 'tsp' ,
      "PurchaseUnit" = 'packet' ,
      "DefaultLocation" = 'Pantry' ,
      "StoreSection" = 'Pantry' ,
      "IsPerishable" = false ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = false ,
      "ShelfLifeDays" = 365 ,
      "TypicalPackageSize" = 3 ,
      "PackageSizeUnit" = 'packet' ,
      "IsStaple" = true ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Yeast';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Yeast', 'Other', 0, 'tsp', 'packet',
      'Pantry', 'Pantry', false, false,
      false, 365, 3, 'packet',
      true, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Yellow Onion') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup chopped' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 30 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Yellow Onion';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Yellow Onion', 'Vegetable', 1, 'cup chopped', 'each',
      'Fridge', 'Produce', true, false,
      true, 30, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Yellow Squash') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '[]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Yellow Squash';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Yellow Squash', 'Vegetable', 1, 'cup sliced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '[]'::jsonb, '') ;
  end if;
end $$;

do $$
begin
  if exists (select 1 from "Ingredients" where "Name" = 'Zucchini') then
    update "Ingredients" set
      "FoodGroup" = 'Vegetable' ,
      "ServingSize" = 1 ,
      "ServingUnit" = 'cup sliced' ,
      "PurchaseUnit" = 'each' ,
      "DefaultLocation" = 'Fridge' ,
      "StoreSection" = 'Produce' ,
      "IsPerishable" = true ,
      "IsFlexibleGroup" = false ,
      "IsMyPlateCounted" = true ,
      "ShelfLifeDays" = 7 ,
      "TypicalPackageSize" = 1 ,
      "PackageSizeUnit" = 'each' ,
      "IsStaple" = false ,
      "Aliases" = '["Courgette"]'::jsonb ,
      "Notes" = ''
    where "Name" = 'Zucchini';
  else
    insert into "Ingredients" (
      "Name", "FoodGroup", "ServingSize", "ServingUnit", "PurchaseUnit",
      "DefaultLocation", "StoreSection", "IsPerishable", "IsFlexibleGroup",
      "IsMyPlateCounted", "ShelfLifeDays", "TypicalPackageSize", "PackageSizeUnit",
      "IsStaple", "Aliases", "Notes"
    ) values (
      'Zucchini', 'Vegetable', 1, 'cup sliced', 'each',
      'Fridge', 'Produce', true, false,
      true, 7, 1, 'each',
      false, '["Courgette"]'::jsonb, '') ;
  end if;
end $$;

commit;