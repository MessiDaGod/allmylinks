// Copyright (c) MudBlazor 2021
// MudBlazor licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using allmylinks.Models;
using allmylinks.Services.UserPreferences;
using MudBlazor;
using Stl.IO;
using Microsoft.JSInterop;
using System.Text.RegularExpressions;
using System.Reflection;

namespace allmylinks.Services;

public class LayoutService : ILayoutService
{
    [Inject] IJSRuntime Js { get; set; }
    private readonly IUserPreferencesService _userPreferencesService;
    private UserPreferences.UserPreferences _userPreferences;

    public bool IsRTL { get; private set; } = false;
    public bool IsDarkMode { get; private set; } = false;

    public MudTheme CurrentTheme { get; private set; }


    public LayoutService(IUserPreferencesService userPreferencesService)
    {
        _userPreferencesService = userPreferencesService;
    }

    public void SetDarkMode(bool value)
    {
        IsDarkMode = value;
    }

    public async Task ApplyUserPreferences(bool isDarkModeDefaultTheme)
    {
        _userPreferences = await _userPreferencesService.LoadUserPreferences();
        if (_userPreferences != null)
        {
            IsDarkMode = _userPreferences.DarkTheme;
            IsRTL = _userPreferences.RightToLeft;
        }
        else
        {
            IsDarkMode = isDarkModeDefaultTheme;
            _userPreferences = new UserPreferences.UserPreferences { DarkTheme = IsDarkMode };
            await _userPreferencesService.SaveUserPreferences(_userPreferences);
        }
    }

    public event EventHandler MajorUpdateOccured;

    private void OnMajorUpdateOccured() => MajorUpdateOccured?.Invoke(this, EventArgs.Empty);

    public async Task ToggleDarkMode()
    {
        IsDarkMode = !IsDarkMode;
        _userPreferences.DarkTheme = IsDarkMode;
        await _userPreferencesService.SaveUserPreferences(_userPreferences);
        OnMajorUpdateOccured();
    }

    public async Task ToggleRightToLeft()
    {
        IsRTL = !IsRTL;
        _userPreferences.RightToLeft = IsRTL;
        await _userPreferencesService.SaveUserPreferences(_userPreferences);
        OnMajorUpdateOccured();

    }

    public void SetBaseTheme(MudTheme theme)
    {
        CurrentTheme = theme;
        OnMajorUpdateOccured();
    }

    public DocsBasePage GetDocsBasePage(string uri)
    {
        if (uri.Contains("/docs/") || uri.Contains("/api/") || uri.Contains("/components/") ||
            uri.Contains("/features/") || uri.Contains("/customization/") || uri.Contains("/utilities/"))
        {
            return DocsBasePage.AllMyLinks;
        }
        else if (uri.Contains("/getting-started/"))
        {
            return DocsBasePage.IsItChristmas;
        }
        else if (uri.Contains("/mud/"))
        {
            return DocsBasePage.SQL;
        }
        else
        {
            return DocsBasePage.None;
        }
    }

    private static List<string> MyPages { get; set; } = new();

    public static string m_WebRootPath { get { return GetwwwRootPath(); } }

    public static string GetwwwRootPath()
    {
        string baseDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? "";
        string binCfgPart = Regex.Match(baseDir, @"[\\/]bin[\\/]\w+[\\/]").Value;
        var wwwRootPath = Path.Combine(baseDir, "wwwroot");
        if (!Directory.Exists(Path.Combine(wwwRootPath, "_framework")))
            return Path.GetFullPath(Path.Combine(baseDir, $"../../../../UI/{binCfgPart}/net6.0/wwwroot"));
        else return wwwRootPath;
    }

    public async Task<List<string>> GetPages()
    {
        var pages = Directory.GetFiles(Path.Combine(GetwwwRootPath(), "../../../"), "*.razor", SearchOption.AllDirectories);
        for (int i = 0; i < pages.Length; i++)
        {
            MyPages.Add(pages[i]);
            await Js.InvokeVoidAsync("AML.logit", pages[i]);
        }

        return MyPages;
    }
}

public interface ILayoutService
{
    Task<List<string>> GetPages();
}