using Api.Controllers;
using Newtonsoft.Json;

namespace API.OzonEntity
{
    public class ApiStockInfo
    {
        [JsonProperty("cursor")]
        public required string Cursor { get; set; }

        [JsonProperty("items")]
        public required List<StockItem> Items { get; set; }

        [JsonProperty("total")]
        public int Total { get; set; }
    }

    public class StockItem
    {
        [JsonProperty("offer_id")]
        public required string Offer_id { get; set; }

        [JsonProperty("product_id")]
        public int Product_id { get; set; }

        [JsonProperty("stocks")]
        public required List<StockValue> Stocks { get; set; }
    }

    public class StockValue
    {
        [JsonProperty("present")]
        public int Present { get; set; }

        [JsonProperty("reserved")]
        public int Reserved { get; set; }

        [JsonProperty("shipment_type")]
        public required string Shipment_type { get; set; }

        [JsonProperty("sku")]
        public int Sku { get; set; }

        [JsonProperty("type")]
        public required string Type { get; set; }
    }
}
