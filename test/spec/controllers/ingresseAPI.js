'use strict';

describe('Service: ingresesAPI', function () {
  var apisdk, preferences, httpBackend;

  beforeEach(module('ingresseSDK'));

  beforeEach(inject(function (ingresseAPI, ingresseApiPreferences, $injector) {
    apisdk = ingresseAPI;
    preferences = $injector.get('ingresseApiPreferences');
    httpBackend = $injector.get('$httpBackend');
  }));

  it('should encode url', function () {
    var encoded = apisdk._urlencode('http://teste.com.br/?param=test test!()"*@#$%^&_-+=`~{}[]|.,');
    expect(encoded).toEqual('http%3A%2F%2Fteste.com.br%2F%3Fparam%3Dtest%20test!()%22*%40%23%24%25%5E%26_-%2B%3D%60~%7B%7D%5B%5D%7C.%2C');
  });

  it('should have two caracters', function () {
    expect(apisdk._formatTwoCaracters(2)).toEqual('02');
    expect(apisdk._formatTwoCaracters('2')).toEqual('02');
  });

  it('should get parameters encoded', function () {
    var filters = {
      parameter: 'value one',
      parameter2: 'value&'
    };

    expect(apisdk._getUrlParameters(filters)).toBe('&parameter=value%20one&parameter2=value%26');
  });

  it('should GET with parameters', function () {
    var method = 'test';
    var identifier = 'testone';
    var parameters = {
      id: 1,
      query: 'testQuery'
    };

    httpBackend.expectGET(preferences._host + '/' +  method + '/' + identifier + apisdk._generateAuthKey() + '&id=1&query=testQuery').respond({responseData: true});
    apisdk._get(method, identifier, parameters);
    httpBackend.flush();
  });

  it('should POST with parameters', function () {
    var method = 'test';
    var identifier = 'testone';
    var parameters = {
      id: 1,
      query: 'testQuery'
    };
    var postParameters = {
      id: 1,
      query: 'testQuery'
    };

    httpBackend.expectPOST(preferences._host + '/' +  method + '/' + identifier + apisdk._generateAuthKey() + '&id=1&query=testQuery', postParameters).respond({responseData: true});
    apisdk._post(method, identifier, parameters, postParameters);
    httpBackend.flush();
  });

  it('should GET event by id', function () {
    var eventId = '12291';
    var filters = {
      term: 'test'
    };

    httpBackend.expectGET(preferences._host + '/event/' + eventId + apisdk._generateAuthKey() + '&term=test').respond({responseData: true});
    apisdk.event.get(eventId, filters);
    httpBackend.flush();
  });

  it('should GET event by link', function () {
    var eventId = 'test';
    var filters = {
      term: 'test'
    };

    httpBackend.expectGET(preferences._host + '/event' + apisdk._generateAuthKey() + '&term=test&method=identify&link=test').respond({responseData: true});
    apisdk.event.get(eventId, filters);
    httpBackend.flush();
  });

  it('should GET event crew', function () {
    var eventId = 'test';
    var usertoken = 'usertoken';
    var filters = {
      term: 'test'
    };

    httpBackend.expectGET(preferences._host + '/event/' + eventId + '/crew' + apisdk._generateAuthKey() + '&term=test&usertoken=usertoken').respond({responseData: true});
    apisdk.event.getCrew(eventId, filters, usertoken);
    httpBackend.flush();
  });

  it('should GET event search', function () {
    var filters = {
      term: 'test'
    };

    httpBackend.expectGET(preferences._host + '/event' + apisdk._generateAuthKey() + '&term=test').respond({responseData: true});
    apisdk.event.search(filters);
    httpBackend.flush();
  });

  it('should GET event ticket types', function () {
    var eventId = 'test';
    var usertoken = 'usertoken';
    var filters = {
      term: 'test',
      passkey: 'hidden'
    };

    httpBackend.expectGET(preferences._host + '/event/' + eventId + '/tickets' + apisdk._generateAuthKey() + '&term=test&passkey=hidden&usertoken=usertoken').respond({responseData: true});
    apisdk.event.getTicketTypes(eventId, filters, usertoken);
    httpBackend.flush();
  });

  it('should GET event session ticket types', function () {
    var eventId = 'test';
    var usertoken = 'usertoken';
    var filters = {
      sessionId: 1234,
      pos: true
    };

    httpBackend.expectGET(preferences._host + '/event/' + eventId + '/session/' + filters.sessionId + '/tickets' + apisdk._generateAuthKey() + '&sessionId=1234&pos=true&usertoken=usertoken').respond({responseData: true});
    apisdk.event.getTicketTypesForSession(eventId, filters, usertoken);
    httpBackend.flush();
  });

  it('should POST update ticket', function () {
    var eventId = 'test';
    var usertoken = 'usertoken';
    var ticket = {
      id: '1234'
    };

    httpBackend.expectPOST(preferences._host + '/event/' + eventId + '/guestlist' + apisdk._generateAuthKey() + '&method=updatestatus&usertoken=usertoken', {tickets: [ticket]}).respond({responseData: true});
    apisdk.event.updateTicketStatus(eventId, ticket, usertoken);
    httpBackend.flush();
  });

  it('should GET event checkin report', function () {
    var eventId = 'test';
    var usertoken = 'usertoken';

    httpBackend.expectGET(preferences._host + '/event/' + eventId + '/guestlist' + apisdk._generateAuthKey() + '&usertoken=usertoken').respond({responseData: true});
    apisdk.event.getCheckinReport(eventId, usertoken);
    httpBackend.flush();
  });

  it('should GET producer customer profile', function () {
    var producerId = 'test';
    var usertoken = 'usertoken';

    httpBackend.expectGET(preferences._host + '/producer/' + producerId + '/customerProfile' + apisdk._generateAuthKey() + '&usertoken=usertoken').respond({responseData: true});
    apisdk.producer.getCustomerProfile(producerId, usertoken);
    httpBackend.flush();
  });

  it('should GET producer sales for customer', function () {
    var identifier = {
      producerId: 'producer',
      costumerId: 'costumer'
    };

    var usertoken = 'usertoken';
    var filters = {
      test: 'test'
    };

    httpBackend.expectGET(preferences._host + '/producer/' + identifier.producerId + '/customer/' + identifier.costumerId + '/sale' + apisdk._generateAuthKey() + '&test=test&usertoken=usertoken').respond({responseData: true});
    apisdk.producer.getSalesForCostumer(identifier, filters, usertoken);
    httpBackend.flush();
  });

  it('should GET Customer List', function () {
    var producerId = 'test';
    var filters = {
      test: 'test'
    };
    var usertoken = 'usertoken';

    httpBackend.expectGET(preferences._host + '/producer/' + producerId + '/customer' + apisdk._generateAuthKey() + '&test=test&usertoken=usertoken').respond({responseData: true});
    apisdk.producer.getCustomerList(producerId, filters, usertoken);
    httpBackend.flush();
  });

  it('should GET Customer List Export to CSV Url', function () {
    var producerId = 'test';
    var usertoken = 'usertoken';

    var url = apisdk.producer.getCustomerListCSVExportURL(producerId, usertoken);
    expect(url).toBe(preferences._host + '/producer/' + producerId + '/customerExport' + apisdk._generateAuthKey() + '&usertoken=usertoken');
  });

  it('should GET Sales Group Report', function () {
    var identifier = 'test';
    var filters = {
      teste: 'teste'
    };
    var usertoken = 'usertoken';

    apisdk.producer.getSalesGroupReport(identifier, filters, usertoken);
    httpBackend.expectGET(preferences._host + '/producer/' + identifier + '/salesgroupReport' + apisdk._generateAuthKey() + '&teste=teste&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET Sales Group Payment Report', function () {
    var identifier = 'test';
    var filters = {
      teste: 'teste'
    };
    var usertoken = 'usertoken';

    apisdk.producer.getSalesGroupPaymentReport(identifier, filters, usertoken);
    httpBackend.expectGET(preferences._host + '/producer/' + identifier + '/salesgroupPaymentReport' + apisdk._generateAuthKey() + '&teste=teste&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should POST ticketbooth method sell', function () {
    var postObject = {
      eventId: '12291',
      payment: 'boleto',
      userEmal: 'daniel.borlino@ingrese.com',
      tickets: [
        {
          session: {
            date: '24/10/2015',
            time: '23:00:00'
          },
          ticketTypeId: 12345,
          halfPrice: 0,
          quantity: 1
        }
      ]
    };
    var usertoken = 'usertoken';

    apisdk.ticketBooth.sell(postObject, usertoken);
    httpBackend.expectPOST(preferences._host + '/ticketbooth' + apisdk._generateAuthKey() + '&method=sell&usertoken=usertoken', postObject).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET ticketbooth method print', function () {
    var transactionId = 1234;
    var filters = {
      from: '1000',
      tickets: [10,11,12,13]
    };
    var token = 'usertoken';
    apisdk.ticketBooth.getPrintData(transactionId, filters, token);
    httpBackend.expectGET(preferences._host + '/ticketbooth/' + transactionId + apisdk._generateAuthKey() + '&from=1000&tickets=10%2C11%2C12%2C13&method=print&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET ticket qrcode image url', function () {
    var ticketCode = 1234;
    var usertoken = 'usertoken';
    var url = apisdk.ticket.getQRCodeUrl(ticketCode, usertoken);
    expect(url).toBe(preferences._host + '/ticket/' + ticketCode + '/qrcode' + apisdk._generateAuthKey() + '&usertoken=' + usertoken);
  });

  it('should GET dashboard/:eventId', function () {
    var identifier = '123456';
    var filters = {
      channel: 'online',
      session: 1234,
      from: '2015-07-01',
      to: '2015-08-01'
    };
    var token = 'usertoken';

    apisdk.dashboard.getEventReport(identifier, filters, token);
    httpBackend.expectGET(preferences._host + '/dashboard/' + identifier + apisdk._generateAuthKey() + '&channel=online&session=1234&from=2015-07-01&to=2015-08-01&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET balance', function () {
    var filters = {
      from: '2015-07-01',
      to: '2015-08-01',
      event: 12291,
      operator: 118,
      salesgroup: 0
    };
    var token = 'usertoken';

    apisdk.balance.get(filters, token);
    httpBackend.expectGET(preferences._host + '/balance' + apisdk._generateAuthKey() + '&from=2015-07-01&to=2015-08-01&event=12291&operator=118&salesgroup=0&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET dashboard/:eventId/visitsReport', function () {
    var eventId = '123456';
    var filters = {
      from: '2015-07-01',
      to: '2015-08-01'
    };
    var usertoken = 'usertoken';

    apisdk.dashboard.getVisitsReport(eventId, filters, usertoken);
    httpBackend.expectGET(preferences._host + '/dashboard/' + eventId + '/visitsReport' + apisdk._generateAuthKey() + '&from=2015-07-01&to=2015-08-01&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });


  it('should GET dashboard/:eventId/transactionReport', function () {
    var eventId = '123456';
    var filters = {
      from: '2015-07-01',
      to: '2015-08-01'
    };
    var usertoken = 'usertoken';

    apisdk.dashboard.getTransactionsReport(eventId, filters, usertoken);
    httpBackend.expectGET(preferences._host + '/dashboard/' + eventId + '/transactionReport' + apisdk._generateAuthKey() + '&from=2015-07-01&to=2015-08-01&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET dashboard/:eventId/timeline', function () {
    var identifier = '123456';
    var filters = {
      channel: 'online',
      session: 1234,
      from: '2015-07-01',
      to: '2015-08-01'
    };
    var token = 'usertoken';

    apisdk.dashboard.getEventSalesTimeline(identifier, filters, token);
    httpBackend.expectGET(preferences._host + '/dashboard/' + identifier + '/timeline' + apisdk._generateAuthKey() + '&channel=online&session=1234&from=2015-07-01&to=2015-08-01&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET error/:class', function () {
    var errorClass = '2000';

    apisdk.error.get(errorClass);
    httpBackend.expectGET(preferences._host + '/error/' + errorClass + apisdk._generateAuthKey()).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET user/:userId', function () {
    apisdk.user.get(1234, {teste: 'teste'}, 'usertoken');
    httpBackend.expectGET(preferences._host + '/user/1234' + apisdk._generateAuthKey() + '&teste=teste&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should POST user method create', function () {
    var user = {
      name: 'Marcelo',
      lastname: 'Silva',
      username: 'bissuh',
      email: 'bissuh@ingresse.com',
      emailConfirm: 'bissuh@ingresse.com',
      pass: '123',
      passCheck: '123',
      acceptedTerms: true,
      fbUserId: '123456789',
      cellPhone: '(11) 98109-1971',
      street: 'Rua Joaquim Floriano',
      number: '488',
      complement: '5 andar',
      district: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zip: '04545-005'
    };

    apisdk.user.create(user);
    httpBackend.expectPOST(preferences._host + '/user' + apisdk._generateAuthKey() + '&method=create', user).respond({responseData: true});
    httpBackend.flush();
  });

  it('should POST user?method=update', function () {
    var userId = 1234;
    var user = {
      name: 'Marcelo',
      lastname: 'Silva',
      username: 'bissuh',
      email: 'bissuh@ingresse.com',
      emailConfirm: 'bissuh@ingresse.com',
      pass: '123',
      passCheck: '123',
      acceptedTerms: true,
      fbUserId: '123456789',
      cellPhone: '(11) 98109-1971',
      street: 'Rua Joaquim Floriano',
      number: '488',
      complement: '5 andar',
      district: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zip: '04545-005'
    };
    var token = 'usertoken';

    apisdk.user.update(userId, user, token);
    httpBackend.expectPOST(preferences._host + '/user/' + userId + apisdk._generateAuthKey() + '&usertoken=usertoken&method=update', user).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET user', function () {
    apisdk.user.search({term: 'daniel'});
    httpBackend.expectGET(preferences._host + '/user' + apisdk._generateAuthKey() + '&term=daniel').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET user/validate', function () {
    apisdk.user.validateField({'field-name': 'name', 'field-value': 'teste'});
    httpBackend.expectGET(preferences._host + '/user/validate' + apisdk._generateAuthKey() + '&field-name=name&field-value=teste').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET user/:userid/events', function () {
    var userid = 1234;
    var filters = {
      type: 'freeseat'
    };
    var token = 'usertoken';

    apisdk.user.getEvents(userid, filters, token);
    httpBackend.expectGET(preferences._host + '/user/' + userid + '/events' + apisdk._generateAuthKey() + '&type=freeseat&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET user/:userid/picture', function () {
    var url = apisdk.user.getPhotoUrl(1234);
    expect(url).toBe(preferences._host + '/user/' + 1234 + '/picture/' + apisdk._generateAuthKey());
  });

  it('should GET sale', function () {
    var filters = {
      id: [1234,1235,1236],
      channel: '123456',
      event: 1234,
      session: [1234,1235,1236],
      from: '2015-07-01',
      to: '2015-08-01',
      status: ['approved','declined','pending'],
      term: 'daniel',
      operator: '1234568',
      paymentoption: 'all'
    };
    var token = 'usertoken';

    apisdk.sale.getReport(filters, token);
    httpBackend.expectGET(preferences._host + '/sale' + apisdk._generateAuthKey() + '&id=1234%2C1235%2C1236&channel=123456&event=1234&session=1234%2C1235%2C1236&from=2015-07-01&to=2015-08-01&status=approved%2Cdeclined%2Cpending&term=daniel&operator=1234568&paymentoption=all&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET sale/:transactionId', function () {
    var transactionId = 123456;
    var token = 'usertoken';

    apisdk.sale.get(transactionId, token);
    httpBackend.expectGET(preferences._host + '/sale/' + transactionId + apisdk._generateAuthKey() + '&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should POST sale?method=refund', function () {
    var transactionId = 123456;
    var reason = 'reason';
    var token = 'usertoken';

    apisdk.sale.refund(transactionId, reason, token);
    httpBackend.expectPOST(preferences._host + '/sale/' + transactionId + apisdk._generateAuthKey() + '&method=refund&usertoken=usertoken',{reason: reason}).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET home/sections', function () {
    apisdk.home.getSections();
    httpBackend.expectGET(preferences._host + '/home/sections' + apisdk._generateAuthKey()).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET home/cover', function () {
    apisdk.home.getCover();
    httpBackend.expectGET(preferences._host + '/home/cover' + apisdk._generateAuthKey()).respond({responseData: true});
    httpBackend.flush();
  });

  it('should POST freepass', function () {
    var filters = {
      verify: true
    };
    var postObject = {
      eventId: 1234,
      ticketTypeId: 1234,
      halfPrice: 0,
      emails: ['daniel.borlino@ingresse.com','bissuh@ingresse.com']
    };
    var token = 'usertoken';

    apisdk.freepass.send(filters, postObject, token);
    httpBackend.expectPOST(preferences._host + '/freepass' + apisdk._generateAuthKey() + '&verify=true&usertoken=' + token, postObject).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET salesgroup', function () {
    var filters = {
      id: 123456,
      term: 'nomedoevento'
    };
    var usertoken = 'usertoken';

    apisdk.salesgroup.get(filters, usertoken);
    httpBackend.expectGET(preferences._host + '/salesgroup' + apisdk._generateAuthKey() + '&id=123456&term=nomedoevento&usertoken=usertoken').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET featured', function () {
    var filters = {
      state: 'sp'
    };
    apisdk.getFeaturedEvents(filters);
    httpBackend.expectGET(preferences._host + '/featured' + apisdk._generateAuthKey() + '&state=sp').respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET /:category', function () {
    var category = 'shows';
    apisdk.getEventCategory(category);
    httpBackend.expectGET(preferences._host + '/' + category + apisdk._generateAuthKey()).respond({responseData: true});
    httpBackend.flush();
  });

  it('should GET Refund Reasons', function () {
    apisdk.getRefundReasons();
    httpBackend.expectGET(preferences._host + '/refundReasons' + apisdk._generateAuthKey()).respond({responseData: true});
    httpBackend.flush();
  });

  it('should get authorize url', function () {
    var url = apisdk.login.getAuthorizeUrl();
    expect(url).toBe(preferences._host + '/authorize/' + apisdk._generateAuthKey() + '&returnurl=' + apisdk._urlencode(preferences.loginReturnUrl));
  });

  it('should get logout url', function () {
    var url = apisdk.login.getLogoutURL();
    expect(url).toBe(preferences._host + '/logout' + apisdk._generateAuthKey() + '&returnurl=' + apisdk._urlencode(preferences.loginReturnUrl));
  });

  it('should POST login', function () {
    var postObject = {
      email: 'daniel.borlino@ingresse.com',
      password: '123'
    };

    apisdk.login.direct(postObject);
    httpBackend.expectPOST(preferences._host + '/login' + apisdk._generateAuthKey(), postObject).respond({responseData: true});
    httpBackend.flush();
  });

  it('should POST login/facebook', function () {
    var postObject = {
      fbUserId: '123456789',
      email: 'daniel.borlino@ingresse.com'
    };

    apisdk.login.facebook(postObject);
    httpBackend.expectPOST(preferences._host + '/login/facebook' + apisdk._generateAuthKey(), postObject).respond({responseData: true});
    httpBackend.flush();
  });

  it('should get register url', function () {
    var url = apisdk.register();
    expect(url).toBe(preferences._host + '/register' + apisdk._generateAuthKey() + '&returnurl=' + apisdk._urlencode(preferences.loginReturnUrl));
  });

  it('should get login with facebook url', function () {
    var url = apisdk.getLoginWithFacebookUrl();
    expect(url).toBe(preferences._host + '/authorize/facebook' + apisdk._generateAuthKey() + '&returnurl=' + apisdk._urlencode(preferences.loginReturnUrl));
  });

  it('should get register with facebook url', function () {
    var url = apisdk.getRegisterWithFacebookUrl();
    expect(url).toBe(preferences._host + '/register-from-facebook' + apisdk._generateAuthKey() + '&returnurl=' + apisdk._urlencode(preferences.loginReturnUrl));
  });

  it('should POST to shop', function () {
    var postObject = {
      eventId: '12291',
      userId: '123456',
      discountCode: 'desconto',
      passkey: 'hidden',
      tickets: [
        {
          session: {
            date: '24/10/2015',
            time: '23:00:00'
          },
          ticketTypeId: 12345,
          halfPrice: 0,
          quantity: 1
        }
      ]
    };
    var usertoken = 'usertoken';

    apisdk.ticketReservation(postObject.eventId, postObject.userId, usertoken, postObject.tickets, postObject.discountCode, postObject.passkey);
    httpBackend.expectPOST(preferences._host + '/shop' + apisdk._generateAuthKey() + '&usertoken=usertoken', postObject).respond({responseData: true});
    httpBackend.flush();
  });

  it('should get a pagar.me card', function () {
    var transaction = {
      creditcard: {
        name: 'DANIEL B OLIVEIRA',
        month: '10',
        year: '2020',
        number: '4111111111111111',
        cvv: '123'
      }
    };

    transaction = apisdk.createPagarmeCard(transaction);
    expect(transaction.creditcard.pagarme.cardNumber).toBe(transaction.creditcard.number);
    expect(transaction.creditcard.pagarme.cardHolderName).toBe(transaction.creditcard.name);
    expect(transaction.creditcard.pagarme.cardExpirationMonth).toBe(transaction.creditcard.month);
    expect(transaction.creditcard.pagarme.cardExpirationYear).toBe(transaction.creditcard.year);
    expect(transaction.creditcard.pagarme.cardCVV).toBe(transaction.creditcard.cvv);
  });

  it('should fail on pagar.me card creation', function () {
    var transaction = {
      creditcard: {
        name: '',
        month: '24',
        year: '0',
        number: '99999999999999',
        cvv: 'x'
      }
    };

    try {
      apisdk.createPagarmeCard(transaction);
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(' Número do cartão inválido. Nome do portador inválido. Mês de expiração inválido. Ano de expiração inválido. Código de segurança inválido.');
      expect(error.code).toBe(1031);
    }
  });

  it('should POST to shop with card', function () {
    var currentTransaction = {
      transactionId: '123456789',
      userId: '123456',
      paymentMethod: 'CreditCard',
      passkey: 'hidden',
      creditcard: {
        name: 'DANIEL B OLIVEIRA',
        month: '10',
        year: '2020',
        number: '4111111111111111',
        cvv: '123',
        cpf: '35231804819'
      },
      eventId: '1234',
      tickets: [
        {
          session: {
            date: '24/10/2015',
            time: '23:00:00'
          },
          ticketTypeId: 12345,
          halfPrice: 0,
          quantity: 1
        }
      ]
    };
    var usertoken = 'usertoken';
    var installments = 1;

    var transactionDTO = apisdk.createPagarmeCard(currentTransaction);
    transactionDTO.creditcard.pagarme.generateHash(function (hash) {
      transactionDTO.creditcard = {
        cardHash: hash,
        cpf: transactionDTO.creditcard.cpf
      };

      apisdk.payReservation(currentTransaction.eventId, currentTransaction.userId, usertoken, currentTransaction.transactionId, currentTransaction.tickets, currentTransaction.paymentMethod, currentTransaction.creditcard, installments, currentTransaction.passkey);
      httpBackend.expectPOST(preferences._host + '/shop' + apisdk._generateAuthKey() + '&usertoken=usertoken', transactionDTO).respond({responseData: true});
      httpBackend.flush();
    });
  });
});
