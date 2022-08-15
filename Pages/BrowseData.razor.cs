using allmylinks.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Newtonsoft.Json;

namespace allmylinks.Pages;

public partial class BrowseData
{
    public BrowseData(IJSRuntime jsRuntime)
    {
        JsRuntime = jsRuntime;
    }

    [Inject] private static IJSRuntime? JsRuntime { get; set; }
    private static readonly IJSRuntime _jsRuntime;
    [JSInvokable]
    public static async Task LoadTables(string json)
    {
        var prices = JsonConvert.DeserializeObject<Prices[]>(json);
        for (int j = 0; j < prices.Length; j++)
        {
            await LogIt(prices[j].ToString());
        }
        return;
    }
}
