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

        try {
            await using var dbContext = await _factory.CreateDbContextAsync();
            if (dbContext.Person.Count() == 0) return;

            var result = new Person("Joe", "Shakely");

            dbContext.Person.Add(result);
            await dbContext.SaveChangesAsync();
            _hasSynced = true;
        }
        catch (Exception e) {
            // ignore
        }
    }
}


public class Root<T>
{
    public List<T> Items { get; set; } = new List<T>();
    public int ItemCount { get; set; }
}


// dotnet build && dotnet run