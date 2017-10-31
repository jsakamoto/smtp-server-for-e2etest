using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Toolbelt.Net.Smtp
{
    public static class SmtpServerHubExtension
    {
        public static Task NotifyMessageReceived(this IHubContext<SmtpServerHub> hub, SmtpMessage message)
        {
            return hub.Clients.All.InvokeAsync("messageReceived", message.ToSimpleFormat());
        }

        public static Task NotifyMessageDeleted(this IHubContext<SmtpServerHub> hub, SmtpMessage message)
        {
            return hub.Clients.All.InvokeAsync("messageDeleted", message.Id);
        }
    }
}
