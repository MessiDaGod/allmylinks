using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Text.Json;
using allmylinks;
using SQLite;
using System.Diagnostics;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

public class PersonServices
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


    public async Task<string> InitAsync()
    {

        try {
        var db = new SQLiteAsyncConnection(DatabasePath);
        await db.DropTableAsync<Person>();
        await db.CreateTableAsync<Person>();
        var person = new Person()
        {
            FirstName = "AAPL",
            LastName = "Mothafucka",
        };

        await db.InsertAsync(person);

        }
        catch (Exception e) {
            return e.Message;
        }

        return "Success!";
    }
}


public class Root<T>
{
    public List<T> Items { get; set; } = new List<T>();
    public int ItemCount { get; set; }
}


// dotnet build && dotnet run