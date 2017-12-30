module _ {
    var app = angular.module('SmtpServerForTest.UI.App');

    interface $Scope extends ng.IScope {
        mails: { Id: string; selected: boolean; }[];
        current: any;
        hasSelected: () => boolean;
        selectThis: (a: number) => void;
        remove: () => void;
    }

    app.controller('MailsController', function ($scope: $Scope, $rootScope, mailAPI, smtpServerHub: ISmtpServerHub) {

        var userSettings: { enableDesktopNotification: boolean } = JSON.parse(window.localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');

        mailAPI.query().then((mails: any) => $scope.mails = mails);

        smtpServerHub.onReceiveMessage((mail: any) => {
            $scope.$apply(() => {
                $scope.mails.unshift(mail);
                if (userSettings.enableDesktopNotification) {
                    var notify = new Notification('You got a mail.', { body: mail.Subject, icon: '/favicon.png', tag: 'SmtpServerForTest' });
                    setTimeout(() => notify.close(), 5000);
                }
            });
        });

        smtpServerHub.onRemoveMessage((mailId: string) => {
            var mailToDelete = $scope.mails.filter(m => m.Id == mailId).pop();
            if (mailToDelete != null) {
                var index = $scope.mails.indexOf(mailToDelete);
                $scope.$apply(() => $scope.mails.splice(index, 1));
            }
        });

        var getSelectedMails = () => {
            return $scope.mails.filter(m => m.selected);
        };

        var setCurrentMail = () => {
            var selectedMails = getSelectedMails();
            if (selectedMails.length == 1)
                $scope.current = selectedMails[0];
            else
                $scope.current = null;
        };

        $scope.$watch(() => {
            return getSelectedMails()
                .map(m => m.Id)
                .join();
        }, setCurrentMail);

        $scope.hasSelected = () => getSelectedMails().length > 0;

        $scope.selectThis = (index) => {
            $scope.mails.forEach(m => { m.selected = false; });
            $scope.mails[index].selected = true;
        };

        $scope.remove = () => {
            var selectedMails = getSelectedMails();
            selectedMails.forEach(m => { mailAPI.remove({ id: m.Id }); });
        };
    });
}