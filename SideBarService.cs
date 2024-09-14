using System.Reflection;
using System.Text.RegularExpressions;
using Stl.IO;

namespace allmylinks;

public class SideBarService
{
    public static string? m_WebRootPath { get; set; }

    public string GetwwwRootPath()
    {
        string baseDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? "";
        string binCfgPart = Regex.Match(baseDir, @"[\\/]bin[\\/]\w+[\\/]").Value;
        var wwwRootPath = Path.Combine(baseDir, "wwwroot");
        if (!Directory.Exists(Path.Combine(wwwRootPath, "_framework")))
            m_WebRootPath = Path.GetFullPath(Path.Combine(baseDir, $"../../../../UI/{binCfgPart}/net6.0/wwwroot"));
        else m_WebRootPath = wwwRootPath;

        return m_WebRootPath;
    }

    public static string BaseDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location.Replace("Server", "UI")) ?? "";

    private IEnumerable<string> m_entries => Directory.GetDirectories(Path.GetFullPath(Path.Combine(FilePath.GetApplicationDirectory(), "../../../../UI/wwwroot")))
                       .Where(entry =>
                       {
                            var name = Path.GetFileName(entry);
                            return !name.StartsWith(".") && name != "bin" && name != "obj"
                            ;
                       });

    public IEnumerable<string> Entries
    {
        get
        {
            return m_entries;
        }
    }

    public string? WebRootPath
    {
        get
        {
            return m_WebRootPath;
        }
        set
        {
            m_WebRootPath = GetwwwRootPath();
        }
    }

    public IEnumerable<SideBarItem> Examples
    {
        get
        {
            return GetSideBarItems;
        }
    }

    public IEnumerable<SideBarItem> Filter(string term)
    {
        if (string.IsNullOrEmpty(term))
            return GetSideBarItems;

        bool contains(string value) => value != null && value.Contains(term, StringComparison.OrdinalIgnoreCase);

        bool filter(SideBarItem example) => contains(example.Name) || (example.Tags != null && example.Tags.Any(contains));

        bool deepFilter(SideBarItem example) => filter(example) || example.Children?.Any(filter) == true;


        return Examples.Where(category => category.Children?.Any(deepFilter) == true || filter(category))
                       .Select(category => new SideBarItem
                       {
                           Name = category.Name,
                           Expanded = true,
                           Children = category.Children.Where(deepFilter).Select(example => new SideBarItem
                           {
                               Name = example.Name,
                               Path = example.Path,
                               Icon = example.Icon,
                               Expanded = true,
                               Children = example.Children
                           }
                           ).ToArray()
                       }).ToList();
    }

    public SideBarItem? FindCurrent(Uri uri)
    {
        static IEnumerable<SideBarItem> Flatten(IEnumerable<SideBarItem> e)
        {
            return e.SelectMany(c => c.Children != null ? Flatten(c.Children) : new[] { c });
        }

        return Flatten(Examples)
                    .FirstOrDefault(predicate: example => example.Path == uri.AbsolutePath || $"/{example.Path}" == uri.AbsolutePath);
    }

    public string TitleFor(SideBarItem example)
    {
        if (example.Name != null && example.Name != "Overview")
        {
            return example.Name ?? $"{example.Name}";
        }

        return "";
    }

    public string DescriptionFor(SideBarItem example)
    {
        return example?.Description ?? "";
    }

    public readonly SideBarItem[] GetSideBarItems = {
       new SideBarItem
       {
            Name = "All My Links",
            Path = "/",
            Icon = "link"
        },
       new SideBarItem
       {
            Name = "Sql",
            Path = "/SqlPage",
            Icon = "database"
        },
    };
}
