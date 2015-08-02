angular.module('ingresseSDK').directive('ingresseLogin', function (ingresseApiPreferences) {
    return {
        scope: {}, // {} = isolate, true = child, false/undefined = no change
        controller: function($scope, $rootScope, $element, $attrs, $transclude, ingresseAPI, IngresseApiUserService, $sce) {
            $scope.isVisible = false;
            $scope.url = null;

            $scope.hide = function(){
                $scope.isVisible = false;
            };

            $scope.$on('showLogin',function(){
                $scope.url = $sce.trustAsResourceUrl(ingresseAPI.login.getAuthorizeUrl());
                $scope.isVisible = true;
            });

            $scope.$on('showLogout',function() {
                $scope.url = $sce.trustAsResourceUrl(ingresseAPI.login.getLogoutURL());
                $scope.isVisible = true;
            });

            $scope.$on('showRegister',function(){
                $scope.url = $sce.trustAsResourceUrl(ingresseAPI.register());
                $scope.isVisible = true;
            });

            $scope.$on('ingresseAPI.userHasLogged',function(event,data){
                $scope.isVisible = false;
                if (data.token && data.userId) {
                    IngresseApiUserService.saveCredentials(data.token, data.userId);
                } else {
                    IngresseApiUserService.userHasLoggedOut();
                }
                $scope.$apply();
            });
        },
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: ingresseApiPreferences.templates_directory + 'ingresse-login.html',
        link: function($scope, iElm, iAttrs, controller) {

        }
    };
});
