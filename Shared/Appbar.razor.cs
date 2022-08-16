// Copyright (c) MudBlazor 2021
// MudBlazor licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using allmylinks.Models;
using allmylinks.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using MudBlazor;

namespace allmylinks.Shared;

public partial class Appbar
{
    [Parameter] public EventCallback<MouseEventArgs> DrawerToggleCallback { get; set; }
    [Parameter] public bool DisplaySearchBar { get; set; }

    [Inject] private NavigationManager NavigationManager { get; set; }
    [Inject] private IApiLinkService ApiLinkService { get; set; }

    [Inject] private LayoutService LayoutService { get; set; }

    MudAutocomplete<ApiLinkServiceEntry> _searchAutocomplete;

    private string _badgeTextSoon = "coming soon";
    private bool _searchDialogOpen;
    private void OpenSearchDialog() => _searchDialogOpen = true;
    private DialogOptions _dialogOptions = new() {Position = DialogPosition.TopCenter, NoHeader = true};

    private async void OnSearchResult(ApiLinkServiceEntry entry)
    {
        NavigationManager.NavigateTo(entry.Link);
        await Task.Delay(1000);
        await _searchAutocomplete.Clear();
    }

    private string GetActiveClass(DocsBasePage page)
    {
        return page == LayoutService.GetDocsBasePage(NavigationManager.Uri) ? "mud-chip-text mud-chip-color-primary mx-1 px-3" : "mx-1 px-3";
    }

    private Task<IEnumerable<ApiLinkServiceEntry>> Search(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            // the user just clicked the autocomplete open, show the most popular pages as search result according to our analytics data
            // ordered by popularity
            return Task.FromResult<IEnumerable<ApiLinkServiceEntry>>(new[]
            {
                new ApiLinkServiceEntry
                {
                    Title = "AllMyLinks",
                    Link = "allmylinks",
                    SubTitle = "Page showing all of Joe Shakely's social links."
                },
                new ApiLinkServiceEntry
                {
                    Title = "Is It Christmas?",
                    Link = "isitchristmas",
                    SubTitle =
                        "High-Performance Modern Christmas Detection Technology."
                },
                new ApiLinkServiceEntry
                {
                    Title = "SQLite Browser",
                    Link = "sql",
                    // ComponentType = typeof(MudTable<T>),
                    SubTitle = "A WASM based sqlite query engine."
                },
            });
        }

        return ApiLinkService.Search(text);
    }
}