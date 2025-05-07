using maritime.api.Models;
using Microsoft.EntityFrameworkCore;

namespace maritime.api.Data;

public class MaritimeDBContext(DbContextOptions<MaritimeDBContext> options) : DbContext(options)
{
    public DbSet<Country> Countries { get; set; }
    public DbSet<Ship> Ships { get; set; }
    public DbSet<Port> Ports { get; set; }
    public DbSet<Voyage> Voyages { get; set; }
}