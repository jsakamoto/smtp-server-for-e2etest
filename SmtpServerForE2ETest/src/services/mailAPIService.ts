namespace SmtpServerForE2ETest {
    export class MailAPIService {

        private api: ng.resource.IResourceClass<SimplifiedMail>;

        constructor($resource: ng.resource.IResourceService) {
            this.api = $resource<SimplifiedMail>('/api/mails/simple/:id', { id: '@id' });
        }

        public query(): ng.resource.IResourceArray<SimplifiedMail> {
            return this.api.query();
        }

        public attach(mail: SimplifiedMail): SimplifiedMail {
            return new this.api(mail);
        }
    }
    app.service('mailAPI', MailAPIService);
}