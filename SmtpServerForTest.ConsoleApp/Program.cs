using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using Toolbelt.Net.Smtp;

class Program
{
    static void Main(string[] args)
    {
        using (var app = new App())
        {
            app.Start();

            MailsController.App = app;

            for (; ; )
            {
                Console.WriteLine();
                Console.WriteLine("[O]pen UI / [Q]uit");
                switch (Console.ReadKey().KeyChar.ToString().ToUpper())
                {
                    case "O":
                        Process.Start(app.RootURLofAPI);
                        break;
                    case "Q": return;
                    default: break;
                }
            }
        }
    }
}
