angular.module('ingresseSDK')
.service('IngresseAPI_EventService', function EventService(ingresseAPI, $log, $q) {
  return {
    convertAPIEventObject: function(apiEvent) {
      var appEvent = {
        id: apiEvent.id,
        title: apiEvent.title,
        description: apiEvent.description,
        planner: apiEvent.planner,
        addedBy: apiEvent.addedBy,
        venue: apiEvent.venue,
        saleAvailable: true,
        saleEnabled: apiEvent.saleEnabled,
        profit: apiEvent.totalProfit,
        quantitySold: apiEvent.totalTicketsSold,
        link: apiEvent.link,
        poster: apiEvent.poster,
        totalTickets: apiEvent.totalTickets,
        type: apiEvent.type,
        taxToCostumer: apiEvent.taxToCostumer
      };

      if (apiEvent.addedBy) {
        appEvent.ownerPhoto = ingresseAPI.getUserPhotoUrl(apiEvent.addedBy.id);
      }

      if (!apiEvent.date) {
        $log.error('The event does not have a date property');
        return false;
      }

      appEvent.sessions = this._addMomentToSessions(apiEvent.date);
      appEvent.mostRecentSession = this._getMostRecentSession(appEvent.sessions);
      appEvent.nextAvailableDate = this._getNextAvailableDate(appEvent.sessions);

      if (!appEvent.nextAvailableDate) {
        appEvent.nextAvailableDate = "Não há sessões disponíveis";
        appEvent.saleAvailable = false;
      }

      appEvent.status = this._getEventStatus(apiEvent.private, apiEvent.status);

      return appEvent;
    },

    _addMomentToSessions: function(apiEventDateArray) {
      for (var i = 0; i < apiEventDateArray.length; i++) {
        apiEventDateArray[i].moment = this._convertApiDateTimeToMoment(apiEventDateArray[i].dateTime);
      };

      return apiEventDateArray;
    },
    _getMostRecentSession: function(eventDateArray) {
      var lo, hi;
      var now = moment();

      for (var i = 0; i < eventDateArray.length; i++) {
        if (eventDateArray[i].moment.isBefore(now) && (lo === undefined || lo.moment.isBefore(eventDateArray[i].moment))) {
          lo = eventDateArray[i];
        }

        if (eventDateArray[i].moment.isAfter(now) && (hi === undefined || hi.moment.isAfter(eventDateArray[i].moment))) {
          hi = eventDateArray[i];
        }
      };

      if(hi) {
        return hi;
      }

      return lo;
    },
    _getNextAvailableDate: function(sessionArray) {
      var availableDates = [];
      var nextAvailableDate = "";

      // Filter all sessions with the available status and convert the date to moment.
      for (var i = 0; i < sessionArray.length; i++) {
        if (sessionArray[i].status === "available" && !sessionArray[i].moment.isBefore(moment())) {
          availableDates.push(sessionArray[i]);
        }
      };

      var sevenDaysLatter = moment().add(7, 'days');

      // Format the response based on the quantity of available dates.
      if(availableDates.length > 1){
        // Format the response based on time.
        nextAvailableDate = availableDates[0].moment.calendar() + " e mais " + (availableDates.length - 1);

        if(availableDates.length < 3){
          nextAvailableDate += " data"
        }else{
          nextAvailableDate += " datas"
        }
        return nextAvailableDate;
      }

      if(availableDates.length === 1){
        // Just one available date.
        nextAvailableDate = availableDates[0].moment.calendar();
        nextAvailableDate += ' ás ' + availableDates[0].moment.format("HH:mm");
      }

      if (availableDates.length === 0) {
        // No availlable date
        return false;
      }

      return nextAvailableDate;
    },
    _getEventStatus: function(private,status) {
      if (status === "published" && !private) {
        return "Público";
      }

      if (status === "published" && private) {
        return "Privado";
      }

      if (status === "hidden") {
        return "Escondido";
      }

      if (status === "draft") {
        return "Rascunho";
      }
    },
    _convertApiDateTimeToMoment: function (apiDateTime) {
      return moment(apiDateTime.date + " " + apiDateTime.time,"DD/MM/YYYY HH:mm:ss");
    }
  }
});
