using Appwrite;
using Appwrite.Models;
using Appwrite.Services;

namespace API.helpers
{
    public class UserMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public UserMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var URL = _configuration.GetSection("Appwrite").GetValue<string>("URL") ?? "";
            var Project = _configuration.GetSection("Appwrite").GetValue<string>("Project") ?? "";
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized: No token provided.");
                return;
            }

            try
            {
                Client client = new Client().SetEndpoint(URL)
                .SetProject(Project).SetJWT(token);

                User user = new Account(client).Get().Result;

                context.Items["User"] = user;
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync($"Unauthorized: {ex.Message}");
                return;
            }

            await _next(context);
        }
    }
}