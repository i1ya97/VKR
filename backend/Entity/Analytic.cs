namespace API.Entity
{
    public class Analytic
    {
        public required Guid Id { get; set; }
        public DateTime Date { get; set; }

        public int Ordered_units { get; set; }

        public required int Returns { get; set; }

        public required Product Sku { get; set; }
    }
}
