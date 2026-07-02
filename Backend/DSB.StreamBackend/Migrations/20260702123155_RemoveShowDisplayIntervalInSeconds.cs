using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DSB.StreamBackend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveShowDisplayIntervalInSeconds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowDisplayIntervalInSeconds",
                table: "CommentatorBoxTimeData");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ShowDisplayIntervalInSeconds",
                table: "CommentatorBoxTimeData",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
