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

      API.getEvent = function (eventId, filters, usertoken) {
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

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getEventCrew = function (eventId, filters, usertoken) {
        var deferred = $q.defer();
        var url;

        url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/crew' + this.generateAuthKey();

        if (usertoken) {
          url += '&usertoken=' + usertoken;
        }

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getVisitsReport = function (eventId, filters, usertoken) {
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
      };

      API.getError = function (errorClass) {
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
      };

      API.getEventList = function (filters) {
        var deferred = $q.defer();
        var url = ingresseAPI_Preferences.getHost() + '/event/' + this.generateAuthKey();

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getEventTickets = function (eventId, filters, usertoken) {
        var deferred = $q.defer();

        var url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/tickets/' + this.generateAuthKey();

        if (usertoken) {
          url += '&usertoken=' + usertoken;
        }

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getUser = function (userid, filters, token) {
        var deferred = $q.defer();

        var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + this.generateAuthKey();

        if (token) {
          url += '&usertoken=' + token;
        }

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getUserTickets = function (userid, filters, token) {
        var deferred = $q.defer();

        var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + '/tickets' + this.generateAuthKey() + '&usertoken=' + token;

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getUserEvents = function (userid, filters, token) {
        var deferred = $q.defer();

        var url = ingresseAPI_Preferences.getHost() + '/user/' + userid + '/events' + this.generateAuthKey() + '&usertoken=' + token;

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getSales = function (token, filters) {
        var deferred = $q.defer();

        var url = ingresseAPI_Preferences.getHost() + '/sale/' + this.generateAuthKey() + '&usertoken=' + token;

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.updateUserInfo = function (userid, userObj, token) {
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
      };


      API.refund = function (token, transactionId, reason) {
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
      };

      API.updateTicketStatus = function (eventId, token, tickets) {
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
      };

      API.getCheckinReport = function (eventId, token, fields) {
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
      };

      API.getGuestList = function (eventId, filters, token) {
        var deferred = $q.defer();

        var url = ingresseAPI_Preferences.getHost() + '/event/' + eventId + '/guestlist' + this.generateAuthKey() + '&usertoken=' + token;

        url += this.getUrlParameters(filters);

        $http.get(url)
          .success(function (response) {
            deferred.resolve(response.responseData);
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      API.getTransactionData = function (transactionId, token) {
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

      return API;
    }
  };
});
