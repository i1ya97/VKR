using API;
using Appwrite.Models;
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
    public async Task<ActionResult<IEnumerable<API.Entity.Log>>> GetLogs()
    {
        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            if (_context.UploadLogs == null)
            {
                return NotFound();
            }

            var logs = await _context.UploadLogs
                                         .Where(item => item.User_id == user.Id)
                                         .ToListAsync();
            return Ok(logs);
        }
        else
        {
            return Unauthorized("User not found in context.");
        }
    }

}
