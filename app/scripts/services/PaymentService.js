'use strict';

angular.module('ingresseSDK')
.service('Payment', function ($q, paymentGateway, paymentType, PagarMeStrategy, PagSeguroStrategy) {
  this.strategy    = null;
  this.transaction = null;

  /**
   * Set the selected strategy
   * @param {function} strategy - The strategy to be used
   */
  this.setStrategy = function (strategy) {
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
  this.setTransaction = function (transaction) {
      this.transaction = transaction;

      return this;
  };

  /**
   * Set gateway to use and set the strategy
   * @param {object} gateway - Gateway object
   * @param {string} gateway.name - Name of the gateway
   * @param {string} [gateway.session] - Gateway session id
   */
  this.setGateway = function (gateway) {
    var _gateway = gateway || this.transaction.gateway;

    switch(_gateway.name) {

      case paymentGateway.PAGSEGURO:
        this.setStrategy(new PagSeguroStrategy());
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
  this.execute = function () {
    if (this.transaction.paymentMethod === paymentType.CREDITCARD) {
      return this.strategy.creditCardPayment(this.transaction);
    }

    return this.strategy.bankSlipPayment(this.transaction);
  };
});

