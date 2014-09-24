
module _ {

    var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap']);

    app.run($rootScope => {
        $rootScope.$on('$routeChangeSuccess', (ev, data) => {
            $rootScope.controller = (data.$$route || { controller: '' }).controller;
        })
    });

    app.config(($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) => {
        $routeProvider
            .when('/', { controller: 'MailsController', templateUrl: '/views/mails.html' })
            .when('/config', { controller: 'ConfigController', templateUrl: '/views/config.html' });
        if (!$httpProvider.defaults.headers.get) $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    });

    app.factory('mailAPI', ($resource: ng.resource.IResourceService, $q: ng.IQService) => {
        var res = $resource('/api/mails/simple/:id', { id: '@Id' });
        return {
            query: () => {
                var defer = $q.defer();
                res.query(mails => defer.resolve(mails));
                return defer.promise;
            },
            remove: (param) => {
                var defer = $q.defer();
                res.remove(param, () => defer.resolve());
                return defer.promise;
            }
        };
    });

    export interface ISmtpServerHub {
        onReceiveMessage(callback: Function): void;
        onRemoveMessage(callback: Function): void;
    }

    class SmtpServerHub {
        _callbacks = { onReceive: [], onRemove: [] };
        _apply(callbacks: Function[], arg: any): void { Enumerable.from(callbacks).forEach(fn => fn(arg)); }
        onReceiveMessage(callback: Function): void { this._callbacks.onReceive.push(callback); }
        onRemoveMessage(callback: Function): void { this._callbacks.onRemove.push(callback); }
    }

    app.factory('smtpServerHub', (): ISmtpServerHub => {
        var conn = $.hubConnection();
        var hub = conn.createHubProxy("SmtpServerHub");
        var hubProxy = new SmtpServerHub();
        hub.on("ReceiveMessage", message => hubProxy._apply(hubProxy._callbacks.onReceive, message));
        hub.on("RemoveMessage", id => hubProxy._apply(hubProxy._callbacks.onRemove, id));
        conn.start();
        return hubProxy;
    });

    app.factory('configAPI', function ($resource: any, $q: ng.IQService) {
        var res = $resource('/api/config');

        var getterFunc = res.get;
        res.get = () => {
            var defer = $q.defer();
            getterFunc.apply(res, [config => { defer.resolve(config); }]);
            return defer.promise;
        };
        return res;
    });

}
