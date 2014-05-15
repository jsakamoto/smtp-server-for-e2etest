(function () {
    var app = angular.module('SmtpServerForTest.UI.App');

    app.controller('ConfigController', function ($scope, $modal, $q, configAPI) {

        configAPI.get().then(function (config) {
            $scope.config = config;
            console.dir(config);
            $scope.saveConfig = function () {
                $scope.saveConfig = function () { $scope.config.$save(); };
            };
            $scope.$watch(
                function () { return JSON.stringify($scope.config); },
                function () { $scope.saveConfig(); });
        });

        var doAccountDialog = function (account) {
            var defer = $q.defer();
            var scope = $scope.$new();
            scope.account = account;
            scope.ok = function () {
                modalDialog.close();
                defer.resolve(scope.account);
            };
            var modalDialog = $modal.open({
                templateUrl: 'account-dialog',
                backdrop: 'static',
                scope: scope
            });
            return defer.promise;
        };

        $scope.addSmtpAuthAccount = function () {
            doAccountDialog({})
                .then(function (newAccount) {
                    $scope.config.Accounts.push(newAccount);
                });
        };

        $scope.editSmtpAuthAccount = function (index) {
            var account = $scope.config.Accounts[index];
            doAccountDialog(JSON.parse(JSON.stringify(account)))
                .then(function (account) {
                    $scope.config.Accounts[index] = account;
                });
        };

        $scope.deleteSmtpAuthAccount = function (index) {
            $scope.config.Accounts.splice(index, 1);
        };
    });

    app.controller('SmtpEndPointConfigController', function ($scope, $modal, $q, configAPI) {
        /// <param name="$scope"    type="Object"></param>
        /// <param name="$modal"    type="Object"></param>
        /// <param name="$q"        type="Object"></param>
        /// <param name="configAPI" type="Object"></param>

        var doEndPointDialog = function (endPoint, otherEndPoints) {
            var defer = $q.defer();
            var scope = $scope.$new();
            scope.endPoint = endPoint;
            scope.ok = function () {
                var isConflicted = Enumerable.From(otherEndPoints)
                    .Any(function (ep) {
                        return scope.endPoint.Address == ep.Address &&
                        scope.endPoint.Port == ep.Port;
                    });
                if (isConflicted == false) {
                    modalDialog.close();
                    defer.resolve(scope.endPoint);
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

        $scope.addSmtpEndPoint = function () {
            var otherEndPoints = $scope.config.SmtpEndPoints.concat();
            doEndPointDialog({}, otherEndPoints)
                .then(function (newEndPoint) {
                    $scope.config.SmtpEndPoints.push(newEndPoint);
                });
        };

        $scope.editSmtpEndPoint = function (index) {
            var endPoint = JSON.parse(JSON.stringify($scope.config.SmtpEndPoints[index]));
            var otherEndPoints = $scope.config.SmtpEndPoints.concat();
            otherEndPoints.splice(index, 1);
            doEndPointDialog(endPoint, otherEndPoints)
                .then(function (endPoint) {
                    $scope.config.SmtpEndPoints[index] = endPoint;
                });
        };

        $scope.deleteSmtpEndPoint = function (index) {
            $scope.config.SmtpEndPoints.splice(index, 1);
        };

    });
})();
