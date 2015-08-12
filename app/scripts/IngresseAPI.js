/// <reference path="../../typings/angularjs/angular.d.ts"/>
'use strict';

function receiveMessage (event) {
  console.log(event.origin);
  if (event.origin !== 'http://cdn.ingresse.com') {
    return;
  }

  var obj = JSON.parse(event.data);
  angular.element(document.body).scope().$broadcast('ingresseAPI.userHasLogged', obj);
}

window.addEventListener('message', receiveMessage, false);

angular.module('ingresseSDK').service('ingresseAPI', function ($http, $q, ingresseApiPreferences) {
  var API = {};

  API._urlencode = function (str) {
    str = str.toString();
    return encodeURIComponent(str);
  };

  API._formatTwoCaracters = function (value) {
    if (value < 10) {
      value = '0' + value;
    }
    return value;
  };

  API._generateAuthKey = function () {
    /*  GENERATES THE PROPER AUTHENTICATION KEY FOR API CALLS, NEED THE PRIVATE AND PUBLIC KEYS OF APPLICATION SETTED WITH ingresseAPIProvider.

      Ex:
      angular.module('yourAppModuleName').config(function (ingresseAPIProvider) {
        ingresseAPIProvider.setPublicKey('your public key');
        ingresseAPIProvider.setPrivateKey('your private key');
      });

      RETURNS THE STRING TO BE USED ON API CALLS.
    */
    if (!ingresseApiPreferences.privatekey && !ingresseApiPreferences.publickey) {
      return '?noauthdata';
    }

    var now = new Date();
    var UTCYear = now.getUTCFullYear();
    var UTCMonth = this._formatTwoCaracters(now.getUTCMonth() + 1);
    var UTCDay = this._formatTwoCaracters(now.getUTCDate());
    var UTCHours = this._formatTwoCaracters(now.getUTCHours());
    var UTCMinutes = this._formatTwoCaracters(now.getUTCMinutes());
    var UTCSeconds = this._formatTwoCaracters(now.getUTCSeconds());

    var timestamp = UTCYear + '-' + UTCMonth + '-' + UTCDay + 'T' + UTCHours + ':' + UTCMinutes + ':' + UTCSeconds + 'Z';
    var data1 = ingresseApiPreferences.publickey + timestamp;
    var data2 = CryptoJS.HmacSHA1(data1, ingresseApiPreferences.privatekey);
    var computedSignature = data2.toString(CryptoJS.enc.Base64);
    var authenticationString = '?publickey=' + ingresseApiPreferences.publickey + '&signature=' + API._urlencode(computedSignature) + '&timestamp=' + API._urlencode(timestamp);

    return authenticationString;
  };

  API._getUrlParameters = function (filters) {
    var parameters = '';
    var key;

    for (key in filters) {
      if (filters.hasOwnProperty(key)) {
        parameters += '&' + key + '=' + this._urlencode(filters[key]);
      }
    }

    return parameters;
  };

  API._get = function (method, identifier, parameters) {
    var deferred = $q.defer();
    var url;

    url = ingresseApiPreferences.getHost();

    if (method) {
      url += '/' + method;
    }

    if (identifier) {
      url += '/' + identifier;
    }

    url += API._generateAuthKey();
    url += API._getUrlParameters(parameters);

    $http.get(url)
      .success(function (response) {
        deferred.resolve(response.responseData);
      })
      .catch(function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  API._post = function (method, identifier, parameters, postParameters) {
    var deferred = $q.defer();
    var url;

    url = ingresseApiPreferences.getHost() + '/' + method;

    if (identifier) {
      url += '/' + identifier;
    }

    url += API._generateAuthKey();
    url += API._getUrlParameters(parameters);

    $http.post(url, postParameters)
      .success(function (response) {
        deferred.resolve(response.responseData);
      })
      .catch(function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  API.event = {
    get : function (eventId, filters) {
      var identifier;

      if (angular.isNumber(parseInt(eventId, 10)) && !isNaN(eventId)) {
        identifier = eventId;
      } else {
        filters.method = 'identify';
        filters.link = eventId;
      }

      return API._get('event', identifier, filters);
    },

    getCrew : function (eventId, filters, usertoken) {
      var identifier = eventId + '/crew';

      if (usertoken) {
        filters.usertoken = usertoken;
      }

      return API._get('event', identifier, filters);
    },

    search : function (filters) {
      return API._get('event', null, filters);
    },

    getTicketTypes : function (eventId, filters, usertoken) {
      var identifier = eventId + '/tickets';

      if (usertoken) {
        filters.usertoken = usertoken;
      }

      return API._get('event', identifier, filters);
    },

    updateTicketStatus : function (eventId, ticket, token) {
      var filters = {
        method: 'updatestatus',
        usertoken: token
      };

      var identifier = eventId + '/guestlist';

      var postObject = {
        tickets: [ticket]
      };

      return API._post('event', identifier, filters, postObject);
    },

    getCheckinReport : function (eventId, token) {
      var identifier = eventId + '/guestlist';

      var filters = {
        usertoken: token
      };

      return API._get('event', identifier, filters);
    }
  };

  API.producer = {
    getCustomerProfile: function (producerId, token) {
      var identifier = producerId + '/customerProfile';

      var filters = {
        usertoken: token
      };

      return API._get('producer', identifier, filters);
    },
    getSalesForCostumer: function (identifier, filters, token) {
      var deferred = $q.defer();
      var url;

      url = ingresseApiPreferences.getHost() + '/producer/' + identifier.producerId + '/customer/' + identifier.costumerId + '/sale' +  API._generateAuthKey();

      if (filters) {
        angular.forEach(filters, function (value, key) {
          if (value) {
            url += '&' + key + '=' + value;
          }
        });
      }

      url += '&usertoken=' + token;

      $http.get(url)
        .success(function (response) {
          deferred.resolve(response.responseData);
        })
        .catch(function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    },
    getCustomerList: function (producerId, filters, token) {
      var identifier = producerId + '/customer';

      filters.usertoken = token;

      return API._get('producer', identifier, filters);
    },
    getCustomerListCSVExportURL: function (producerId, token) {
      return ingresseApiPreferences.getHost() + '/producer/' + producerId + '/customerExport' + API._generateAuthKey() + '&usertoken=' + token;
    },
    getSalesGroupReport: function (identifier, filters, token) {
      identifier += '/salesgroupReport';

      filters.usertoken = token;

      return API._get('producer', identifier, filters);
    },
    getSalesGroupPaymentReport: function (identifier, filters, token) {
      identifier += '/salesgroupPaymentReport';

      filters.usertoken = token;

      return API._get('producer', identifier, filters);
    }
  };

  API.ticketBooth = {
    sell: function (postObject, token) {
      var filters = {
        method: 'sell',
        usertoken: token
      };

      return API._post('ticketbooth', null, filters, postObject);
    },
    getPrintData: function (transactionId, filters, token) {
      filters.method = 'print';
      filters.usertoken = token;

      return API._get('ticketbooth', transactionId, filters);
    }
  };

  API.ticket = {
    // Legacy API code, different interface.
    getQRCodeUrl: function (ticketCode, usertoken) {
      var url;

      url = ingresseApiPreferences.getHost();
      url += '/ticket/' + ticketCode + '/qrcode';

      url += API._generateAuthKey();
      url += '&usertoken=' + usertoken;

      return url;
    }
  };

  API.dashboard = {
    getEventReport: function (identifier, filters, token) {
      filters.usertoken = token;

      return API._get('dashboard', identifier, filters);
    },
    getVisitsReport: function (eventId, filters, usertoken) {
      var identifier = eventId + '/visitsReport';

      if (usertoken) {
        filters.usertoken = usertoken;
      }

      return API._get('dashboard', identifier, filters);
    },
    getEventSalesTimeline: function (identifier, filters, token) {
      identifier += '/timeline';
      filters.usertoken = token;

      return API._get('dashboard', identifier, filters);
    }
  };

  API.error = {
    get: function (errorClass) {
      return API._get('error', errorClass);
    }
  };

  API.user = {
    get: function (userid, filters, token) {
      if (token) {
        filters.usertoken = token;
      }

      return API._get('user', userid, filters);
    },

    create: function (userObj) {
      return API._post('user', null, {method: 'create'}, userObj);
    },

    update: function (userid, userObj, token) {
      var filters;

      if (token) {
        filters = {
          usertoken: token,
          method: 'update'
        };
      }

      return API._post('user', userid, filters, userObj);
    },

    search: function (filters) {
      return API._get('user', null, filters);
    },

    validateField: function (field) {
      return API._get('user/validate', null, field);
    },

    getTickets: function (userid, filters, token) {
      var identifier = userid + '/tickets';

      if (token) {
        filters.usertoken = token;
      }

      return API._get('user', identifier, filters);
    },

    getEvents: function (userid, filters, token) {
      var identifier = userid + '/events';

      if (token) {
        filters.usertoken = token;
      }

      return API._get('user', identifier, filters);
    },

    getPhotoUrl: function (userid) {
      return ingresseApiPreferences.getHost() + '/user/' + userid + '/picture/' + API._generateAuthKey();
    }
  };

  API.sale = {
    getReport: function (filters, token) {
      if (token) {
        filters.usertoken = token;
      }

      return API._get('sale', null, filters);
    },

    get: function (transactionId, token) {
      var filters = {
        usertoken: token
      };

      return API._get('sale', transactionId, filters);
    },

    refund: function (transactionId, reason, token) {
      var postObject = {
        reason: reason
      };

      var filters = {
        method: 'refund',
        usertoken: token
      };

      return API._post('sale', transactionId, filters, postObject);
    }
  };

  API.home = {
    getSections:  function () {
      return API._get('home', 'sections');
    },
    getCover: function () {
      return API._get('home', 'cover');
    }
  };

  API.freepass = {
    send: function (filters, postObject, token) {
      filters.usertoken = token;

      return API._post('freepass', null, filters, postObject);
    }
  };

  API.getFeaturedEvents = function (filters) {
    return API._get('featured', null, filters);
  };

  API.getEventCategory = function (category) {
    return API._get(null, category);
  };

  API.getRefundReasons = function () {
    return API._get('refundReasons');
  };

  API.login = {
    getAuthorizeUrl: function () {
      var url = ingresseApiPreferences.getHost() + '/authorize/' + API._generateAuthKey();
      return url + '&returnurl=' + API._urlencode(ingresseApiPreferences.loginReturnUrl);
    },
    getLogoutURL: function () {
      var url = ingresseApiPreferences.getHost() + '/logout' + API._generateAuthKey();
      return url + '&returnurl=' + API._urlencode(ingresseApiPreferences.loginReturnUrl);
    },
    direct: function (postObject) {
      return API._post('login', null, null, postObject);
    },
    facebook: function (postObject) {
      return API._post('login', 'facebook', null, postObject);
    }
  };

  API.register = function () {
    var url = ingresseApiPreferences.getHost() + '/register' + API._generateAuthKey();
    return url + '&returnurl=' + API._urlencode(ingresseApiPreferences.loginReturnUrl);
  };

  API.getLoginWithFacebookUrl = function () {
    var url = ingresseApiPreferences.getHost() + '/authorize/facebook' + API._generateAuthKey() + '&returnurl=' + API._urlencode(ingresseApiPreferences.loginReturnUrl);
    return url;
  };

  API.getRegisterWithFacebookUrl = function () {
    var url = ingresseApiPreferences.getHost() + '/register-from-facebook' + API._generateAuthKey() + '&returnurl=' + API._urlencode(ingresseApiPreferences.loginReturnUrl);
    return url;
  };

  API.ticketReservation = function (eventId, userId, token, tickets, discountCode, passkey) {
    var filters = {
      usertoken: token
    };

    var postObject = {
      eventId: eventId,
      userId: userId,
      tickets: tickets,
      discountCode: discountCode,
      passkey: passkey
    };

    return API._post('shop', null, filters, postObject);
  };

  API.createPagarmeCard = function (transaction) {
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
  };

  API.payReservation = function (eventId, userId, token, transactionId, tickets, paymentMethod, creditCard, installments, passkey) {

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
        tickets: tickets,
        passkey: passkey
      };

      url = ingresseApiPreferences.getHost() + '/shop/' + self._generateAuthKey() + '&usertoken=' + token;

      $http.post(url, currentTransaction)
        .success(function (response) {
          if (!response.responseData.data) {
            deferred.reject('Desculpe, houve um erro ao tentar gerar o boleto. Por favor entre em contato com a ingresse pelo número (11) 4264-0718.');
            return;
          }

          if (response.responseData.data.status === 'declined') {
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
      tickets: tickets,
      passkey: passkey
    };

    if (installments) {
      currentTransaction.installments = installments;
    }

    try {
      transactionDTO = this.createPagarmeCard(currentTransaction);
    } catch (err) {
      deferred.reject(err);
      return deferred.promise;
    }

    transactionDTO.creditcard.pagarme.generateHash(function (hash) {
      transactionDTO.creditcard = {
        cardHash: hash,
        cpf: transactionDTO.creditcard.cpf
      };

      url = ingresseApiPreferences.getHost() + '/shop/' + self._generateAuthKey() + '&usertoken=' + token;

      $http.post(url, transactionDTO)
        .success(function (response) {
          deferred.resolve(response.responseData.data);
        })
        .catch(function (error) {
          deferred.reject(error);
        });
    });

    return deferred.promise;
  };

  return API;
});
