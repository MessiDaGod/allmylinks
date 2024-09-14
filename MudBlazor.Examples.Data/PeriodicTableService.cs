using System.Reflection;
using System.Text.Json;
using MudBlazor.Examples.Data.Models;

namespace MudBlazor.Examples.Data
{
    public class PeriodicTableService : IPeriodicTableService
    {
        public Task<IEnumerable<Element>> GetElements()
        {
            return GetElements(string.Empty);
        }

        public async Task<IEnumerable<Element>> GetElements(string search = "")
        {
            var elements = new List<Element>();
            var key = GetResourceKey(typeof(PeriodicTableService).Assembly, "Elements.json");
            await using var stream = typeof(PeriodicTableService).Assembly.GetManifestResourceStream(key);
            var table = await JsonSerializer.DeserializeAsync<Table>(stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            elements = table.ElementGroups.Aggregate(elements, (current, elementGroup) => current.Concat(elementGroup.Elements).ToList());

            return search == string.Empty ? elements : elements.Where(elm => (elm.Sign + elm.Name).Contains(search, StringComparison.InvariantCultureIgnoreCase));
        }

        public static string GetResourceKey(Assembly assembly, string embeddedFile)
        {
            return assembly.GetManifestResourceNames().FirstOrDefault(x => x.Contains(embeddedFile));
        }
    }
}
