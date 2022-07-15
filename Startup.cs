// joeshakely
using System;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.AspNetCore.Hosting;

namespace allmylinks
{
    public class Startup
    {
        private IConfiguration Cfg { get; }
        private ILogger Log { get; set; } = NullLogger<Startup>.Instance;

        public Startup(IConfiguration configuration)
        {
            Cfg = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddConsole();
                logging.SetMinimumLevel(LogLevel.None);
                logging.AddFilter("Microsoft", LogLevel.None);
                logging.AddFilter("Microsoft.AspNetCore.Hosting", LogLevel.None);
                logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.None);
                logging.AddFilter("Stl.Fusion.Operations", LogLevel.None);
            });
        }
    }
}

