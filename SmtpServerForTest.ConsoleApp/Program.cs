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

            Console.WriteLine();
            for (; ; )
            {
                Console.WriteLine("[O]pen UI / [Q]uit");
                var key = Console.ReadKey(intercept: true).KeyChar.ToString().ToUpper();
                Console.WriteLine(key);
                Console.WriteLine();
                switch (key)
                {
                    case "O":
                        Process.Start(app.RootURLofAPI);
                        break;
                    case "Q":
                        Console.WriteLine("Stoping...");
                        app.Stop();
                        Console.WriteLine("Stoped.");
                        return;
                    default: break;
                }
            }
        }
    }
}
