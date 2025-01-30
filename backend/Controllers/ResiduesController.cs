using API;
using API.Entity;
using Appwrite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ResiduesController : ControllerBase
{
    private readonly ApplicationContext _context;

    public ResiduesController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Residue>>> GetResidues([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {

        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            var products = await _context.Products
                              .Where(item => item.User_id == user.Id)
                              .ToListAsync();

            var productIds = products.Select(item => item.Id).ToList();

            var stocks = await _context.Stoks.Where(stock => productIds.Contains(stock.Offer.Id))
                                .ToListAsync();

            var query = _context.Analytics.Where(a => productIds.Contains(a.Offer.Id));

            if (startDate.HasValue)
            {
                query = query.Where(a => a.Date >= startDate);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.Date <= endDate);
            }

            var analytics = await query.ToListAsync();

            if (stocks.Count == 0 && analytics.Count == 0 && products.Count != 0)
            {
                Random random = new Random();
                stocks = new List<Stock>();

                foreach (var product in products)
                {
                    var stock = new[]{new Stock
                        {
                            Id = Guid.NewGuid(),
                            Present = random.Next(1, 101),
                            Reserved = random.Next(1, 5),
                            Type = "fbo",
                            Sku = 1,
                            Offer = product
                        },
                        new Stock
                        {
                            Id = Guid.NewGuid(),
                            Present = random.Next(1, 3),
                            Reserved = random.Next(1, 5),
                            Type = "fbs",
                            Sku = 1,
                            Offer = product
                        },
                    };

                    stocks.AddRange(stock);
                }
                analytics = new List<Analytic>();

                var endDateTime = DateTime.UtcNow;
                var startDateTime = endDateTime.AddMonths(-3).AddHours(0);

                for (var date = startDateTime; date <= endDateTime; date = date.AddDays(1))
                {
                    var index = 0;
                    foreach (var product in products)
                    {
                        var ordered = random.Next(1, (index % 3 + 1) * (date.Month % 4 + 1)) + random.Next(0, 5);
                        var ordered_units = new[] { new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = date.Date,
                               Value = ordered,
                               Type = "ordered_units",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = date.Date,
                               Value = ordered * (int)product.Price,
                               Type = "revenue",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = date.Date,
                               Value = random.Next(0, 2),
                               Type = "returns",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = date.Date,
                               Value = random.Next(1, 15),
                               Type = "delivered_units",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = date.Date,
                               Value = random.Next(1, 1500),
                               Type = "position_category",
                               Offer = product,
                           }
                        };
                        index++;
                        analytics.AddRange(ordered_units);
                    }
                }
                _context.Stoks.AddRange(stocks);
                _context.Analytics.AddRange(analytics);
                await _context.SaveChangesAsync();

                var logs = new[] {new API.Entity.Log
                    {
                        Id = Guid.NewGuid(),
                        Due_date = DateTime.UtcNow.Date,
                        Start_date = DateTime.UtcNow.AddMonths(-3).Date.AddHours(0),
                        End_date = DateTime.UtcNow.Date.AddHours(0),
                        Type = "analytics/data",
                        Status = "success",
                        Comment = "",
                        User_id = user.Id,
                    }, new API.Entity.Log
                    {
                        Id = Guid.NewGuid(),
                        Due_date = DateTime.UtcNow.Date,
                        Type = "product/info/stocks",
                        Status = "success",
                        Comment = "",
                        User_id = user.Id,
                    }};

                _context.UploadLogs.AddRange(logs);
                await _context.SaveChangesAsync();
            }
            try
            {
                var residues = products.Select(product =>
                {
                    // Пытаемся найти остатки по типу FBO, если не найдено – значение по умолчанию 0
                    var fboStock = stocks.FirstOrDefault(stock => stock.Offer != null
                                                               && stock.Offer.Id == product.Id
                                                               && stock.Type != null
                                                               && stock.Type.Equals("FBO", StringComparison.OrdinalIgnoreCase));

                    // Пытаемся найти остатки по типу FBS, если не найдено – значение по умолчанию 0
                    var fbsStock = stocks.FirstOrDefault(stock => stock.Offer != null
                                                               && stock.Offer.Id == product.Id
                                                               && stock.Type != null
                                                               && stock.Type.Equals("FBS", StringComparison.OrdinalIgnoreCase));

                    var orderedUnits = analytics != null
                        ? analytics.Where(a => a.Offer != null && a.Offer.Id == product.Id && a.Type == "ordered_units")
                                   .Sum(a => a.Value)
                        : 0;

                    var totalReturns = analytics != null
                        ? analytics.Where(a => a.Offer != null && a.Offer.Id == product.Id && a.Type == "returns")
                                   .Sum(a => a.Value)
                        : 0;

                    var totalRevenue = analytics != null
                        ? analytics.Where(a => a.Offer != null && a.Offer.Id == product.Id && a.Type == "revenue")
                                   .Sum(a => a.Value)
                        : 0;

                    var totalDeliveredUnits = analytics != null
                        ? analytics.Where(a => a.Offer != null && a.Offer.Id == product.Id && a.Type == "delivered_units")
                                   .Sum(a => a.Value)
                        : 0;
                    var totalPositionCategory = analytics != null
                        ? analytics.Where(a => a.Offer != null && a.Offer.Id == product.Id && a.Type == "position_category")
                                   .Sum(a => a.Value)
                        : 0;

                    return new Residue
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Offer_id = product.Offer_id,
                        Type_id = product.Type_id,
                        Created_at = product.Created_at,
                        Old_price = product.Old_price,
                        Min_price = product.Min_price,
                        Price = product.Price,
                        Marketing_price = product.Marketing_price,
                        Currency_code = product.Currency_code,
                        Sale_schema = product.Sale_schema,
                        Delivery_amount = product.Delivery_amount,
                        Return_amount = product.Return_amount,
                        Vat = product.Vat,
                        Percent = product.Percent,
                        Value = product.Value,
                        Volume_weight = product.Volume_weight,
                        Is_discounted = product.Is_discounted,
                        Is_kgt = product.Is_kgt,
                        User_id = product.User_id,
                        Fbo = fboStock?.Present ?? 0,
                        Fbs = fbsStock?.Present ?? 0,
                        Ordered = orderedUnits,
                        Returns = totalReturns,
                        Revenue = totalRevenue,
                        DeliveredUnits = totalDeliveredUnits,
                        PositionCategory = totalPositionCategory
                    };
                }).ToList();


                return Ok(residues);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Произошла ошибка при обработке остатков товаров.", ex);
            }
        }
        else
        {
            return Unauthorized("User not found in context.");
        }
    }

}
