namespace API.Entity
{
    public class Residue
    {
        public required string Offer_id { get; set; }

        public required string Name { get; set; }

        public required int Fbo { get; set; }

        public required int Fbs { get; set; }

        public required int Ordered { get; set; }

        public required int Returns { get; set; }
    }
}
