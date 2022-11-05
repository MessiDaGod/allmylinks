using allmylinks.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Stl.Fusion.Authentication;

namespace allmylinks.Services;

public class SqlService : ISqlService
{

    public record PostCommand(string text, Session Session) : ISessionCommand<QueryEditor>
    {
        // Default constructor is needed for JSON deserialization
        public PostCommand() : this(null!, Session.Null) { }
    }

    public virtual async Task<string> Get(string text)
    {
        string result = string.Empty;
        await Task.Run(() => result = text).ConfigureAwait(false);
        return result;
    }
}

public interface ISqlService
{
    Task<string> Get(string text);
}
