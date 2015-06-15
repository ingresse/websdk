angular.module('ingresseEmulatorApp')
  .controller('ErrorController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
    $scope.request = {};
    $scope.result = {};

    $scope.$on('$viewContentLoaded', function() {
      $scope.calls = ingresseAPI_Preferences.httpCalls;
    });

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      for (var i = tab.fields.length - 1; i >= 0; i--) {
        if (!tab.fields[i].model) {
          continue;
        }

        if (tab.fields[i].type === 'date') {
          obj[tab.fields[i].label] = tab.fields[i].model.toISOString();
          continue;
        }

        obj[tab.fields[i].label] = tab.fields[i].model;
      };

      return obj;
    };

    $scope.getError = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['error'].identifier.model;

      ingresseAPI.getError(identifier)
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

    $scope.fields = {
      error: {
        label: 'Error',
        action: $scope.getError,
        authentication: false,
        identifier: {
          label: 'errorClass',
          model: '',
          type: 'number',
          disabled: false
        },
        fields: []
      }
    };
  });
