'use strict';

angular.module('ingresseSDK')
.directive('domainFlag', function () {
    return {
        template: '<div class="homolog-flag homolog-flag--{{ position || \'top\' }}" title="API Environment: {{ env }}" data-ng-cloak data-ng-show="env && env !== \'https://api.ingresse.com\'">{{ env }}</div>',
        replace : true,
        restrict: 'E',
        scope   : {
            position: '@?',
        },
        controller: function($scope, $rootScope, ingresseApiPreferences) {
            $scope.env = ingresseApiPreferences.getHost();

            $scope.$on('preferences.hostChanged', function() {
                $scope.env = ingresseApiPreferences.getHost();
            });
        }
    };
});
