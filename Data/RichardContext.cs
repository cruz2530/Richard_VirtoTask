using Microsoft.EntityFrameworkCore;
using RichardAde.Models;

namespace RichardAde.Data
{
    public class RichardContext : DbContext
    {
        public DbSet<Product> Products { get; set; } = null!;

        public RichardContext(DbContextOptions<RichardContext> options) : base(options)
        { }

       
    }
}
