'use strict';

angular.module('ingresseSDK')
.factory('Payment', function ($q, ingressePaymentGateway, ingressePaymentType, PagarMeStrategy, pagSeguroStrategy) {
  /**
   * Payment
   * @class
   */
  var Payment = function () {
    this.strategy    = null;
    this.transaction = null;
  };

  /**
   * Set the selected strategy
   * @param {function} strategy - The strategy to be used
   */
  Payment.prototype.setStrategy = function (strategy) {
    this.strategy = strategy;

    return this;
  };

  /**
   * Set transaction
   * @param {object} transaction - Transaction object with the gateway name
   * @param {object} transaction.gateway - Gateway object
   * @param {string} transaction.gateway.name - Name of the Gateway
   * @param {string} transaction.gateway.session - Gateway session token
   */
  Payment.prototype.setTransaction = function (transaction) {
      this.transaction = transaction;

      return this;
  };

  /**
   * Set gateway to use and set the strategy
   * @param {object} gateway - Gateway object
   * @param {string} gateway.name - Name of the gateway
   * @param {string} [gateway.session] - Gateway session id
   */
  Payment.prototype.setGateway = function (gateway) {
    var _gateway = gateway || this.transaction.gateway;

    switch(_gateway.name) {

      case ingressePaymentGateway.PAGSEGURO:
        this.setStrategy(pagSeguroStrategy);
        break;

      default:
        this.setStrategy(new PagarMeStrategy());

    }

    return this;
  };

  /**
   * Execute strategy payment
   * @returns {promise}
   */
  Payment.prototype.execute = function () {
    if (this.transaction.paymentMethod === ingressePaymentType.CREDITCARD) {
      return this.strategy.creditCardPayment(this.transaction);
    }

    return this.strategy.bankSlipPayment(this.transaction);
  };

  return Payment;
});

