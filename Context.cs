using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop;

namespace allmylinks;
public class Context : DbContext
{
    public DbSet<Person> Person { get; set; }
    private readonly Lazy<Task<IJSObjectReference>> _moduleTask;
    public Context(DbContextOptions<Context> options, IJSRuntime jsRuntime) : base(options)
    {
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
        await module.InvokeVoidAsync("AllMyLinks.syncDatabase", false, cancellationToken);
        Console.WriteLine("Finish save database");
    }

}

[Table(nameof(Person))]
public record Person
{
    [Key]
    public long Id {get; set; }
    public string? FirstName { get; set; } = null!;
    public string? LastName { get; set; } = null!;
    public string Date { get { return DateTime.Now.ToShortDateString(); } }
    public DateTime? StartDate { get; set; } = null!;

    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }
}