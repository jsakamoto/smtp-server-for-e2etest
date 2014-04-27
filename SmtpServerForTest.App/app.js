/// <reference path="scripts/angular.js" />

var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource']);

app.factory('Mail', function ($resource) {
    return $resource('/api/mails/:id', { id: '@ID' });
});

app.controller('MailsViewCtrl', function ($scope, mails) {
    $scope.mails = mails;
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