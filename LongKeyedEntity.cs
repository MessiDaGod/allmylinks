using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shakely;
using SQLite;

public record LongKeyedEntity : IHasId<long>
{
    [PrimaryKey, AutoIncrement]
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; init; }
}
