'use strict';

/**
 * DISCLAIMER
 * PagSeguroDirectPayment lib obligates us to create this strategy as a singleton
 * to handle the **setSession** just once, to prevent the error **30400** when
 * trying to buy for the second time after a declined transaction
 */

angular.module('ingresseSDK')
.factory('pagSeguroStrategy', function ($q, PagSeguroDirectPayment) {
  /**
   * PagSeguro singleton payment strategy
   */
  var pagSeguroStrategy  = {
    session: null
  };

  /**
   * Creditcard payment
   * @param {object} transaction - Transaction object
   * @returns {promise}
   */
  pagSeguroStrategy.creditCardPayment = function (transaction) {
    var deferred = $q.defer();

    // Get sender hash
    transaction.senderHash = pagSeguroStrategy.getSenderHash(transaction.gateway.session);

    // Format full year for pagSeguro
    var fullYear = pagSeguroStrategy.formatFullYear(transaction.creditcard.year);

    // Prams to generate the pagseguro card token
    var cardTokenParams = {
      cardNumber     : transaction.creditcard.number,
      brand          : transaction.creditcard.flag,
      cvv            : transaction.creditcard.cvv,
      expirationMonth: transaction.creditcard.month,
      expirationYear : fullYear,

      success: function (response) {
        // Add the information to the creditcard object
        transaction.creditcard = {
          cardHash : response.card.token,
          cpf      : transaction.creditcard.cpf,
          birthdate: transaction.creditcard.birthdate,
          number   : transaction.creditcard.mask,
        };

        // Resolve promise with the transaction object with card hash
        deferred.resolve(transaction);
      },

      error: function (response) {
        // Reject promise with the error
        var error = pagSeguroStrategy.errorCheck(response.errors);

        deferred.reject(error);
      }
    };

    // Create card token
    PagSeguroDirectPayment.createCardToken(cardTokenParams);

    return deferred.promise;
  };

  /**
   * Bank slip payment
   * @returns {promise}
   */
  pagSeguroStrategy.bankSlipPayment = function (transaction) {
    var deferred = $q.defer();

    // Get sender hash
    transaction.senderHash = pagSeguroStrategy.getSenderHash(transaction.gateway.session);

    deferred.resolve(transaction);

    return deferred.promise;
  };

  /**
   * PagSeguro format fullyear
   * @param {string} - Year to check if is in fullyear format
   */
  pagSeguroStrategy.formatFullYear = function (year) {
    if (angular.isDefined(year) && year.toString().length === 2) {
      return '20' + year;
    }

    return year;
  };

  /**
   * Get sender hash
   * @param {string} session - PagSeguro session, get it in the api gateway object
   */
  pagSeguroStrategy.getSenderHash = function (session) {
    // Set session only one time to prevent error 30400
    // as the pagSeguro consultant advised
    if (!pagSeguroStrategy.session) {
      PagSeguroDirectPayment.setSessionId(session);
      pagSeguroStrategy.session = session;
    }

    return PagSeguroDirectPayment.getSenderHash();
  };

  /**
   * Check for error in the card hash
   * @param {array} errors - Check for error types
   */
  pagSeguroStrategy.errorCheck = function (errors) {
    var pagSeguroErrors = [{ code: 30400, message: 'Verifique os dados do cartão de crédito.'}];

		if (errors) {
		  var error;

			for (var i = 0; i < pagSeguroErrors.length; i++) {
			  var err = pagSeguroErrors[i];

			  if (errors[err.code]) {
			    error = new Error(err.message);
			    error.code = err.code;

			    break;
			  }
			}

			if (error) {
			  return error;
			}
		}

		return errors;
  };

  return pagSeguroStrategy;
});

