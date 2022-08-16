// joeshakely

using allmylinks.Services.UserPreferences;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Stl.Fusion;

namespace allmylinks
{
    public class Startup
    {
        private IConfiguration Cfg { get; }
        private IWebAssemblyHostEnvironment Env { get; }
        private ILogger Log { get; set; } = NullLogger<Startup>.Instance;

        public Startup(IConfiguration configuration, IWebAssemblyHostEnvironment env)
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
