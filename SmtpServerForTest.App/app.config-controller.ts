module _ {
    var app = angular.module('SmtpServerForTest.UI.App');

    interface EndPoint {
        Address: string;
        Port: number;
    }

    interface IConfigScope extends ng.IScope {
        config: any;
        saveConfig: () => void;
    }

    interface IConfigEditorScope extends IConfigScope {

        add: () => void;
        edit: (a: number) => void;
        remove: (a: number) => void;
        ok: () => void;

        $new: () => IConfigEditorScope;
        target: any;
    }

    app.controller('ConfigController', ($scope: IConfigScope, $modal, $q: ng.IQService, configAPI) => {

        configAPI.get().then(config => {
            $scope.config = config;
            $scope.saveConfig = () => {
                $scope.saveConfig = () => { $scope.config.$save(); };
            };
            $scope.$watch(
                () => JSON.stringify($scope.config),
                () => $scope.saveConfig());
        });
    });

    app.controller('AccountConfigController', ($scope: IConfigEditorScope, $modal, $q: ng.IQService, configAPI) => {

        var doAccountDialog = account => {
            var defer = $q.defer();
            var scope = $scope.$new();
            scope.target = account;
            scope.ok = () => {
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

        $scope.add = () => doAccountDialog({})
            .then(newAccount => $scope.config.Accounts.push(newAccount));

        $scope.edit = index => {
            var account = $scope.config.Accounts[index];
            doAccountDialog(JSON.parse(JSON.stringify(account)))
                .then(account => $scope.config.Accounts[index] = account);
        };

        $scope.remove = index => $scope.config.Accounts.splice(index, 1);
    });

    app.controller('SmtpEndPointConfigController', function ($scope: IConfigEditorScope, $modal, $q: ng.IQService, configAPI) {

        var doEndPointDialog = (endPoint, otherEndPoints: EndPoint[]) => {
            var defer = $q.defer();
            var scope = $scope.$new();
            scope.target = endPoint;
            scope.ok = function () {
                var isConflicted = Enumerable.from(otherEndPoints)
                    .any(ep => scope.target.Address == ep.Address && scope.target.Port == ep.Port);
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

        $scope.add = () => {
            var otherEndPoints = $scope.config.SmtpEndPoints.concat();
            doEndPointDialog({}, otherEndPoints)
                .then(newEndPoint => $scope.config.SmtpEndPoints.push(newEndPoint));
        };

        $scope.edit = index => {
            var endPoint = JSON.parse(JSON.stringify($scope.config.SmtpEndPoints[index]));
            var otherEndPoints = $scope.config.SmtpEndPoints.concat();
            otherEndPoints.splice(index, 1);
            doEndPointDialog(endPoint, otherEndPoints)
                .then(endPoint => $scope.config.SmtpEndPoints[index] = endPoint);
        };

        $scope.remove = index => $scope.config.SmtpEndPoints.splice(index, 1);
    });
}