using Microsoft.EntityFrameworkCore;

namespace API;

public class ApplicationContext: DbContext
{
    public DbSet<WeatherForecast> WeatherForecasts { get; set; } = null!;
    public ApplicationContext(DbContextOptions<ApplicationContext> options)
    : base(options)
    {
        //Database.EnsureCreated();   // создаем базу данных при первом обращении
    }
    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    modelBuilder.Entity<WeatherForecast>().HasNoKey();
    //}
}
