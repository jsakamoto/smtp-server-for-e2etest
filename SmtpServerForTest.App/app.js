var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource', 'ngAnimate']);

app.factory('mailAPI', function ($resource) {
    return $resource('/api/mails/:id', { id: '@Id' });
});

app.controller('MailsViewCtrl', function ($scope, mails, smtpServerHub, mailAPI) {
    $scope.mails = mails;
    smtpServerHub.onReceiveMessage(function (mail) {
        $scope.$apply(function () { $scope.mails.unshift(mail); });
    });

    $scope.hasSelected = function () {
        var hasSelected = false;
        $.each($scope.mails, function () { hasSelected |= this.selected; });
        return hasSelected;
    };

    $scope.remove = function () {
        var selectedMails = [];
        $.each($scope.mails, function () { if (this.selected) selectedMails.push(this); });

        $.each(selectedMails, function () {
            var mailToDelete = this;
            mailAPI['delete'](mailToDelete, function () {
                var index = $scope.mails.indexOf(mailToDelete);
                $scope.mails.splice(index, 1);
            });
        });
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MailsViewCtrl',
            templateUrl: '/views/mails.html',
            resolve: {
                mails: function (mailAPI, $q) {
                    var defer = $q.defer();
                    mailAPI.query(function (mails) { defer.resolve(mails); });
                    return defer.promise;
                }
            }
        });
});

app.factory('smtpServerHub', function () {
    var conn = $.hubConnection();
    var hub = conn.createHubProxy("SmtpServerHub");
    var hubProxy = {
        _callbacks: [],
        _apply: function (arg) {
            $.each(this._callbacks, function () { (this)(arg); });
        },
        onReceiveMessage: function (callback) { this._callbacks.push(callback); }
    };
    hub.on("ReceiveMessage", function (smtpMessage) {
        hubProxy._apply(smtpMessage);
    });
    conn.start();
    return hubProxy;
});
