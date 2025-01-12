using API;
using API.Entity;
using Appwrite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationContext _context;

    public ProductsController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var products = await _context.Products
                              .Where(item => item.User_id == user.Id)
                              .ToListAsync();
            return Ok(products);
        } else
        {
            return Unauthorized("User not found in context.");
        }
    }

    [HttpPost]
    [Route("add-products")]
    public async Task<ActionResult<String>> PostProducts()
    {
        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var products = new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Смартфон POCO C61 64 ГБ зеленый",
                    Offer_id = 210167440,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 9000,
                    Min_price = 8200,
                    Price = 8500,
                    Marketing_price = 8300,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 270,
                    Return_amount = 150,
                    Vat = 20,
                    Percent = 5,
                    Value = 410,
                    Volume_weight = 380,
                    Is_discounted = false,
                    Is_kgt = false,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 2,
                    Name = "Ноутбук ASUS VivoBook 15",
                    Offer_id = 210167441,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 45000,
                    Min_price = 43000,
                    Price = 44000,
                    Marketing_price = 43500,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 500,
                    Return_amount = 300,
                    Vat = 20,
                    Percent = 10,
                    Value = 900,
                    Volume_weight = 2500,
                    Is_discounted = true,
                    Is_kgt = false,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 3,
                    Name = "Наушники Sony WH-1000XM4",
                    Offer_id = 205800162,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 25000,
                    Min_price = 24000,
                    Price = 24500,
                    Marketing_price = 24200,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 200,
                    Return_amount = 100,
                    Vat = 20,
                    Percent = 5,
                    Value = 500,
                    Volume_weight = 300,
                    Is_discounted = false,
                    Is_kgt = true,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 4,
                    Name = "Планшет Samsung Galaxy Tab S7",
                    Offer_id = 209932822,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 35000,
                    Min_price = 33000,
                    Price = 34000,
                    Marketing_price = 33500,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 400,
                    Return_amount = 200,
                    Vat = 20,
                    Percent = 5,
                    Value = 700,
                    Volume_weight = 600,
                    Is_discounted = true,
                    Is_kgt = false,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 5,
                    Name = "Фитнес-трекер Xiaomi Mi Band 6",
                    Offer_id = 210222824,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 4000,
                    Min_price = 3500,
                    Price = 3700,
                    Marketing_price = 3600,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 150,
                    Return_amount = 80,
                    Vat = 20,
                    Percent = 5,
                    Value = 100,
                    Volume_weight = 50,
                    Is_discounted = false,
                    Is_kgt = false,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 6,
                    Name = "Кофемашина Philips 3200 Series",
                    Offer_id = 210222821,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 30000,
                    Min_price = 29000,
                    Price = 29500,
                    Marketing_price = 29200,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 600,
                    Return_amount = 250,
                    Vat = 20,
                    Percent = 5,
                    Value = 800,
                    Volume_weight = 1500,
                    Is_discounted = true,
                    Is_kgt = false,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 7,
                    Name = "Телевизор LG 55UN73006LA",
                    Offer_id = 210889494,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 60000,
                    Min_price = 58000,
                    Price = 59000,
                    Marketing_price = 58500,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 800,
                    Return_amount = 400,
                    Vat = 20,
                    Percent = 5,
                    Value = 1200,
                    Volume_weight = 10000,
                    Is_discounted = false,
                    Is_kgt = true,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 8,
                    Name = "Смарт-часы Apple Watch Series 6",
                    Offer_id = 205800161,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 30000,
                    Min_price = 29000,
                    Price = 29500,
                    Marketing_price = 29200,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 250,
                    Return_amount = 150,
                    Vat = 20,
                    Percent = 5,
                    Value = 600,
                    Volume_weight = 300,
                    Is_discounted = true,
                    Is_kgt = false,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 9,
                    Name = "Игровая консоль Sony PlayStation 5",
                    Offer_id = 205876161,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 50000,
                    Min_price = 48000,
                    Price = 49000,
                    Marketing_price = 48500,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 700,
                    Return_amount = 300,
                    Vat = 20,
                    Percent = 5,
                    Value = 1000,
                    Volume_weight = 4000,
                    Is_discounted = false,
                    Is_kgt = true,
                    User_id = user.Id
                },
                new Product
                {
                    Id = 10,
                    Name = "Электросамокат Xiaomi Mi Electric Scooter 1S",
                    Offer_id = 205800346,
                    Type_id = 0,
                    Created_at = DateTime.Parse("2024-10-25T00:00:00Z").ToUniversalTime(),
                    Old_price = 25000,
                    Min_price = 24000,
                    Price = 24500,
                    Marketing_price = 24200,
                    Currency_code = "руб",
                    Sale_schema = "FBO",
                    Delivery_amount = 300,
                    Return_amount = 150,
                    Vat = 20,
                    Percent = 5,
                    Value = 500,
                    Volume_weight = 1200,
                    Is_discounted = false,
                    Is_kgt = false,
                    User_id = user.Id
                },
            };

            await _context.SaveChangesAsync();

            return Ok("Done");
        }
        else
        {
            return Unauthorized("User not found in context.");
        }
    }



}
