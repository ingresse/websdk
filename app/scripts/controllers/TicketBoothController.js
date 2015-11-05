'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ticketbooth', {
        templateUrl: 'views/emulator.html',
        controller: 'TicketboothController',
        reloadOnSearch: false
      });
  })
  .controller('TicketboothController', function ($scope, $rootScope, ingresseAPI, IngresseApiUserService, $routeParams, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
      QueryService.setSelectedTab('sell');
    });

    $scope.sell = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var postObject = QueryService.getFiltersByTab($scope.fields.sell);

      ingresseAPI.ticketBooth.sell(postObject, $scope.credentials.token)
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

    $scope.print = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.print.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.print);

      QueryService.setSearchParams('print', identifier, filters);

      ingresseAPI.ticketBooth.getPrintData(identifier, filters, $scope.credentials.token)
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
      sell: {
        label: 'sell',
        action: $scope.sell,
        authentication: true,
        fields: [
          {
            label: 'eventId',
            type: 'number',
            model: '',
            disabled: false
          },
          {
            label: 'payment',
            type: 'option',
            options: ['money', 'boleto', 'check', 'free', 'creditcard_visa', 'creditcard_mastercard', 'creditcard_amex', 'creditcard_diners', 'creditcard_elo', 'debitcard_visa', 'debitcard_mastercard', 'debitcard_elo', 'others'],
            model: ''
          },
          {
            label: 'userEmail',
            type: 'text',
            model: ''
          },
          {
            label: 'tickets',
            type: 'object',
            model: [],
            disabled: true
          }
        ]
      },
      print: {
        label: 'print',
        action: $scope.print,
        authentication: true,
        identifier: {
          label: 'transactionId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'from',
            type: 'number',
            model: '',
            disabled: false
          }
        ]
      }
    };

    $scope.$watch('fields.sell.fields[0].model', function() {
      var eventId = $scope.fields.sell.fields[0].model;
      if (!eventId) {
        return;
      }

      console.log(eventId);

      ingresseAPI.getEventTicketTypes(eventId)
        .then(function (response) {
          var availableTicket;
          for (var i = 0; i < response.length; i++) {
            if (response[i].status === 'available') {
              availableTicket = response[i];
            }
          }

          if (!availableTicket) {
            $scope.fields.sell.fields[3].model = 'Não há tickets disponíveis para o evento';
            return;
          }

          var ticket = {
            quantity: 1,
            halfPrice: 0,
            ticketTypeId: availableTicket.id,
            session: availableTicket.validTo
          };

          $scope.fields.sell.fields[3].model.push(ticket);
          console.log($scope.fields.sell.fields[3].model);
        });
    });
  });
