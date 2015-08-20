'use strict';

angular.module('ingresseEmulatorApp').directive('results', function () {
    return {
        templateUrl: 'views/results.html',
        restrict: 'E',
        scope: {},
        controller: function($scope, EmulatorService) {
            $scope.results = EmulatorService.responses;

            $scope.removeResponse = function (response) {
              EmulatorService.removeResponse(response);
            };
        }
    };
});
