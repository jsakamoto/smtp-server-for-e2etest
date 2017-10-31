"use strict";
var SmtpServerForE2ETest;
(function (SmtpServerForE2ETest) {
    SmtpServerForE2ETest.app.filter('join', function () {
        return function (input, separator) { return input == null ? null : input.join(separator); };
    });
    SmtpServerForE2ETest.app.filter('htmlPreFormat', function ($injector) {
        var sce = null;
        return function (input) {
            if (input == null)
                return null;
            sce = sce || $injector.get('$sce');
            return sce.trustAsHtml(input
                .replace(/(\n)|(\r\n)|(\r)/ig, '<br/>')
                .replace(/ /ig, '&nbsp;'));
        };
    });
    SmtpServerForE2ETest.app.filter('ipaddress', function () {
        return function (input) {
            switch (input) {
                case '127.0.0.1': return 'Local Loopback (IPv4)';
                case '0.0.0.0': return 'Any (IPv4)';
                case '::1': return 'Local Loopback (IPv6)';
                case '::': return 'Any (IPv6)';
                default: return input;
            }
        };
    });
})(SmtpServerForE2ETest || (SmtpServerForE2ETest = {}));
//# sourceMappingURL=filters.js.map