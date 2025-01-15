//using API;
//using API.Entity;
//using API.Migrations;
//using Appwrite;
//using Appwrite.Enums;
//using Appwrite.Models;
//using Appwrite.Services;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Linq;
//using System.Text;

//namespace Api.Controllers;

//[ApiController]
//[Route("[controller]")]
//public class ProductsController : ControllerBase
//{
//    private readonly ApplicationContext _context;
//    private readonly IConfiguration _configuration;

//    public ProductsController(ApplicationContext context, IConfiguration configuration)
//    {
//        _context = context;
//        _configuration = configuration;
//    }

//    [HttpGet]
//    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
//    {
//        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
//        {
//            if (_context.Products == null)
//            {
//                return NotFound();
//            }
//            var products = await _context.Products
//                              .Where(item => item.User_id == user.Id)
//                              .ToListAsync();
//            return Ok(products);
//        } else
//        {
//            return Unauthorized("User not found in context.");
//        }
//    }

//    [HttpPost]
//    [Route("add-products")]
//    public async Task<ActionResult<String>> PostProducts()
//    {
//        if (HttpContext.Items.TryGetValue("User", out var userObj) && userObj is User user)
//        {
//            using (var client = new HttpClient())
//            {
//                var OZON_URL = _configuration.GetSection("OZON").GetValue<string>("URL") ?? "";
//                var URL = _configuration.GetSection("Appwrite").GetValue<string>("URL") ?? "";
//                var Project = _configuration.GetSection("Appwrite").GetValue<string>("Project") ?? "";
//                var Token = _configuration.GetSection("Appwrite").GetValue<string>("API_key") ?? "";
//                var API_credentions = _configuration.GetSection("Appwrite").GetValue<string>("API_credentions") ?? "";

//                Client clientAppwrite = new Client().SetEndpoint(URL).SetProject(Project).SetKey(Token);

//                var databases = new Databases(clientAppwrite);

//                try
//                {
//                    var queries = new List<string>
//                    {
//                        Query.Equal("userId", "6784cb5500344d7c33d4").ToString(),
//                        Query.Equal("target", "OZON").ToString()
//                    };
//                    var result = await databases.ListDocuments("678101a60016c2a93d57", API_credentions, queries);
//                    var clientOzon = result.Documents[0].Data.FirstOrDefault((x) => x.Key == "client").Value?.ToString();
//                    var token = result.Documents[0].Data.FirstOrDefault((x) => x.Key == "token").Value?.ToString();

//                    client.BaseAddress = new Uri(OZON_URL);


//                    client.DefaultRequestHeaders.Add("Client-Id", clientOzon);
//                    client.DefaultRequestHeaders.Add("Api-Key", token);

//                    var content = new StringContent(JsonConvert.SerializeObject(new
//                    {
//                        filter = new { },
//                        last_id = "",
//                        limit = 100,
//                    }), Encoding.UTF8, "application/json");

//                    // Отправьте POST-запрос
//                    var response = await client.PostAsync("v3/product/list", content);

//                    // Проверьте успешность запроса
//                    if (response.IsSuccessStatusCode)
//                    {
//                        string[]? product_ids = (await response.Content.ReadFromJsonAsync<ApiResponse?>())?.result.items.Select(x => x.product_id.ToString()).ToArray();

//                        // Создайте объект для отправки
//                        var json = JsonConvert.SerializeObject(new
//                        {
//                            filter = new { },
//                            last_id = "",
//                            limit = 100,
//                        });

//                        var filter = new StringContent(JsonConvert.SerializeObject(new
//                        {
//                            product_id = product_ids,
//                        }), Encoding.UTF8, "application/json");

//                        // Отправьте POST-запрос
//                        var responseInfo = await client.PostAsync("v3/product/info/list", filter);

//                    if (responseInfo.IsSuccessStatusCode)
//                    {
//                        var itemsA = (await responseInfo.Content.ReadFromJsonAsync<ApiResponseProducts?>())?.items;
//                        var asd = itemsA.Select((i) => new Product{
//                            Id = i.Id,
//                            Name = i.Name,
//                            Offer_id = i.Offer_id,
//                            Type_id = i.Type_id,
//                            Created_at = i.Created_at,
//                            Old_price = i.Old_price,
//                            Min_price = i.Min_price,
//                            Price = i.Price,
//                            Marketing_price = i.Marketing_price,
//                            Currency_code = i.Currency_code,
//                            Delivery_amount = i.Delivery_amount,
//                            Return_amount = i.Return_amount,
//                            Vat = i.Vat,
//                            Percent = i.Percent,
//                            Value = i.Value,
//                            Volume_weight = i.Volume_weight,
//                            Is_discounted = i.Is_discounted,
//                            Is_kgt = i.Is_kgt,
//                            User_id = "678101a60016c2a93d57"
//                        });
//                        _context.Products.AddRange(asd);
//                        await _context.SaveChangesAsync();


//                        return Ok(asd);
//                        }
//                        else
//                        {
//                            return $"Ошибка: {responseInfo.StatusCode}";
//                        }

//                    }
//                    else
//                    {
//                        return $"Ошибка: {response.StatusCode}";
//                    }

//                }
//                catch (Exception ex)
//                {
//                    return $"Ошибка: {ex.InnerException}";
//                }
//            }
//        }
//        return Ok();
//    }
//}

//public class ApiResponse
//{
//    public Result result { get; set; }
//}

//public class Result
//{
//    public List<Item> items { get; set; }
//}

//public class Item
//{
//    public long product_id { get; set; }
//}

//public class ApiResponseProducts
//{
//    public List<ProductOZON> items { get; set; }
//}


using API;
using API.Entity;
using API.Migrations;
using API.OzonEntity;
using Appwrite;
using Appwrite.Enums;
using Appwrite.Models;
using Appwrite.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
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
                            foreach (var stockValue in item.stocks)
                            {
                                // Поиск продукта по значению sku (сравнение по Id, приведённому к строке).
                                var productForStock = products.FirstOrDefault(p => p.Offer_id == item.offer_id);
                                if (productForStock != null)
                                {
                                    var stock = new Stock
                                    {
                                        Id = Guid.NewGuid(),
                                        Present = stockValue.present,
                                        Reserved = stockValue.reserved,
                                        Type = stockValue.type, // Используем значение поля type из ответа.
                                        Sku = productForStock
                                    };
                                    stocks.Add(stock);
                                }
                            }
                        }
                    }

                    // Получаем аналитические данные с OZON.
                    var analyticsResponse = await GetAnalyticsDataAsync(ozonUrl, clientOzon, ozonToken);

                    List<Analytic> analytics = new List<Analytic>();
                    if (analyticsResponse != null && analyticsResponse.result.data.Any())
                    {
                        foreach (var analyticData in analyticsResponse.result.data)
                        {
                            // Используем первый элемент dimensions для сопоставления продукта.
                            var dimension = analyticData.dimensions.FirstOrDefault();
                            if (dimension != null)
                            {
                                // Ищем продукт по Offer_id (при необходимости можно изменить условие поиска).
                                var productForAnalytic = products.FirstOrDefault(p => p.Offer_id == dimension.id);
                                if (productForAnalytic != null)
                                {
                                    var analytic = new Analytic
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = analyticsResponse.timestamp, // Используем timestamp из ответа.
                                        Ordered_units = analyticData.metrics.FirstOrDefault(),
                                        Returns = 0, // Если в ответе нет отдельного поля returns, можно задать 0 или другое значение.
                                        Sku = productForAnalytic
                                    };
                                    analytics.Add(analytic);
                                }
                            }
                        }
                    }


                    _context.Products.AddRange(products);
                    _context.Stoks.AddRange(stocks);
                    _context.Analytics.AddRange(analytics);
                    await _context.SaveChangesAsync();

                    return Ok(products);
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
                limit = 1000
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("v3/product/list", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Ошибка получения списка продуктов: {response.StatusCode}");
            }

            var apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse>();
            return apiResponse?.result.items.Select(x => x.product_id.ToString()).ToArray();
        }

        /// <summary>
        /// Получает подробную информацию о продуктах с OZON по списку product_id
        /// </summary>
        private async Task<List<ProductOZON>?> GetOzonProductDetailsAsync(string ozonUrl, string clientOzon, string ozonToken, string[] productIds)
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

            var apiResponseProducts = await response.Content.ReadFromJsonAsync<ApiResponseProducts>();
            return apiResponseProducts?.items;
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
            var stockResponse = JsonConvert.DeserializeObject<StockInfoResponse>(jsonResponse);
            return stockResponse?.items;
        }


        /// <summary>
        /// Выполняет запрос к OZON по адресу v1/analytics/data и возвращает данные аналитики.
        /// </summary>
        private async Task<AnalyticsResponse?> GetAnalyticsDataAsync(string ozonUrl, string clientOzon, string ozonToken)
        {
            // Предполагается, что базовый URL ozonUrl подходит для запроса аналитики.
            string analyticsEndpoint = "v1/analytics/data";
            using var httpClient = new HttpClient { BaseAddress = new Uri(ozonUrl) };
            httpClient.DefaultRequestHeaders.Add("Client-Id", clientOzon);
            httpClient.DefaultRequestHeaders.Add("Api-Key", ozonToken);

            var requestBody = new
            {
                date_from = OffsetDate(),
                date_to = FormatDateNow(),
                metrics = new string[] { "ordered_units" },
                dimension = new string[] { "sku" },
                sort = new[]
                {
                    new { key = "ordered_units", order = "DESC" }
                },
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
            var analyticsResponse = JsonConvert.DeserializeObject<AnalyticsResponse>(jsonResponse);
            return analyticsResponse;
        }

        /// <summary>
        /// Возвращает дату для поля date_from.
        /// Пример: возвращает дату, сдвинутую на 7 дней назад.
        /// </summary>
        private string OffsetDate()
        {
            // Для примера отнимаем 7 дней от текущей даты.
            return DateTime.UtcNow.AddMonths(-3).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Возвращает текущую дату для поля date_to.
        /// </summary>
        private string FormatDateNow()
        {
            return DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        }
    }

    #region Модели данных ответа от OZON

    public class ApiResponse
    {
        public Result result { get; set; }
    }

    public class Result
    {
        public List<Item> items { get; set; }
    }

    public class Item
    {
        public long product_id { get; set; }
    }

    public class ApiResponseProducts
    {
        public List<ProductOZON> items { get; set; }
    }

    public class StockInfoResponse
    {
        public string cursor { get; set; }
        public List<StockItem> items { get; set; }
        public int total { get; set; }
    }

    public class StockItem
    {
        [JsonProperty("offer_id")]
        public string offer_id { get; set; }

        [JsonProperty("product_id")]
        public int product_id { get; set; }

        [JsonProperty("stocks")]
        public List<StockValue> stocks { get; set; }
    }

    public class StockValue
    {
        [JsonProperty("present")]
        public int present { get; set; }

        [JsonProperty("reserved")]
        public int reserved { get; set; }

        [JsonProperty("shipment_type")]
        public string shipment_type { get; set; }

        [JsonProperty("sku")]
        public int sku { get; set; }

        [JsonProperty("type")]
        public string type { get; set; }
    }

    /// <summary>
    /// Модель для десериализации ответа аналитики.
    /// </summary>
    public class AnalyticsResponse
    {
        [JsonProperty("timestamp")]
        public DateTime timestamp { get; set; }

        [JsonProperty("result")]
        public AnalyticsResult result { get; set; }
    }

    public class AnalyticsResult
    {
        [JsonProperty("data")]
        public List<AnalyticData> data { get; set; }

        [JsonProperty("totals")]
        public List<int> totals { get; set; }
    }

    /// <summary>
    /// Модель для отдельного элемента аналитических данных.
    /// </summary>
    public class AnalyticData
    {
        [JsonProperty("dimensions")]
        public List<Dimension> dimensions { get; set; }

        [JsonProperty("metrics")]
        public List<int> metrics { get; set; }
    }

    /// <summary>
    /// Модель для элемента dimensions.
    /// </summary>
    public class Dimension
    {
        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }
    }

    #endregion
}
