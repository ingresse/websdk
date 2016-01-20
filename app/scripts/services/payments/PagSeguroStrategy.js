'use strict';

angular.module('ingresseSDK')
.factory('PagSeguroStrategy', function ($q, BaseStrategy) {
  /**
   * PagSeguro payment strategy
   * @class
   */
  var PagSeguroStrategy = function () {
    BaseStrategy.apply(this, arguments);
  };

  /**
   * Use base strategy prototype
   */
  PagSeguroStrategy.prototype = new BaseStrategy();

  /**
   * Creditcard payment
   * @param {object} transaction - Transaction object
   * @returns {promise}
   */
  PagSeguroStrategy.prototype.creditCardPayment = function (transaction) {
    var deferred = $q.defer();

    // Get sender hash
    transaction.senderHash = this.getSenderHash(transaction.gateway.session);

    // Format full year for pagSeguro
    var fullYear = this.formatFullYear(transaction.creditcard.year);

    var param = {
      cardNumber     : transaction.creditcard.number,
      brand          : transaction.creditcard.flag,
      cvv            : transaction.creditcard.cvv,
      expirationMonth: transaction.creditcard.month,
      expirationYear : fullYear,

      success: function (response) {
        transaction.creditcard = {
          cardHash : response.card.token,
          cpf      : transaction.creditcard.cpf,
          birthdate: transaction.creditcard.birthdate
        };

        // Resolve promise with the transaction object with card hash
        deferred.resolve(transaction);
      },

      error: function (response) {
        deferred.reject(response);
      }
    };

    // Create card hash
    PagSeguroDirectPayment.createCardToken(param);

    return deferred.promise;
  };

  /**
   * Bank slip payment
   * @returns {promise}
   */
  PagSeguroStrategy.prototype.bankSlipPayment = function (transaction) {
    var deferred = $q.defer();

    transaction.senderHash = this.getSenderHash(transaction.gateway.session);

    deferred.resolve(transaction);

    return deferred.promise;
  };

  /**
   * PagSeguro format year
   */
  PagSeguroStrategy.prototype.formatFullYear = function (year) {
    if (angular.isDefined(year) && year.toString().length == 2) {
      return '20' + year;
    }

    return year;
  };

  /**
   * Get sender hash
   * @param {string} session - PagSeguro session, musc return in the api gateway object
   */
  PagSeguroStrategy.prototype.getSenderHash = function (session) {
    PagSeguroDirectPayment.setSessionId(session);

    return PagSeguroDirectPayment.getSenderHash();
  };

  return PagSeguroStrategy;
});

