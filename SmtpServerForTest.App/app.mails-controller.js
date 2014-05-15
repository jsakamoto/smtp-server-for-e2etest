(function () {
    var app = angular.module('SmtpServerForTest.UI.App');

    app.controller('MailsController', function ($scope, $rootScope, mailAPI, smtpServerHub) {
        /// <param name="$scope" type="Object"></param>

        $rootScope.foo = "bar";

        mailAPI.query().then(function (mails) {
            $scope.mails = mails;
        });

        smtpServerHub.onReceiveMessage(function (mail) {
            $scope.$apply(function () { $scope.mails.unshift(mail); });
        });

        var getSelectedMails = function () {
            /// <returns type="Enumerable"></returns>
            return Enumerable.From($scope.mails || [])
                .Where(function (m) { return m.selected; });
        };

        var setCurrentMail = function () {
            var selectedMails = getSelectedMails();
            if (selectedMails.Count() == 1)
                $scope.current = selectedMails.First();
            else
                $scope.current = null;
        };

        $scope.$watch(function () {
            return getSelectedMails()
                .Select(function (m) { return m.Id; })
                .ToArray()
                .join();
        }, setCurrentMail);

        $scope.hasSelected = function () {
            return getSelectedMails().Count() > 0;
        };

        $scope.selectThis = function (index) {
            $.each($scope.mails, function () { this.selected = false; });
            $scope.mails[index].selected = true;
        };

        $scope.remove = function () {
            var selectedMails = getSelectedMails().ToArray();
            $.each(selectedMails, function () {
                var mailToDelete = this;
                mailAPI.remove({ id: mailToDelete.Id })
                    .then(function () {
                        var index = $scope.mails.indexOf(mailToDelete);
                        $scope.mails.splice(index, 1);
                    });
            });
        };
    });
})();
