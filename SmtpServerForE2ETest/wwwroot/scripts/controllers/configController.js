"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var ConfigController = (function () {
        function ConfigController($scope, appConfigAPI) {
            var _this = this;
            this.appConfigAPI = appConfigAPI;
            $scope.$watch(function () { return _this.appConfig; }, function (newVal, oldVal) {
                if (angular.toJson(oldVal) != '{}') {
                    console.log('save!');
                    _this.appConfig.$save();
                }
            }, true);
        }
        Object.defineProperty(ConfigController.prototype, "appConfig", {
            get: function () { return this.appConfigAPI.appConfig; },
            enumerable: true,
            configurable: true
        });
        return ConfigController;
    }());
    SmtpServerForE2ETest.app.controller('configController', ConfigController);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=configController.js.map