// Copyright (c) MudBlazor 2021
// MudBlazor licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using allmylinks.Services;
using allmylinks.Services.Notifications;
using Microsoft.AspNetCore.Components;

namespace allmylinks.Shared;

public partial class AppbarButtons
{
    [Inject] private INotificationService NotificationService { get; set; }
    [Inject] private LayoutService LayoutService { get; set; }
    private IDictionary<NotificationMessage, bool> _messages = null;
    private bool _newNotificationsAvailable = false;

    private async Task MarkNotificationAsRead()
    {
        await NotificationService.MarkNotificationsAsRead();
        _newNotificationsAvailable = false;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            _newNotificationsAvailable = await NotificationService.AreNewNotificationsAvailable();
            _messages = await NotificationService.GetNotifications();
            StateHasChanged();
        }

        await base.OnAfterRenderAsync(firstRender);
    }

}
