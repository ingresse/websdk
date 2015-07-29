angular.module('ingresseEmulatorApp')
.directive('query', function () {
    return {
        templateUrl: 'directives/query.html',
        restrict: 'E',
        transclude: true,
        scope: {
            fields: '=',
            credentials: '=',
            isMethodSelectionHidden: '='
        },
        controller: function($scope, ingresseAPI_Preferences, ipCookie, $location, QueryService) {
            $scope.domain = ingresseAPI_Preferences._host;
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

              ipCookie('host', host, {expires: 365});
              ingresseAPI_Preferences.setHost(host);
              $scope.domain = ingresseAPI_Preferences._host;
            };

            $scope.loadCookies = function () {
              var host = ipCookie('host');

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
