'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ticket', {
        templateUrl: 'views/emulator.html',
        controller: 'TicketController',
        reloadOnSearch: false
      });
  })
  .controller('TicketController', function ($scope, $rootScope, ingresseAPI, IngresseApiUserService, $routeParams, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
      QueryService.setSelectedTab('ticketQRCode');
    });

    $scope.getTicketQRCodeUrl = function () {
      var identifier = $scope.fields.ticketQRCode.identifier.model;

      EmulatorService.addResponse({url: ingresseAPI.getTicketQRCodeUrl(identifier, $scope.credentials.token)}, true);
    };

    $scope.updateTicketTransfer = function () {
      $scope.isLoading = true;

      var  ticketId = $scope.fields.updateTicketTransfer.identifier.model,
        postObject = QueryService.getFiltersByTab($scope.fields.updateTicketTransfer);

      ingresseAPI.ticket.updateTicketTransfer(ticketId, postObject, $scope.credentials.token)
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

    $scope.createTicketTransfer = function () {
      $scope.isLoading = true;

      var  ticketId = $scope.fields.createTicketTransfer.identifier.model,
        postObject = QueryService.getFiltersByTab($scope.fields.createTicketTransfer);

      ingresseAPI.ticket.createTicketTransfer(ticketId, postObject, $scope.credentials.token)
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

    $scope.getTransferHistory = function () {
      $scope.isLoading = true;

      var  ticketId = $scope.fields.createTicketTransfer.identifier.model;

      ingresseAPI.ticket.getTransferHistory(ticketId, $scope.credentials.token)
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
      ticketQRCode: {
        label: 'qrcode',
        action: $scope.getTicketQRCodeUrl,
        authentication: true,
        identifier: {
          label: 'id',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: []
      },

      updateTicketTransfer: {
        label: 'Update Ticket Transfer',
        action: $scope.updateTicketTransfer,
        authentication: true,
        identifier: {
          label: 'ticketId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'transferId',
            type: 'number',
            model: '',
            disabled: false,
            required: true
          },
          {
            label: 'action',
            model: '',
            type: 'option',
            options: ['accept', 'refuse', 'cancel'],
            disabled: false,
            required: true
          }
        ]
      },

      createTicketTransfer: {
        label: 'Create Ticket Transfer',
        action: $scope.createTicketTransfer,
        authentication: true,
        identifier: {
          label: 'ticketId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'user',
            type: 'text',
            model: '',
            disabled: false
          },
          {
            label: 'isReturn',
            type: 'option',
            options: ['false', 'true'],
            model: '',
            disabled: false
          }
        ]
      },

      getTransferHistory: {
        label: 'Ticket History Transfer',
        action: $scope.getHistoryTransfer,
        authentication: true,
        identifier: {
          label: 'ticketId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        }
      }
    };
  });
