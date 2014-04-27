using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Toolbelt.Net.Smtp
{
    public class ValuesController : ApiController
    {
        public int[] Get()
        {
            return new[] { 1, 2, 3 };
        }
    }
}
