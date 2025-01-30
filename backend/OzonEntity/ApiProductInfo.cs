using Newtonsoft.Json;

namespace API.OzonEntity
{
    public class ApiProductInfo
    {
        [JsonProperty("items")]
        public required List<ProductInfo> Items { get; set; }
    }
    public class ProductInfo
    {
        [JsonProperty("id")] 
        public required long Id { get; set; }

        [JsonProperty("name")] 
        public required string Name { get; set; }

        [JsonProperty("offer_id")] 
        public required string Offer_id { get; set; }

        [JsonProperty("type_id")] 
        public long Type_id { get; set; }

        [JsonProperty("created_at")] 
        public DateTime Created_at { get; set; }

        [JsonProperty("old_price")] 
        public double Old_price { get; set; }

        [JsonProperty("min_price")] 
        public double Min_price { get; set; }

        [JsonProperty("price")] 
        public double Price { get; set; }

        [JsonProperty("marketing_price")] 
        public double Marketing_price { get; set; }

        [JsonProperty("currency_code")] 
        public required string Currency_code { get; set; }

        [JsonProperty("delivery_amount")] 
        public double Delivery_amount { get; set; }

        [JsonProperty("return_amount")] 
        public double Return_amount { get; set; }

        [JsonProperty("vat")] 
        public double Vat { get; set; }

        [JsonProperty("percent")] 
        public double Percent { get; set; }

        [JsonProperty("value")] 
        public double Value { get; set; }

        [JsonProperty("volume_weight")] 
        public double Volume_weight { get; set; }

        [JsonProperty("is_discounted")] 
        public bool Is_discounted { get; set; }

        [JsonProperty("is_kgt")]
        public bool Is_kgt { get; set; }

        [JsonProperty("commissions")]
        public required List<Commission> Commissions { get; set; }
    }


    public class Commission
    {
        [JsonProperty("delivery_amount")]
        public double Delivery_amount { get; set; }

        [JsonProperty("percent")]
        public double Percent { get; set; }

        [JsonProperty("return_amount")]
        public double Return_amount { get; set; }

        [JsonProperty("sale_schema")]
        public required string Sale_schema { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }

    }
}
