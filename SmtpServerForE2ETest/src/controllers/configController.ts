namespace SmtpServerForE2ETest {

    class ConfigController {

        public get appConfig(): AppConfig { return this.appConfigAPI.appConfig; }

        constructor(
            $scope: ng.IScope,
            private appConfigAPI: AppConfigAPIService
        ) {
            $scope.$watch(() => this.appConfig, (newVal, oldVal) => {
                if (angular.toJson(oldVal) != '{}') {
                    console.log('save!');
                    this.appConfig.$save();
                }
            }, true);
        }
    }

    app.controller('configController', ConfigController);
}