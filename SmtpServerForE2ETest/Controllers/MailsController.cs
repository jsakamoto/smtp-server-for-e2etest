using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Toolbelt.Net.Smtp
{
    /// <summary>
    /// blur blur
    /// </summary>
    [Route("api/mails"), EnableCors(CorsPolicy.Any)]
    public class MailsController : Controller
    {
        private SmtpService SmtpService { get; }

        public MailsController(SmtpService smtpService)
        {
            this.SmtpService = smtpService;
        }

        /// <summary>
        /// Retrieve all stocked mail messages.
        /// </summary>
        [HttpGet]
        public IEnumerable<SmtpMessage> Get()
        {
            return this.SmtpService.GetAllMessages();
        }

        /// <summary>
        /// Get the stocked mail message of specified id.
        /// </summary>
        [HttpGet, Route("{id}")]
        public IActionResult Get(Guid id)
        {
            var mail = this.SmtpService.GetMessage(id);
            if (mail != null) return this.Ok(mail);
            else return this.NotFound();
        }

        /// <summary>
        /// Delete all of the stocked mail messages.
        /// </summary>
        [HttpDelete]
        public void Delete()
        {
            this.SmtpService.DeleteAllMessages();
        }

        /// <summary>
        /// Delete the stocked mail message of specified id.
        /// </summary>
        [HttpDelete, Route("simple/{id}"), Route("{id}")]
        public void Delete(Guid id)
        {
            this.SmtpService.DeleteMessage(id);
        }

        /// <summary>
        /// Get all stocked mail message with simplified format.
        /// </summary>
        [HttpGet, Route("simple")]
        public IEnumerable<object> GetSimpleFormat()
        {
            return this.Get().Select(a => a.ToSimpleFormat());
        }

        /// <summary>
        /// Get the stocked mail message of specified id with simplified format.
        /// </summary>
        [HttpGet, Route("simple/{id}")]
        public IActionResult GetSimpleFormat(Guid id)
        {
            var mail = this.Get().FirstOrDefault(m => m.Id == id)?.ToSimpleFormat();
            if (mail != null) return this.Ok(mail);
            return this.NotFound();
        }

        /// <summary>
        /// Get the attached file in the stocked mail message of specified mail and attachment id.
        /// </summary>
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
