angular.module('ingresseEmulatorApp')
  .controller('ShopController', function ($scope, ingresseAPI, EmulatorService) {
    $scope.request = {};

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

    $scope.ticketReservation = function () {
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.reservation.filters);

      ingresseAPI.ticketReservation(null, filters, $scope.user.token)
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
                fields: [
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
