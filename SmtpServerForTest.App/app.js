var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource', 'ngAnimate']);

app.factory('Mail', function ($resource) {
    return $resource('/api/mails/:id', { id: '@Id' });
});

app.controller('MailsViewCtrl', function ($scope, mails, smtpServerHub) {
    $scope.mails = mails;
    smtpServerHub.onReceiveMessage(function (mail) {
        $scope.$apply(function () { $scope.mails.unshift(mail); });
    });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MailsViewCtrl',
            templateUrl: '/views/mails.html',
            resolve: {
                mails: function (Mail, $q) {
                    var defer = $q.defer();
                    Mail.query(function (mails) { defer.resolve(mails); });
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
