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
    using System.Net;
    using SignalR = Microsoft.AspNet.SignalR;

    public class App : IDisposable
    {
        public static App Current { get; private set; }

        protected AppConfig _Config;

        public AppConfig Config
        {
            get { return _Config; }
            set { _Config = value; this.SaveConfig(); this.RestartSmtpHostIfRunning(); }
        }

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
            App.Current = this;
            var config = new AppConfig();
            if (File.Exists(this.ConfigPath))
            {
                JsonConvert.PopulateObject(File.ReadAllText(this.ConfigPath), config);
            }
            this.Config = config;
        }

        protected IDisposable _httpHost;

        protected SmtpServerCore _smtpHost;

        public void Start()
        {
            lock (this)
            {
                StartHttpHost();
                StartSmtpHost();
            }
        }

        protected void StartHttpHost()
        {
            if (_httpHost == null)
            {
                var baseAddress = string.Format("http://{0}:{1}/", this.Config.ApiEndPoint.Address, this.Config.ApiEndPoint.Port);
                _httpHost = WebApp.Start<Startup>(url: baseAddress);
            }
        }

        protected void StartSmtpHost()
        {
            if (_smtpHost == null)
            {
                var credentials =
                    this.Config.EnableSMTPAuth ?
                    this.Config.Accounts.Select(a => a.ToNetworkCredential()) :
                    Enumerable.Empty<NetworkCredential>();
                _smtpHost = new SmtpServerCore(
                    this.Config.SmtpEndPoints.Select(ep => ep.ToIPEndPoint()),
                    credentials);

                _smtpHost.ReceiveMessage += OnReceiveMessage;
                _smtpHost.Start();
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
                StopHttpHost();
                StopSmtpHost();
            }
        }

        public void WaiteForEndOfAllSessions()
        {
            if (this._smtpHost != null)
            {
                this._smtpHost.WaiteForEndOfAllSessions();
            }
        }

        protected void StopHttpHost()
        {
            if (_httpHost != null)
            {
                _httpHost.Dispose();
                _httpHost = null;
            }
        }

        protected void StopSmtpHost()
        {
            if (_smtpHost != null)
            {
                _smtpHost.Stop();
                _smtpHost.Dispose();
                _smtpHost = null;
            }
        }

        protected void RestartSmtpHostIfRunning()
        {
            lock (this)
            {
                if (_smtpHost != null)
                {
                    StopSmtpHost();
                    StartSmtpHost();
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
