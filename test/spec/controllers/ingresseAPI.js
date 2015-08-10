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
      term: 'test'
    };

    httpBackend.expectGET(preferences._host + '/event/' + eventId + '/tickets' + apisdk._generateAuthKey() + '&term=test&usertoken=usertoken').respond({responseData: true});
    apisdk.event.getTicketTypes(eventId, filters, usertoken);
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
    httpBackend.expectGET(preferences._host + '/producer/' + identifier + '/salesgroupReport' + apisdk._generateAuthKey() + '&test=test&usertoken=usertoken');
  });
  
  it('should GET Sales Group Payment Report', function () {
    var identifier = 'test';
    var filters = {
      teste: 'teste'
    };
    var usertoken = 'usertoken';

    apisdk.producer.getSalesGroupReport(identifier, filters, usertoken);
    httpBackend.expectGET(preferences._host + '/producer/' + identifier + '/salesgroupPaymentReport' + apisdk._generateAuthKey() + '&test=test&usertoken=usertoken');
  });
  
  it('should GET sell from ticketbooth', function () {
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
    httpBackend.expectPOST(preferences._host + '/ticketbooth/' + apisdk._generateAuthKey() + '&method=sell&usertoken=usertoken', postObject);
  });
});
