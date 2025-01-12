namespace API.Entity
{
    public class Log
    {
        public required Guid Id { get; set; }
        public DateTime Due_date { get; set; }

        public DateTime? Start_date { get; set; }

        public DateTime? End_date { get; set; }

        public string? Type { get; set; }

        public required string Status { get; set; }

        public string? Comment { get; set; }

        public required string User_id { get; set; }
    }
}
