using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.EntityFrameworkCore;

namespace allmylinks;

public static class InitializeDatabase
{
    public static void AddDatabaseFeatures(this IServiceCollection services)
    {
        try {
            services.AddDbContextFactory<Context>(
                    options => options.UseSqlite("Filename=database/main.db"));
        }
        catch (Exception) {
            // ignore
        }

        services.AddScoped<PersonServices>();
    }

    public static async Task InitializeDatabaseFeature(this WebAssemblyHost host)
    {
        try {
            // Initialize DatabaseContext and sync with IndexedDb Files
            var dbService = host.Services.GetRequiredService<DatabaseService<Context>>();
            await dbService.InitDatabaseAsync();

            // Sync Contributions
            var contributionService = host.Services.GetRequiredService<PersonServices>();
            await contributionService.InitAsync();
            await host.InitializeDatabaseFeature();
        }
        catch (Exception) {
            // ignore
        }

        await host.RunAsync();
    }
}