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
            !transaction.creditcard) {
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

        var creditCardPayment = angular.merge({}, transaction, {
            installments: (parseInt(transaction.installments) || 1),
            creditcard  : {
                number        : (transaction.creditcard.number + ''),
                expiracyMonth : ((transaction.creditcard.expiracyMonth || transaction.creditcard.month) + ''),
                expiracyYear  : ((transaction.creditcard.expiracyYear || transaction.creditcard.year) + ''),
                cvv           : (transaction.creditcard.cvv + ''),
                holderName    : ((transaction.creditcard.holderName || transaction.creditcard.name) + ''),
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
    IngresseStrategy.prototype.bankSlipPayment = function (transaction) {
        var deferred = $q.defer();

        deferred.resolve(transaction);

        return deferred.promise;
    };

    return IngresseStrategy;
});
