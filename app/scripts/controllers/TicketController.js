angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ticket', {
        templateUrl: 'views/emulator.html',
        controller: 'TicketController'
      });
  })
  .controller('TicketController', function ($scope, $rootScope, ingresseAPI, IngresseAPI_UserService, $routeParams, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseAPI_UserService.credentials;
      QueryService.getSearchParams($scope.fields);
      QueryService.setSelectedTab('ticketQRCode');
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
