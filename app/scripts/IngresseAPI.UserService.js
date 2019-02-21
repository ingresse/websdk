'use strict';

angular.module('ingresseSDK')
.service('IngresseApiUserService',
    function UserService ($rootScope, ingresseApiPreferences, ingresseApiCookies) {
    return {
        data: {},
        credentials: {},
        getCredentials: function () {
            this.credentials.userId = ingresseApiCookies('userId');
            this.credentials.token  = ingresseApiCookies('token');
            this.credentials.jwt    = ingresseApiCookies('jwt');

            if (this.credentials.userId || this.credentials.token || this.credentials.jwt) {
                return this.credentials;
            }

            return false;
        },
        clearCredentials: function () {
            ingresseApiCookies('userId', '', -1);
            ingresseApiCookies('token', '', -1);
            ingresseApiCookies('jwt', '', -1);

            this.data               = null;
            this.credentials.userId = null;
            this.credentials.token  = null;
            this.credentials.jwt    = null;
        },
        saveCredentials: function (token, userId, jwt) {
            this.credentials.userId = userId;
            this.credentials.token  = token;
            this.credentials.jwt    = '';

            if (jwt) {
                this.credentials.jwt = jwt;

                ingresseApiCookies('jwt', jwt, 24, 'hours');
            }

            ingresseApiCookies('userId', userId, 7);
            ingresseApiCookies('token', token, 7);

            $rootScope.$broadcast('userSessionSaved');
        },
        saveLocation: function(location){
            this.city = location;
            ingresseApiCookies('city', this.city, 365);
            $rootScope.$broadcast('user_service.location_saved');
        },
        getLocation: function(){
            if(!this.city){
                return ingresseApiCookies('city');
            }

            return this.city;
        },
    };
});
