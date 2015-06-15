angular.module('ingresseEmulatorApp')
  .controller('EventController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
    $scope.$on('userSessionSaved', function () {
      $scope.user = {
        token: IngresseAPI_UserService.token,
        id: IngresseAPI_UserService.userId
      };
    });

    $scope.$on('userHasLoggedOut', function () {
      $scope.user = {};
    });

    $scope.request = {};
    $scope.result = {};

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.$on('$viewContentLoaded', function() {
      $scope.user = {
        token: IngresseAPI_UserService.token,
        id: IngresseAPI_UserService.userId
      };

      $scope.calls = ingresseAPI_Preferences.httpCalls;

      if ($routeParams.id) {
        $scope.request.id = $routeParams.id;
      }

      $scope.selectedIndex = 0;
    });

    $scope.showError = function(text) {
      alert = $mdDialog.alert({
        title: 'Erro',
        content: text,
        ok: 'Close'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });

      $scope.selectedIndex = 0;
    };

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      for (var i = tab.fields.length - 1; i >= 0; i--) {
        if (!tab.fields[i].model) {
          continue;
        }

        if (tab.fields[i].type === 'date') {
          obj[tab.fields[i].label] = tab.fields[i].model.toISOString();
          continue;
        }

        obj[tab.fields[i].label] = tab.fields[i].model;
      };

      return obj;
    };

    $scope.getEvent = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['event'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['event']);

      ingresseAPI.getEvent(identifier, filters, $scope.user.token)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getCheckinReport = function() {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['checkinReport'].identifier.model;

      ingresseAPI.getCheckinReport(identifier, $scope.user.token)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.updateTicketStatus = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['updateTicketStatus'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['updateTicketStatus']);

      filters.ticketTimestamp = new Date().toISOString();

      ingresseAPI.updateTicketStatus(identifier, filters, $scope.user.token)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getEventTicketTypes = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['eventTicketTypes'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['eventTicketTypes']);

      ingresseAPI.getEventTicketTypes(identifier, filters, $scope.user.token)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getGuestList = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['guestList'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['guestList']);

      ingresseAPI.getGuestList(identifier, filters, $scope.user.token)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getEventCrew = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['crew'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['crew']);

      ingresseAPI.getEventCrew(identifier, filters, $scope.user.token)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getEventList = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields['eventSearch']);

      ingresseAPI.getEventList(filters)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.fields = {
        event: {
          label: 'Event',
          action: $scope.getEvent,
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
              options: ['all','checked','unchecked'],
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
              options: ['online','offline'],
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
