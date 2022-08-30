using System.Collections.Concurrent;
using System.Collections.Generic;
using allmylinks.Services;
using Newtonsoft.Json;
// using Shakely.YahooApi.Abstractions;
using Stl.Fusion;
using Stl.Fusion.Blazor;
using Stl.Fusion.UI;
using UAParser;
using User = Stl.Fusion.Authentication.User;
using Microsoft.JSInterop;
using Flurl.Http;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json.Linq;

namespace allmylinks.Pages;

public partial class BrowseData
{
    private AuthState AuthState { get; set; } = new(new User("")); // For SSB pre-render
    [Parameter]
    public TimeSpan UpdateDelay { get; set; } = TimeSpan.FromSeconds(5);
    private Stl.Fusion.Authentication.User User => AuthState.User;
    internal ConcurrentDictionary<string, UserAgent> UserAgentCache { get; } = new();
    private (string Name, string DisplayName)[] AuthSchemas { get; set; } = Array.Empty<(string, string)>();
}