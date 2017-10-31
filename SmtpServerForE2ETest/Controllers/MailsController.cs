using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace Toolbelt.Net.Smtp
{
    [Route("api/mails")]
    public class MailsController : Controller
    {
        private SmtpService SmtpService { get; }

        public MailsController(SmtpService smtpService)
        {
            this.SmtpService = smtpService;
        }

        [HttpGet]
        public IEnumerable<SmtpMessage> Get()
        {
            return this.SmtpService.GetAllMessages();
        }

        [HttpGet, Route("{id}")]
        public IActionResult Get(Guid id)
        {
            var mail = this.SmtpService.GetMessage(id);
            if (mail != null) return this.Ok(mail);
            else return this.NotFound();
        }

        [HttpDelete]
        public void Delete()
        {
            this.SmtpService.DeleteAllMessages();
        }

        [HttpDelete, Route("simple/{id}"), Route("{id}")]
        public void Delete(Guid id)
        {
            this.SmtpService.DeleteMessage(id);
        }

        [HttpGet, Route("simple")]
        public IEnumerable<object> GetSimpleFormat()
        {
            return this.Get().Select(a => a.ToSimpleFormat());
        }

        [HttpGet, Route("simple/{id}")]
        public IActionResult GetSimpleFormat(Guid id)
        {
            var mail = this.Get().FirstOrDefault(m => m.Id == id)?.ToSimpleFormat();
            if (mail != null) return this.Ok(mail);
            return this.NotFound();
        }

        [HttpGet, Route("{id}/attachments/{attachmentIndex}")]
        public IActionResult GetAttachment(Guid id, int attachmentIndex)
        {
            var msg = this.SmtpService.GetMessage(id);
            if (msg == null) return this.NotFound();
            if (msg.Attachments.Length >= attachmentIndex) return this.NotFound();

            var attachment = msg.Attachments[attachmentIndex];
            return File(attachment.ContentBytes, "application/octet-stream", attachment.Name);
        }
    }
}
