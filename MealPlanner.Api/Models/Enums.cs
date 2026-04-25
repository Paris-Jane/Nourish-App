namespace MealPlanner.Api.Models;

public enum ActivityLevel { Sedentary, Light, Moderate, Active }
public enum UserRole { Owner, Member }
public enum PrepStyle { DayOf, OnePrepDay, TwoPrepDays }
public enum CookTime { Under20, Under45, NoLimit }
public enum FoodGroup { Grains, Protein, Vegetable, Fruit, Dairy, Legume, Other }
public enum DefaultLocation { Fridge, Pantry, Freezer }
public enum StoreSection { Produce, Protein, Dairy, Grains, Pantry, Frozen, Bakery, Other }
public enum ScalabilityTag { Flexible, Rigid, Portioned }
public enum TimeTag { Quick, Medium, Involved }
public enum RecipePrepStyleTag { BatchFriendly, CookFresh, FreezerFriendly }
public enum WeekDay { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday }
public enum MealType { Breakfast, Lunch, Dinner, Snack }
public enum WeekStatus { Draft, Active, Completed }
public enum GroceryListStatus { Active, Completed }
public enum FridgeLocation { Fridge, Pantry, Freezer }
public enum AddedVia { GroceryList, ReceiptScan, Manual, Leftover }
public enum SheetType { BatchPrepDay, NightOf }
public enum TimingTag { PrepAhead, DayOfActive, DayOfPassive }
public enum PrepStepCategory { WashChop, MixSauce, CookStarch, CookProtein, RoastBake, AssemblePortion, FreshFinish }
