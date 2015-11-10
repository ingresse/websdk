'use strict';

angular.module('ingresseEmulatorApp')
  .controller('ShopController', function ($scope, ingresseAPI, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.ticketReservation = function () {
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.reservation.filters);

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
