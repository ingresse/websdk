'use strict';

angular.module('ingresseEmulatorApp')
.directive('query', function () {
    return {
        templateUrl: 'views/query.html',
        restrict: 'E',
        transclude: true,
        scope: {
            fields: '=',
            credentials: '=',
            isMethodSelectionHidden: '='
        },
        controller: function($scope, ingresseApiPreferences, ingresseApiCookies, $location, QueryService) {
            $scope.domain = ingresseApiPreferences._host;
            $scope.method = $location.$$path;
            $scope.selectedTabKey = QueryService.selectedTab;

            $scope.$watch('selectedTabKey', function () {
              if (!$scope.selectedTabKey) {
                return;
              }

              $scope.tabSelected = $scope.selectedTabKey;
            });

            $scope.setHost = function (host) {
              if (!host || host === '') {
                return;
              }

              ingresseApiCookies('host', host, 365);
              ingresseApiPreferences.setHost(host);
              $scope.domain = ingresseApiPreferences._host;
            };

            $scope.loadCookies = function () {
              var host = ingresseApiCookies('host');

              if (host) {
                $scope.setHost(host);
              }
            };

            $scope.methodSelected = function (method) {
                $location.path(method);
            };

            $scope.getSearchParams = function () {
              var params = $location.search();

              if (!params.method) {
                return;
              }

              if (params.method) {
                $scope.tabSelected = params.method;
              }
            };

            $scope.loadCookies();
            $scope.getSearchParams();
        }
    };
});
