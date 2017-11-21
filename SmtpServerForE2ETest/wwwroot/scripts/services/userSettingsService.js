"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var UserSettingsService = (function () {
        function UserSettingsService($rootScope) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.settings = JSON.parse(localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');
            this.updateDesktopNotificationPermission();
            $rootScope.$watch(function () { return _this.settings; }, function () { return _this.saveUserSettings(); }, true);
        }
        UserSettingsService.prototype.updateDesktopNotificationPermission = function () {
            this.desktopNotificationPermission = window.Notification == null ? 'notsupported' : window.Notification.permission;
            if (this.desktopNotificationPermission == 'notsupported' || this.desktopNotificationPermission == 'denied')
                this.settings.enableDesktopNotification = false;
        };
        UserSettingsService.prototype.saveUserSettings = function () {
            var _this = this;
            window.localStorage.setItem('userSettings', JSON.stringify(this.settings));
            if (window.Notification && this.settings.enableDesktopNotification && window.Notification.permission == 'default') {
                window.Notification.requestPermission(function () {
                    _this.$rootScope.$apply(function () { return _this.updateDesktopNotificationPermission(); });
                });
            }
        };
        return UserSettingsService;
    }());
    SmtpServerForE2ETest.UserSettingsService = UserSettingsService;
    SmtpServerForE2ETest.app.service('userSettings', UserSettingsService);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=userSettingsService.js.map