using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using Microsoft.Owin.Hosting;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
{
    using SignalR = Microsoft.AspNet.SignalR;

    public class App : IDisposable
    {
        public AppConfig Config { get; set; }

        public string DataPath
        {
            get
            {
                var dataPath = "Toolbelt.Net.Smtp.SmtpServerForTest";
                var dataFullPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), dataPath);
                if (!Directory.Exists(dataFullPath)) Directory.CreateDirectory(dataFullPath);
                return dataFullPath;
            }
        }

        public string ConfigPath { get { return Path.Combine(this.DataPath, "config.json"); } }

        public string MailFolderPath
        {
            get
            {
                var path = Path.Combine(this.DataPath, "mails");
                if (!Directory.Exists(path)) Directory.CreateDirectory(path);
                return path;
            }
        }

        public App()
        {
            this.Config = new AppConfig();
            if (File.Exists(this.ConfigPath))
            {
                JsonConvert.PopulateObject(File.ReadAllText(this.ConfigPath), this.Config);
            }
            else
            {
                SaveConfig();
            }
        }

        private IDisposable _httpHost;

        private SmtpServerCore _smtpHost;

        public void Start()
        {
            lock (this)
            {
                if (_httpHost == null)
                {
                    var baseAddress = string.Format("http://{0}:{1}/", this.Config.ApiEndPoint.Address, this.Config.ApiEndPoint.Port);
                    _httpHost = WebApp.Start<Startup>(url: baseAddress);
                }
                if (_smtpHost == null)
                {
                    _smtpHost = new SmtpServerCore(
                        this.Config.SmtpEndPoints.Select(ep => ep.ToIPEndPoint())
                        );
                    _smtpHost.ReceiveMessage += OnReceiveMessage;
                    _smtpHost.Start();
                }
            }
        }

        protected virtual void OnReceiveMessage(object sender, ReceiveMessageEventArgs e)
        {
            var msg = e.Message;
            var saveToPath = Path.Combine(this.MailFolderPath, msg.Id.ToString("N") + ".eml");
            msg.SaveAs(saveToPath);

            // notify via SignalR
            var hubContext = SignalR.GlobalHost.ConnectionManager.GetHubContext<SmtpServerHub>();
            SmtpServerHub.NotifyReceiveMessage(msg, hubContext.Clients);
        }

        public void Stop()
        {
            lock (this)
            {
                if (_httpHost != null)
                {
                    _httpHost.Dispose();
                    _httpHost = null;
                }
                if (_smtpHost != null)
                {
                    _smtpHost.Stop();
                    _smtpHost.Dispose();
                    _smtpHost = null;
                }
            }
        }

        public void Dispose()
        {
            this.Stop();
            SaveConfig();
        }

        private void SaveConfig()
        {
            File.WriteAllText(this.ConfigPath, this.Config.ToJson());
        }

        public string RootURLofAPI
        {
            get
            {
                return string.Format("http://{0}:{1}/",
                    this.Config.ApiEndPoint.Address,
                    this.Config.ApiEndPoint.Port);
            }
        }
    }
}
