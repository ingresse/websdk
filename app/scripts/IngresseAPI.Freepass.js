angular.module('ingresseSDK').service('IngresseAPI_Freepass', function ingresseAPI_Freepass($http, $timeout, ingresseAPI_Preferences, IngresseAPI_UserService, ingresseAPI, $q) {
    return {
        send: function (eventId, ticketTypeId, isHalfPrice, emails, verify, token) {
            var deferred = $q.defer();

            var url = ingresseAPI_Preferences.getHost() + '/freepass/' + ingresseAPI.generateAuthKey() + '&usertoken=' + token;

            if(verify) {
                url += '&verify=true';
            }

            var obj = {
                eventId: eventId,
                ticketTypeId: ticketTypeId,
                emails: emails,
                halfPrice: isHalfPrice
            }

            $http.post(url, obj)
            .success(function(response){
                deferred.resolve(response.responseData);
            })
            .catch(function(error){
                deferred.reject(error.message);
            });

            return deferred.promise;
        }
    }
});
