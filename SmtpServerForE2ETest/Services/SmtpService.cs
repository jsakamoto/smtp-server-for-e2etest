using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Toolbelt.Net.Smtp.Services;

namespace Toolbelt.Net.Smtp
{
    public class SmtpService : IDisposable
    {
        public string MailFolderPath { get; }

        public event EventHandler<MessageEventArgs> MessageDeleted;

        public event EventHandler<MessageEventArgs> MessageReceived;

        private SmtpServerCore SmtpServer { get; set; }

        private AppConfigService AppConfigService { get; set; }

        public SmtpService(string mailFolderPath)
        {
            this.MailFolderPath = mailFolderPath;
            if (!Directory.Exists(mailFolderPath)) Directory.CreateDirectory(mailFolderPath);
        }

        public void Start()
        {
            var appConfig = this.AppConfigService.AppConfig;
            var endPoints = appConfig.SmtpEndPoints.SelectMany(ep => ep.ToIPEndPoints());
            var credentials = appConfig.EnableSMTPAuth ?
                appConfig.Accounts.Select(a => a.ToNetworkCredential()) :
                Enumerable.Empty<NetworkCredential>();

            this.SmtpServer = new SmtpServerCore(endPoints, credentials);
            this.SmtpServer.ReceiveMessage += SmtpServer_ReceiveMessage;
            this.SmtpServer.Start();
        }

        public void Restart()
        {
            this.ShutdownSmtpServer();
            this.Start();
        }

        private void SmtpServer_ReceiveMessage(object sender, ReceiveMessageEventArgs args)
        {
            var saveToPath = Path.Combine(this.MailFolderPath, args.Message.Id + ".eml");
            args.Message.SaveAs(saveToPath);

            this.MessageReceived?.Invoke(this, new MessageEventArgs(args.Message));
        }

        private void WaiteForEndOfAllSessions()
        {
            // TODO: throw new NotImplementedException();
        }

        public IEnumerable<SmtpMessage> GetAllMessages()
        {
            this.WaiteForEndOfAllSessions();

            return Directory.GetFiles(this.MailFolderPath, "*.eml")
                .Select(path => SmtpMessage.CreateFrom(path))
                .OrderByDescending(m => m.Date);
        }


        public SmtpMessage GetMessage(Guid id)
        {
            this.WaiteForEndOfAllSessions();

            return this.GetAllMessages().FirstOrDefault(a => a.Id == id);
        }

        public void DeleteAllMessages()
        {
            Directory.GetFiles(this.MailFolderPath, "*.eml")
                .Select(path => new { path, message = SmtpMessage.CreateFrom(path) })
                .ToList()
                .ForEach(m =>
                {
                    File.Delete(m.path);
                    this.MessageDeleted?.Invoke(this, new MessageEventArgs(m.message));
                });
        }

        public void DeleteMessage(Guid id)
        {
            var target = Directory.GetFiles(this.MailFolderPath, "*.eml")
                .Select(path => new { path, message = SmtpMessage.CreateFrom(path) })
                .First(a => a.message.Id == id);
            File.Delete(target.path);

            this.MessageDeleted?.Invoke(this, new MessageEventArgs(target.message));
        }

        public void SetConfig(AppConfigService appConfigService)
        {
            DetachAppConfigChangedEventHandler();

            this.AppConfigService = appConfigService;
            this.AppConfigService.AppConfigChanged += AppConfigService_AppConfigChanged;
        }

        private void DetachAppConfigChangedEventHandler()
        {
            if (this.AppConfigService != null)
                this.AppConfigService.AppConfigChanged -= AppConfigService_AppConfigChanged;
        }

        private void AppConfigService_AppConfigChanged(object sender, EventArgs e)
        {
            this.Restart();
        }

        public void Dispose()
        {
            ShutdownSmtpServer();
            DetachAppConfigChangedEventHandler();
        }

        private void ShutdownSmtpServer()
        {
            if (this.SmtpServer != null)
            {
                if (this.SmtpServer.IsRunning) this.SmtpServer.Stop();
                this.SmtpServer.ReceiveMessage -= SmtpServer_ReceiveMessage;
                this.SmtpServer.Dispose();
                this.SmtpServer = null;
            }
        }
    }
}
