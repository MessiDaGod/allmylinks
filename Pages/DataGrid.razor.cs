#nullable enable
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using Microsoft.VisualBasic;
using BlazorMonaco;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.JSInterop;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Serialization;
using Radzen;
using Radzen.Blazor;
using FileInfo = System.IO.FileInfo;
using Range = BlazorMonaco.Range;
using System.Diagnostics;
using System.Text.Json;

namespace Shakely.YahooApi.UI.Pages;

public partial class DataGrid
{
    [Inject] IJSRuntime? Js { get; set; }
    [Inject] NotificationService? NotificationService { get; set; }

    bool FirstRender { get; set; } = true;
    public string? MyText { get; private set; } = null!;
    private static string[] CLIENTS = new[] { "BlantonTurner", "Odin", "Me" };
    private string? CLIENT { get; set; }
    IEnumerable<string?>? selectedCsv;
    private string InitialValue => MyText ?? string.Empty;

    // protected override async Task OnInitializedAsync()
    // {

    // }

    // protected override async Task OnAfterRenderAsync(bool firstRender)
    // {
    // }

    // protected override async Task OnParametersSetAsync()
    // {

    // }
}