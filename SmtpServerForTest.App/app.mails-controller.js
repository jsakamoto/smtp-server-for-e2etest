var _;
(function (_) {
    var app = angular.module('SmtpServerForTest.UI.App');

    app.controller('MailsController', function ($scope, $rootScope, mailAPI, smtpServerHub) {
        $rootScope.foo = "bar";

        mailAPI.query().then(function (mails) {
            return $scope.mails = mails;
        });

        smtpServerHub.onReceiveMessage(function (mail) {
            $scope.$apply(function () {
                return $scope.mails.unshift(mail);
            });
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
                mailAPI.remove({ id: m.Id }).then(function () {
                    var index = $scope.mails.indexOf(m);
                    $scope.mails.splice(index, 1);
                });
            });
        };
    });
})(_ || (_ = {}));
//# sourceMappingURL=app.mails-controller.js.map
