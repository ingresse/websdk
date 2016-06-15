'use strict';

angular.module('ingresseSDK')
.factory('PagarMeStrategy', function ($q, BaseStrategy) {
  /**
   * PagarMe payment strategy
   * @class
   */
  var PagarMeStrategy = function () {
    BaseStrategy.apply(this, arguments);
  };

  /**
   * Use base strategy prototype
   */
  PagarMeStrategy.prototype = new BaseStrategy();

  /**
   * Creditcard payment
   * @param {object} transaction - Transaction object
   * @returns {promise}
   */
  PagarMeStrategy.prototype.creditCardPayment = function (transaction) {
		// Create hash for pagarme
    var creditCard = new PagarMe.creditCard(),
        deferred   = $q.defer();

    creditCard.cardHolderName      = transaction.creditcard.name.toString();
    creditCard.cardExpirationMonth = transaction.creditcard.month.toString();
    creditCard.cardExpirationYear  = transaction.creditcard.year.toString();
    creditCard.cardNumber          = transaction.creditcard.number.toString();
    creditCard.cardCVV             = transaction.creditcard.cvv.toString();

    // Check for error
    try {
      this.errorCheck(creditCard);

    } catch (err) {
      deferred.reject(err);
      return deferred.promise;
    }

    // Generate card hash
    creditCard.generateHash(function (hash) {
      transaction.creditcard = {
        cardHash : hash,
        cpf      : transaction.creditcard.cpf,
        birthdate: transaction.creditcard.birthdate,
        number   : transaction.creditcard.mask,
      };

      // Resolve promise with the transaction object with card hash
      deferred.resolve(transaction);
    });

    return deferred.promise;
  };

  /**
   * Bank slip payment
   * @returns {promise}
   */
  PagarMeStrategy.prototype.bankSlipPayment = function (transaction) {
    var deferred = $q.defer();

    deferred.resolve(transaction);

    return deferred.promise;
  };

  /**
   * Check for error in the card hash
   */
  PagarMeStrategy.prototype.errorCheck = function (creditCard) {
		var field,
				fieldErrors = creditCard.fieldErrors(),
		    hasErrors   = false;

		for (field in fieldErrors) {
			if (fieldErrors.hasOwnProperty(field)) {
				hasErrors = true;
				break;
			}
		}

		if (hasErrors) {
			var cardErrors = '',
			    key;

			for (key in fieldErrors) {
				if (fieldErrors.hasOwnProperty(key)) {
					cardErrors += ' ' + fieldErrors[key];
				}
			}

			var error = new Error(cardErrors);
			error.code = 1031;

			throw error;
		}
  };

  return PagarMeStrategy;
});

