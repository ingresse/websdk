angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/producer', {
        templateUrl: 'views/emulator.html',
        controller: 'ProducerController'
      });
  })
  .controller('ProducerController', function ($scope, ingresseAPI, IngresseAPI_UserService, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseAPI_UserService.credentials;
      QueryService.getSearchParams($scope.fields);
    });

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      var i, day, month, year;

      for (i = tab.fields.length - 1; i >= 0; i--) {
        if (tab.fields[i].model) {
          if (tab.fields[i].type === 'date') {
            day = tab.fields[i].model.getDate().toString();
            month = tab.fields[i].model.getMonth().toString();
            if (month.length < 2) {
              month = "0" + month;
            }
            year = tab.fields[i].model.getFullYear().toString();
            obj[tab.fields[i].label] = year + "-" + month + "-" + day;
          } else {
            obj[tab.fields[i].label] = tab.fields[i].model;
          }
        }
      }

      return obj;
    };

    $scope.getProducerCustomerList = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.producerCustomers.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.producerCustomers);

      QueryService.setSearchParams('producerCustomers', $scope.fields.producerCustomers.identifier, filters);

      ingresseAPI.getProducerCustomerList(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
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
