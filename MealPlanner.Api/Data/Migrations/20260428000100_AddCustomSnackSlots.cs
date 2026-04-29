using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealPlanner.Api.Data.Migrations
{
    public partial class AddCustomSnackSlots : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE ""WeekMealSlots"" ADD COLUMN IF NOT EXISTS ""CustomSnackName"" text;");
            migrationBuilder.Sql(@"ALTER TABLE ""WeekMealSlots"" ADD COLUMN IF NOT EXISTS ""CustomSnackDescription"" text;");
            migrationBuilder.Sql(@"ALTER TABLE ""WeekMealSlots"" ADD COLUMN IF NOT EXISTS ""CustomSnackItems"" jsonb NOT NULL DEFAULT '[]';");
            migrationBuilder.Sql(@"ALTER TABLE ""WeekMealSlots"" ADD COLUMN IF NOT EXISTS ""CustomFoodGroupServings"" jsonb NOT NULL DEFAULT '{}';");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "CustomSnackName", table: "WeekMealSlots");
            migrationBuilder.DropColumn(name: "CustomSnackDescription", table: "WeekMealSlots");
            migrationBuilder.DropColumn(name: "CustomSnackItems", table: "WeekMealSlots");
            migrationBuilder.DropColumn(name: "CustomFoodGroupServings", table: "WeekMealSlots");
        }
    }
}
