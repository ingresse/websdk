'use strict';

angular.module('ingresseSDK')
.factory('Payment', function ($q, ingressePaymentGateway, ingressePaymentType, IngresseStrategy) {
    /**
     * @class Payment
     */
    var Payment = function () {
        this.strategy    = null;
        this.transaction = null;
    };

    /**
     * Set the selected strategy
     *
     * @param {function} strategy - The strategy to be used
     */
    Payment.prototype.setStrategy = function (strategy) {
        this.strategy = strategy;

        return this;
    };

    /**
     * Set transaction
     *
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
     */
    Payment.prototype.setGateway = function () {
        this.setStrategy(new IngresseStrategy());

        return this;
    };

    /**
    * Execute strategy payment
    *
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
