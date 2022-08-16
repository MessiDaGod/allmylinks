using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop;
using SQLitePCL;

namespace allmylinks;
public class Context : DbContext
{
    // [DllImport("foo")]
    // public static extern int whatever();
    public DbSet<Person>? Person { get; set; } = null!;
    private readonly Lazy<Task<IJSObjectReference>> _moduleTask;
    public Context(
        DbContextOptions<Context> options,
        IJSRuntime jsRuntime) : base(options)
    {
        raw.SetProvider(new SQLite3Provider_e_sqlite3());
        _moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
   "import", "./js/AllMyLinks.js").AsTask());
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>()
            .HasKey(t => new { t.Id });

        base.OnModelCreating(modelBuilder);
    }


    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.LogTo(Console.WriteLine, LogLevel.Error)
               .EnableDetailedErrors()
               .EnableSensitiveDataLogging(false);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var result = await base.SaveChangesAsync(cancellationToken);
        // #if RELEASE
        await PersistDatabaseAsync(cancellationToken);
        // #endif
        return result;
    }

    private async Task PersistDatabaseAsync(CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Start saving database");
        var module = await _moduleTask.Value;
        await module.InvokeVoidAsync("AML.syncDatabase", false, cancellationToken);
        Console.WriteLine("Finish save database");
    }

}

[Table(nameof(Person))]
public record Person : LongKeyedEntity
{
    public Person() { }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Date { get { return DateTime.Now.ToLongTimeString(); } }

    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public override string ToString()
    {
        return string.Concat(FirstName ?? "", " ", LastName ?? "");
    }
}