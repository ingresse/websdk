'use strict';

angular.module('ingresseEmulatorApp')
  .controller('HeaderController', function ($scope, $window, $location, $mdSidenav,
    ingresseAPI, ingresseApiPreferences, IngresseApiUserService) {

    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };

    $scope.login = function () {
      $scope.credentials = IngresseApiUserService.getCredentials();

      if (!$scope.credentials) {
        document.location.href =
            'https://auth.ingresse.com/?host=' +
            ingresseApiPreferences.getEnv() +
            '&returnUrl=' +
            encodeURIComponent($location.absUrl()) +
            '&companyId=' +
            ingresseApiPreferences.getCompanyId() +
            '&apiKey=' +
            ingresseApiPreferences.getApiKey()
        ;

        return;
      }

      $scope.loadUserData($scope.credentials);
    };

    $scope.logout = function () {
      $scope.user        = null;
      $scope.credentials = null;

      $location.search('usertoken', null);
      IngresseApiUserService.clearCredentials();
    };

    $scope.$on('ingresseAPI.userHasLogged', function (event, obj) {
      if (!obj || !obj.token || !obj.userId) {
        IngresseApiUserService.clearCredentials();
        $location.search('usertoken', null);

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
      ingresseAPI.user.get(credentials.userId, { fields: 'id,name,email,type,picture,pictures' }, credentials.token)
        .then(function (response) {
          if (response) {
            $scope.user = response;
          }
        })
        .catch(function (error) {
            console.log(error);
        });
    };
  });
