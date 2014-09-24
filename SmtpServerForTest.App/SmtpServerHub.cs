using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Toolbelt.Net.Smtp
{
    public class SmtpServerHub : Hub
    {
        public static void NotifyReceiveMessage(SmtpMessage message, IHubConnectionContext clients)
        {
            clients.All.ReceiveMessage(message.ToSimpleFormat());
        }

        public static void NotifyRemoveMessage(Guid mailId, IHubConnectionContext clients)
        {
            clients.All.RemoveMessage(mailId);
        }
    }
}
