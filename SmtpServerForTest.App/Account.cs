using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Toolbelt.Net.Smtp
{
    public class Account
    {
        public string Name { get; set; }

        public string Password { get; set; }

        public NetworkCredential ToNetworkCredential()
        {
            return new NetworkCredential(this.Name, this.Password);
        }
    
        public override string ToString()
        {
            return this.ToJson();
        }
    }
}
