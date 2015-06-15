angular.module('ingresseEmulatorApp')
  .controller('ShopController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
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

    $scope.ticketReservation = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields['reservation'].filters);

      ingresseAPI.ticketReservation(null, filters, $scope.user.token)
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
      reservation: {
        label: 'Reservation',
        action: $scope.ticketReservation,
        authentication: true,
        identifier: {},
        fields: [
          {
            label: 'userId',
            model: '',
            type: 'number'
          },
          {
            label: 'eventId',
            model: '',
            type: 'number'
          },
          {
            label: 'tickets',
            model: [],
            type: 'array',
            fields: [
              {
                label: 'session',
                model: {},
                type: 'object',
                fields:[
                  {
                    label: 'date',
                    model: '',
                    type: 'text'
                  },
                  {
                    label: 'time',
                    model: '',
                    type: 'text'
                  }
                ]
              }
            ],
            disabled: false
          }
        ]
      }
    };
  });
