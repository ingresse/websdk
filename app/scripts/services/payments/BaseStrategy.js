'use strict';

angular.module('ingresseSDK')
.factory('BaseStrategy', function () {
  /**
   * Base payment strategy
   * @class
   */
  var BaseStrategy = function () {};

  /**
   * CreditCard payment
   */
  BaseStrategy.prototype.creditCardPayment = function () {
    throw Error('You should implement creditcard payment method');
  };

  /**
   * BankSlip payment
   */
  BaseStrategy.prototype.bankSlip = function () {
    throw Error('You should implement bank slip payment method');
  };

  return BaseStrategy;
});

