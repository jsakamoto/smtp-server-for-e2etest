using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;
using Microsoft.Owin.Cors;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
namespace Toolbelt.Net.Smtp
{
    public class Startup
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            appBuilder.UseCors(CorsOptions.AllowAll);

            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            appBuilder.UseWebApi(config);

            appBuilder.MapSignalR();

            ConfigureFileServer(appBuilder);
        }

#if DEBUG
        private void ConfigureFileServer(IAppBuilder app)
        {
            var slnDir = EnumContainerDir().FirstOrDefault(dir => Directory.GetFiles(dir, "*.sln").Any());
            var projDir = Path.Combine(slnDir, "SmtpServerForTest.App");
            app.UseFileServer(new FileServerOptions
            {
                EnableDirectoryBrowsing = false,
                FileSystem = new PhysicalFileSystem(projDir),
            });
        }

        public IEnumerable<string> EnumContainerDir()
        {
            var dir = AppDomain.CurrentDomain.BaseDirectory;
            while (dir != null)
            {
                yield return dir;
                dir = Path.GetDirectoryName(dir);
            }
        }
#else
        private void ConfigureFileServer(IAppBuilder app)
        {
            var fileSystem = new EmbeddedResourceFileSystem2("Toolbelt.Net.Smtp");
            //var fileSystem = new EmbeddedResourceFileSystem("Toolbelt.Net.Smtp");
            app.UseDefaultFiles(new DefaultFilesOptions
            {
                DefaultFileNames = new[] { "index.html" }.ToList(),
                FileSystem = fileSystem
            });
            app.UseStaticFiles(new StaticFileOptions
            {
                FileSystem = fileSystem
            });
        }
#endif
    }
}
