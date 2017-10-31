using System;
using System.Linq;
using System.Net;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
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

        public IPEndPoint[] ToIPEndPoints()
        {
            var ipAddresses =
                this.Address == "+" || this.Address == "*" || this.Address == "any" ? new[] { IPAddress.Any, IPAddress.IPv6Any } :
                this.Address == "0.0.0.0" ? new[] { IPAddress.Any } :
                this.Address == "::0" ? new[] { IPAddress.IPv6Any } :
                Dns.GetHostAddresses(this.Address);

            return ipAddresses
                .Select(adr => new IPEndPoint(adr, this.Port))
                .ToArray();
        }

        public override string ToString() => JsonConvert.SerializeObject(this);


        public static EndPoint Parse(string endPointText)
        {
            var parts = endPointText.Split(':');
            return new EndPoint { Address = parts[0], Port = int.Parse(parts[1]) };
        }
    }
}
