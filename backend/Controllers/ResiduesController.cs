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
    public async Task<ActionResult<IEnumerable<Residue>>> GetResidues(DateTime startDate, DateTime endDate)
    {

        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            var products = await _context.Products
                              .Where(item => item.User_id == user.Id)
                              .ToListAsync();

            var stocks = await _context.Stoks.Where(stock => stock.Type == "FBO" || stock.Type == "FBS")
                                .ToListAsync();

            var analytics = await _context.Analytics
                                .Where(a => a.Date >= startDate && a.Date <= endDate)
                                .ToListAsync();

            try
            {
                var residues = products.Select(product =>
                {
                    // Пытаемся найти остатки по типу FBO, если не найдено – значение по умолчанию 0
                    var fboStock = stocks.FirstOrDefault(stock => stock.Sku != null
                                                               && stock.Sku.Id == product.Id
                                                               && stock.Type != null
                                                               && stock.Type.Equals("FBO", StringComparison.OrdinalIgnoreCase));

                    // Пытаемся найти остатки по типу FBS, если не найдено – значение по умолчанию 0
                    var fbsStock = stocks.FirstOrDefault(stock => stock.Sku != null
                                                               && stock.Sku.Id == product.Id
                                                               && stock.Type != null
                                                               && stock.Type.Equals("FBS", StringComparison.OrdinalIgnoreCase));

                    var orderedUnits = analytics != null
                        ? analytics.Where(a => a.Sku != null && a.Sku.Id == product.Id)
                                   .Sum(a => a.Ordered_units)
                        : 0;

                    var totalReturns = analytics != null
                        ? analytics.Where(a => a.Sku != null && a.Sku.Id == product.Id)
                                   .Sum(a => a.Returns)
                        : 0;

                    return new Residue
                    {
                        Offer_id = product.Offer_id,
                        Name = product.Name,
                        Fbo = fboStock?.Present ?? 0,
                        Fbs = fbsStock?.Present ?? 0,
                        Ordered = orderedUnits,
                        Returns = totalReturns
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
