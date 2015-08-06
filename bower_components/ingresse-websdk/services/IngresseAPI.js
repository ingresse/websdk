/* global angular */
/*jslint browser: true*/
/*global PagarMe:true, CryptoJS: true*/

function receiveMessage(event) {
  if (event.origin !== "https://dk57nqppwurwj.cloudfront.net" && event.origin !== "https://compra.ingresse.com") {
    return;
  }

  var obj = JSON.parse(event.data);
  angular.element(document.body).scope().$broadcast('ingresseAPI.userHasLogged', obj);
}

window.addEventListener("message", receiveMessage, false);

angular.module('ingresseSDK').provider('ingresseAPI', function ($httpProvider) {
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function (obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      if (obj.hasOwnProperty(name)) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            if (value.hasOwnProperty(subName)) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function (data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];

  $httpProvider.interceptors.push(function ($q, ingresseAPI_Preferences, $log) {
    return {
      // optional method
      'request': function (config) {
        if (config.url.indexOf(ingresseAPI_Preferences.getHost()) > -1) {
          ingresseAPI_Preferences.httpCallStarted(config.url);
        }
        return config;
      },
      'responseError': function (rejection) {
        // do something on error
        ingresseAPI_Preferences.httpCallStoped(rejection.config.url, false);
        var error = new Error("Não foi possível nos comunicar com os servidores da ingresse. Verifique sua conexão com a internet e tente novamente.");
        error.code = 503;

        return $q.reject(error);
      },
      'response': function (response) {
         // do something on error
        ingresseAPI_Preferences.httpCallStoped(response.config.url, true);

        if (!response.data.responseError) {
          return response;
        }

        var error = new Error();
        error.code = response.data.responseError.code;
        error.message = response.data.responseError.message;

        if (error.code === 1001) {
          error.message = "Desculpe, mas você precisa selecionar pelo menos um ingresso.";
          return $q.reject(error);
        }

        if (error.code === 1005) {
          error.message = "O usuário informado é diferente do usuário que gerou a transação. Você trocou de login no meio do processo? Por favor, recomeçe a operação.";
          return $q.reject(error);
        }

        if (error.code === 1006) {
          error.message = "O campo e-mail não foi preenchido.";
          return $q.reject(error);
        }

        if (error.code === 1007) {
          error.message = "O endereço de e-mail informado não é valido.";
          return $q.reject(error);
        }

        if (error.code === 1009) {
          error.message = "Parâmetro do estado é inválido.";
          return $q.reject(error);
        }

        if (error.code === 1013 || error.code === 1014) {
          error.message = "O número de parcelas não esta correto.";
          return $q.reject(error);
        }

        if (error.code === 1029 || error.code === 1030) {
          error.message = "O código de desconto inforado não esta correto.";
          return $q.reject(error);
        }

        if (error.code === 1031) {
          error.message = "Esta faltando alguma informação do cartão de crédito, verifique se você não esqueceu de preencher algo.";
          return $q.reject(error);
        }

        if (error.code === 1032) {
          error.message = "Você esqueceu de preencher o campo CPF.";
          return $q.reject(error);
        }

        if (error.code === 1032) {
          error.message = "Você esqueceu de preencher o campo CPF.";
          return $q.reject(error);
        }

        if (error.code === 1089) {
          error.message = "Faltou uma informação necessária: ";
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
          error.message = "Você já acessou a última página";
          return $q.reject(error);
        }

        if (error.code === 2005) {
          error.message = "É preciso fazer login para continuar";
          return $q.reject(error);
        }

        if (error.code === 2007) {
          error.message = "Esta aplicação não possui permissão para realizar a operação de login";
          return $q.reject(error);
        }

        if (error.code === 2008) {
          error.message = "Sua conexão não esta segura (https)";
          return $q.reject(error);
        }

        if (error.code === 2009) {
          error.message = "Aparentemente você não tem permissão para realizar esta tarefa";
          return $q.reject(error);
        }

        if (error.code === 2011) {
          error.message = "Para continuar você precisa ser o dono do evento";
          return $q.reject(error);
        }

        if (error.code === 2015) {
          error.message = "Opa! Parece que a configuração de dia e hora não está ok. Verifique se o dia e hora no seu computador ou celular está configurado corretamente. Cod:2015";
          return $q.reject(error);
        }

        if (error.code === 2016) {
          error.message = "Aparentemente você não tem permissão para realizar esta tarefa";
          return $q.reject(error);
        }

        if (error.code === 2020) {
          error.message = "Senha inválida";
          return $q.reject(error);
        }

        if (error.code === 2021) {
          error.message = "Seu e-mail não foi encontrado";
          return $q.reject(error);
        }

        if (error.code === 2022) {
          error.message = "Não foi possível enviar o e-mail";
          return $q.reject(error);
        }

        if (error.code === 2028) {
          error.message = "Desculpe, mas este usuário não possui permissão de venda para este evento.";
          return $q.reject(error);
        }

        if (error.code === 3002) {
          error.message = "Desculpe, mas o evento solicitado não existe em nosso banco de dados.";
          return $q.reject(error);
        }

        if (error.code === 3003) {
          error.message = "Desculpe, este usuário não existe.";
          return $q.reject(error);
        }

        if (error.code === 3020) {
          error.message = "Desculpe, mas não há ingressos cadastrados para o evento solicitado.";
          return $q.reject(error);
        }

        if (error.code === 3036) {
          error.message = "Desculpe, somente é possível estornar transações aprovadas.";
          return $q.reject(error);
        }

        if (error.code === 5001) {
          error.message = "Não conseguimos nos conectar ao seu facebook... Por favor, faça o login no seu facebook e tente novamente.";
          return $q.reject(error);
        }

        if (error.code === 5002) {
          error.message = "Houve um problema de comunicação com nosso gateway de pagamento. Por favor tente novamente.";
          return $q.reject(error);
        }

        if (error.code === 6014) {
          error.message = "Você excedeu o limite de ingressos disponíveis por conta. Para mais informações, verifique a descrição do evento.";
          return $q.reject(error);
        }

        $log.error(error);
        error.message = "Houve um erro inesperado, por favor entre em contato com a ingresse e informe o código: " + error.code;
        return $q.reject(error);
      }
    };
  });

  return {
    $get: function ($http, $q, ingresseAPI_Preferences) {
      return {
        // ENCODE ANY STRING TO BE USED IN URLS
        urlencode: function (str) {
          str = str.toString();

          return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+');
        },

        /*  GENERATES THE PROPER AUTHENTICATION KEY FOR API CALLS, NEED THE PRIVATE AND PUBLIC KEYS OF APPLICATION SETTED WITH ingresseAPIProvider.

          Ex:
          angular.module('yourAppModuleName').config(function (ingresseAPIProvider) {
            ingresseAPIProvider.setPublicKey('your public key');
            ingresseAPIProvider.setPrivateKey('your private key');
          });

          RETURNS THE STRING TO BE USED ON API CALLS.
        */
        generateAuthKey : function () {

          if (!ingresseAPI_Preferences.privatekey && !ingresseAPI_Preferences.publickey) {
            return;
          }

          var formatTwoCaracters = function (value) {
            if (value < 10) {
              value = "0" + value;
            }
            return value;
          };

          var now = new Date();
          var UTCYear = now.getUTCFullYear();
          var UTCMonth = formatTwoCaracters(now.getUTCMonth() + 1);
          var UTCDay = formatTwoCaracters(now.getUTCDate());
          var UTCHours = formatTwoCaracters(now.getUTCHours());
          var UTCMinutes = formatTwoCaracters(now.getUTCMinutes());
          var UTCSeconds = formatTwoCaracters(now.getUTCSeconds());

          var timestamp = UTCYear + "-" + UTCMonth + "-" + UTCDay + "T" + UTCHours + ":" + UTCMinutes + ":" + UTCSeconds + "Z";
          var data1 = ingresseAPI_Preferences.publickey + timestamp;
          var data2 = CryptoJS.HmacSHA1(data1, ingresseAPI_Preferences.privatekey);
          var computedSignature = data2.toString(CryptoJS.enc.Base64);
          var authenticationString = "?publickey=" + ingresseAPI_Preferences.publickey + "&signature=" + this.urlencode(computedSignature) + "&timestamp=" + this.urlencode(timestamp);

          return authenticationString;
        },

        /*
          BUSCA INFORMAÇÕES DE UM ÚNICO EVENTO
          eventId: int
          fields: string
        */
        getEvent: function (eventId, fields, usertoken) {
          var deferred = $q.defer();
          var url;

          if (angular.isNumber(parseInt(eventId, 10)) && !isNaN(eventId)) {
            url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + this.generateAuthKey();
          } else {
            url = ingresseAPI_Preferences.getHost() + '/event/' + this.generateAuthKey() + '&method=identify&link=' + eventId;
          }

          if (usertoken) {
            url += '&usertoken=' + usertoken;
          }

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getEventCrew: function (eventId, fields, usertoken) {
          var deferred = $q.defer();
          var url;

          url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/crew' + this.generateAuthKey();

          if (usertoken) {
            url += '&usertoken=' + usertoken;
          }

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getVisitsReport: function (eventId, filters, usertoken) {
          var deferred = $q.defer();
          var url;

          url = ingresseAPI_Preferences.getHost() + '/dashboard/' + eventId + '/visitsReport' + this.generateAuthKey();

          if (usertoken) {
            url += '&usertoken=' + usertoken;
          }

          if (filters) {
            if (filters.from) {
              url += '&from=' + filters.from;
            }

            if (filters.to) {
              url += '&to=' + filters.to;
            }
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getEventSalesTimeline: function (eventId, token, filters) {
          var deferred = $q.defer();
          var url;

          url = ingresseAPI_Preferences.getHost() + '/dashboard/' + eventId + '/timeline' + this.generateAuthKey() + '&usertoken=' + token;

          if (filters) {
            angular.forEach(filters, function (value, key) {
              if (value) {
                url += '&' + key + '=' + value;
              }
            });
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },


        getError: function (errorClass) {
          var deferred = $q.defer();
          var url;

          if (errorClass) {
            url = ingresseAPI_Preferences.getHost() + '/error/' + errorClass + this.generateAuthKey();
          } else {
            url = ingresseAPI_Preferences.getHost() + '/error/' + this.generateAuthKey();
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getProducerCustomerProfile: function (producerId, token) {
          var deferred = $q.defer();
          var url;

          url = ingresseAPI_Preferences.getHost() + '/producer/' + producerId + '/customerProfile/' +  this.generateAuthKey() + '&usertoken=' + token;

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getProducerSalesForCostumer: function (identifier, token, filters) {
          var deferred = $q.defer();
          var url;

          url = ingresseAPI_Preferences.getHost() + '/producer/' + identifier.producerId + '/customer/' + identifier.costumerId + '/sale' +  this.generateAuthKey() + '&usertoken=' + token;

          if (filters) {
            angular.forEach(filters, function (value, key) {
              if (value) {
                url += '&' + key + '=' + value;
              }
            });
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        /*
          BUSCA UMA LISTA DE EVENTOS
          eventId: int
          fields: string
        */
        getEventList: function (fields, filters, page, pageSize) {
          var deferred = $q.defer();
          var url = ingresseAPI_Preferences.getHost() + '/event/' + this.generateAuthKey();

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          if (page) {
            url += '&page=' + page;
          }

          if (pageSize) {
            url += '&pageSize=' + pageSize;
          }

          if (filters) {
            if (filters.lat) {
              url += '&lat=' + filters.lat;
            }

            if (filters.long) {
              url += '&long=' + filters.long;
            }

            if (filters.from) {
              url += '&from=' + filters.from;
            }

            if (filters.to) {
              url += '&to=' + filters.to;
            }

            if (filters.state) {
              url += '&state=' + filters.state;
            }

            if (filters.term) {
              url += '&term=' + filters.term;
            }
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },


        /*
          Ingressos de um evento
          eventId: int
        */
        getEventTickets: function (eventId, usertoken, pos, passkey) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/tickets/' + this.generateAuthKey();

          if (usertoken) {
            url += '&usertoken=' + usertoken;
          }

          if (passkey) {
            url += '&passkey=' + passkey;
          }

          if (pos) {
            url += '&pos=true';
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        /*
          Dados do usuário
          userid: int
          token: string
          fields: string
        */
        getUser: function (userid, token, fields) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + this.generateAuthKey();

          if (token) {
            url += '&usertoken=' + token;
          }

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getUserTickets: function (userid, token, fields, filters) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + '/tickets' + this.generateAuthKey() + '&usertoken=' + token;

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          if (filters) {
            if (filters.event) {
              url += '&event=' + filters.event;
            }

            if (filters.term) {
              url += '&term=' + filters.term;
            }
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        /*
        BUSCA EVENTOS DO USUÁRIO
          userid: int
          token: string
          fields: string
          filters: {
            term: string
          }
        */
        getUserEvents: function (userid, token, fields, filters, page, pageSize) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + '/events' + this.generateAuthKey() + '&usertoken=' + token;

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          if (page) {
            url += '&page=' + page;
          }

          if (pageSize) {
            url += '&pageSize=' + pageSize;
          }

          if (filters) {
            if (filters.lat) {
              url += '&lat=' + filters.lat;
            }

            if (filters.long) {
              url += '&long=' + filters.long;
            }

            if (filters.from) {
              url += '&from=' + filters.from;
            }

            if (filters.to) {
              url += '&to=' + filters.to;
            }

            if (filters.state) {
              url += '&state=' + filters.state;
            }

            if (filters.term) {
              url += '&term=' + filters.term;
            }
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },


        /*
          GET SALES INFORMATION
          At least one of the filters must be used: event, from-to. All the transaction will be available depending of user privileges. As event owner, transaction access are limited to transaction from his own events.

          FILTERS
          id: List of transaction IDs. Filter transactions by their IDs.
          channel: List of transaction IDs. Filter transactions by their IDs.
          event: Retrieve transaction for a specific event ID.
          session: List of date IDs. Filter transactions information for the specified session. Requires event filter.
          from: Filter transaction values for sales from the date specified. Format: Y-m-d. Limit of 180 days base. Requires to date to be specified.
          to: Filter transaction values for sales until the date specified. Format: Y-m-d. Limit of 180 days base. Requires from date to be specified.
          status: Array of status to filter transactions. Options: approved, declined, pending.
          term: Filter transactions by guest name, buyer e-mail or transactionId. It should not match exactly to consider a valid result.
        */
        getSales: function (token, filters, page) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/sale/' + this.generateAuthKey() + '&usertoken=' + token;

          if (page) {
            url += '&page=' + page;
          }

          if (filters) {
            angular.forEach(filters, function (value, key) {
              if (value) {
                url += '&' + key + '=' + value;
              }
            });
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },


        getSalesReport: function (eventId, token, filters) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/dashboard/' + eventId + '/' + this.generateAuthKey() + '&usertoken=' + token;

          if (filters) {
            angular.forEach(filters, function (value, key) {
              if (value) {
                url += '&' + key + '=' + value;
              }
            });
          };

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },



        /* UPDATE USER INFO

          PARAMETERS
          userObj = {
            name: '',
            lastname: '',
            street: '',
            number: '',
            complement: '',
            district: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
          }
        */
        updateUserInfo: function (userid, token, userObj) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + this.generateAuthKey() + '&usertoken=' + token + '&method=update';

          $http.post(url, userObj)
            .success(function (response) {
              if (angular.isObject(response.responseData)) {
                deferred.resolve(true);
              } else {
                deferred.reject();
              }
            })
            .error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },


        refund: function (token, transactionId, reason) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/sale/' + transactionId + this.generateAuthKey() + '&usertoken=' + token + '&method=refund';

          $http.post(url, {reason: reason})
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        /*
          Atualiza status de ingressos
          eventId: int
          token: token do usuário

        */
        updateTicketStatus: function (eventId, token, tickets) {
          var deferred = $q.defer();

          if (!token) {
            deferred.reject('Token do usuário não foi informado.');
            return deferred.promise;
          }

          if (!eventId) {
            deferred.reject('O id do evento não foi informado.');
            return deferred.promise;
          }

          if (!tickets) {
            deferred.reject('Os ingressos não foram informados');
            return deferred.promise;
          }

          var url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/guestlist' + this.generateAuthKey() + '&method=updatestatus' + '&usertoken=' + token;

          var obj = {
            tickets: tickets
          };

          $http.post(url, obj)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getCheckinReport: function (eventId, token, fields) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/guestlist' + this.generateAuthKey() + '&usertoken=' + token + '&method=report';

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getProducerSalesGroupReport: function(producerId, token, filters) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/producer/' + producerId + '/salesgroupReport' + this.generateAuthKey() + '&usertoken=' + token;

          if (filters) {
            angular.forEach(filters, function (value, key) {
              if (value) {
                url += '&' + key + '=' + value;
              }
            });
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getProducerCostumersCSV: function(producerId, token, filters) {
          var url =  ingresseAPI_Preferences.getHost() + '/producer/' + producerId + '/customerExport' + this.generateAuthKey() + '&usertoken=' + token;

          if (filters) {
            if (filters.scorefrom) {
              url += '&scorefrom=' + filters.scorefrom;
            }

            if (filters.scoreto) {
              url += '&scoreto=' + filters.scoreto;
            }

            if (filters.event) {
              url += '&event=' + filters.event;
            }

            if (filters.platform) {
              url += '&platform=' + filters.platform;
            }

            if (filters.classification) {
              url += '&classification=' + filters.classification;
            }

            if (filters.term) {
              url += '&term=' + filters.term;
            }
          }

          return url;
        },

        getProducerCostumers: function (producerId, token, filters, page, pageSize) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/producer/' + producerId + '/customer' + this.generateAuthKey() + '&usertoken=' + token;

          if (page) {
            url += '&page=' + page;
          }

          if (pageSize) {
            url += '&pageSize=' + pageSize;
          }

          if (filters) {
            if (filters.scorefrom) {
              url += '&scorefrom=' + filters.scorefrom;
            }

            if (filters.scoreto) {
              url += '&scoreto=' + filters.scoreto;
            }

            if (filters.event) {
              url += '&event=' + filters.event;
            }

            if (filters.platform) {
              url += '&platform=' + filters.platform;
            }

            if (filters.classification) {
              url += '&classification=' + filters.classification;
            }

            if (filters.term) {
              url += '&term=' + filters.term;
            }
          }



          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getGuestList: function (eventId, token, fields, filters, page, pageSize) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/guestlist' + this.generateAuthKey() + '&usertoken=' + token;

          if (fields) {
            url += '&fields=' + fields.toString();
          }

          if (page) {
            url += '&page=' + page;
          }

          if (pageSize) {
            url += '&pageSize=' + pageSize;
          }

          if (filters) {
            if (filters.status) {
              url += '&status=' + filters.status;
            }

            if (filters.term) {
              url += '&term=' + filters.term;
            }

            if (filters.channel) {
              url += '&channel=' + filters.channel;
            }

            if (filters.tickettypeid) {
              url += '&tickettypeid=' + filters.tickettypeid;
            }

            if (filters.sessionid) {
              url += '&sessionid=' + filters.sessionid;
            }

            if (filters.from) {
              url += '&from=' + filters.from;
            }
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getTransactionData: function (transactionId, token) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/sale/' + transactionId + this.generateAuthKey() + '&usertoken=' + token;

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getTransactionReport: function(eventId, token, filters) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/dashboard/' + eventId + '/transactionReport' + this.generateAuthKey() + '&usertoken=' + token;

          if (filters) {
            angular.forEach(filters, function (value, key) {
              if (value) {
                url += '&' + key + '=' + value;
              }
            });
          }

          $http.get(url)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        getUserPhotoUrl: function (userid) {
          return ingresseAPI_Preferences.getHost() + '/user/' + userid + '/picture/' + this.generateAuthKey();
        },

        login: function () {
          var url = ingresseAPI_Preferences.getHost() + '/authorize/' + this.generateAuthKey();
          return url + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
        },

        logout: function () {
          var url = ingresseAPI_Preferences.getHost() + '/logout' + this.generateAuthKey();
          return url + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
        },

        register: function () {
          var url = ingresseAPI_Preferences.getHost() + '/register' + this.generateAuthKey();
          return url + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
        },

        getLoginWithFacebookUrl: function () {
          var url = ingresseAPI_Preferences.getHost() + '/authorize/facebook' + this.generateAuthKey() + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
          return url;
        },

        getRegisterWithFacebookUrl: function () {
          var url = ingresseAPI_Preferences.getHost() + '/register-from-facebook' + this.generateAuthKey() + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
          return url;
        },

        ticketReservation: function (eventId, userId, token, tickets, discountCode) {
          var deferred = $q.defer();

          var url = ingresseAPI_Preferences.getHost() + '/shop/' + this.generateAuthKey() + '&usertoken=' + token;

          var reservation = {
            eventId: eventId,
            userId: userId,
            tickets: tickets,
            discountCode: discountCode
          };

          $http.post(url, reservation)
            .success(function (response) {
              deferred.resolve(response.responseData);
            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },

        createPagarmeCard: function (transaction) {
          var field;

          //Create hash for pagar.me
          var creditCard = new PagarMe.creditCard();
          creditCard.cardHolderName = transaction.creditcard.name.toString();
          creditCard.cardExpirationMonth = transaction.creditcard.month.toString();
          creditCard.cardExpirationYear = transaction.creditcard.year.toString();
          creditCard.cardNumber = transaction.creditcard.number.toString();
          creditCard.cardCVV = transaction.creditcard.cvv.toString();

          // pega os erros de validação nos campos do form
          var fieldErrors = creditCard.fieldErrors();

          //Verifica se há erros
          var hasErrors = false;
          for (field in fieldErrors) {
            if (fieldErrors.hasOwnProperty(field)) {
              hasErrors = true;
              break;
            }
          }

          if (hasErrors) {
            var cardErrors = '';
            var key;

            for (key in fieldErrors) {
              if (fieldErrors.hasOwnProperty(key)) {
                cardErrors += ' ' + fieldErrors[key];
              }
            }

            var error = new Error(cardErrors);
            error.code = 1031;

            throw error;
          }

          // se não há erros, retorna o cartão...
          transaction.creditcard.pagarme = creditCard;
          return transaction;
        },

        /*
          userId: Id do usuário para quem a venda será realizada.
          token: token de acesso do usuário que esta fazendo a operação.
          transactionId: Id da transação.
          paymentMethod: Meio de pagamento.

          creditCard: {
            cpf: number,
            number: number,
            name: Nome que esta no cartão,
            cvv: Código de segurança,
            year: Ano de expiração,
            month: Mês de expiração
          }
        */
        payReservation: function (eventId, userId, token, transactionId, tickets, paymentMethod, creditCard, installments) {

          var deferred = $q.defer();
          var transactionDTO = {};
          var currentTransaction, url;
          var self = this;

          if (paymentMethod === 'BoletoBancario') {
            currentTransaction = {
              transactionId: transactionId,
              userId: userId,
              paymentMethod: paymentMethod,
              eventId: eventId,
              tickets: tickets
            };

            url = ingresseAPI_Preferences.getHost() + '/shop/' + self.generateAuthKey() + '&usertoken=' + token;

            $http.post(url, currentTransaction)
              .success(function (response) {
                if (!response.responseData.data) {
                  deferred.reject('Desculpe, houve um erro ao tentar gerar o boleto. Por favor entre em contato com a ingresse pelo número (11) 4264-0718.');
                  return;
                }

                if (response.responseData.data.status === "declined") {
                  deferred.reject(response.responseData.data.message);
                  return;
                }

                deferred.resolve(response.responseData.data);
              })
              .catch(function (error) {
                deferred.reject(error);
              });

            return deferred.promise;
          }

          // Pagamento com Cartão de Crédito.
          currentTransaction = {
            transactionId: transactionId,
            userId: userId,
            paymentMethod: paymentMethod,
            creditcard: creditCard,
            eventId: eventId,
            tickets: tickets
          };

          if (installments) {
            currentTransaction.installments = installments;
          }

          try {
            transactionDTO = this.createPagarmeCard(currentTransaction);
          }
          catch (err) {
            deferred.reject(err.message);
            return deferred.promise;
          }

          transactionDTO.creditcard.pagarme.generateHash(function (hash) {
            transactionDTO.creditcard = {
              cardHash: hash,
              cpf: transactionDTO.creditcard.cpf
            };

            url = ingresseAPI_Preferences.getHost() + '/shop/' + self.generateAuthKey() + '&usertoken=' + token;

            $http.post(url, transactionDTO)
              .success(function (response) {
                deferred.resolve(response.responseData.data);
              })
              .catch(function (error) {
                deferred.reject(error);
              });
          });

          return deferred.promise;
        }
      };
    }
  };
});
