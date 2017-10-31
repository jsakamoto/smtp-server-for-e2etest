"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    var MailAPIService = (function () {
        function MailAPIService($resource) {
            this.api = $resource('/api/mails/simple/:id', { id: '@id' });
        }
        MailAPIService.prototype.query = function () {
            return this.api.query();
        };
        MailAPIService.prototype.attach = function (mail) {
            return new this.api(mail);
        };
        return MailAPIService;
    }());
    SmtpServerForE2ETest.MailAPIService = MailAPIService;
    SmtpServerForE2ETest.app.service('mailAPI', MailAPIService);
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=mailAPIService.js.map