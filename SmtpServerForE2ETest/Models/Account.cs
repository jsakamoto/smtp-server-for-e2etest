using System;
using System.Net;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
{
    public class Account
    {
        public string Name { get; set; }

        public string Password { get; set; }

        public NetworkCredential ToNetworkCredential() => new NetworkCredential(this.Name, this.Password);

        public override string ToString() => JsonConvert.SerializeObject(this);
    }
}
