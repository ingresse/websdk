angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $mdSidenav, ingresseAPI_Preferences, ingresseAPI, IngresseAPI_UserService, $location, ipCookie) {
    $scope.openLeftMenu = function() {
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

      ingresseAPI.getUser($scope.credentials.userId, {fields:'id,name,email,type'}, $scope.credentials.token)
      .then(function (response) {
        $scope.user = response;
        $scope.user.photo = ingresseAPI.getUserPhotoUrl($scope.credentials.userId);
      });
    });

    $scope.$on('userHasLoggedOut', function () {
      $scope.user = null;
    });
  });
