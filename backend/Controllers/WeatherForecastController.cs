using API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ApplicationContext _context;

    public WeatherForecastController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WeatherForecast>>> GetWeatherForecasts()
    {
        if (_context.WeatherForecasts == null)
        {
            return NotFound();
        }
        return await _context.WeatherForecasts.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> PostStudent(WeatherForecast student)
    {
        if (_context.WeatherForecasts == null)
        {
            return Problem("Entity set 'StudentDBContext.Students'  is null.");
        }
        _context.WeatherForecasts.Add(student);
        await _context.SaveChangesAsync();

        return student.Id;
    }

}
