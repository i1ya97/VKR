using API;
using API.Entity;
using API.helpers;
using API.OzonEntity;
using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationContext _context;
        private readonly IConfiguration _configuration;

        public ProductsController(ApplicationContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Возвращает список продуктов текущего пользователя
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
            {
                if (_context.Products == null)
                {
                    return NotFound("Products not found in the context.");
                }

                var products = await _context.Products
                                             .Where(item => item.User_id == user.Id)
                                             .ToListAsync();

                return Ok(products);
            }
            else
            {
                return Unauthorized("User not found in context.");
            }
        }

        /// <summary>
        /// Добавляет продукты, полученные с OZON, в базу данных
        /// </summary>
        [HttpPost]
        [Route("add-products")]
        public async Task<ActionResult> PostProducts()
        {
            if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
            {
                try
                {
                    // Извлекаем настройки для OZON и Appwrite из конфигурации
                    string ozonUrl = _configuration.GetSection("OZON").GetValue<string>("URL") ?? "";
                    string appwriteUrl = _configuration.GetSection("Appwrite").GetValue<string>("URL") ?? "";
                    string projectId = _configuration.GetSection("Appwrite").GetValue<string>("Project") ?? "";
                    string appwriteApiKey = _configuration.GetSection("Appwrite").GetValue<string>("API_key") ?? "";
                    string credentialsCollectionId = _configuration.GetSection("Appwrite").GetValue<string>("API_credentions") ?? "";

                    // Получаем креденшелы для OZON из Appwrite
                    var (clientOzon, ozonToken) = await GetOzonCredentialsAsync(appwriteUrl, projectId, appwriteApiKey, credentialsCollectionId, user.Id);
                    if (string.IsNullOrEmpty(clientOzon) || string.IsNullOrEmpty(ozonToken))
                    {
                        return BadRequest("Не удалось получить креденшелы для OZON.");
                    }

                    if(ozonToken == "test")
                    {
                        var productsInit = new List<Product>
                           {
                            new Product
                            {
                                Id = 1,
                                Name = "Смартфон POCO C61 64 ГБ зеленый",
                                Offer_id = "210167440",
                                Type_id = 1,
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
                                User_id = user.Id,
                            },
                            new Product
                            {
                                Id = 2,
                                Name = "Ноутбук ASUS VivoBook 15",
                                Offer_id = "210167441",
                                Type_id = 1,
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
                                Offer_id = "205800162",
                                Type_id = 1,
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
                                Offer_id = "209932822",
                                Type_id = 1,
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
                                Offer_id = "210222824",
                                Type_id = 2,
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
                                Offer_id = "210222821",
                                Type_id = 3,
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
                                Offer_id = "210889494",
                                Type_id = 1,
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
                                Offer_id = "205800161",
                                Type_id = 1,
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
                                Offer_id = "205876161",
                                Type_id = 1,
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
                                Offer_id = "205800346",
                                Type_id = 1,
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
                        _context.Products.AddRange(productsInit);
                        await _context.SaveChangesAsync();

                        var log = new API.Entity.Log
                        {
                            Id = Guid.NewGuid(),
                            Due_date = DateTime.UtcNow.Date,
                            Type = "product/list",
                            Status = "success",
                            Comment = "",
                            User_id = user.Id,
                        };

                        _context.UploadLogs.AddRange(log);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }

                    // Получаем список product_id с OZON
                    var productIds = await GetOzonProductIdsAsync(ozonUrl, clientOzon, ozonToken);
                    if (productIds == null || !productIds.Any())
                    {
                        return BadRequest("Не удалось получить список product_id с OZON.");
                    }

                    // Получаем подробную информацию о продуктах с OZON
                    var ozonProducts = await GetOzonProductDetailsAsync(ozonUrl, clientOzon, ozonToken, productIds);
                    if (ozonProducts == null || !ozonProducts.Any())
                    {
                        return BadRequest("Не удалось получить подробную информацию о продуктах с OZON.");
                    }

                    // Преобразуем полученные данные в локальные сущности Product
                    var products = ozonProducts.Select(i => new Product
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Offer_id = i.Offer_id,
                        Type_id = i.Type_id,
                        Created_at = i.Created_at,
                        Old_price = i.Old_price,
                        Min_price = i.Min_price,
                        Price = i.Price,
                        Marketing_price = i.Marketing_price,
                        Currency_code = i.Currency_code,
                        Sale_schema = i.Commissions?.FirstOrDefault()?.Sale_schema ?? "",
                        Delivery_amount = i.Delivery_amount,
                        Return_amount = i.Return_amount,
                        Vat = i.Vat,
                        Percent = i.Percent,
                        Value = i.Value,
                        Volume_weight = i.Volume_weight,
                        Is_discounted = i.Is_discounted,
                        Is_kgt = i.Is_kgt,
                        User_id = user.Id
                    }).ToList();

                    // Получаем информацию о запасах (stock) с OZON согласно новой структуре ответа.
                    var stockItems = await GetOzonStockInfoAsync(ozonUrl, clientOzon, ozonToken, productIds);
                    List<Stock> stocks = new List<Stock>();

                    if (stockItems != null && stockItems.Any())
                    {
                        foreach (var item in stockItems)
                        {
                            foreach (var stockValue in item.Stocks)
                            {
                                // Поиск продукта по значению sku (сравнение по Id, приведённому к строке).
                                var productForStock = products.FirstOrDefault(p => p.Offer_id == item.Offer_id);
                                if (productForStock != null)
                                {
                                    var stock = new Stock
                                    {
                                        Id = Guid.NewGuid(),
                                        Present = stockValue.Present,
                                        Reserved = stockValue.Reserved,
                                        Type = stockValue.Type,
                                        Sku = stockValue.Sku,
                                        Offer = productForStock,
                                    };
                                    stocks.Add(stock);
                                }
                            }
                        }
                    }

                    var skus = stocks.Select((v) => v.Sku).ToArray();

                    // Получаем аналитические данные с OZON.
                    var analyticsResponse = await GetAnalyticsDataAsync(ozonUrl, clientOzon, ozonToken, skus);

                    List<Analytic> analytics = new List<Analytic>();
                    if (analyticsResponse != null && analyticsResponse.Result.Data.Any())
                    {
                        foreach (var analyticData in analyticsResponse.Result.Data)
                        {
                            // Используем первый элемент dimensions для сопоставления продукта.
                            var id = analyticData.Dimensions?[0].Id;
                            var date = analyticData.Dimensions?[1].Id;
                            if (id != null && date != null)
                            {
                                // Ищем продукт по Offer_id (при необходимости можно изменить условие поиска).
                                var productForAnalytic = stocks.FirstOrDefault(s => s.Sku.ToString() == id);
                                if (productForAnalytic != null && analyticData.Metrics != null)
                                {
                                    var ordered_units = new[] { new Analytic
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = DateTimeOffset.Parse(date).UtcDateTime,
                                        Value = Utils.ConvertMetricToInt(analyticData.Metrics[0]),
                                        Type = "ordered_units",
                                        Offer = productForAnalytic.Offer,
                                    }, new Analytic
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = DateTimeOffset.Parse(date).UtcDateTime,
                                        Value = Utils.ConvertMetricToInt(analyticData.Metrics[1]),
                                        Type = "revenue",
                                        Offer = productForAnalytic.Offer,
                                    }, new Analytic
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = DateTimeOffset.Parse(date).UtcDateTime,
                                        Value = Utils.ConvertMetricToInt(analyticData.Metrics[2]),
                                        Type = "returns",
                                        Offer = productForAnalytic.Offer,
                                    }, new Analytic
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = DateTimeOffset.Parse(date).UtcDateTime,
                                        Value = Utils.ConvertMetricToInt(analyticData.Metrics[3]),
                                        Type = "delivered_units",
                                        Offer = productForAnalytic.Offer,
                                    }, new Analytic
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = DateTimeOffset.Parse(date).UtcDateTime,
                                        Value = Utils.ConvertMetricToInt(analyticData.Metrics[4]),
                                        Type = "position_category",
                                        Offer = productForAnalytic.Offer,
                                    }};
                                    analytics.AddRange(ordered_units);
                                }
                            }
                        }
                    }


                    _context.Products.AddRange(products);
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
                    }, new API.Entity.Log
                    {
                        Id = Guid.NewGuid(),
                        Due_date = DateTime.UtcNow.Date,
                        Type = "product/list",
                        Status = "success",
                        Comment = "",
                        User_id = user.Id,
                    }};

                    _context.UploadLogs.AddRange(logs);
                    await _context.SaveChangesAsync();

                    return Ok();
                }
                catch (Exception ex)
                {
                    // При необходимости добавить логирование ошибки
                    return StatusCode(500, $"Ошибка: {ex.Message}");
                }
            }

            return Unauthorized("Пользователь не найден.");
        }

        /// <summary>
        /// Получает креденшелы для OZON через Appwrite
        /// </summary>
        private async Task<(string clientOzon, string ozonToken)> GetOzonCredentialsAsync(string appwriteUrl, string projectId, string apiKey, string credentialsCollectionId, string userId)
        {
            Client appwriteClient = new Client()
                .SetEndpoint(appwriteUrl)
                .SetProject(projectId)
                .SetKey(apiKey);

            var databases = new Databases(appwriteClient);

            // Формируем запрос: здесь используется статический userId и target (в дальнейшем можно сделать динамическим)
            var queries = new List<string>
            {
                Query.Equal("userId", userId).ToString(),
                Query.Equal("target", "OZON").ToString()
            };

            var result = await databases.ListDocuments("678101a60016c2a93d57", credentialsCollectionId, queries);
            var document = result.Documents.FirstOrDefault();

            string clientOzon = document?.Data.FirstOrDefault(x => x.Key == "client").Value?.ToString() ?? "";
            string ozonToken = document?.Data.FirstOrDefault(x => x.Key == "token").Value?.ToString() ?? "";

            return (clientOzon, ozonToken);
        }

        /// <summary>
        /// Получает список идентификаторов продуктов с OZON
        /// </summary>
        private async Task<string[]?> GetOzonProductIdsAsync(string ozonUrl, string clientOzon, string ozonToken)
        {
            using var httpClient = new HttpClient
            {
                BaseAddress = new Uri(ozonUrl)
            };

            httpClient.DefaultRequestHeaders.Add("Client-Id", clientOzon);
            httpClient.DefaultRequestHeaders.Add("Api-Key", ozonToken);

            var requestData = new
            {
                filter = new { },
                last_id = "",
                limit = 10
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("v3/product/list", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Ошибка получения списка продуктов: {response.StatusCode}");
            }

            var apiResponse = await response.Content.ReadFromJsonAsync<ApiProduct>();
            return apiResponse?.Result.Items.Select(x => x.Product_id.ToString()).ToArray();
        }

        /// <summary>
        /// Получает подробную информацию о продуктах с OZON по списку product_id
        /// </summary>
        private async Task<List<ProductInfo>?> GetOzonProductDetailsAsync(string ozonUrl, string clientOzon, string ozonToken, string[] productIds)
        {
            using var httpClient = new HttpClient
            {
                BaseAddress = new Uri(ozonUrl)
            };

            httpClient.DefaultRequestHeaders.Add("Client-Id", clientOzon);
            httpClient.DefaultRequestHeaders.Add("Api-Key", ozonToken);

            var requestData = new
            {
                product_id = productIds
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("v3/product/info/list", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Ошибка получения подробной информации о продуктах: {response.StatusCode}");
            }

            var apiResponseProducts = await response.Content.ReadFromJsonAsync<ApiProductInfo>();
            return apiResponseProducts?.Items;
        }

        /// <summary>
        /// Выполняет запрос к OZON для получения информации о запасах (stock).
        /// </summary>
        private async Task<List<StockItem>?> GetOzonStockInfoAsync(string ozonUrl, string clientOzon, string ozonToken, string[] productIds)
        {

            using var httpClient = new HttpClient
            {
                BaseAddress = new Uri(ozonUrl)
            };

            httpClient.DefaultRequestHeaders.Add("Client-Id", clientOzon);
            httpClient.DefaultRequestHeaders.Add("Api-Key", ozonToken);

            // В данном примере запрос без тела, но при необходимости можно добавить параметры.
            var emptyPayload = new {
                filter = new
                {
                    product_id = productIds,
                },
                limit = 1000,
            };
            var content = new StringContent(JsonConvert.SerializeObject(emptyPayload), Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync("v4/product/info/stocks", content);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Ошибка получения данных о запасах: {response.StatusCode}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            // Десериализуем ответ согласно предоставленной структуре.
            var stockResponse = JsonConvert.DeserializeObject<ApiStockInfo>(jsonResponse);
            return stockResponse?.Items;
        }


        /// <summary>
        /// Выполняет запрос к OZON по адресу v1/analytics/data и возвращает данные аналитики.
        /// </summary>
        private async Task<ApiAnalytics?> GetAnalyticsDataAsync(string ozonUrl, string clientOzon, string ozonToken, int[] skus)
        {
            string analyticsEndpoint = "v1/analytics/data";
            using var httpClient = new HttpClient { BaseAddress = new Uri(ozonUrl) };
            httpClient.DefaultRequestHeaders.Add("Client-Id", clientOzon);
            httpClient.DefaultRequestHeaders.Add("Api-Key", ozonToken);
            var requestBody = new
            {
                date_from = Utils.OffsetDate(),
                date_to = Utils.FormatDateNow(),
                metrics = new string[] { "ordered_units", "revenue", "returns", "delivered_units", "position_category" },
                dimension = new string[] { "sku", "day" },
                sort = new[]
                {
                    new { key = "sku", order = "DESC" }
                },
                filters = skus.Select(v => new
                {
                    key = "sku",
                    value = v.ToString(),
                }).ToArray(),
                limit = 1000,
                offset = 0
            };

            // Если для запроса analytics не требуется тело, передаем пустой объект.
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(analyticsEndpoint, content);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Ошибка получения аналитики: {response.StatusCode}");
            }
            var jsonResponse = await response.Content.ReadAsStringAsync();
            var analyticsResponse = JsonConvert.DeserializeObject<ApiAnalytics>(jsonResponse);
            return analyticsResponse;
        }

    }
}
