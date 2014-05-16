var _;
(function (_) {
    var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap']);

    app.run(function ($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (ev, data) {
            $rootScope.controller = (data.$$route || { controller: '' }).controller;
        });
    });

    app.config(function ($routeProvider, $httpProvider) {
        $routeProvider.when('/', { controller: 'MailsController', templateUrl: '/views/mails.html' }).when('/config', { controller: 'ConfigController', templateUrl: '/views/config.html' });
        if (!$httpProvider.defaults.headers.get)
            $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    });

    app.factory('mailAPI', function ($resource, $q) {
        var res = $resource('/api/mails/simple/:id', { id: '@Id' });
        return {
            query: function () {
                var defer = $q.defer();
                res.query(function (mails) {
                    return defer.resolve(mails);
                });
                return defer.promise;
            },
            remove: function (param) {
                var defer = $q.defer();
                res.remove(param, function () {
                    return defer.resolve();
                });
                return defer.promise;
            }
        };
    });

    var SmtpServerHub = (function () {
        function SmtpServerHub() {
            this._callbacks = [];
        }
        SmtpServerHub.prototype._apply = function (arg) {
            Enumerable.from(this._callbacks).forEach(function (fn) {
                return fn(arg);
            });
        };
        SmtpServerHub.prototype.onReceiveMessage = function (callback) {
            this._callbacks.push(callback);
        };
        return SmtpServerHub;
    })();
    _.SmtpServerHub = SmtpServerHub;

    app.factory('smtpServerHub', function () {
        var conn = $.hubConnection();
        var hub = conn.createHubProxy("SmtpServerHub");
        var hubProxy = new SmtpServerHub();
        hub.on("ReceiveMessage", function (message) {
            return hubProxy._apply(message);
        });
        conn.start();
        return hubProxy;
    });

    app.factory('configAPI', function ($resource, $q) {
        var res = $resource('/api/config');

        var getterFunc = res.get;
        res.get = function () {
            var defer = $q.defer();
            getterFunc.apply(res, [function (config) {
                    defer.resolve(config);
                }]);
            return defer.promise;
        };
        return res;
    });
})(_ || (_ = {}));
//# sourceMappingURL=app.js.map
