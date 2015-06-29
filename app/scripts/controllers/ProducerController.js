angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/producer', {
        templateUrl: 'views/emulator.html',
        controller: 'ProducerController'
      })
  })
  .controller('ProducerController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
    $scope.request = {};
    $scope.result = {};

    $scope.$on('$viewContentLoaded', function() {
      $scope.credentials = IngresseAPI_UserService.credentials;
      $scope.calls = ingresseAPI_Preferences.httpCalls;
    });

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      for (var i = tab.fields.length - 1; i >= 0; i--) {
        if (!tab.fields[i].model) {
          continue;
        }

        if (tab.fields[i].type === 'date') {
          var day = tab.fields[i].model.getDate().toString();
          var month = tab.fields[i].model.getMonth().toString();
          if (month.length < 2) {
            month = "0" + month;
          }
          var year = tab.fields[i].model.getFullYear().toString();
          obj[tab.fields[i].label] = year + "-" + month + "-" + day;
          continue;
        }

        obj[tab.fields[i].label] = tab.fields[i].model;
      };

      return obj;
    };

    $scope.getProducerCustomerList = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['producerCustomers'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['producerCustomers']);

      ingresseAPI.getProducerCustomerList(identifier, filters, $scope.credentials.token)
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
      producerCustomers: {
        label: 'Costumer',
        action: $scope.getProducerCustomerList,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'scorefrom',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'scoreto',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'event',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'platform',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'classification',
            model: '',
            type: 'number',
            disabled: false
          }
        ]
      }
    };
  });
