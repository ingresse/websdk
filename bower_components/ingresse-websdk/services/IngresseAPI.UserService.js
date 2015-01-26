angular.module('ingresseSDK').service('IngresseAPI_UserService', function UserService($rootScope){
    return {
        data: null,
        userId: null,
        token: null,
        login: function(){
            if(!this.userId || !this.token){
                $rootScope.$broadcast('showLogin');
                return;
            }
        },
        register: function(){
            $rootScope.$broadcast('showRegister');
        },
        logout: function(){
            document.cookie = "userid=; expires=Fri, 31 Dec 1960 23:59:59 GMT; path=/";
            document.cookie = "token=; expires=Fri, 31 Dec 1960 23:59:59 GMT; path=/";
            $rootScope.$broadcast('showLogout');
            this.data = null;
            this.userId = null;
            this.token = null;
        },
        saveCredentials: function (token, userId){
            this.userId = userId;
            this.token = token;
            $rootScope.$broadcast('userSessionSaved');
        }
    }
});
