using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Text.Json;
using allmylinks;
using SQLite;
using System.Diagnostics;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

public class PersonServices : IPersonServices
{
    // [Inject] IJSRuntime JS { get; set; }
    private readonly IDbContextFactory<Context> _factory;
    private readonly HttpClient _httpClient;
    private bool _hasSynced = false;

    public string DbDir { get { return Path.Combine(Directory.GetCurrentDirectory(), "database"); } }
    public string DatabasePath { get { return Path.Combine(DbDir, "main.db"); } }
    public PersonServices(IDbContextFactory<Context> factory, HttpClient httpClient)
    {
        _factory = factory;
        _httpClient = httpClient;
    }


    public async virtual Task<string> InitAsync()
    {
        var db = new SQLiteAsyncConnection(DatabasePath);
        await db.DropTableAsync<Person>();
        await db.CreateTableAsync<Person>();
        List<string> people = new();
        var person = new Person()
        {
            FirstName = "AAPL",
            LastName = "Mothafucka",
        };

        await db.InsertAsync(person);

        var query = db.Table<Person>();

        for (int i = 0; i < await query.CountAsync(); i++) {
            people.Add(query.ToString()!);
        }

        return "Success!";
    }
}


public class Root<T>
{
    public List<T> Items { get; set; } = new List<T>();
    public int ItemCount { get; set; }
}

public interface IPersonServices
{
    Task<string> InitAsync();
}

// dotnet build && dotnet run