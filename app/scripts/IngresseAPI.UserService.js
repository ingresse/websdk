'use strict';

angular.module('ingresseSDK').service('IngresseApiUserService', function UserService($rootScope, ipCookie){
    return {
        data: {},
        credentials: {},
        getCredentials: function () {
            this.credentials.userId   = ipCookie('userId');
            this.credentials.token    = ipCookie('token');
            this.credentials.jwtToken = ipCookie('jwtToken');

            if (this.credentials.userId || this.credentials.token || this.credentials.jwtToken) {
                return this.credentials;
            }

            return false;
        },
        clearCredentials: function () {
            ipCookie('userId', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('token', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('jwtToken', '', { expires: -1, domain: '.ingresse.com' });
            ipCookie('userId', '', { expires: -1});
            ipCookie('token', '', { expires: -1});
            ipCookie('jwtToken', '', { expires: -1});

            this.data                 = null;
            this.credentials.userId   = null;
            this.credentials.token    = null;
            this.credentials.jwtToken = null;
        },
        saveCredentials: function (token, userId, jwtToken) {
            this.credentials.userId = userId;
            this.credentials.token  = token;
            
            if (jwtToken) {
                this.credentials.jwtToken = jwtToken;
                ipCookie('jwtToken', jwtToken, { expires: 7, domain: '.ingresse.com' });
                
            } else if (ipCookie('jwtToken') && ipCookie('userId') === this.credentials.userId) {
                this.credentials.jwtToken = ipCookie('jwtToken');
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
