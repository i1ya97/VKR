using API.Entity;
using Appwrite.Services;
using Appwrite;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Quartz;
using Appwrite.Models;
using Microsoft.EntityFrameworkCore;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.helpers
{
    public class OzonApiJob: IJob
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationContext _context;

        public OzonApiJob(ApplicationContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            string appwriteUrl = _configuration.GetSection("Appwrite").GetValue<string>("URL") ?? "";
            string projectId = _configuration.GetSection("Appwrite").GetValue<string>("Project") ?? "";
            string appwriteApiKey = _configuration.GetSection("Appwrite").GetValue<string>("API_key") ?? "";
            string credentialsCollectionId = _configuration.GetSection("Appwrite").GetValue<string>("API_credentions") ?? "";

            var documents = await GetOzonCredentialsAsync(appwriteUrl, projectId, appwriteApiKey, credentialsCollectionId);

            Random random = new Random();

            foreach (var document in documents)
            {
                string userId = document?.Data.FirstOrDefault(x => x.Key == "userId").Value?.ToString() ?? "";
                string ozonToken = document?.Data.FirstOrDefault(x => x.Key == "token").Value?.ToString() ?? "";

                if(ozonToken == "test")
                {
                    var products = await _context.Products
                                      .Where(item => item.User_id == userId)
                                      .ToListAsync();

                    var productIds = products.Select(item => item.Id).ToList();

                    var stocks = await _context.Stoks.Where(stock => productIds.Contains(stock.Offer.Id))
                    .ToListAsync();

                    foreach (var stock in stocks)
                    {
                        if(stock.Type == "fbo")
                        {
                            stock.Present = random.Next(1, 101);
                        } else
                        {
                            stock.Present = random.Next(1, 3);
                            stock.Present = random.Next(1, 3);
                        }
                        stock.Reserved = random.Next(1, 5);
                    }
                    var analytics = new List<Analytic>();

                    var dateTime = DateTime.UtcNow.AddHours(0);
                    var index = 0;
                    foreach (var product in products)
                    {
                        var ordered = random.Next(1, (index % 3 + 1) * (dateTime.Month % 4 + 1)) + random.Next(0, 5);
                        var ordered_units = new[] { new Analytic
                        {
                               Id = Guid.NewGuid(),
                               Date = dateTime.Date,
                               Value = ordered,
                               Type = "ordered_units",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = dateTime.Date,
                               Value = ordered * (int)product.Price,
                               Type = "revenue",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = dateTime.Date,
                               Value = random.Next(0, 2),
                               Type = "returns",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = dateTime.Date,
                               Value = random.Next(1, 15),
                               Type = "delivered_units",
                               Offer = product,
                           }, new Analytic
                           {
                               Id = Guid.NewGuid(),
                               Date = dateTime.Date,
                               Value = random.Next(1, 1500),
                               Type = "position_category",
                               Offer = product,
                           }
                        };
                        index++;
                        analytics.AddRange(ordered_units);
                    }
                    _context.Analytics.AddRange(analytics);
                    await _context.SaveChangesAsync();
                }

                var newData = new Entity.Log
                {
                    Id = Guid.NewGuid(),
                    Due_date = DateTime.UtcNow.Date,
                    Start_date = DateTime.UtcNow.AddDays(-1).Date,
                    End_date = DateTime.UtcNow.Date,
                    Type = "analytics/data",
                    Status = "success",
                    Comment = "",
                    User_id = userId
                };

                await _context.UploadLogs.AddAsync(newData);
                await _context.SaveChangesAsync();

            }
        }

        private async Task<List<Document>> GetOzonCredentialsAsync(string appwriteUrl, string projectId, string apiKey, string credentialsCollectionId)
        {
            Client appwriteClient = new Client()
                .SetEndpoint(appwriteUrl)
                .SetProject(projectId)
                .SetKey(apiKey);

            var databases = new Databases(appwriteClient);

            // Формируем запрос: здесь используется статический userId и target (в дальнейшем можно сделать динамическим)
            var queries = new List<string>
            {
                Query.Equal("target", "OZON").ToString()
            };

            var result = await databases.ListDocuments("678101a60016c2a93d57", credentialsCollectionId, queries);

            return result.Documents;
        }
    }
}
