using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SQLite;
using Shakely;

public record LongKeyedEntity : IHasId<long>
{
    [PrimaryKey, AutoIncrement]
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; init; }
}
