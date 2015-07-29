angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user', {
        templateUrl: 'views/emulator.html',
        controller: 'UserController'
      });
  })
  .controller('UserController', function ($scope, $rootScope, ingresseAPI, IngresseAPI_UserService, EmulatorService, QueryService) {
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

    $scope.getUser = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.user.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.user);

      QueryService.setSearchParams('user', $scope.fields.user.identifier, filters);

      ingresseAPI.getUser(identifier, filters, $scope.credentials.token)
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

    $scope.getUserTickets = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.userTickets.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.userTickets);

      QueryService.setSearchParams('userTickets', $scope.fields.userTickets.identifier, filters);

      ingresseAPI.getUserTickets(identifier, filters, $scope.credentials.token)
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

    $scope.getUserEvents = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.userEvents.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.userEvents);

      QueryService.setSearchParams('userEvents', $scope.fields.userEvents.identifier, filters);

      ingresseAPI.getUserEvents(identifier, filters, $scope.credentials.token)
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

    $scope.getUserPhotoUrl = function () {
      $scope.result = {};

      var identifier = $scope.fields.userPhoto.identifier.model;

      QueryService.setSearchParams('userPhoto', $scope.fields.userPhoto.identifier, null);

      EmulatorService.addResponse({url: ingresseAPI.getUserPhotoUrl(identifier)}, true);
    };

    $scope.updateUserInfo = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.userUpdate.identifier.model;
      var obj = $scope.getFiltersByTab($scope.fields.userUpdate);

      QueryService.setSearchParams('userUpdate', $scope.fields.userUpdate.identifier, null);

      ingresseAPI.updateUserInfo(identifier, obj, $scope.credentials.token)
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

    $scope.createUser = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.createUser);

      QueryService.setSearchParams('createUser', null, filters);

      ingresseAPI.createUser(filters)
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

    $scope.searchUser = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.searchUser);

      QueryService.setSearchParams('searchUser', null, filters);

      ingresseAPI.searchUser(filters)
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

    $scope.fields = {
      user: {
        label: 'User',
        action: $scope.getUser,
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
        action: $scope.searchUser,
        authentication: false,
        fields: [
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      userPhoto: {
        label: 'Photo',
        action: $scope.getUserPhotoUrl,
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
        action: $scope.getUserEvents,
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
        action: $scope.getUserTickets,
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
            label: 'event',
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
        action: $scope.updateUserInfo,
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
      createUser: {
        label: 'Create User',
        action: $scope.createUser,
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
