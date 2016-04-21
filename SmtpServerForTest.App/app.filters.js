var _;
(function (_) {
    var app = angular.module('SmtpServerForTest.UI.App');
    app.filter('join', function () {
        return function (input, separator) {
            if (input == null)
                return null;
            return input.join(separator);
        };
    });
    app.filter('htmlPreFormat', function ($injector) {
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
    app.filter('ipaddress', function () {
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
})(_ || (_ = {}));
//# sourceMappingURL=app.filters.js.map