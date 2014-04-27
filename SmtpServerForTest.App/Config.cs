using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;

namespace Toolbelt.Net.Smtp
{
    public class AppConfig
    {
        public class EndPoint
        {
            public string Address { get; set; }

            public int Port { get; set; }

            public EndPoint()
            {
                this.Address = "";
            }

            public EndPoint(string address, int port)
            {
                this.Address = address;
                this.Port = port;
            }

            public IPEndPoint ToIPEndPoint()
            {
                return new IPEndPoint(IPAddress.Parse(this.Address), this.Port);
            }

            public override string ToString()
            {
                return this.ToJson();
            }
        }

        public EndPoint[] SmtpEndPoints { get; set; }

        public EndPoint ApiEndPoint { get; set; }

        public AppConfig()
        {
            this.SmtpEndPoints = new[] { 
                new EndPoint("127.0.0.1", 25),
                new EndPoint("127.0.0.1", 587),
                new EndPoint("::1", 25),
                new EndPoint("::1", 587)
            };
            
            this.ApiEndPoint = new EndPoint("localhost", 8025);
        }
    }
}
