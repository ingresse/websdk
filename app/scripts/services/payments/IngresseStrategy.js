'use strict';

angular.module('ingresseSDK')
.factory('IngresseStrategy', function ($q, BaseStrategy) {
    /**
     * @class Ingresse Payment Strategy
     */
    var IngresseStrategy = function () {
        BaseStrategy.apply(this, arguments);
    };

    /**
     * Generic Payment Strategy
     *
     * @param {object} transaction
     */
    var genericPayment = function (transaction) {
        var deferred = $q.defer();

        deferred.resolve(transaction);

        return deferred.promise;
    };

    /**
     * Use base strategy prototype
     */
    IngresseStrategy.prototype = new BaseStrategy();

    /**
    * Creditcard payment
    *
    * @param {object} transaction - Transaction object
    *
    * @returns {promise}
    */
    IngresseStrategy.prototype.creditCardPayment = function (transaction) {
        var deferred = $q.defer();

        if (!transaction ||
            !transaction.installments ||
            (!transaction.creditcard && !transaction.wallet)) {
            deferred.reject({
                message: 'Credit Card Payment data must have installments and, of course, the credit card information.',
                example: {
                    installments: 2,
                    creditcard  : {
                        holderName    : 'John Connor',
                        holderBirthDay: '1991-11-03',
                        number        : '1234567890987654',
                        expiracyMonth : 12,
                        expiracyYear  : 28,
                        cvv           : 123,
                    },
                },
            });

            return deferred.promise;
        }

        var creditCard        = transaction.creditcard;
        var installments      = transaction.installments;
        var creditCardPayment = angular.merge({}, transaction, {
            installments: (parseInt(installments) || 1),
        }, (transaction.wallet) ? {} : {
            creditcard: {
                number       : (creditCard.number + ''),
                expiracyMonth: ((creditCard.expiracyMonth || creditCard.month) + ''),
                expiracyYear : ((creditCard.expiracyYear || creditCard.year) + ''),
                cvv          : (creditCard.cvv + ''),
                holderName   : ((creditCard.holderName || creditCard.name) + ''),
                save         : (creditCard.save || false),
            },
        });

        deferred.resolve(creditCardPayment);

        return deferred.promise;
    };

    /**
     * Bank slip payment
     *
     * @returns {promise}
     */
    IngresseStrategy.prototype.bankSlipPayment = genericPayment;

    /**
     * Generic payment
     *
     * @returns {promise}
     */
    IngresseStrategy.prototype.genericPayment = genericPayment;

    return IngresseStrategy;
});
