using allmylinks;
using allmylinks.Abstractions;
using allmylinks.Extensions;
using allmylinks.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using MudBlazor.Services;
using Radzen;
using Stl.DependencyInjection;
using Stl.Fusion;
using Stl.Fusion.Authentication;
using Stl.Fusion.Blazor;
using Stl.Fusion.Client;
using Stl.Fusion.Extensions;
using Stl.OS;

internal class Program
{
    private static Task Main(string[] args)
    {
        if (OSInfo.Kind != OSKind.WebAssembly)
            throw new ApplicationException("This app runs only in browser.");

        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        builder.Services.AddMudServices();
        // builder.Services.AddControllers();

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        });
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

        var DbDir = Path.Combine(Path.Combine(Directory.GetCurrentDirectory(), "database"));
        var DatabasePath = Path.Combine(Path.Combine(Directory.GetCurrentDirectory(), "database"), "main.db");

        builder.Services.AddScoped<DialogService>();
        builder.Services.AddScoped<NotificationService>();
        builder.Services.AddScoped<TooltipService>();
        builder.Services.AddScoped<ContextMenuService>();
        builder.Services.AddScoped<SideBarService>();
        builder.Services.AddScoped<LayoutService>();

        builder.Services.TryAddDocsViewServices();
        try
        {
            builder.Services.AddDatabaseFeatures();
        }
        catch (Exception)
        {
            // ignore
        }

        builder.Services.AddScoped<PersonServices>();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: "AllowGithub",
                              policy =>
                              {
                                  policy.WithOrigins("https://github.com");
                              });
        });
        ConfigureServices(builder.Services, builder);
        var host = builder.Build();

        // host.UseHttpsRedirection();
        // host.UseStaticFiles();
        // host.UseRouting();

        // host.UseCors();

        host.Services.HostedServices().Start();
        return host.RunAsync();
    }

    public static void ConfigureServices(IServiceCollection services, WebAssemblyHostBuilder builder)
    {
        builder.Logging.SetMinimumLevel(LogLevel.Warning);

        var baseUri = new Uri(builder.HostEnvironment.BaseAddress);
        var apiBaseUri = new Uri($"{baseUri}api/");

        // Fusion
        var fusion = services.AddFusion();
        var fusionClient = fusion.AddRestEaseClient();
        fusionClient.ConfigureWebSocketChannel(c => new()
        {
            BaseUri = baseUri,
            LogLevel = LogLevel.Information,
            MessageLogLevel = LogLevel.None,
        });
        fusionClient.ConfigureHttpClient((c, name, o) =>
        {
            var isFusionClient = (name ?? "").StartsWith("Stl.Fusion");
            var clientBaseUri = isFusionClient ? baseUri : apiBaseUri;
            o.HttpClientActions.Add(client => client.BaseAddress = clientBaseUri);
        });

        // // Fusion service clients
        fusionClient.AddReplicaService<ICounterService, ICounterClientDef>();
        // fusionClient.AddReplicaService<IWeatherForecastService, IWeatherForecastClientDef>();
        // fusionClient.AddReplicaService<IChatService, IChatClientDef>();

        ConfigureSharedServices(services);
    }

    public static void ConfigureSharedServices(IServiceCollection services)
    {
        // Other UI-related services
        var fusion = services.AddFusion();
        fusion.AddBlazorUIServices();
        fusion.AddFusionTime();
        fusion.AddBackendStatus<CustomBackendStatus>();
        // We don't care about Sessions in this sample, but IBackendStatus
        // service assumes it's there, so let's register a fake one
        services.AddSingleton(new SessionFactory().CreateSession());

        // Default update delay is set to min.
        services.AddTransient<IUpdateDelayer>(_ => UpdateDelayer.MinDelay);
    }
}