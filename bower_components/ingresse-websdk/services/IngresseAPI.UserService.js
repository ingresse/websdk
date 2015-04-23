angular.module('ingresseSDK').service('IngresseAPI_UserService', function UserService($rootScope, ipCookie){
    return {
        data: null,
        userId: null,
        token: null,
        userHasLoggedOut: function () {
            $rootScope.$broadcast('userHasLoggedOut');
        },
        login: function(){
            this.userId = ipCookie('userId');
            this.token = ipCookie('token');

            if(!this.userId || !this.token){
                $rootScope.$broadcast('showLogin');
                return;
            }

            $rootScope.$broadcast('userSessionSaved');
        },
        register: function(){
            $rootScope.$broadcast('showRegister');
        },
        logout: function(){
            ipCookie.remove('userId');
            ipCookie.remove('token');
            $rootScope.$broadcast('showLogout');

            this.data = null;
            this.userId = null;
            this.token = null;
        },
        saveCredentials: function (token, userId){
            this.userId = userId;
            this.token = token;
            ipCookie('userId', userId, { expires: 7 });
            ipCookie('token', token, { expires: 7 });
            $rootScope.$broadcast('userSessionSaved');
        },
        saveLocation: function(location){
            this.city = location;
            ipCookie('city',this.city,365);
            $rootScope.$broadcast('user_service.location_saved');
        },
        getLocation: function(){
            if(!this.city){
                return $cookies.city;
            }

            return this.city;
        }
    }
});
