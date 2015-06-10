angular.module('ingresseEmulatorApp')
.directive('query', function () {
    return {
        templateUrl: 'directives/query.html',
        restrict: 'E',
        transclude: true,
        scope: {
            fields: '=',
            user: '='
        },
        controller: function($scope, $element, $attrs, $transclude) {

        },
        compile: function compile(tElement, tAttrs, transclude) {
            return function postLink(scope, iElement, iAttrs, controller) {

            }
        },
        link: function postLink(scope, iElement, iAttrs) {

        }
    };
});
