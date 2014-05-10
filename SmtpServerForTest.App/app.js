var app = angular.module('SmtpServerForTest.UI.App', ['ngRoute', 'ngResource', 'ngAnimate']);

app.factory('mailAPI', function ($resource, $q) {
    var res = $resource('/api/mails/:id', { id: '@Id' });
    return {
        query: function () {
            var defer = $q.defer();
            res.query(function (mails) { defer.resolve(mails); });
            return defer.promise;
        }
    };
});

app.controller('MailsViewCtrl', function ($scope, mailAPI, smtpServerHub) {

    mailAPI.query().then(function (mails) {
        $scope.mails = mails;
    });

    smtpServerHub.onReceiveMessage(function (mail) {
        $scope.$apply(function () { $scope.mails.unshift(mail); });
    });

    $scope.hasSelected = function () {
        var hasSelected = false;
        var mails = $scope.mails || [];
        $.each(mails, function () { hasSelected |= this.selected; });
        return hasSelected;
    };

    $scope.remove = function () {
        var selectedMails = [];
        $.each($scope.mails, function () { if (this.selected) selectedMails.push(this); });

        $.each(selectedMails, function () {
            var mailToDelete = this;
            mailToDelete.$remove(function () {
                var index = $scope.mails.indexOf(mailToDelete);
                $scope.mails.splice(index, 1);
            });
        });
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', { controller: 'MailsViewCtrl', templateUrl: '/views/mails.html' })
        .when('/config', { controller: 'ConfigCtrl', templateUrl: '/views/config.html' })
    ;
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

app.filter('mailaddress', function () {
    return function (input) {
        var output = input.DisplayName;
        output += output == '' ? input.Address : ' <' + input.Address + '>';
        return output;
    };
});

app.filter('each', function ($injector) {
    var filters = {};
    return function (input, filterName) {
        var filter = filters[filterName];
        if (filter == null) {
            filter = $injector.get('$filter')(filterName);
            filters[filterName] = filter;
        }
        var output = [];
        $.each(input, function () { output.push(filter(this)); });
        return output;
    };
});

app.filter('join', function () {
    return function (input, separator) {
        /// <param name="input" type="Array"></param>
        return input.join(separator);
    }
});

app.controller('ConfigCtrl', function ($scope) {
});
