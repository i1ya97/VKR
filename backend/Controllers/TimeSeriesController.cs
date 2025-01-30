using API.Entity;
using Appwrite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Transforms.TimeSeries;
using System.Linq;

namespace API.Controllers;

    
[ApiController]
[Route("[controller]")]
public class TimeSeriesController : ControllerBase
{
    private readonly ApplicationContext _context;

    public TimeSeriesController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Dictionary<long, Dictionary<string, List<Dictionary<string, TimeSeries>>>>>> GetTimeSeries(
        [FromBody] TimeSeriesRequest request
        )
    {
        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            var productIds = request.ProductIds;
            var curves = request.Curves;
            var startDate = request.StartDate;
            var endDate = request.EndDate;

            var products = await _context.Products
                              .Where(item => item.User_id == user.Id && productIds.Contains(item.Id))
                              .ToListAsync();

            var useProductIds = products.Select(item => item.Id).ToList();

            var query = _context.Analytics.Where(a => useProductIds.Contains(a.Offer.Id) && curves.Contains(a.Type));

            if (startDate.HasValue)
            {
                query = query.Where(a => a.Date >= startDate);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.Date <= endDate);
            }

            var analytics = await query.ToListAsync();

            var timeSeries = analytics
                .GroupBy(a => a.Offer.Id)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .GroupBy(a => a.Type)
                        .ToDictionary(
                            curveGroup => curveGroup.Key,
                            curveGroup => curveGroup
                                .Select(a => new TimeSeries
                                {
                                    Key = a.Date,
                                    Value = a.Value
                                })
                                .OrderBy(entry => entry.Key)
                                .ToList()
                        )
                );

            return Ok(timeSeries);
        }
        else
        {
            return Unauthorized("User not found in context.");
        }
    }

    [HttpPost]
    [Route("getPredictions")]
    public async Task<ActionResult<Dictionary<long, Dictionary<string, List<Dictionary<string, TimeSeries>>>>>> getPredictionTimeSeries(
        [FromBody] TimeSeriesRequest request
        )
    {
        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
        {
            var productIds = request.ProductIds;
            var curves = request.Curves;
            var startDate = request.StartDate;
            var endDate = request.EndDate;

            var products = await _context.Products
                              .Where(item => item.User_id == user.Id && productIds.Contains(item.Id))
                              .ToListAsync();

            var useProductIds = products.Select(item => item.Id).ToList();

            var analytics = await _context.Analytics
                    .Where(a => useProductIds.Contains(a.Offer.Id) && curves.Contains(a.Type))
                    .ToListAsync();

            var mlContext = new MLContext();

            var timeSeries = analytics
                .GroupBy(a => a.Offer.Id)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .GroupBy(a => a.Type)
                        .ToDictionary(
                            curveGroup => curveGroup.Key,
                            curveGroup =>
                            {
                                var historicalData = curveGroup
                                    .OrderBy(a => a.Date)
                                    .Select(a => a.Value)
                                    .ToArray();

                                var forecastLength = historicalData.Length;

                                var dataView = mlContext.Data.LoadFromEnumerable(historicalData.Select((v, i) => new TimeSeriesData { Value = v }));

                                var forecastingPipeline = mlContext.Forecasting.ForecastBySsa(
                                    outputColumnName: "ForecastedValues",
                                    inputColumnName: "Value",
                                    windowSize: historicalData.Length / 2 - 10,
                                    seriesLength: historicalData.Length,
                                    trainSize: historicalData.Length,
                                    horizon: forecastLength);

                                var model = forecastingPipeline.Fit(dataView);

                                var forecastEngine = model.CreateTimeSeriesEngine<TimeSeriesData, TimeSeriesPrediction>(mlContext);

                                var forecast = forecastEngine.Predict();

                                var values = forecast.ForecastedValues.Select((v, i) => new TimeSeries
                                {
                                    Key = DateTime.UtcNow.AddDays(i + 1).Date,
                                    Value = (int)v
                                });

                                if (startDate.HasValue)
                                {
                                    values = values.Where(a => a.Key >= startDate);
                                }

                                if (endDate.HasValue)
                                {
                                    values = values.Where(a => a.Key <= endDate);
                                }

                                return values;
                            }
                        )
                );

            return Ok(timeSeries);
        }
        else
        {
            return Unauthorized("User not found in context.");
        }
    }
    }

public class TimeSeriesRequest
{
    public required long[] ProductIds { get; set; }
    public required List<string> Curves { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
public class TimeSeriesData
{
    public float Value { get; set; }
}

public class TimeSeriesPrediction
{
    public float[] ForecastedValues { get; set; }
}