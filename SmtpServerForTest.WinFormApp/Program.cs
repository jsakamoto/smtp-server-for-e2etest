using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SmtpServerForTest.WinFormApp
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            using (var app = new Toolbelt.Net.Smtp.App())
            {
                app.Start();

                var mainForm = new MainForm();
                Application.Run(mainForm);

                app.Stop();
            }
        }
    }
}
