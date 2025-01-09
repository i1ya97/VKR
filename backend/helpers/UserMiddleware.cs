using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace API.helpers
{
    public class UserMiddleware
    {
        private readonly RequestDelegate _next;

        public UserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized: No token provided.");
                return;
            }

            try
            {
                Client client = new Client().SetEndpoint("http://51.250.32.125:17600/v1")
                .SetProject("6777b84800366212389d").SetJWT(token);

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