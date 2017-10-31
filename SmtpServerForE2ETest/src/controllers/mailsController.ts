namespace SmtpServerForE2ETest {

    class MailsController {

        public mails: SimplifiedMail[];

        public get selectedMail(): SimplifiedMail | null {
            let selectedMails = this.getSelectedMails();
            return selectedMails.length == 1 ? selectedMails[0] : null;
        }

        public get hasSelected(): boolean { return this.mails.some(m => m.selected); }

        constructor(
            $rootScope: ng.IRootScopeService,
            private mailAPI: MailAPIService,
            private mailEvents: MailEventsService
        ) {
            this.mails = mailAPI.query();
            $rootScope.$on('messageReceived', (ev, msg: SimplifiedMail) => this.onMessageReceived(msg));
            $rootScope.$on('messageDeleted', (ev, id: string) => this.onMessageDeleted(id));
        }

        private getSelectedMails(): SimplifiedMail[] {
            return this.mails.filter(m => m.selected);
        }

        public selectThis(mail: SimplifiedMail): void {
            this.mails.forEach(m => { m.selected = false });
            mail.selected = true;
        }

        public remove(): void {
            let selectedMails = this.getSelectedMails();
            selectedMails.forEach(m => m.$delete());
        }

        private onMessageReceived(message: SimplifiedMail): void {
            this.mails.unshift(this.mailAPI.attach(message));

            // TODO: Desktop notification
            //if (userSettings.enableDesktopNotification) {
            //    var notify = new Notification('You got a mail.', { body: mail.Subject, icon: '/favicon.png', tag: 'SmtpServerForTest' });
            //    setTimeout(() => notify.close(), 5000);
            //}
        }

        private onMessageDeleted(id: string): void {
            var index = this.mails.findIndex(m => m.id == id);
            if (index != -1) this.mails.splice(index, 1);
        }
    }

    app.controller('mailsController', MailsController);
}