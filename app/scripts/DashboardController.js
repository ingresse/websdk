angular.module('ingresseEmulatorApp')
  .controller('DashboardController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
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

    $scope.getVisitsReport = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['visitsReport'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['visitsReport']);

      ingresseAPI.getVisitsReport(identifier, filters, $scope.user.token)
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
      visitsReport: {
        label: 'Visits Report',
        action: $scope.getVisitsReport,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
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
          }
        ]
      }
    };
  });
