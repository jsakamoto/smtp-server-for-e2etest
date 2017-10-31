namespace SmtpServerForE2ETest {

    export class AppConfigAPIService {

        private api: ng.resource.IResourceClass<AppConfig>;

        public appConfig: AppConfig;

        constructor($resource: ng.resource.IResourceService) {
            this.api = $resource<AppConfig>('/api/config');
            this.refresh();
        }

        public refresh(): void {
            this.appConfig = this.api.get();
        }
    }

    app.service('appConfigAPI', AppConfigAPIService);
}