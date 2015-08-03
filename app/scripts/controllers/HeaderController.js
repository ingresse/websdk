'use strict';

angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $mdSidenav, ingresseAPI, IngresseApiUserService) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };

    $scope.login = function () {
      IngresseApiUserService.login();
    };

    $scope.logout = function () {
      IngresseApiUserService.logout();
    };

    $scope.$on('userSessionSaved', function () {
      $scope.credentials = IngresseApiUserService.credentials;

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
