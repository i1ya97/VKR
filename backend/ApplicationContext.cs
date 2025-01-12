using API.Entity;
using Microsoft.EntityFrameworkCore;

namespace API;

public class ApplicationContext: DbContext
{

    public DbSet<Product> Products { get; set; } = null!;

    public DbSet<Log> UploadLogs { get; set; } = null!;

    public DbSet<Stock> Stoks { get; set; } = null!;

    public DbSet<Analytic> Analytics { get; set; } = null!;

    public ApplicationContext(DbContextOptions<ApplicationContext> options)
    : base(options) { }
}
