angular.module('ingresseEmulatorApp')
.directive('dynamicInput', function () {
    return {
        templateUrl: 'directives/dynamic-input.html',
        restrict: 'E',
        scope: {
            key: '=',
            value: '='
        },
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.isSimple = true;
            if (typeof($scope.value) === 'object') {
                $scope.isSimple = false;
            }
        },
        compile: function compile(tElement, tAttrs, transclude) {
            return function postLink(scope, iElement, iAttrs, controller) {

            }
        },
        link: function postLink(scope, iElement, iAttrs) {

        }
    };
});
