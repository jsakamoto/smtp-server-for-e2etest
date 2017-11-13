using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Swashbuckle.AspNetCore.Swagger;

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

            services.AddSwaggerGen(option =>
            {
                var xdocPath = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "SmtpServerForE2ETest.xml");
                option.IncludeXmlComments(xdocPath);
                option.SwaggerDoc("v1", new Info { Title = "SMTP Server for E2E Test Web API", Version = "v1" });
            });

            var baseDir = GetBaseDir();
            var smtpService = new SmtpService(
                mailFolderPath: Path.Combine(baseDir, "mails")
            );
            services.AddSingleton(smtpService);

            var appConfigService = new AppConfigService(
                configFolderPath: baseDir,
                config: Configuration
            );
            services.AddSingleton(appConfigService);
        }

        private string GetBaseDir()
        {
            var defaultBaseDir = default(string);
            if (Environment.OSVersion.Platform.ToString().ToLower().StartsWith("win"))
            {
                defaultBaseDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Toolbelt.Net.Smtp.SmtpServerForTest");
            }
            else
            {
                defaultBaseDir = Path.Combine(Path.DirectorySeparatorChar.ToString(), "var", "smtpe2etest");
            }
            var baseDir = Configuration.GetValue("BASEDIR", defaultBaseDir);
            return baseDir;
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
            app.UseSwagger();
            app.UseSwaggerUI(option =>
            {
                option.SwaggerEndpoint("/swagger/v1/swagger.json", "This API allows you to manipulate stocked e-mail messages, and configure this Fake SMTP service.");
            });
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
