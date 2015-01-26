angular.module('ingresseSDK')
  .service('Ticketbooth', ['$http', '$log', '$q', 'Config', function ($http, $log, $q, Config) {
    return {
      host: Config.host,
      sell: function (eventId, payment, userEmail, tickets, session, date, time, ticketTypeId, halfPrice, quantity) {
        var deferred = $q.defer();

        var method = "ticketbooth?method=sell";
        var postParams = {
          eventId: eventId,
          payment: payment,
          userEmail: userEmail,
          ticekts: tickets,
          session: session,
          date: date,
          time: time,
          ticketTypeId: ticketTypeId,
          halfPrice: halfPrice,
          quantity: quantity
        };

        $http.post(Config.host + method, postParams)
          .success(function (result) {
            $log.log(result);
          })
          .error(function (error) {
            $log.error(error);
          });
      }
    }
  }]);
