"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    SmtpServerForE2ETest.app = angular.module('app', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap']);
    SmtpServerForE2ETest.app.run(function ($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (ev, data) {
            $rootScope.controller = (data.$$route || { controller: '' }).controller;
        });
    });
    SmtpServerForE2ETest.app.config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', { controller: 'mailsController', controllerAs: 'ctrl', templateUrl: '/views/mails.html' })
            .when('/config', { controller: 'configController', controllerAs: 'ctrl', templateUrl: '/views/config.html' });
        if ($httpProvider.defaults.headers != undefined && $httpProvider.defaults.headers.get == undefined) {
            $httpProvider.defaults.headers.get = {};
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        }
    });
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=app.js.map