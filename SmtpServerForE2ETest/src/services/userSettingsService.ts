namespace SmtpServerForE2ETest {

    export class UserSettingsService {

        public settings: UserSettings;

        public desktopNotificationPermission: string;

        constructor(
            private $rootScope: ng.IRootScopeService
        ) {
            this.settings = JSON.parse(localStorage.getItem('userSettings') || '{"enableDesktopNotification":false}');
            this.updateDesktopNotificationPermission();

            $rootScope.$watch(
                () => this.settings,
                () => this.saveUserSettings(), true);
        }

        private updateDesktopNotificationPermission(): void {
            this.desktopNotificationPermission = window.Notification == null ? 'notsupported' : window.Notification.permission;
            if (this.desktopNotificationPermission == 'notsupported' || this.desktopNotificationPermission == 'denied')
                this.settings.enableDesktopNotification = false;
        }

        private saveUserSettings(): void {
            window.localStorage.setItem('userSettings', JSON.stringify(this.settings));

            if (window.Notification && this.settings.enableDesktopNotification && window.Notification.permission == 'default') {
                window.Notification.requestPermission(() => {
                    this.$rootScope.$apply(() => this.updateDesktopNotificationPermission());
                });
            }
        }
    }

    app.service('userSettings', UserSettingsService);
}