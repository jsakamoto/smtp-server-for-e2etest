module _ {
    var app = angular.module('SmtpServerForTest.UI.App');

    interface $Scope extends ng.IScope {
        mails: { Id: string; selected: boolean; }[];
        current: any;
        hasSelected: () => boolean;
        selectThis: (a: number) => void;
        remove: () => void;
    }

    app.controller('MailsController', function ($scope: $Scope, $rootScope, mailAPI, smtpServerHub: SmtpServerHub) {

        var userSettings: { enableDesktopNotification: boolean } = JSON.parse(window.localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');

        mailAPI.query().then(mails => $scope.mails = mails);

        smtpServerHub.onReceiveMessage(mail => {
            $scope.$apply(() => {
                $scope.mails.unshift(mail);
                if (userSettings.enableDesktopNotification) {
                    var notify = new Notification('You got a mail.', { body: mail.Subject, icon:'/favicon.png', tag:'SmtpServerForTest' });
                    setTimeout(() => notify.close(), 5000);
                }
            });
        });

        var getSelectedMails = () => {
            return Enumerable.from($scope.mails)
                .where(m => m.selected);
        };

        var setCurrentMail = () => {
            var selectedMails = getSelectedMails();
            if (selectedMails.count() == 1)
                $scope.current = selectedMails.first();
            else
                $scope.current = null;
        };

        $scope.$watch(() => {
            return getSelectedMails()
                .select(m => m.Id)
                .toArray()
                .join();
        }, setCurrentMail);

        $scope.hasSelected = () => getSelectedMails().count() > 0;

        $scope.selectThis = (index) => {
            Enumerable.from($scope.mails).forEach(m => { m.selected = false; });
            $scope.mails[index].selected = true;
        };

        $scope.remove = () => {
            var selectedMails = getSelectedMails().toArray();
            Enumerable.from(selectedMails)
                .forEach(m => {
                    mailAPI.remove({ id: m.Id })
                        .then(() => {
                            var index = $scope.mails.indexOf(m);
                            $scope.mails.splice(index, 1);
                        });
                });
        };
    });
}