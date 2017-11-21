"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var ConfigController = (function () {
        function ConfigController(userSettings, $scope, appConfigAPI) {
            var _this = this;
            this.$scope = $scope;
            this.appConfigAPI = appConfigAPI;
            this.userSettingsService = userSettings;
            $scope.$watch(function () { return _this.appConfig; }, function (newVal, oldVal) {
                if (angular.toJson(oldVal) != '{}')
                    _this.appConfig.$save();
            }, true);
        }
        Object.defineProperty(ConfigController.prototype, "appConfig", {
            get: function () { return this.appConfigAPI.appConfig; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigController.prototype, "userSettings", {
            get: function () { return this.userSettingsService.settings; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigController.prototype, "desktopNotificationPermission", {
            get: function () { return this.userSettingsService.desktopNotificationPermission; },
            enumerable: true,
            configurable: true
        });
        return ConfigController;
    }());
    SmtpServerForE2ETest.app.controller('configController', ConfigController);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=configController.js.map