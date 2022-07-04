using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop;

namespace allmylinks;
public class DatabaseService<T>
    where T : DbContext
{
    [Inject] IJSRuntime? JS { get; set; }
    // #if RELEASE
    public static string FileName = "/Users/joeshakely/repos/allmylinks/wwwroot/database/main.db";
    private readonly IDbContextFactory<T> _dbContextFactory;
    private readonly Lazy<Task<IJSObjectReference>> _moduleTask;
    // #endif


    // // #if DEBUG
    //         public DatabaseService()
    //         {
    //         }
    // #else
    public DatabaseService(IJSRuntime jsRuntime
        , IDbContextFactory<T> dbContextFactory)
    {
        if (jsRuntime == null) throw new ArgumentNullException(nameof(jsRuntime));
        _dbContextFactory = dbContextFactory ?? throw new ArgumentNullException(nameof(dbContextFactory));

        _moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
           "import", "./js/AllMyLinks.js").AsTask());
    }
    // #endif

    public async Task InitDatabaseAsync()
    {
        try
        {
            // #if RELEASE

            var module = await _moduleTask.Value;
            try {
                await module.InvokeVoidAsync("mountAndInitializeDb");

            if (!File.Exists(FileName))
            {
                File.Create(FileName).Close();
            }

            await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
            await dbContext.Database.EnsureCreatedAsync();
            }
            catch (Exception e)
            {
                await JS.InvokeVoidAsync("log", e.Message);
            }

            // #endif
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.GetType().Name, ex.Message);
        }
    }
}
