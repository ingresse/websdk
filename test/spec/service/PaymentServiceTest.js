'use strict';

describe('Payment Service', function () {
  var payment, Payment, TRANSACTION;
  var pagSeguroStrategy, PagarMeStrategy, ingressePaymentGateway;

	beforeEach(module('ingresseSDK', function ($provide) {
	  // Mock pagarme strategy
    PagarMeStrategy = function () {};
    PagarMeStrategy.prototype.creditCardPayment = jasmine.createSpy('creditCardPayment');
    PagarMeStrategy.prototype.bankSlipPayment = jasmine.createSpy('bankSlipPayment');

	  // Mock pagseguro singleton strategy
    pagSeguroStrategy = {};
    pagSeguroStrategy.creditCardPayment = jasmine.createSpy('creditCardPayment');
    pagSeguroStrategy.bankSlipPayment = jasmine.createSpy('bankSlipPayment');

		$provide.value('PagarMeStrategy', PagarMeStrategy);
		$provide.value('pagSeguroStrategy', pagSeguroStrategy);
	}));

  beforeEach(inject(function ($injector) {
    Payment = $injector.get('Payment');
    ingressePaymentGateway = $injector.get('ingressePaymentGateway');

    // Default transaction
    TRANSACTION = {
      paymentMethod: 'CartaoCredito',
      transactionId: '12345',
      gateway: {
        name: 'pagarme'
      }
    };
  }));

  beforeEach(function () {
    payment = new Payment();
  });


  it('should create an instance of Payment service', function () {
    expect(payment instanceof Payment).toBe(true);
  });

  it('should have strategy and transaction params as null', function () {
    expect(payment.strategy).toBe(null);
    expect(payment.transaction).toBe(null);
  });

  it('should setTransaction update transaction property', function () {
    payment.setTransaction(TRANSACTION);

    expect(angular.isObject(payment.transaction)).toBe(true);
    expect(payment.transaction.transactionId).toBe('12345');
    expect(payment.transaction.gateway.name).toBe('pagarme');
  });

  it('should setGateway call setStrategy depending on the gateway name', function () {
    spyOn(payment, 'setStrategy').and.callThrough();

    payment.setTransaction(TRANSACTION);

    payment.setGateway();

    expect(payment.setStrategy).toHaveBeenCalled();
    expect(payment.strategy instanceof PagarMeStrategy).toBe(true);

  });

  it('should execute method the paymentd method defined in transaction', function () {
    payment
      .setTransaction(TRANSACTION)
      .setGateway();

    payment.execute();

    expect(payment.strategy.creditCardPayment).toHaveBeenCalledWith(payment.transaction);

    // Change transaction to bank slip
    TRANSACTION.paymentMethod = 'BoletoBancario';

    payment
      .setTransaction(TRANSACTION)
      .setGateway();

    payment.execute();

    expect(payment.strategy.bankSlipPayment).toHaveBeenCalledWith(payment.transaction);
  });
});

