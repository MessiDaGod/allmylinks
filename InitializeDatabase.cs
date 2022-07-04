using System.Diagnostics;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using allmylinks;


namespace allmylinks;

public static class InitializeDatabase
{
    public static void AddDatabaseFeatures(this IServiceCollection services)
    {
        services.AddDbContextFactory<Context>(
                options => options.UseSqlite($"Filename=/Users/joeshakely/repos/allmylinks/wwwroot/database/main.db"));
        services.AddScoped<PersonServices>();
    }

    public static async Task InitializeDatabaseFeature(this WebAssemblyHost host)
    {
        // Initialize DatabaseContext and sync with IndexedDb Files
        var dbService = host.Services.GetRequiredService<DatabaseService<Context>>();
        await dbService.InitDatabaseAsync();

        // Sync Contributions
        var contributionService = host.Services.GetRequiredService<PersonServices>();
        await contributionService.InitAsync();
        await host.InitializeDatabaseFeature();
        await host.RunAsync();
    }
}