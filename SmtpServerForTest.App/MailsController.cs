using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Toolbelt.Net.Smtp
{
    public class MailsController : ApiController
    {
        public static App App { get; set; }

        public IEnumerable<SmtpMessage> Get()
        {
            return Directory.GetFiles(App.MailFolderPath, "*.eml")
                .Select(path => SmtpMessage.CreateFrom(path))
                .OrderByDescending(m => m.Date);
        }

        public SmtpMessage Get(Guid id)
        {
            return Directory.GetFiles(App.MailFolderPath, "*.eml")
                .Select(path => SmtpMessage.CreateFrom(path))
                .First(a => a.Id == id);
        }

        public void Delete(Guid id)
        {
            var pathToDelete = Directory.GetFiles(App.MailFolderPath, "*.eml")
                .Select(path => new { path, SmtpMessage.CreateFrom(path).Id })
                .First(a => a.Id == id)
                .path;
            File.Delete(pathToDelete);
        }
    }
}
