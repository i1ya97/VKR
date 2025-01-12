namespace API.Entity
{
    public class Product
    {
        public required long Id { get; set; }
        public required string Name { get; set; }

        public required long Offer_id { get; set; }

        public long Type_id { get; set; }

        public DateTime Created_at { get; set; }

        public double Old_price { get; set; }

        public double Min_price { get; set; }

        public double Price { get; set; }

        public double Marketing_price { get; set; }

        public required string Currency_code { get; set; }

        public required string Sale_schema { get; set; }

        public double Delivery_amount { get; set; }

        public double Return_amount { get; set; }

        public double Vat { get; set; }

        public double Percent { get; set; }

        public double Value { get; set; }

        public double Volume_weight { get; set; }

        public bool Is_discounted { get; set; }

        public bool Is_kgt { get; set; }

        public required string User_id { get; set; }
    }
}
