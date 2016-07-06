'use strict';

function receiveMessage (event) {
  if (event.origin !== 'https://cdn.ingresse.com') {
    return;
  }

  var obj = JSON.parse(event.data);
  angular.element(document.body).scope().$broadcast('ingresseAPI.userHasLogged', obj);
}

window.addEventListener('message', receiveMessage, false);

angular.module('ingresseSDK')
.service('ingresseAPI', function ($http, $q, ingresseApiPreferences, Payment) {
  var API = {};

  API._urlencode = function (str) {
    if (str === null || str === undefined) {
      return;
    }

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

    var authenticationString;
    if (ingresseApiPreferences.publickey && ingresseApiPreferences._signature && ingresseApiPreferences._timestamp) {
      authenticationString = '?publickey=' + API._urlencode(ingresseApiPreferences.publickey) + '&signature=' + API._urlencode(ingresseApiPreferences._signature) + '&timestamp=' + API._urlencode(ingresseApiPreferences._timestamp);
      return authenticationString;
    }

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
    authenticationString = '?publickey=' + ingresseApiPreferences.publickey + '&signature=' + API._urlencode(computedSignature) + '&timestamp=' + API._urlencode(timestamp);

    return authenticationString;
  };

  API._getUrlParameters = function (filters) {
    var parameters = '';
    var key;

    for (key in filters) {
      if (filters.hasOwnProperty(key)) {
        if (filters[key] !== undefined && filters[key] !== null) {
          parameters += '&' + key + '=' + this._urlencode(filters[key]);
        }
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
        if (angular.isObject(response.responseData) && angular.isDefined(response.ResponseSessionStatus)) {
          response.responseData.sessionStatus = response.ResponseSessionStatus;
        }

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

    getTicketTypesForSession: function (eventId, filters, usertoken) {
      var identifier = eventId + '/session/' + filters.sessionId + '/tickets';

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
    },

    getAttributes : function (eventId, filters) {
      var _filter = filters || {},
        identifier = eventId + '/attributes';

      return API._get('event', identifier, _filter);
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
    getCustomerListCSVExportURL: function (producerId, token, filters) {
      var url = ingresseApiPreferences.getHost() + '/producer/' + producerId + '/customerExport' + API._generateAuthKey() + '&usertoken=' + token;

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
    },
    setLogPrintData: function(transactionId, postObject, token) {
      var filters = {
          usertoken: token
        }, identifier = transactionId + '/history';

      return API._post('ticketbooth', identifier, filters, postObject);
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
    },

    updateTicketTransfer: function (ticketId, postObject, userToken) {
      var filters = {
        usertoken: userToken
      },

      identifier = ticketId + '/transfer/' + postObject.transferId;

      return API._post('ticket', identifier, filters, postObject);
    },

    createTicketTransfer: function (ticketId, postObject, userToken) {
      var filters = {
        usertoken: userToken
      },

      identifier = ticketId + '/transfer';

      return API._post('ticket', identifier, filters, postObject);
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
    getTransactionsReport: function (identifier, filters, token) {
      identifier += '/transactionReport';

      filters.usertoken = token;

      return API._get('dashboard', identifier, filters);
    },
    getEventSalesTimeline: function (identifier, filters, token) {
      identifier += '/timeline';
      filters.usertoken = token;

      return API._get('dashboard', identifier, filters);
    }
  };

  API.balance = {
    describe: function (method) {
      if (method === 'get') {
        return 'https://docs.google.com/document/d/1a4-M6o4hCa0AUG1Q_Zsxhl4UuicuA7qWJWH0C66qfbo/edit#heading=h.qmxn7fpd5bif';
      }
    },
    get: function (filters, token) {
      if (token) {
        filters.usertoken = token;
      }

      return API._get('balance', null, filters);
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

    search: function (filters, token) {
      if (token) {
        filters.usertoken = token;
      }

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

    renameTicket: function (userid, ticketId, filters, postObject, token) {
      var identifier = userid + '/ticket/' + ticketId;

      if (token) {
        filters.usertoken = token;
      }

      return API._post('user', identifier, filters, postObject);
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
    },

    getUserSessionTickets: function (userId, sessionId, filters, token) {
      var identifier = userId + '/sessions/' + sessionId;

      if (token) {
        filters.usertoken = token;
      }

      return API._get('user', identifier, filters);
    },

    getAllUserSessions: function (userId, filters, token) {
      var identifier = userId + '/sessions/';

      if (token) {
        filters.usertoken = token;
      }

      return API._get('user', identifier, filters);
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

    refund: function (transactionId, postObject, token) {
      var filters = {
        method: 'refund',
        usertoken: token
      };

      return API._post('sale', transactionId, filters, postObject);
    }
  };

  API.salesgroup = {
    get: function (filters, token) {
      if (!filters) {
        filters = {};
      }

      filters.usertoken = token;

      return API._get('salesgroup', null, filters);
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

  API.getEventCategory = function (category, filters) {
    return API._get(null, category, filters);
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

  API.ticketReservation = function (eventId, userId, token, tickets, discountCode, passkey, extra) {
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

    angular.extend(postObject, extra);

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

  API.payReservation = function (eventId, userId, token, transactionId, tickets, paymentMethod, creditCard, installments, passkey, postback) {

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

    if (postback) {
      currentTransaction.postback = 1;
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
        cpf: transactionDTO.creditcard.cpf,
        birthdate: transactionDTO.creditcard.birthdate
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

  /**
   * Pay for reserved tickets
   * @param {object}  transaction - Transaction object
   * @param {integer} transaction.eventId - Event id
   * @param {integer} transaction.userId - The id of the user paying
   * @param {object}  transaction.gateway - The gateway used by the event
   * @param {string}  transaction.transactionId - The transaction id
   * @param {string}  transaction.paymentMethod - The payment method
   * @param {object}  [transaction.creditcard] - The creditcard information
   * @param {integer} transaction.installments - The number of installmetns
   * @param {string}  [transaction.passkey] - The passkey used to buy the ticket
   * @param {boolean} [transaction.postback] - If it will use postback or not
   * @param {string}  token - The token of the user paying
   */
  API.pay = function (transaction, token) {
    var payment  = new Payment(),
        url      = ingresseApiPreferences.getHost() + '/shop/' + this._generateAuthKey() + '&usertoken=' + token,
        deferred = $q.defer();

    // Configure payment service
    payment
      .setTransaction(transaction)
      .setGateway();

    // Execute payment
    payment.execute()
      .then(function (transaction) {
        // Send date to api
        $http.post(url, transaction)
          .success(function (response) {
            deferred.resolve(response.responseData.data);
          })

          // On error reject promise
          .catch(function (error) {
            deferred.reject(error);
          });
      })
      .catch(function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  return API;
});
