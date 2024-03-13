'use strict';

angular.module('ingresseSDK')
  .provider('ErrorInterceptor', function ($httpProvider, ingresseErrors) {
    $httpProvider.interceptors.push('ErrorInterceptor');

    return {
      $get: function ($q, ingresseApiPreferences, $log) {
        return {
          // optional method
          'request': function (config) {
            if (config.url.indexOf(ingresseApiPreferences.getHost()) > -1) {
              ingresseApiPreferences.httpCallStarted(config.url);
            }

            return config;
          },
          'responseError': function (rejection) {
            ingresseApiPreferences.httpCallStoped(rejection.config.url, false);

            var error = new Error('Não foi possível nos comunicar com os servidores da ingresse. Verifique sua conexão com a internet e tente novamente.');

            error.code = 503;

            return $q.reject(error);
          },
          'response': function (response) {
            ingresseApiPreferences.httpCallStoped(response.config.url, true);

            if (!response || !response.data || !response.data.responseError) {
              return response;
            }

            var error = new Error();
            var LOCALE = (function() {
              var name = 'locale=';
              var cookieValue = (document.cookie.split(';')
                  .map(function(cookie) {
                      return cookie.trim();
                  })
                  .find(function(cookie) {
                      return cookie.startsWith(name);
                  }) || '')
                  .substring(name.length)
                  .split('=')
                  .pop();
          
              return cookieValue || 'pt-BR';
          })();
          
            error.code = response.data.responseError.code;
            error.fields = response.data.responseError.fields;
            error.raw = response.data.responseError.message;
            error.message = '';

            if (error.code) {
              var ERRORS = ingresseErrors.filter(function (error) { return error.locale === LOCALE })

              ERRORS.some(function (translated) {
                if (translated.codes.indexOf(error.code) >= 0) {
                  error.message = translated.message;

                  return true;
                } else {
                  return false;
                }
              });
            }

            if (!error.message) {
              switch (LOCALE) {
                  case 'es-ES':
                      error.message = 'Hubo un error inesperado, comuníquese con Ingresse e informe el código:';
                      break;
                  case 'en-US':
                      error.message = 'An unexpected error occurred, please contact Ingresse and provide the code:';
                      break;
                  default:
                      error.message = 'Houve um erro inesperado, por favor entre em contato com a Ingresse e informe o código:';
              }
          }
          

            error.message = (error.message + ' (#' + error.code + ')');

            $log.error(error);

            return $q.reject(error);
          }
        };
      }
    };
  });
