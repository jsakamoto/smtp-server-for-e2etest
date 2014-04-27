using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Toolbelt.Net.Smtp;

namespace SmtpServerForTest.App.Test
{
    [TestClass]
    public class Config_EndPointTest
    {
        [TestMethod]
        public void ToIPEndPointTest()
        {
            var ipEndPoint = new AppConfig.EndPoint("127.0.0.1", 25).ToIPEndPoint();
            ipEndPoint.AddressFamily.Is(AddressFamily.InterNetwork);
            ipEndPoint.Port.Is(25);
            ipEndPoint.Address.ToString().Is("127.0.0.1");
        }
    }
}
