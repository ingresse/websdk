angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $mdSidenav, ingresseAPI_Preferences, $location, ipCookie) {
    $scope.domain = ingresseAPI_Preferences._host;

    $scope.method = $location.$$path;

    $scope.setHost = function (host) {
      if (!host || host === '') {
        return;
      }

      ipCookie('host', host, {expires: 365});
      ingresseAPI_Preferences.setHost(host);
      $scope.domain = ingresseAPI_Preferences._host;
    };

    $scope.loadCookies = function () {
      var host = ipCookie('host');

      if (host) {
        $scope.setHost(host);
      }
    };

    $scope.methodSelected = function (method) {
        $location.path(method);
    };

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.loadCookies();
  });
