using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Sockets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Toolbelt.Net.Smtp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            services.AddSingleton(this.Configuration);
            services.AddMvc();
            services.AddSignalR();

            var baseDir = AppDomain.CurrentDomain.BaseDirectory;
            var smtpService = new SmtpService(
                mailFolderPath: Path.Combine(baseDir, "mails")
            );
            services.AddSingleton(smtpService);

            var appConfigService = new AppConfigService(
                configFolderPath: Path.Combine(baseDir, "config"),
                config: Configuration
            );
            services.AddSingleton(appConfigService);

            // https://stackoverflow.com/questions/27299289/how-to-get-signalr-hub-context-in-a-asp-net-core
            // https://stackoverflow.com/questions/37318209/asp-net-core-rc2-signalr-hub-context-outside-request-thread
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSignalR(routes =>
            {
                routes.MapHub<SmtpServerHub>("events");
            });
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();

            var services = app.ApplicationServices;
            var smtpServerHubContext = services.GetService<IHubContext<SmtpServerHub>>();

            var appConfigService = services.GetService<AppConfigService>();


            var smtpService = services.GetService<SmtpService>();
            smtpService.SetConfig(appConfigService);
            smtpService.MessageReceived += (sender, args) => smtpServerHubContext.NotifyMessageReceived(args.Message);
            smtpService.MessageDeleted += (sender, args) => smtpServerHubContext.NotifyMessageDeleted(args.Message);
            smtpService.Start();
        }
    }
}
