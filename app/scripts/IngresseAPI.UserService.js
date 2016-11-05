'use strict';

angular.module('ingresseSDK').service('IngresseApiUserService', function UserService($rootScope, ipCookie){
    return {
        data: {},
        credentials: {},
        getCredentials: function () {
            this.credentials.userId = ipCookie('userId');
            this.credentials.token  = ipCookie('token');
            this.credentials.jwt    = ipCookie('jwt');

            if (this.credentials.userId || this.credentials.token || this.credentials.jwt) {
                return this.credentials;
            }

            return false;
        },
        clearCredentials: function () {
            ipCookie('userId', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('token', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('jwt', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('userId', '', { expires: -1});
            ipCookie('token', '', { expires: -1});
            ipCookie('jwt', '', { expires: -1});

            this.data               = null;
            this.credentials.userId = null;
            this.credentials.token  = null;
            this.credentials.jwt    = null;
        },
        saveCredentials: function (token, userId, jwt) {
            this.credentials.userId = userId;
            this.credentials.token  = token;

            if (jwt) {
                this.credentials.jwt = jwt;

                ipCookie('jwt', jwt, {
                    domain        : '.ingresse.com',
                    expires       : 24,
                    expirationUnit: 'hours'
                });
            }

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
