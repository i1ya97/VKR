namespace API.Entity
{
    public class Residue: Product
    {

        public required int Fbo { get; set; }

        public required int Fbs { get; set; }

        public required int Ordered { get; set; }

        public required int Returns { get; set; }

        public required int Revenue { get; set; }

        public required int DeliveredUnits { get; set; }

        public required int PositionCategory { get; set; }

    }
}
