using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
{
    public class ConfigController : ApiController
    {
        public AppConfig Get()
        {
            return App.Current.Config;
        }

        [HttpPost, HttpPut, HttpPatch]
        public void Put()
        {
            try
            {
                var content = this.Request.Content.ReadAsStringAsync().Result;
                var config = App.Current.Config;
                JsonConvert.PopulateObject(content, config);
                App.Current.Config = config;
            }
            catch (ObjectDisposedException) { return; }
        }
    }
}
