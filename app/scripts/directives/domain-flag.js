'use strict';

angular.module('ingresseSDK').directive('domainFlag', function () {
    return {
        template: '<div class="homolog-flag" ng-cloak data-ng-class="{ \'homolog-flag--bottom\': positionBottom, \'homolog-flag--visible\': apiDomain === \'https://hml-api.ingresse.com\' || apiDomain === \'https://hml-api-2.ingresse.com\' || apiDomain === \'https://apipre.ingresse.com\' }">{{ apiDomain }}</div>',
        replace: true,
        restrict: 'E',
        scope: {
            positionBottom: '@',
        },
        controller: function($scope, $rootScope, ingresseApiPreferences) {
            $scope.apiDomain = ingresseApiPreferences.getHost();

            $scope.$on('preferences.hostChanged', function() {
                $scope.apiDomain = ingresseApiPreferences.getHost();
            });
        }
    };
});
