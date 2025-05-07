using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace maritime.api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    CountryPK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.CountryPK);
                });

            migrationBuilder.CreateTable(
                name: "Ships",
                columns: table => new
                {
                    ShipPK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    MaximumSpeed = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ships", x => x.ShipPK);
                });

            migrationBuilder.CreateTable(
                name: "Ports",
                columns: table => new
                {
                    PortPK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    CountryPK = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ports", x => x.PortPK);
                    table.ForeignKey(
                        name: "FK_Ports_Countries_CountryPK",
                        column: x => x.CountryPK,
                        principalTable: "Countries",
                        principalColumn: "CountryPK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Voyages",
                columns: table => new
                {
                    VoyagePK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VoyageDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ArrivalPortPK = table.Column<int>(type: "int", nullable: false),
                    DeparturePortPK = table.Column<int>(type: "int", nullable: false),
                    VoyageStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VoyageEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ShipPK = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voyages", x => x.VoyagePK);
                    table.ForeignKey(
                        name: "FK_Voyages_Ports_ArrivalPortPK",
                        column: x => x.ArrivalPortPK,
                        principalTable: "Ports",
                        principalColumn: "PortPK");
                    table.ForeignKey(
                        name: "FK_Voyages_Ports_DeparturePortPK",
                        column: x => x.DeparturePortPK,
                        principalTable: "Ports",
                        principalColumn: "PortPK");
                    table.ForeignKey(
                        name: "FK_Voyages_Ships_ShipPK",
                        column: x => x.ShipPK,
                        principalTable: "Ships",
                        principalColumn: "ShipPK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ports_CountryPK",
                table: "Ports",
                column: "CountryPK");

            migrationBuilder.CreateIndex(
                name: "IX_Voyages_ArrivalPortPK",
                table: "Voyages",
                column: "ArrivalPortPK");

            migrationBuilder.CreateIndex(
                name: "IX_Voyages_DeparturePortPK",
                table: "Voyages",
                column: "DeparturePortPK");

            migrationBuilder.CreateIndex(
                name: "IX_Voyages_ShipPK",
                table: "Voyages",
                column: "ShipPK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Voyages");

            migrationBuilder.DropTable(
                name: "Ports");

            migrationBuilder.DropTable(
                name: "Ships");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
