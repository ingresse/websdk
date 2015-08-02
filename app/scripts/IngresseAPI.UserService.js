'use strict';

angular.module('ingresseSDK').service('IngresseApiUserService', function UserService($rootScope, ipCookie){
    return {
        data: null,
        credentials: {},
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
            this.credentials.userId = ipCookie('userId');
            this.credentials.token = ipCookie('token');

            if(this.credentials.userId || this.credentials.token){
                $rootScope.$broadcast('userSessionSaved');
                return true;
            }

            return false;
        },
        register: function(){
            $rootScope.$broadcast('showRegister');
        },
        logout: function(){
            ipCookie('userId', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('token', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('userId', '', { expires: -1});
            ipCookie('token', '', { expires: -1});
            $rootScope.$broadcast('showLogout');

            this.data = null;
            this.credentials.userId = null;
            this.credentials.token = null;
        },
        saveCredentials: function (token, userId){
            this.credentials.userId = userId;
            this.credentials.token = token;
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
    };
});
