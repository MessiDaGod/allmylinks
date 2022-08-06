using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

public class CustomEventHelper
{
    private readonly Func<EventArgs, Task> _callback;

    public CustomEventHelper(Func<EventArgs, Task> callback)
    {
        _callback = callback;
    }

    [JSInvokable]
    public Task OnCustomEvent(EventArgs args) => _callback(args);
}

public class CustomEventInterop : IDisposable
{
    private readonly IJSRuntime _jsRuntime;
    private DotNetObjectReference<CustomEventHelper> Reference;

    public CustomEventInterop(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }



    public void Dispose()
    {
        Reference?.Dispose();
    }
}