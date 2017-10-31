using System;

namespace Toolbelt.Net.Smtp
{
    public class AppEnvironment
    {
        public bool CanChangeAPIEndPoint { get; set; } = false;

        public bool CanChangeSMTPEndPoints { get; set; } = true;
    }
}
