'use strict';

angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $mdSidenav, ingresseAPI, IngresseApiUserService, $window) {
    
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };

    $scope.login = function () {
      $scope.credentials = IngresseApiUserService.getCredentials();
      if (!$scope.credentials) {
        // open login on new tab.
        var url = ingresseAPI.login.getAuthorizeUrl();
        $window.open(url);
      }
      
      $scope.loadUserData($scope.credentials);
    };

    $scope.logout = function () {
      var url = ingresseAPI.login.getLogoutURL();
      $window.open(url);
    };

    $scope.$on('ingresseAPI.userHasLogged', function (event, obj) {
      if (!obj || !obj.token || !obj.userId) {
        IngresseApiUserService.clearCredentials();
        $scope.credentials = null;
        $scope.user = null;
        $scope.$apply();
        return;
      }
      
      IngresseApiUserService.saveCredentials(obj.token, obj.userId);
      $scope.credentials = IngresseApiUserService.credentials;
      $scope.loadUserData($scope.credentials);
    });
    
    $scope.loadUserData = function (credentials) {
      ingresseAPI.user.get(credentials.userId, {fields: 'id,name,email,type'}, credentials.token)
        .then(function (response) {
          response.photo = ingresseAPI.user.getPhotoUrl(credentials.userId);
          $scope.user = response;
        });
    };
  });
