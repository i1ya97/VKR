namespace API.Entity
{
    public class Stock
    {
        public required Guid Id { get; set; }
        public int Present { get; set; }

        public int Reserved { get; set; }

        public required string Type { get; set; }

        public required Product Offer { get; set; }

        public required int Sku { get; set; }
    }
}
