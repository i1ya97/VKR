namespace API.Entity
{
    public class Analytic
    {
        public required Guid Id { get; set; }
        public DateTime Date { get; set; }

        public int Value { get; set; }

        public required string Type { get; set; }

        public required Product Offer { get; set; }
    }
}
