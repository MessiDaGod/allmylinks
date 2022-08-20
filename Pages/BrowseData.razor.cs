using System.Collections.Generic;
using Newtonsoft.Json;
using Stl.Fusion;
using Stl.Fusion.Blazor;
using Stl.Fusion.UI;
using UAParser;
using User = Stl.Fusion.Authentication.User;
using Microsoft.JSInterop;
using Flurl.Http;
using Newtonsoft.Json.Linq;
using System.Collections.Concurrent;

namespace allmylinks.Pages;

public partial class BrowseData
{
    public class Model
    {
        public string Text { get; set; } = string.Empty;

        public Model(string text)
        {
            Text = text;
        }
    }

    private AuthState AuthState { get; set; } = new(new User("")); // For SSB pre-render
    private Stl.Fusion.Authentication.User User => AuthState.User;
    internal ConcurrentDictionary<string, UserAgent> UserAgentCache { get; } = new();
    private (string Name, string DisplayName)[] AuthSchemas { get; set; } = Array.Empty<(string, string)>();
    protected override void OnParametersSet() =>
    State.UpdateDelayer = new UpdateDelayer(Services.UICommandTracker(), UpdateDelay);

    protected override ComputedState<Model>.Options GetStateOptions() => new() { UpdateDelayer = new UpdateDelayer(Services.UICommandTracker(), UpdateDelay) };

    protected override MutableState<LocalModel>.Options GetMutableStateOptions() => new() { InitialValue = new() };

    protected override async Task<Model?> ComputeState(CancellationToken ct)
    {
        var text = await PriceService.GetPricesRecordCountAsync(Cts.Token) ?? "0";
        // var priceUser = await PriceService.GetPriceUser(_session, Cts.Token);
        string? mostRec = null;
        await Task.Run(async () => mostRec = LatestStick.ToArray()[LatestStick.ToArray().Length - 1].Close.ToString());
        await Task.Run(async () => MutableState.Value.PriceCount = OHLCList.ToArray().Length.ToString());

        return new Model()
        {
            PricesRecordCount = priceCount,
            // PriceUser = priceUser,
            ModelMostRecentPrice = mostRec
        };
    }
    public class LocalModel : BrowseData
    {
        private string _text = "";
        public string MyText
        {
            get => _text;
            set
            {
                if (_text == value)
                    return;
                _text = value;
            }
        }
    }

}