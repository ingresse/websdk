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
      }
    };
  });
