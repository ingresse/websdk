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

angular.module('ingresseSDK').provider('ingresseAPI', function () {
  return {
    $get: function ($http, $q, ingresseAPI_Preferences) {
      var API = {};

      API.urlencode = function (str) {
        str = str.toString();

        return encodeURIComponent(str)
          .replace(/!/g, '%21')
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/\*/g, '%2A')
          .replace(/%20/g, '+');
      };

      API.generateAuthKey = function () {
        /*  GENERATES THE PROPER AUTHENTICATION KEY FOR API CALLS, NEED THE PRIVATE AND PUBLIC KEYS OF APPLICATION SETTED WITH ingresseAPIProvider.

          Ex:
          angular.module('yourAppModuleName').config(function (ingresseAPIProvider) {
            ingresseAPIProvider.setPublicKey('your public key');
            ingresseAPIProvider.setPrivateKey('your private key');
          });

          RETURNS THE STRING TO BE USED ON API CALLS.
        */
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
      };

      API.getUrlParameters = function (filters) {
        var parameters = '';
        var key;

        for (key in filters) {
          if (filters.hasOwnProperty(key)) {
            parameters += '&' + key + '=' + filters[key];
          }
        }

        return parameters;
      };

      API._get = function (method, identifier, parameters) {
        var deferred = $q.defer();
        var url;

        url = ingresseAPI_Preferences.getHost();

        if (method) {
          url += '/' + method;
        }

        if (identifier) {
          url += '/' + identifier;
        }

        url += this.generateAuthKey();
        url += this.getUrlParameters(parameters);

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

        url = ingresseAPI_Preferences.getHost() + '/' + method;

        if (identifier) {
          url += '/' + identifier;
        }

        url += this.generateAuthKey();
        url += this.getUrlParameters(parameters);

        $http.post(url, postParameters)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getEvent = function (eventId, filters) {
        var identifier;

        if (angular.isNumber(parseInt(eventId, 10)) && !isNaN(eventId)) {
          identifier = eventId;
        } else {
          filters.method = 'identify';
          filters.link = eventId;
        }

        return this._get('event', identifier, filters);
      };

      API.getEventCrew = function (eventId, filters, usertoken) {
        var identifier = eventId + '/crew';

        if (usertoken) {
          filters.usertoken = usertoken;
        }

        return this._get('event', identifier, filters);
      };

      API.getVisitsReport = function (eventId, filters, usertoken) {
        var identifier = eventId + '/visitsReport';

        if (usertoken) {
          filters.usertoken = usertoken;
        }

        return this._get('dashboard', identifier, filters);
      };

      API.getError = function (errorClass) {
        return this._get('error', errorClass);
      };

      API.getEventList = function (filters) {
        return this._get('event',null, filters);
      };

      API.getEventCategory = function (category) {
        return this._get(null, category);
      };

      API.getEventTicketTypes = function (eventId, filters, usertoken) {
        var identifier = eventId + '/tickets';

        return this._get('event', identifier, filters);
      };

      API.searchUser = function (filters) {
        return this._get('user', null, filters);
      };

      API.getUser = function (userid, filters, token) {
        if (token) {
          filters.usertoken = token;
        }

        return this._get('user',userid, filters);
      };

      API.getUserTickets = function (userid, filters, token) {
        var identifier = userid + '/tickets';

        if (token) {
          filters.usertoken = token;
        }

        return this._get('user',identifier, filters);
      };

      API.getUserEvents = function (userid, filters, token) {
        var identifier = userid + '/events';

        if (token) {
          filters.usertoken = token;
        }

        return this._get('user', identifier, filters);
      };

      API.getSales = function (filters, token) {
        if (token) {
          filters.usertoken = token;
        }

        return this._get('sale', null, filters);
      };

      API.createUser = function (userObj) {
          return this._post('user', null, {method: 'create'}, userObj);
      };

      API.updateUserInfo = function (userid, userObj, token) {
        if (token) {
          var filters = {
            usertoken: token
          }
        }

        return this._post('user', userid, filters, userObj);
      };

      API.refund = function (transactionId, reason, token) {
        var postObject = {
          reason: reason
        }

        var filters = {
          method: 'refund',
          usertoken: token
        }

        return this._post('sale', transactionId, filters, postObject);
      };

      API.updateTicketStatus = function (eventId, ticket, token) {
        var filters = {
          method: 'updatestatus',
          usertoken: token
        }

        var identifier = eventId + '/guestlist';

        var postObject = {
          tickets: [ticket]
        }

        return this._post('event', identifier, filters, postObject);
      };

      API.getCheckinReport = function (eventId, token) {
        var identifier = eventId + '/guestlist';

        var filters = {
          usertoken: token
        }

        return this._get('event', identifier, filters);
      };

      API.getGuestList = function (eventId, filters, token) {
        var identifier = eventId + '/guestlist';

        if (token) {
          filters.usertoken = token;
        }

        return this._get('event', identifier, filters);
      };

      API.getTransactionData = function (transactionId, token) {
        var filters = {
          usertoken: token
        };

        return this._get('sale', transactionId, filters);
      };

      API.getRefundReasons = function () {
        return this._get('refundReasons');
      };

      API.getUserPhotoUrl = function (userid) {
        return ingresseAPI_Preferences.getHost() + '/user/' + userid + '/picture/' + this.generateAuthKey();
      };

      API.login = function () {
        var url = ingresseAPI_Preferences.getHost() + '/authorize/' + this.generateAuthKey();
        return url + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
      };

      API.logout = function () {
        var url = ingresseAPI_Preferences.getHost() + '/logout' + this.generateAuthKey();
        return url + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
      };

      API.register = function () {
        var url = ingresseAPI_Preferences.getHost() + '/register' + this.generateAuthKey();
        return url + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
      };

      API.getLoginWithFacebookUrl = function () {
        var url = ingresseAPI_Preferences.getHost() + '/authorize/facebook' + this.generateAuthKey() + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
        return url;
      };

      API.getRegisterWithFacebookUrl = function () {
        var url = ingresseAPI_Preferences.getHost() + '/register-from-facebook' + this.generateAuthKey() + '&returnurl=' + this.urlencode(ingresseAPI_Preferences.login_return_url);
        return url;
      };

      API.ticketReservation = function (eventId, userId, token, tickets, discountCode) {
        var deferred = $q.defer();

        var filters = {
          usertoken: token
        };

        var postObject = {
          eventId: eventId,
          userId: userId,
          tickets: tickets,
          discountCode: discountCode
        };

        return this._post('shop', null, filters, postObject);
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

      API.payReservation = function (eventId, userId, token, transactionId, tickets, paymentMethod, creditCard, installments) {

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
        } catch (err) {
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
      };

      API.getProducerCustomerList = function (producerId, filters, token) {
        var identifier = producerId + '/customer';

        filters.usertoken = token;

        return this._get('producer', identifier, filters);
      };

      API.getProducerSalesForCostumer = function (identifier, filters, token) {
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
      };

      API.getProducerCustomerProfile = function (producerId, token) {
        var identifier = producerId + '/customerProfile';

        var filters = {
          usertoken: token
        };

        return this._get('producer', identifier);
      };

      API.getFeaturedEvents = function(filters) {
        return this._get('featured', null, filters);
      };

      return API;
    }
  };
});
