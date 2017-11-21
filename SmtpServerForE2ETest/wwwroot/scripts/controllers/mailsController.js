"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var MailsController = (function () {
        function MailsController($rootScope, userSettings, mailAPI, mailEvents) {
            var _this = this;
            this.userSettings = userSettings;
            this.mailAPI = mailAPI;
            this.mailEvents = mailEvents;
            this.mails = mailAPI.query();
            $rootScope.$on('messageReceived', function (ev, msg) { return _this.onMessageReceived(msg); });
            $rootScope.$on('messageDeleted', function (ev, id) { return _this.onMessageDeleted(id); });
        }
        Object.defineProperty(MailsController.prototype, "selectedMail", {
            get: function () {
                var selectedMails = this.getSelectedMails();
                return selectedMails.length == 1 ? selectedMails[0] : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailsController.prototype, "hasSelected", {
            get: function () { return this.mails.some(function (m) { return m.selected; }); },
            enumerable: true,
            configurable: true
        });
        MailsController.prototype.getSelectedMails = function () {
            return this.mails.filter(function (m) { return m.selected; });
        };
        MailsController.prototype.selectThis = function (mail) {
            this.mails.forEach(function (m) { m.selected = false; });
            mail.selected = true;
        };
        MailsController.prototype.remove = function () {
            var selectedMails = this.getSelectedMails();
            selectedMails.forEach(function (m) { return m.$delete(); });
        };
        MailsController.prototype.onMessageReceived = function (message) {
            this.mails.unshift(this.mailAPI.attach(message));
            if (this.mails.length == 1)
                this.mails[0].selected = true;
            // Desktop notification
            if (this.userSettings.settings.enableDesktopNotification) {
                var notify = new Notification('You got a mail.', { body: message.subject, icon: '/favicon.png', tag: 'SmtpServerForTest' });
                setTimeout(function () { return notify.close(); }, 5000);
            }
        };
        MailsController.prototype.onMessageDeleted = function (id) {
            var index = this.mails.findIndex(function (m) { return m.id == id; });
            if (index != -1)
                this.mails.splice(index, 1);
        };
        return MailsController;
    }());
    SmtpServerForE2ETest.app.controller('mailsController', MailsController);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=mailsController.js.map