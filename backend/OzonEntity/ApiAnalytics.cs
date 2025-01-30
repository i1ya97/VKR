using Api.Controllers;
using Newtonsoft.Json;

namespace API.OzonEntity
{
    public class ApiAnalytics
    {
        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }

        [JsonProperty("result")]
        public required AnalyticsResult Result { get; set; }
    }

    public class AnalyticsResult
    {
        [JsonProperty("data")]
        public required List<AnalyticData> Data { get; set; }

        [JsonProperty("totals")]
        public required List<object> Totals { get; set; }
    }

    public class AnalyticData
    {
        [JsonProperty("dimensions")]
        public required List<Dimension> Dimensions { get; set; }

        [JsonProperty("metrics")]
        public required List<object> Metrics { get; set; }
    }

    public class Dimension
    {
        [JsonProperty("id")]
        public required string Id { get; set; }

        [JsonProperty("name")]
        public required string Name { get; set; }
    }
}
