using allmylinks;
using Microsoft.EntityFrameworkCore;
using SQLite;

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
        var dropResult = await db.DropTableAsync<Person>();
        var createResult = await db.CreateTableAsync<Person>();
        List<string> people = new();
        var person = new Person
        {
            FirstName = "Joe",
            LastName = "Mothafuckin Shakely",
        };

        await db.InsertAsync(person);
        Console.WriteLine(person.ToString());

        return person.ToString();
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