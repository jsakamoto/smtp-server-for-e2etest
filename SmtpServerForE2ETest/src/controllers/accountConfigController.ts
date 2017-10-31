namespace SmtpServerForE2ETest {

    class AccountConfigController {

        public get appConfig(): AppConfig { return this.appConfigAPI.appConfig; }

        private modalDialog: any = null;

        constructor(
            private $scope: ng.IScope,
            private $q: ng.IQService,
            private appConfigAPI: AppConfigAPIService,
            private $modal: any
        ) {
        }

        private doAccountDialog(account: Account): ng.IPromise<Account> {
            let defer = this.$q.defer();
            let scope = this.$scope.$new() as any;
            scope.target = account;
            scope.ok = () => {
                this.modalDialog.close();
                defer.resolve(scope.target);
            };
            this.modalDialog = this.$modal.open({
                templateUrl: 'account-dialog',
                backdrop: 'static',
                scope: scope
            });
            return defer.promise;
        }

        public add(): void {
            this.doAccountDialog({} as any)
                .then(account => this.appConfig.accounts.push(account));
        }

        public edit(index: number): void {
            var account = this.appConfig.accounts[index];
            this.doAccountDialog(angular.copy(account))
                .then(account => this.appConfig.accounts[index] = account);
        }

        public remove(index: number): void {
            this.appConfig.accounts.splice(index, 1);
        }
    }

    app.controller('accountConfigController', AccountConfigController);
}