using System;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
{
    public class AppConfigService
    {
        public AppEnvironment Environment { get; }

        public string ConfigFolderPath { get; }

        public string ConfigFilePath => Path.Combine(ConfigFolderPath, "config.json");

        public AppConfig AppConfig { get; }

        public event EventHandler AppConfigChanged;

        public AppConfigService(string configFolderPath, IConfiguration config)
        {
            this.Environment = new AppEnvironment();
            this.AppConfig = new AppConfig();
            this.ConfigFolderPath = configFolderPath;

            if (!Directory.Exists(configFolderPath)) Directory.CreateDirectory(configFolderPath);
            if (File.Exists(this.ConfigFilePath))
            {
                var configJson = File.ReadAllText(this.ConfigFilePath);
                JsonConvert.PopulateObject(configJson, this.AppConfig);
            }

            var envSmtpEndPoints = config.GetValue("SMTPEndPoints", "");
            if (envSmtpEndPoints != "")
            {
                this.Environment.CanChangeSMTPEndPoints = false;
                this.AppConfig.SmtpEndPoints = envSmtpEndPoints
                    .Split(',')
                    .Select(text => EndPoint.Parse(text))
                    .ToArray();
            }
        }

        public void Update(string configJson)
        {
            var before = JsonConvert.SerializeObject(this.AppConfig);
            JsonConvert.PopulateObject(configJson, this.AppConfig);
            var after = JsonConvert.SerializeObject(this.AppConfig);
            if (before != after)
            {
                this.Save();
                this.AppConfigChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public void Save()
        {
            var configJson = JsonConvert.SerializeObject(this.AppConfig);
            File.WriteAllText(this.ConfigFilePath, configJson);
        }
    }
}