
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace allmylinks.Services.Notifications;

public interface INotificationService
{
    Task<bool> AreNewNotificationsAvailable();
    Task MarkNotificationsAsRead();
    Task MarkNotificationsAsRead(string id);

    Task<NotificationMessage> GetMessageById(string id);
    Task<IDictionary<NotificationMessage,bool>> GetNotifications();
    Task AddNotification(NotificationMessage message);
}