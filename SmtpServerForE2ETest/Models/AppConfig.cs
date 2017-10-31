using System;
using System.Net;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
{
    public class AppConfig
    {
        public EndPoint[] SmtpEndPoints { get; set; }

        public EndPoint ApiEndPoint { get; set; }

        public bool EnableSMTPAuth { get; set; }

        public Account[] Accounts { get; set; }

        public AppConfig()
        {
            this.SmtpEndPoints = new[] {
                new EndPoint("127.0.0.1", 25),
                new EndPoint("127.0.0.1", 587),
                new EndPoint("::1", 25),
                new EndPoint("::1", 587)
            };

            this.ApiEndPoint = new EndPoint("localhost", 8025);
            this.EnableSMTPAuth = true;
            this.Accounts = new Account[0];
        }
    }
}
