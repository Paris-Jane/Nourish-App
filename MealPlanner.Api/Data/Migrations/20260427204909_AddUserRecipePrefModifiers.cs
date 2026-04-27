using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MealPlanner.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRecipePrefModifiers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WeekMealSlots_WeekId_DayOfWeek_MealType",
                table: "WeekMealSlots");

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "WeekMealSlots",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SelectedModifierIngredientIds",
                table: "WeekMealSlots",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "HeightInches",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "WeightPounds",
                table: "Users",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "SelectedModifierIngredientIds",
                table: "UserRecipePrefs",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkedIngredientIds",
                table: "RecipeSteps",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrepCategory",
                table: "RecipeSteps",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "ScaleByLinkedIngredients",
                table: "RecipeSteps",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "UserIngredientPrefs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    IngredientId = table.Column<int>(type: "integer", nullable: false),
                    IsFavorite = table.Column<bool>(type: "boolean", nullable: false),
                    LastUsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserIngredientPrefs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserIngredientPrefs_Ingredients_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "Ingredients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserIngredientPrefs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserWeekPrefs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    WeekId = table.Column<int>(type: "integer", nullable: false),
                    IsFavorite = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWeekPrefs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserWeekPrefs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserWeekPrefs_Weeks_WeekId",
                        column: x => x.WeekId,
                        principalTable: "Weeks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeekMealSlots_WeekId_DayOfWeek_MealType_Position",
                table: "WeekMealSlots",
                columns: new[] { "WeekId", "DayOfWeek", "MealType", "Position" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserIngredientPrefs_IngredientId",
                table: "UserIngredientPrefs",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_UserIngredientPrefs_UserId_IngredientId",
                table: "UserIngredientPrefs",
                columns: new[] { "UserId", "IngredientId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserWeekPrefs_UserId_WeekId",
                table: "UserWeekPrefs",
                columns: new[] { "UserId", "WeekId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserWeekPrefs_WeekId",
                table: "UserWeekPrefs",
                column: "WeekId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserIngredientPrefs");

            migrationBuilder.DropTable(
                name: "UserWeekPrefs");

            migrationBuilder.DropIndex(
                name: "IX_WeekMealSlots_WeekId_DayOfWeek_MealType_Position",
                table: "WeekMealSlots");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "WeekMealSlots");

            migrationBuilder.DropColumn(
                name: "SelectedModifierIngredientIds",
                table: "WeekMealSlots");

            migrationBuilder.DropColumn(
                name: "HeightInches",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "WeightPounds",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SelectedModifierIngredientIds",
                table: "UserRecipePrefs");

            migrationBuilder.DropColumn(
                name: "LinkedIngredientIds",
                table: "RecipeSteps");

            migrationBuilder.DropColumn(
                name: "PrepCategory",
                table: "RecipeSteps");

            migrationBuilder.DropColumn(
                name: "ScaleByLinkedIngredients",
                table: "RecipeSteps");

            migrationBuilder.CreateIndex(
                name: "IX_WeekMealSlots_WeekId_DayOfWeek_MealType",
                table: "WeekMealSlots",
                columns: new[] { "WeekId", "DayOfWeek", "MealType" },
                unique: true);
        }
    }
}
