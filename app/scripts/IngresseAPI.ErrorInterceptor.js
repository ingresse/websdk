'use strict';

angular.module('ingresseSDK')
  .provider('ErrorInterceptor', function ($httpProvider) {
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
            // do something on error
            ingresseApiPreferences.httpCallStoped(rejection.config.url, false);
            var error = new Error('Não foi possível nos comunicar com os servidores da ingresse. Verifique sua conexão com a internet e tente novamente.');
            error.code = 503;

            return $q.reject(error);
          },
          'response': function (response) {
             // do something on error
            ingresseApiPreferences.httpCallStoped(response.config.url, true);

            if (!response.data.responseError) {
              return response;
            }

            var error = new Error();
            error.code = response.data.responseError.code;
            error.message = response.data.responseError.message;

            if (error.code === 1001) {
              error.message = 'Desculpe, mas você precisa selecionar pelo menos um ingresso.';
              return $q.reject(error);
            }

            if (error.code === 1005) {
              error.message = 'O usuário informado é diferente do usuário que gerou a transação. Você trocou de login no meio do processo? Por favor, recomeçe a operação.';
              return $q.reject(error);
            }

            if (error.code === 1006) {
              error.message = 'O campo e-mail não foi preenchido.';
              return $q.reject(error);
            }

            if (error.code === 1007) {
              error.message = 'O endereço de e-mail informado não é valido.';
              return $q.reject(error);
            }

            if (error.code === 1009) {
              error.message = 'Parâmetro do estado é inválido.';
              return $q.reject(error);
            }

            if (error.code === 1013 || error.code === 1014) {
              error.message = 'O número de parcelas não esta correto.';
              return $q.reject(error);
            }

            if (error.code === 1029 || error.code === 1030) {
              error.message = 'O código de desconto informado não esta correto.';
              return $q.reject(error);
            }

            if (error.code === 1031) {
              error.message = 'Está faltando alguma informação do cartão de crédito, verifique se você não esqueceu de preencher algo.';
              return $q.reject(error);
            }

            if (error.code === 1032) {
              error.message = 'Você esqueceu de preencher o campo CPF.';
              return $q.reject(error);
            }

            if (error.code === 1032) {
              error.message = 'Você esqueceu de preencher o campo CPF.';
              return $q.reject(error);
            }

            if (error.code === 1089) {
              error.message = 'Faltou uma informação necessária: ';
              var errorFields = [];
              var key;

              for (key in error.fields) {
                if (error.fields.hasOwnProperty(key)) {
                  if (key === 'event') {
                    errorFields.push('Id do evento');
                  }
                }
              }

              if (errorFields.length > 0) {
                error.message = errorFields.toString();
              }

              return $q.reject(error);
            }

            if (error.code === 2004) {
              error.message = 'Você já acessou a última página';
              return $q.reject(error);
            }

            if (error.code === 2005) {
              error.message = 'É preciso fazer login para continuar';
              return $q.reject(error);
            }

            if (error.code === 2007) {
              error.message = 'Esta aplicação não possui permissão para realizar a operação de login';
              return $q.reject(error);
            }

            if (error.code === 2008) {
              error.message = 'Sua conexão não está segura (https)';
              return $q.reject(error);
            }

            if (error.code === 2009) {
              error.message = 'Aparentemente você não tem permissão para realizar esta tarefa';
              return $q.reject(error);
            }

            if (error.code === 2011) {
              error.message = 'Para continuar você precisa ser o dono do evento';
              return $q.reject(error);
            }

            if (error.code === 2015) {
              error.message = 'Opa! Parece que a configuração de dia e hora não está ok. Verifique se o dia e hora no seu computador ou celular está configurado corretamente. Cod:2015';
              return $q.reject(error);
            }

            if (error.code === 2016) {
              error.message = 'Aparentemente você não tem permissão para realizar esta tarefa';
              return $q.reject(error);
            }

            if (error.code === 2020) {
              error.message = 'Senha inválida';
              return $q.reject(error);
            }

            if (error.code === 2021) {
              error.message = 'Seu e-mail não foi encontrado';
              return $q.reject(error);
            }

            if (error.code === 2022) {
              error.message = 'Não foi possível enviar o e-mail';
              return $q.reject(error);
            }

            if (error.code === 2028) {
              error.message = 'Desculpe, mas este usuário não possui permissão de venda para este evento.';
              return $q.reject(error);
            }

            if (error.code === 3002) {
              error.message = 'Desculpe, mas o evento solicitado não existe em nosso banco de dados.';
              return $q.reject(error);
            }

            if (error.code === 3003) {
              error.message = 'Desculpe, este usuário não existe.';
              return $q.reject(error);
            }

            if (error.code === 3014) {
              error.message = 'A quantidade total de ingressos selecionados não está disponível. Experimente diminuir a quantidade de ingressos.';
              return $q.reject(error);
            }

            if (error.code === 3020) {
              error.message = 'Desculpe, mas não há ingressos cadastrados para o evento solicitado.';
              return $q.reject(error);
            }

            if (error.code === 3023) {
              error.message = 'Sua sessão de compra expirou. Por favor, refaça o processo de compra.';
              return $q.reject(error);
            }

            if (error.code === 3036) {
              error.message = 'Desculpe, somente é possível estornar transações aprovadas.';
              return $q.reject(error);
            }

            if (error.code === 5001) {
              error.message = 'Não conseguimos nos conectar ao seu facebook... Por favor, faça o login no seu facebook e tente novamente.';
              return $q.reject(error);
            }

            if (error.code === 5002) {
              error.message = 'Houve um problema de comunicação com nosso gateway de pagamento. Por favor tente novamente.';
              return $q.reject(error);
            }

            if (error.code === 6014) {
              error.message = 'Você excedeu o limite de ingressos disponíveis por conta. Para mais informações, verifique a descrição do evento.';
              return $q.reject(error);
            }

            $log.error(error);
            error.message = 'Houve um erro inesperado, por favor entre em contato com a ingresse e informe o código: ' + error.code;
            return $q.reject(error);
          }
        };
      }
    };
  });
