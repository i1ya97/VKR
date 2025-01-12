using API.Entity;
using Quartz;

namespace API.helpers
{
    public class OzonApiJob: IJob
    {

        private readonly ApplicationContext _context;

        public OzonApiJob(ApplicationContext context)
        {
            _context = context;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var newData = new Log
            {
                Id = Guid.NewGuid(),
                Due_date = DateTime.UtcNow.Date,
                Start_date = DateTime.UtcNow.AddDays(-1).Date,
                End_date = DateTime.UtcNow.Date,
                Type = "analytics/data",
                Status = "success",
                Comment = "",
                User_id = ""
            };

            await _context.UploadLogs.AddAsync(newData);
            await _context.SaveChangesAsync();
        }
    }
}
