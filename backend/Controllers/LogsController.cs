using API;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class LogsController : ControllerBase
{
    private readonly ApplicationContext _context;

    public LogsController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Log>>> GetLogs()
    {

        if (_context.UploadLogs == null)
        {
            return NotFound();
        }
        return await _context.UploadLogs.ToListAsync();
    }

}
