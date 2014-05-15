using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Toolbelt.Net.Smtp
{
    [RoutePrefix("api/mails")]
    public class MailsController : ApiController
    {
        [HttpGet]
        public IEnumerable<SmtpMessage> Get()
        {
            App.Current.WaiteForEndOfAllSessions();
            return Directory.GetFiles(App.Current.MailFolderPath, "*.eml")
                .Select(path => SmtpMessage.CreateFrom(path))
                .OrderByDescending(m => m.Date);
        }

        [HttpGet]
        [Route("{id}")]
        public SmtpMessage Get(Guid id)
        {
            App.Current.WaiteForEndOfAllSessions();
            return Directory.GetFiles(App.Current.MailFolderPath, "*.eml")
                .Select(path => SmtpMessage.CreateFrom(path))
                .First(a => a.Id == id);
        }

        [HttpDelete]
        [Route("simple/{id}")]
        [Route("{id}")]
        public void Delete(Guid id)
        {
            var pathToDelete = Directory.GetFiles(App.Current.MailFolderPath, "*.eml")
                .Select(path => new { path, SmtpMessage.CreateFrom(path).Id })
                .First(a => a.Id == id)
                .path;
            File.Delete(pathToDelete);
        }


        [Route("simple")]
        public IEnumerable<object> GetSimpleFormat()
        {
            return this.Get().Select(a => a.ToSimpleFormat());
        }

        [Route("simple/{id}")]
        public object GetSimpleFormat(Guid id)
        {
            App.Current.WaiteForEndOfAllSessions();
            return Directory.GetFiles(App.Current.MailFolderPath, "*.eml")
                .Select(path => SmtpMessage.CreateFrom(path))
                .Where(a => a.Id == id)
                .Select(a => a.ToSimpleFormat())
                .First();
        }

        [Route("{id}/attachments/{attachmentIndex}")]
        public IHttpActionResult GetAttachment(Guid id, int attachmentIndex)
        {
            var msg = this.Get(id);
            var attachment = msg.Attachments[attachmentIndex];
            //return this.Content(HttpStatusCode.OK, attachment.ContentBytes);
            return this.ResponseMessage(new HttpResponseMessage
            {
                Content = new ByteArrayContent(attachment.ContentBytes)
                {
                    Headers =
                    {
                        ContentType = new MediaTypeHeaderValue("application/octet-stream"),
                        ContentDisposition = new ContentDispositionHeaderValue("attatchment")
                        {
                            FileName = attachment.Name
                        }
                    },
                }
            });
        }

    }
}
