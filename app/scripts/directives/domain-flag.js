'use strict';

angular.module('ingresseSDK').directive('domainFlag', function () {
    return {
        template: '<div class="homologFlag" ng-class="{bottom: positionBottom}" ng-cloak ng-show="apiDomain == \'https://apihml.ingresse.com\' || apiDomain == \'https://apistg.ingresse.com\'">{{apiDomain}}</div>',
        replace: true,
        restrict: 'E',
        scope: {
            positionBottom: '@'
        },
        controller: function($scope, $rootScope, ingresseApiPreferences) {
            $scope.apiDomain = ingresseApiPreferences.getHost();

            $scope.$on('preferences.hostChanged', function() {
                $scope.apiDomain = ingresseApiPreferences.getHost();
            });
        }
    };
});
