angular.module('ingresseEmulatorApp')
  .controller('ErrorController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
    $scope.request = {};
    $scope.result = {};

    $scope.$on('$viewContentLoaded', function() {
      $scope.calls = ingresseAPI_Preferences.httpCalls;
    });

    $scope.getError = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getError($scope.request.errorClass)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };
  });
