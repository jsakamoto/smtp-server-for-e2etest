using System;

namespace Toolbelt.Net.Smtp.Services
{
    public class MessageEventArgs : EventArgs
    {
        public SmtpMessage Message { get; }

        public MessageEventArgs(SmtpMessage message)
        {
            this.Message = message;
        }
    }
}
