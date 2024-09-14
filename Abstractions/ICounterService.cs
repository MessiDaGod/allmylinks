using Stl.Fusion;

namespace allmylinks.Abstractions;
public interface ICounterService
{
    [ComputeMethod]
    Task<int> Get(CancellationToken cancellationToken = default);
    Task Increment(CancellationToken cancellationToken = default);
}