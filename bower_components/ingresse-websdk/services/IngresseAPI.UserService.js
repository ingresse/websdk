angular.module('ingresseSDK').service('IngresseAPI_UserService', function UserService($rootScope, ipCookie){
    return {
        data: null,
        userId: null,
        token: null,
        userHasLoggedOut: function () {
            $rootScope.$broadcast('userHasLoggedOut');
        },
        login: function(){
            if(!this.getSavedLogin()){
                $rootScope.$broadcast('showLogin');
                return;
            }
        },
        getSavedLogin: function () {
            this.userId = ipCookie('userId');
            this.token = ipCookie('token');

            if(this.userId || this.token){
                $rootScope.$broadcast('userSessionSaved');
                return true;
            }

            return false;
        },
        register: function(){
            $rootScope.$broadcast('showRegister');
        },
        logout: function(){
            ipCookie('userId', "", { expires: -1, domain: '.ingresse.com' });
            ipCookie('token', "", { expires: -1, domain: '.ingresse.com' });
            $rootScope.$broadcast('showLogout');

            this.data = null;
            this.userId = null;
            this.token = null;
        },
        saveCredentials: function (token, userId){
            this.userId = userId;
            this.token = token;
            ipCookie('userId', userId, { expires: 7, domain: '.ingresse.com' });
            ipCookie('token', token, { expires: 7, domain: '.ingresse.com' });
            $rootScope.$broadcast('userSessionSaved');
        },
        saveLocation: function(location){
            this.city = location;
            ipCookie('city',this.city, {expires: 365, domain:'.ingresse.com'});
            $rootScope.$broadcast('user_service.location_saved');
        },
        getLocation: function(){
            if(!this.city){
                return ipCookie('city');
            }

            return this.city;
        }
    }
});
