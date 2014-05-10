using System;
using System.Linq;
using System.Web.Http;
using Microsoft.Owin.Cors;
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
            appBuilder.UseCors(CorsOptions.AllowAll);

            var config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            appBuilder.UseWebApi(config);

            appBuilder.MapSignalR();

            //appBuilder.UseStaticFiles(new StaticFileOptions
            //{
            //    FileSystem = new EmbededResourceFileSystem2("Toolbelt.Net.Smtp")
            //});
            appBuilder.UseFileServer(new FileServerOptions
            {
                EnableDirectoryBrowsing = false,
                FileSystem = new PhysicalFileSystem(@"C:\Projects\My\Lib\SmtpServer\SmtpServerForTest\SmtpServerForTest.App"),
                //FileSystem = new EmbeddedResourceFileSystem("Toolbelt.Net.Smtp")
            });
        }
    }
}
