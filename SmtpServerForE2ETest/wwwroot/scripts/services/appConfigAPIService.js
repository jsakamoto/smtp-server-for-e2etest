"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var AppConfigAPIService = (function () {
        function AppConfigAPIService($resource) {
            this.api = $resource('/api/config');
            this.refresh();
        }
        AppConfigAPIService.prototype.refresh = function () {
            this.appConfig = this.api.get();
        };
        return AppConfigAPIService;
    }());
    SmtpServerForE2ETest.AppConfigAPIService = AppConfigAPIService;
    SmtpServerForE2ETest.app.service('appConfigAPI', AppConfigAPIService);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=appConfigAPIService.js.map