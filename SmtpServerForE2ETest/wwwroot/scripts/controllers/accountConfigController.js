"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var AccountConfigController = (function () {
        function AccountConfigController($scope, $q, appConfigAPI, $modal) {
            this.$scope = $scope;
            this.$q = $q;
            this.appConfigAPI = appConfigAPI;
            this.$modal = $modal;
            this.modalDialog = null;
        }
        Object.defineProperty(AccountConfigController.prototype, "appConfig", {
            get: function () { return this.appConfigAPI.appConfig; },
            enumerable: true,
            configurable: true
        });
        AccountConfigController.prototype.doAccountDialog = function (account) {
            var _this = this;
            var defer = this.$q.defer();
            var scope = this.$scope.$new();
            scope.target = account;
            scope.ok = function () {
                _this.modalDialog.close();
                defer.resolve(scope.target);
            };
            this.modalDialog = this.$modal.open({
                templateUrl: 'account-dialog',
                backdrop: 'static',
                scope: scope
            });
            return defer.promise;
        };
        AccountConfigController.prototype.add = function () {
            var _this = this;
            this.doAccountDialog({})
                .then(function (account) { return _this.appConfig.accounts.push(account); });
        };
        AccountConfigController.prototype.edit = function (index) {
            var _this = this;
            var account = this.appConfig.accounts[index];
            this.doAccountDialog(angular.copy(account))
                .then(function (account) { return _this.appConfig.accounts[index] = account; });
        };
        AccountConfigController.prototype.remove = function (index) {
            this.appConfig.accounts.splice(index, 1);
        };
        return AccountConfigController;
    }());
    SmtpServerForE2ETest.app.controller('accountConfigController', AccountConfigController);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=accountConfigController.js.map