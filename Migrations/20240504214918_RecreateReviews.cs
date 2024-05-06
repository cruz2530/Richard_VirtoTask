using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RichardAde.Migrations
{
    /// <inheritdoc />
    public partial class RecreateReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductReview");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "reviews",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_ProductId",
                table: "reviews",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_reviews_products_ProductId",
                table: "reviews",
                column: "ProductId",
                principalTable: "products",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reviews_products_ProductId",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "IX_reviews_ProductId",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "reviews");

            migrationBuilder.CreateTable(
                name: "ProductReview",
                columns: table => new
                {
                    ProductsId = table.Column<int>(type: "int", nullable: false),
                    ReviewsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductReview", x => new { x.ProductsId, x.ReviewsId });
                    table.ForeignKey(
                        name: "FK_ProductReview_products_ProductsId",
                        column: x => x.ProductsId,
                        principalTable: "products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductReview_reviews_ReviewsId",
                        column: x => x.ReviewsId,
                        principalTable: "reviews",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductReview_ReviewsId",
                table: "ProductReview",
                column: "ReviewsId");
        }
    }
}
