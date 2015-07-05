angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/event', {
        templateUrl: 'views/emulator.html',
        controller: 'EventController'
      });
  })
  .controller('EventController', function ($scope, ingresseAPI, IngresseAPI_UserService, $routeParams, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseAPI_UserService.credentials;
      QueryService.getSearchParams($scope.fields);
    });

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      var i, day, month, year;

      for (i = tab.fields.length - 1; i >= 0; i--) {
        if (tab.fields[i].model) {
          if (tab.fields[i].type === 'date') {
            day = tab.fields[i].model.getDate().toString();
            month = tab.fields[i].model.getMonth().toString();
            if (month.length < 2) {
              month = "0" + month;
            }
            year = tab.fields[i].model.getFullYear().toString();
            obj[tab.fields[i].label] = year + "-" + month + "-" + day;
          } else {
            obj[tab.fields[i].label] = tab.fields[i].model;
          }
        }
      }

      return obj;
    };

    $scope.getEvent = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.event.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.event);

      QueryService.setSearchParams('event', $scope.fields.event.identifier, filters);

      ingresseAPI.getEvent(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getCheckinReport = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.checkinReport.identifier.model;

      QueryService.setSearchParams('checkinReport', $scope.fields.checkinReport.identifier);

      ingresseAPI.getCheckinReport(identifier, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.updateTicketStatus = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.updateTicketStatus.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.updateTicketStatus);

      QueryService.setSearchParams('updateTicketStatus', $scope.fields.updateTicketStatus.identifier, filters);

      filters.ticketTimestamp = new Date().toISOString();

      ingresseAPI.updateTicketStatus(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getEventTicketTypes = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.eventTicketTypes.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.eventTicketTypes);

      QueryService.setSearchParams('eventTicketTypes', $scope.fields.eventTicketTypes.identifier, filters);

      ingresseAPI.getEventTicketTypes(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getGuestList = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.guestList.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.guestList);

      QueryService.setSearchParams('guestList', $scope.fields.guestList.identifier, filters);

      ingresseAPI.getGuestList(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getEventCrew = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.crew.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.crew);

      QueryService.setSearchParams('crew', $scope.fields.crew.identifier, filters);

      ingresseAPI.getEventCrew(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getEventList = function () {
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.eventSearch);

      QueryService.setSearchParams('user', null, filters);

      ingresseAPI.getEventList(filters)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.fields = {
      event: {
        label: 'Event',
        action: $scope.getEvent,
        authentication: false,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'fields',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      checkinReport: {
        label: 'Checkin Report',
        action: $scope.getCheckinReport,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        }
      },
      eventSearch: {
        label: 'Event Search',
        action: $scope.getEventList,
        fields: [
          {
            label: 'fields',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'page',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'pageSize',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'lat',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'long',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'from',
            model: '',
            type: 'date',
            disabled: false
          },
          {
            label: 'to',
            model: '',
            type: 'date',
            disabled: false
          },
          {
            label: 'state',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      eventTicketTypes: {
        label: 'Ticket Types',
        action: $scope.getEventTicketTypes,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'pos',
            model: '',
            type: 'checkbox',
            disabled: false
          }
        ]
      },
      updateTicketStatus: {
        label: 'Update Ticket',
        action: $scope.updateTicketStatus,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'ticketCode',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'ticketStatus',
            model: '',
            type: 'checkbox',
            checkbox: {
              trueValue: '1',
              falseValue: '0'
            },
            disabled: false
          }
        ]
      },
      guestList: {
        label: 'Guest List',
        action: $scope.getGuestList,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'fields',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'page',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'pageSize',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'status',
            model: '',
            type: 'option',
            options: ['all', 'checked', 'unchecked'],
            disabled: false
          },
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'channel',
            model: '',
            type: 'option',
            options: ['online', 'offline'],
            disabled: false
          },
          {
            label: 'tickettypeid',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'sessionid',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'from',
            model: '',
            type: 'date',
            disabled: false
          }
        ]
      },
      crew: {
        label: 'Crew',
        action: $scope.getEventCrew,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'fields',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      }
    };
  });
