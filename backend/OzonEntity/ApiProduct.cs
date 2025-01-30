using Api.Controllers;
using Newtonsoft.Json;

namespace API.OzonEntity
{
    public class ApiProduct
    {
        [JsonProperty("result")]
        public required Result Result { get; set; }
    }
    public class Result
    {
        [JsonProperty("items")]
        public required List<Item> Items { get; set; }
    }

    public class Item
    {
        [JsonProperty("product_id")]
        public long Product_id { get; set; }
    }
}
