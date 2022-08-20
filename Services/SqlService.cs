using allmylinks.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Stl.Fusion.Authentication;

namespace allmylinks.Services;

public class SqlService : ISqlService
{

    public record PostCommand(string price, Session Session) : ISessionCommand<Price>
    {
        // Default constructor is needed for JSON deserialization
        public PostCommand() : this(null!, Session.Null) { }
    }

    public async Task<string> Get(string text)
    {
        return text;
    }
}

public interface ISqlService
{
    Task<string> Get(string text);
}
