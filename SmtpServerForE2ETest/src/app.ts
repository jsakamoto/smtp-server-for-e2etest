namespace SmtpServerForE2ETest {

    export var app = angular.module('app', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap']);

    app.run(($rootScope: ng.IRootScopeService) => {
        $rootScope.$on('$routeChangeSuccess', (ev, data) => {
            ($rootScope as any).controller = (data.$$route || { controller: '' }).controller;
        })
    });

    app.config(($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) => {

        $routeProvider
            .when('/', { controller: 'mailsController', controllerAs: 'ctrl', templateUrl: '/views/mails.html' })
            .when('/config', { controller: 'configController', controllerAs: 'ctrl', templateUrl: '/views/config.html' });

        if ($httpProvider.defaults.headers != undefined && $httpProvider.defaults.headers.get == undefined) {
            $httpProvider.defaults.headers.get = {};
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        }
    });
}