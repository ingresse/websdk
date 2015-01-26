angular.module('ingresseSDK').directive('ingresseLogin', function (ingresseAPI_Preferences) {
    return {
        scope: {}, // {} = isolate, true = child, false/undefined = no change
        controller: function($scope, $rootScope, $element, $attrs, $transclude, ingresseAPI, IngresseAPI_UserService, $sce) {
            $scope.isVisible = false;
            $scope.url = null;

            $scope.hide = function(){
                $scope.isVisible = false;
            };

            $scope.$on('showLogin',function(){
                $scope.url = $sce.trustAsResourceUrl(ingresseAPI.login());
                $scope.isVisible = true;
            });

            $scope.$on('showLogout',function() {
                $scope.url = $sce.trustAsResourceUrl(ingresseAPI.logout());
                $scope.isVisible = true;
            });

            $scope.$on('showRegister',function(){
                $scope.url = $sce.trustAsResourceUrl(ingresseAPI.register());
                $scope.isVisible = true;
            });

            $scope.$on('ingresseAPI.userHasLogged',function(event,data){
                $scope.isVisible = false;
                IngresseAPI_UserService.saveCredentials(data.token, data.userId);
                $scope.$apply();
            });
        },
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: '/bower_components/ingresse-websdk/directives/ingresse-login.html',
        link: function($scope, iElm, iAttrs, controller) {

        }
    };
});
