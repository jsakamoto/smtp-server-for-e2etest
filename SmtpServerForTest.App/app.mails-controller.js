"use strict";
var _;
(function (_) {
    var app = angular.module('SmtpServerForTest.UI.App');
    app.controller('MailsController', function ($scope, $rootScope, mailAPI, smtpServerHub) {
        var userSettings = JSON.parse(window.localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');
        mailAPI.query().then(function (mails) { return $scope.mails = mails; });
        smtpServerHub.onReceiveMessage(function (mail) {
            $scope.$apply(function () {
                $scope.mails.unshift(mail);
                if (userSettings.enableDesktopNotification) {
                    var notify = new Notification('You got a mail.', { body: mail.Subject, icon: '/favicon.png', tag: 'SmtpServerForTest' });
                    setTimeout(function () { return notify.close(); }, 5000);
                }
            });
        });
        smtpServerHub.onRemoveMessage(function (mailId) {
            var mailToDelete = $scope.mails.filter(function (m) { return m.Id == mailId; }).pop();
            if (mailToDelete != null) {
                var index = $scope.mails.indexOf(mailToDelete);
                $scope.$apply(function () { return $scope.mails.splice(index, 1); });
            }
        });
        var getSelectedMails = function () {
            return $scope.mails.filter(function (m) { return m.selected; });
        };
        var setCurrentMail = function () {
            var selectedMails = getSelectedMails();
            if (selectedMails.length == 1)
                $scope.current = selectedMails[0];
            else
                $scope.current = null;
        };
        $scope.$watch(function () {
            return getSelectedMails()
                .map(function (m) { return m.Id; })
                .join();
        }, setCurrentMail);
        $scope.hasSelected = function () { return getSelectedMails().length > 0; };
        $scope.selectThis = function (index) {
            $scope.mails.forEach(function (m) { m.selected = false; });
            $scope.mails[index].selected = true;
        };
        $scope.remove = function () {
            var selectedMails = getSelectedMails();
            selectedMails.forEach(function (m) { mailAPI.remove({ id: m.Id }); });
        };
    });
})(_ || (_ = {}));
//# sourceMappingURL=app.mails-controller.js.map