"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var MailEventsService = (function () {
        function MailEventsService($rootScope) {
            this.hubConnection = new signalR.HubConnection('/events');
            this.hubConnection.on('messageReceived', function (message) {
                $rootScope.$apply(function () {
                    $rootScope.$emit('messageReceived', message);
                });
            });
            this.hubConnection.on('messageDeleted', function (id) {
                $rootScope.$apply(function () {
                    $rootScope.$emit('messageDeleted', id);
                });
            });
            this.hubConnection.start();
        }
        return MailEventsService;
    }());
    SmtpServerForE2ETest.MailEventsService = MailEventsService;
    SmtpServerForE2ETest.app.service('mailEvents', MailEventsService);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=mailEventsService.js.map