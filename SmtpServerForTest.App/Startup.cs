using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using Toolbelt.Net.Smtp.Code;

namespace Toolbelt.Net.Smtp
{
    public class Startup
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            var config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            appBuilder.UseWebApi(config);
            appBuilder.UseFileServer(new FileServerOptions
            {
                EnableDirectoryBrowsing = false,
                FileSystem = new PhysicalFileSystem(@"C:\Projects\My\Lib\SmtpServer\SmtpServerForTest\SmtpServerForTest.App"),
                //FileSystem = new EmbeddedResourceFileSystem("Toolbelt.Net.Smtp")
                //FileSystem = new EmbededResourceFileSystem2("Toolbelt.Net.Smtp")
            });
        }
    }
}
