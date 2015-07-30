angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $mdSidenav, ingresseAPI, IngresseAPI_UserService) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };

    $scope.login = function () {
      IngresseAPI_UserService.login();
    };

    $scope.logout = function () {
      IngresseAPI_UserService.logout();
    };

    $scope.$on('userSessionSaved', function () {
      $scope.credentials = IngresseAPI_UserService.credentials;

      ingresseAPI.user.get($scope.credentials.userId, {fields: 'id,name,email,type'}, $scope.credentials.token)
        .then(function (response) {
          $scope.user = response;
          $scope.user.photo = ingresseAPI.user.getPhotoUrl($scope.credentials.userId);
        });
    });

    $scope.$on('userHasLoggedOut', function () {
      $scope.user = null;
    });
  });
