namespace SmtpServerForE2ETest {

    class ConfigController {

        public get appConfig(): AppConfig { return this.appConfigAPI.appConfig; }

        public get userSettings(): UserSettings { return this.userSettingsService.settings }

        public get desktopNotificationPermission(): string { return this.userSettingsService.desktopNotificationPermission }

        private userSettingsService: UserSettingsService;

        constructor(
            userSettings: UserSettingsService,
            private $scope: ng.IScope,
            private appConfigAPI: AppConfigAPIService
        ) {
            this.userSettingsService = userSettings;

            $scope.$watch(() => this.appConfig, (newVal, oldVal) => {
                if (angular.toJson(oldVal) != '{}') this.appConfig.$save();
            }, true);
        }
    }

    app.controller('configController', ConfigController);
}