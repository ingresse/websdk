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
            var LOCALE = localStorage.getItem('@ingresse:locale') || 'pt-BR'

            error.code = response.data.responseError.code;
            error.fields = response.data.responseError.fields;
            error.raw = response.data.responseError.message;
            error.message = '';

            if (error.code) {
              var ERRORS = ingresseErrors.filter(error => error.locale === LOCALE)

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
              error.message = LOCALE === 'pt-BR' ?
                'Houve um erro inesperado, por favor entre em contato com a ingresse e informe o código' :
                'Hubo un error inesperado, comuníquese con Ingress e informe el código'
            }

            error.message = (error.message + ' (#' + error.code + ')');

            $log.error(error);

            return $q.reject(error);
          }
        };
      }
    };
  });
