using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Text.Json;
using allmylinks;

public class PersonServices
{
    private readonly IDbContextFactory<Context> _factory;
    private readonly HttpClient _httpClient;
    private bool _hasSynced = false;
    public PersonServices(IDbContextFactory<Context> factory, HttpClient httpClient)
    {
        _factory = factory;
        _httpClient = httpClient;
    }


    public async Task InitAsync()
    {
        if (_hasSynced) return;

        await using var dbContext = await _factory.CreateDbContextAsync();
        if (dbContext.Person.Count() > 0) return;

        var result = await _httpClient.GetFromJsonAsync<Root<Person>>("/sample-data/contributions.json");
        if (result?.Items.Count > 0)
        {
            var index = 1;
            result.Items.ForEach(item =>
            {
                item.Id = index++;
                if (DateTime.TryParse(item.Date, out var startDate))
                {
                    item.StartDate = startDate;
                }

                dbContext.Person.Add(item);
            });
        }

        await dbContext.SaveChangesAsync();
        _hasSynced = true;
    }

}


public class Root<T>
{
    public List<T> Items { get; set; } = new List<T>();
    public int ItemCount { get; set; }
}
