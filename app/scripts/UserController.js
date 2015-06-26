angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user', {
        templateUrl: 'views/emulator.html',
        controller: 'UserController'
      })
  })
  .controller('UserController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
    $scope.credentials = IngresseAPI_UserService.credentials;

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

    $scope.getUser = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['user'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['user']);

      ingresseAPI.getUser(identifier, filters, $scope.credentials.token)
        .then(function (response) {
          $scope.request.userObj = angular.copy(response);
          $scope.result = response;
        })
        .catch(function (error) {
          $scope.result = error;
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.getUserTickets = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['userTickets'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['userTickets']);

      ingresseAPI.getUserTickets(identifier, filters, $scope.credentials.token)
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

    $scope.getUserEvents = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['userEvents'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['userEvents']);

      ingresseAPI.getUserEvents(identifier, filters, $scope.credentials.token)
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

    $scope.getUserPhotoUrl = function () {
      $scope.result = {};

      var identifier = $scope.fields['userPhoto'].identifier.model;

      $scope.result = {url: ingresseAPI.getUserPhotoUrl(identifier)};
    }

    $scope.updateUserInfo = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['userUpdate'].identifier.model;
      var obj = $scope.getFiltersByTab($scope.fields['userUpdate']);

      ingresseAPI.updateUserInfo(identifier, obj, $scope.credentials.token)
        .then(function (response) {
          $scope.request.userObj = angular.copy(response);
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
      }
    };
  });
