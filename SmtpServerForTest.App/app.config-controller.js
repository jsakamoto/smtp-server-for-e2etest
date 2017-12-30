"use strict";
var _;
(function (_) {
    var app = angular.module('SmtpServerForTest.UI.App');
    app.controller('ConfigController', function ($scope, $modal, $q, configAPI) {
        configAPI.get().then(function (config) {
            // Setup server configuration save/watch.
            $scope.config = config;
            $scope.saveConfig = function () {
                $scope.saveConfig = function () { $scope.config.$save(); };
            };
            $scope.$watch(function () { return JSON.stringify($scope.config); }, function () { return $scope.saveConfig(); });
            // Setup user settings save/watch.
            $scope.userSettings = JSON.parse(window.localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');
            var updateDesktopNotificationPermission = function () {
                $scope.desktopNotificationPermission = window.Notification == null ? 'notsupported' : window.Notification.permission;
                if ($scope.desktopNotificationPermission == 'notsupported' || $scope.desktopNotificationPermission == 'denied')
                    $scope.userSettings.enableDesktopNotification = false;
            };
            updateDesktopNotificationPermission();
            $scope.saveUserSettings = function () {
                window.localStorage.setItem('userSettings', JSON.stringify($scope.userSettings));
                if (window.Notification && $scope.userSettings.enableDesktopNotification && window.Notification.permission == 'default') {
                    window.Notification.requestPermission(function () {
                        $scope.$apply(updateDesktopNotificationPermission);
                    });
                }
            };
            $scope.$watch(function () { return JSON.stringify($scope.userSettings); }, function () { return $scope.saveUserSettings(); });
        });
    });
    app.controller('AccountConfigController', function ($scope, $modal, $q, configAPI) {
        var doAccountDialog = function (account) {
            var defer = $q.defer();
            var scope = $scope.$new();
            scope.target = account;
            scope.ok = function () {
                modalDialog.close();
                defer.resolve(scope.target);
            };
            var modalDialog = $modal.open({
                templateUrl: 'account-dialog',
                backdrop: 'static',
                scope: scope
            });
            return defer.promise;
        };
        $scope.add = function () { return doAccountDialog({})
            .then(function (newAccount) { return $scope.config.Accounts.push(newAccount); }); };
        $scope.edit = function (index) {
            var account = $scope.config.Accounts[index];
            doAccountDialog(JSON.parse(JSON.stringify(account)))
                .then(function (account) { return $scope.config.Accounts[index] = account; });
        };
        $scope.remove = function (index) { return $scope.config.Accounts.splice(index, 1); };
    });
    app.controller('SmtpEndPointConfigController', function ($scope, $modal, $q, configAPI) {
        var doEndPointDialog = function (endPoint, otherEndPoints) {
            var defer = $q.defer();
            var scope = $scope.$new();
            scope.target = endPoint;
            scope.ok = function () {
                var isConflicted = otherEndPoints
                    .some(function (ep) { return scope.target.Address == ep.Address && scope.target.Port == ep.Port; });
                if (isConflicted == false) {
                    modalDialog.close();
                    defer.resolve(scope.target);
                }
                else {
                    alert('The end point is already defined.');
                }
            };
            var modalDialog = $modal.open({
                templateUrl: 'endPoint-dialog',
                backdrop: 'static',
                scope: scope
            });
            return defer.promise;
        };
        $scope.add = function () {
            var otherEndPoints = $scope.config.SmtpEndPoints.concat();
            doEndPointDialog({}, otherEndPoints)
                .then(function (newEndPoint) { return $scope.config.SmtpEndPoints.push(newEndPoint); });
        };
        $scope.edit = function (index) {
            var endPoint = JSON.parse(JSON.stringify($scope.config.SmtpEndPoints[index]));
            var otherEndPoints = $scope.config.SmtpEndPoints.concat();
            otherEndPoints.splice(index, 1);
            doEndPointDialog(endPoint, otherEndPoints)
                .then(function (endPoint) { return $scope.config.SmtpEndPoints[index] = endPoint; });
        };
        $scope.remove = function (index) { return $scope.config.SmtpEndPoints.splice(index, 1); };
    });
})(_ || (_ = {}));
//# sourceMappingURL=app.config-controller.js.map