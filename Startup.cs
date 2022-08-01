// joeshakely
using System;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.AspNetCore.Hosting;
using Stl.Fusion;
using allmylinks.Services;
using allmylinks.Services.UserPreferences;

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

        public static void ConfigureServices(IServiceCollection services)
        {

            var fusion = services.AddFusion();
            fusion.AddComputeService<IUserPreferencesService, UserPreferencesService>();
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
