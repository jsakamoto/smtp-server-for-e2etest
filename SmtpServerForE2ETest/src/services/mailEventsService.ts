declare var signalR: any;

namespace SmtpServerForE2ETest {

    export class MailEventsService {

        private hubConnection: any;

        constructor($rootScope: ng.IRootScopeService) {
            this.hubConnection = new signalR.HubConnection('/events');

            this.hubConnection.on('messageReceived', (message: SimplifiedMail) => {
                $rootScope.$apply(() => {
                    $rootScope.$emit('messageReceived', message);
                });
            });

            this.hubConnection.on('messageDeleted', (id: string) => {
                $rootScope.$apply(() => {
                    $rootScope.$emit('messageDeleted', id);
                });
            });

            this.hubConnection.start();
        }
    }
    app.service('mailEvents', MailEventsService);
}