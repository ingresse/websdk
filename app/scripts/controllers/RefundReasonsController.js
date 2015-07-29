angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/refundReasons', {
        templateUrl: 'views/emulator.html',
        controller: 'RefundReasonsController'
      });
  })
  .controller('RefundReasonsController', function ($scope, ingresseAPI, IngresseAPI_UserService, EmulatorService, QueryService) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseAPI_UserService.credentials;
      QueryService.getSearchParams($scope.fields);
      $scope.isMethodSelectionHidden = true;
    });

    $scope.getRefundReasons = function () {
      $scope.isLoading = true;

      ingresseAPI.getRefundReasons()
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
      refundReasons: {
        label: 'Refund Reasons',
        action: $scope.getRefundReasons,
        authentication: false
      }
    };
  });
