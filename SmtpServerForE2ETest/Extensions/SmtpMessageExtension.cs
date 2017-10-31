using System;
using System.Linq;

namespace Toolbelt.Net.Smtp
{
    public static class SmtpMessageExtension
    {
        public static object ToSimpleFormat(this SmtpMessage msg)
        {
            return new
            {
                msg.Id,
                From = msg.From != null ? msg.From.ToString() : "",
                To = msg.To.Select(_ => _.ToString()).ToArray(),
                CC = msg.CC.Select(_ => _.ToString()).ToArray(),
                msg.Subject,
                msg.Date,
                msg.Body,
                Attachments = msg.Attachments.Select(_ => _.Name).ToArray()
            };
        }
    }
}
