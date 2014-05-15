(function () {
    var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap']);

    app.run(function ($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (ev, data) {
            $rootScope.controller = (data.$$route || { controller: '' }).controller;
        })
    });

    app.config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', { controller: 'MailsController', templateUrl: '/views/mails.html' })
            .when('/config', { controller: 'ConfigController', templateUrl: '/views/config.html' });
        if (!$httpProvider.defaults.headers.get) $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    });

    app.factory('mailAPI', function ($resource, $q) {
        var res = $resource('/api/mails/simple/:id', { id: '@Id' });
        return {
            query: function () {
                var defer = $q.defer();
                res.query(function (mails) { defer.resolve(mails); });
                return defer.promise;
            },
            remove: function (param) {
                var defer = $q.defer();
                res.remove(param, function () { defer.resolve(); });
                return defer.promise;
            }
        };
    });

    app.factory('configAPI', function ($resource, $q) {
        var res = $resource('/api/config');

        var getterFunc = res.get;
        res.get = function () {
            var defer = $q.defer();
            getterFunc.apply(res, [function (config) { defer.resolve(config); }]);
            return defer.promise;
        };
        return res;
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
})();
