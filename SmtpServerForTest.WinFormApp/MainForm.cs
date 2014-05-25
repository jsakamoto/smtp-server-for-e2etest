using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace SmtpServerForTest.WinFormApp
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
            this.Hide();
        }

        private void quitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void MainForm_Shown(object sender, EventArgs e)
        {
            this.Hide();
            this.notifyIcon1.ShowBalloonTip(3);
        }

        private void openUIConfigurationToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Process.Start(Toolbelt.Net.Smtp.App.Current.RootURLofAPI);
        }
    }
}
