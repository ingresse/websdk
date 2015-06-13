angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };
  });
