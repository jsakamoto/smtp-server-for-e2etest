var _;
(function (_) {
    var app = angular.module('SmtpServerForTest.UI.App');

    app.controller('MailsController', function ($scope, $rootScope, mailAPI, smtpServerHub) {
        var userSettings = JSON.parse(window.localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');

        mailAPI.query().then(function (mails) {
            return $scope.mails = mails;
        });

        smtpServerHub.onReceiveMessage(function (mail) {
            $scope.$apply(function () {
                $scope.mails.unshift(mail);
                if (userSettings.enableDesktopNotification) {
                    var notify = new Notification('You got a mail.', { body: mail.Subject, icon: '/favicon.png', tag: 'SmtpServerForTest' });
                    setTimeout(function () {
                        return notify.close();
                    }, 5000);
                }
            });
        });

        smtpServerHub.onRemoveMessage(function (mailId) {
            var mailToDelete = Enumerable.from($scope.mails).firstOrDefault(function (m) {
                return m.Id == mailId;
            });
            if (mailToDelete != null) {
                var index = $scope.mails.indexOf(mailToDelete);
                $scope.$apply(function () {
                    return $scope.mails.splice(index, 1);
                });
            }
        });

        var getSelectedMails = function () {
            return Enumerable.from($scope.mails).where(function (m) {
                return m.selected;
            });
        };

        var setCurrentMail = function () {
            var selectedMails = getSelectedMails();
            if (selectedMails.count() == 1)
                $scope.current = selectedMails.first();
            else
                $scope.current = null;
        };

        $scope.$watch(function () {
            return getSelectedMails().select(function (m) {
                return m.Id;
            }).toArray().join();
        }, setCurrentMail);

        $scope.hasSelected = function () {
            return getSelectedMails().count() > 0;
        };

        $scope.selectThis = function (index) {
            Enumerable.from($scope.mails).forEach(function (m) {
                m.selected = false;
            });
            $scope.mails[index].selected = true;
        };

        $scope.remove = function () {
            var selectedMails = getSelectedMails().toArray();
            Enumerable.from(selectedMails).forEach(function (m) {
                mailAPI.remove({ id: m.Id });
            });
        };
    });
})(_ || (_ = {}));
//# sourceMappingURL=app.mails-controller.js.map
