using RestEase;

namespace allmylinks.Abstractions;

[BasePath("counter")]
public interface ICounterClientDef
{
    [Post("increment")]
    Task Increment(CancellationToken cancellationToken = default);

    [Get("get")]
    Task<int> Get(CancellationToken cancellationToken = default);
}