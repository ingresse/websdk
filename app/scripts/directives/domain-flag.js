'use strict';

angular.module('ingresseSDK').directive('domainFlag', function () {
    return {
        template: '<div class="homologFlag" ng-cloak ng-class="{bottom: positionBottom, visible: apiDomain == \'https://apihml.ingresse.com\' || apiDomain == \'https://apistg.ingresse.com\'}">{{apiDomain}}</div>',
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
