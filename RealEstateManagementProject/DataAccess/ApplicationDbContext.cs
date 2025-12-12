
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RealEstateManagementProject.Entities.Concrete;
using RealEstateManagementProject.Entities;
namespace RealEstateManagementProject.DataAccess
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext>options):base(options) 
        { 
            
        }
        public DbSet<Il> Iller { get; set; }
        public DbSet<Ilce> Ilceler { get; set; }
        public DbSet<Mahalle> Mahalleler { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Tasinmaz> Tasinmazlar { get; set; }
        public DbSet<Log> Loglar { get; set; }

    }

}
