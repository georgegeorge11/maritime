﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using maritime.api.Data;

#nullable disable

namespace maritime.api.Migrations
{
    [DbContext(typeof(MaritimeDBContext))]
    partial class MaritimeDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("maritime.api.Models.Country", b =>
                {
                    b.Property<int>("CountryPK")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CountryPK"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("CountryPK");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("maritime.api.Models.Port", b =>
                {
                    b.Property<int>("PortPK")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PortPK"));

                    b.Property<int>("CountryPK")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.HasKey("PortPK");

                    b.HasIndex("CountryPK");

                    b.ToTable("Ports");
                });

            modelBuilder.Entity("maritime.api.Models.Ship", b =>
                {
                    b.Property<int>("ShipPK")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ShipPK"));

                    b.Property<decimal>("MaximumSpeed")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.HasKey("ShipPK");

                    b.ToTable("Ships");
                });

            modelBuilder.Entity("maritime.api.Models.Voyage", b =>
                {
                    b.Property<int>("VoyagePK")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VoyagePK"));

                    b.Property<int>("ArrivalPortPK")
                        .HasColumnType("int");

                    b.Property<int>("DeparturePortPK")
                        .HasColumnType("int");

                    b.Property<int>("ShipPK")
                        .HasColumnType("int");

                    b.Property<DateOnly>("VoyageDate")
                        .HasColumnType("date");

                    b.Property<DateTime>("VoyageEndDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("VoyageStartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("VoyagePK");

                    b.HasIndex("ArrivalPortPK");

                    b.HasIndex("DeparturePortPK");

                    b.HasIndex("ShipPK");

                    b.ToTable("Voyages");
                });

            modelBuilder.Entity("maritime.api.Models.Port", b =>
                {
                    b.HasOne("maritime.api.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryPK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Country");
                });

            modelBuilder.Entity("maritime.api.Models.Voyage", b =>
                {
                    b.HasOne("maritime.api.Models.Port", "ArrivalPort")
                        .WithMany()
                        .HasForeignKey("ArrivalPortPK")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("maritime.api.Models.Port", "DeparturePort")
                        .WithMany()
                        .HasForeignKey("DeparturePortPK")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("maritime.api.Models.Ship", "Ship")
                        .WithMany()
                        .HasForeignKey("ShipPK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ArrivalPort");

                    b.Navigation("DeparturePort");

                    b.Navigation("Ship");
                });
#pragma warning restore 612, 618
        }
    }
}
