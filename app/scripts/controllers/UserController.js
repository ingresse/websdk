'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user', {
        templateUrl: 'views/emulator.html',
        controller: 'UserController',
        reloadOnSearch: false
      });
  })
  .controller('UserController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
    });

    $scope.get = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.user.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.user);

      QueryService.setSearchParams('user', $scope.fields.user.identifier, filters);

      ingresseAPI.user.get(identifier, filters, $scope.credentials.token)
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

    $scope.getTickets = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.userTickets.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.userTickets);

      QueryService.setSearchParams('userTickets', $scope.fields.userTickets.identifier, filters);

      ingresseAPI.user.getTickets(identifier, filters, $scope.credentials.token)
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

    $scope.getEvents = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.userEvents.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.userEvents);

      QueryService.setSearchParams('userEvents', $scope.fields.userEvents.identifier, filters);

      ingresseAPI.user.getEvents(identifier, filters, $scope.credentials.token)
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

    $scope.getPhotoUrl = function () {
      $scope.result = {};

      var identifier = $scope.fields.userPhoto.identifier.model;

      QueryService.setSearchParams('userPhoto', $scope.fields.userPhoto.identifier, null);

      EmulatorService.addResponse({url: ingresseAPI.user.getPhotoUrl(identifier)}, true);
    };

    $scope.update = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.userUpdate.identifier.model;
      var obj = QueryService.getFiltersByTab($scope.fields.userUpdate);

      QueryService.setSearchParams('userUpdate', $scope.fields.userUpdate.identifier, null);

      ingresseAPI.user.update(identifier, obj, $scope.credentials.token)
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

    $scope.create = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.createUser);

      QueryService.setSearchParams('createUser', null, filters);

      ingresseAPI.user.create(filters)
        .then(function (response) {
          EmulatorService.addResponse(response, response.status);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.search = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.searchUser);

      QueryService.setSearchParams('searchUser', null, filters);

      ingresseAPI.user.search(filters, $scope.credentials.token)
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

    $scope.validateField = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.validateUserField);

      QueryService.setSearchParams('validateUserField', null, filters);

      ingresseAPI.user.validateField(filters)
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

    $scope.getUserSession = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.userSession.identifier.model,
        filters = QueryService.getFiltersByTab($scope.fields.userSession),
        sessionId = $scope.fields.userSession.fields[0].model;

      ingresseAPI.user.getUserSessionTickets(identifier, sessionId, filters, $scope.credentials.token)
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

    $scope.getAllUserSessions = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.userSessions.identifier.model,
        filters = QueryService.getFiltersByTab($scope.fields.userSessions);

      ingresseAPI.user.getAllUserSessions(identifier, filters, $scope.credentials.token)
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

    $scope.getUserTicketTransfer = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.userTicketTransfer.identifier.model,
        filters = QueryService.getFiltersByTab($scope.fields.userTicketTransfer);

      ingresseAPI.user.getTransfers(identifier, filters, $scope.credentials.token)
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

    $scope.getRecentsTransfers = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.getRecentsTransfers.identifier.model,
        filter = QueryService.getFiltersByTab($scope.fields.getRecentsTransfers);
      ingresseAPI.user.getRecentsTransfers(identifier, filter, $scope.credentials.token)
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

    $scope.getUserWallet = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.userWallet.identifier.model,
        filters = QueryService.getFiltersByTab($scope.fields.userWallet);

      ingresseAPI.user.getUserWallet(identifier, filters, $scope.credentials.token)
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
      user: {
        label: 'User',
        action: $scope.get,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
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
      searchUser: {
        label: 'Search User',
        action: $scope.search,
        authentication: true,
        fields: [
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          },
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
          }
        ]
      },
      validateUserField: {
        label: 'Validate Field',
        action: $scope.validateField,
        authentication: false,
        fields: [
          {
            label: 'field-name',
            model: '',
            type: 'option',
            options: ['name', 'email', 'username', 'cellphone', 'password', 'emailConfirm'],
            disabled: false
          },
          {
            label: 'field-value',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'field2-value',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      userPhoto: {
        label: 'Photo',
        action: $scope.getPhotoUrl,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: []
      },
      userEvents: {
        label: 'Events',
        action: $scope.getEvents,
        authentication: false,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
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
            label: 'lat',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'long',
            model: '',
            type: 'number',
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
      userTickets: {
        label: 'Tickets',
        action: $scope.getTickets,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
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
            label: 'eventId',
            model: '',
            type: 'number',
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
      userUpdate: {
        label: 'Update',
        action: $scope.update,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'name',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'lastname',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'street',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'number',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'complement',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'district',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'city',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'state',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'zip',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'phone',
            model: '',
            type: 'phone',
            disabled: false
          }
        ]
      },
      userSessions: {
        label: 'Get All User Session',
        action: $scope.getAllUserSessions,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'term',
            model: '',
            type: 'text',
            disable: false
          },
          {
            label: 'order',
            model: '',
            options: ['ASC', 'DESC'],
            type: 'option',
            disable: false
          },
          {
            label: 'from',
            model: '',
            type: 'text',
            disable: false
          },
          {
            label: 'to',
            model: '',
            type: 'text',
            disable: false
          },
          {
            label: 'pageSize',
            model: '',
            type: 'number',
            disable: false
          },
          {
            label: 'page',
            model: '',
            type: 'number',
            disable: false
          }
        ]
      },
      userSession: {
        label: 'Get User Session Tickets',
        action: $scope.getUserSession,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'sessionId',
            model: '',
            type: 'number',
            disable: false,
            required: true
          },
          {
            label: 'pageSize',
            model: '',
            type: 'number',
            disable: false
          },
          {
            label: 'page',
            model: '',
            type: 'number',
            disable: false
          }
        ]
      },
      userWallet: {
        label: 'Get User Event Wallet',
        action: $scope.getUserWallet,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'term',
            model: '',
            type: 'text',
            disable: false
          },
          {
            label: 'order',
            model: '',
            options: ['ASC', 'DESC'],
            type: 'option',
            disable: false
          },
          {
            label: 'from',
            model: '',
            type: 'text',
            disable: false
          },
          {
            label: 'to',
            model: '',
            type: 'text',
            disable: false
          },
          {
            label: 'pageSize',
            model: '',
            type: 'number',
            disable: false
          },
          {
            label: 'page',
            model: '',
            type: 'number',
            disable: false
          }
        ]
      },
      userTicketTransfer: {
        label: 'Get Tickets Transfer',
        action: $scope.getUserTicketTransfer,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'status',
            model: '',
            options: ['pending', 'accepted', 'refused', 'returned', 'cancelled'],
            type: 'option',
            disable: false
          }
        ]
      },
      getRecentsTransfers: {
        label: 'Get Recents Transfer',
        action: $scope.getRecentsTransfers,
        authentication: true,
        identifier: {
          label: 'userid',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'order',
            model: '',
            options: ['ASC', 'DESC'],
            type: 'option',
            disable: false
          },
          {
            label: 'size',
            model: '',
            type: 'number',
            disabled: false
          }
        ]
      },
      createUser: {
        label: 'Create User',
        action: $scope.create,
        authentication: false,
        identifier: null,
        fields: [
          {
            label: 'name',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'lastname',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'email',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'emailConfirm',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'password',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'passCheck',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'acceptedTerms',
            model: '',
            type: 'checkbox',
            disabled: false
          },
          {
            label: 'username',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'fbUserId',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'cellPhone',
            model: '',
            type: 'phone',
            disabled: false
          },
          {
            label: 'street',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'number',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'complement',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'district',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'city',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'state',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'zip',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      }
    };
  });
