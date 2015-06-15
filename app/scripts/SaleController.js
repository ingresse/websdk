angular.module('ingresseEmulatorApp')
  .controller('SaleController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
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

    $scope.$on('$viewContentLoaded', function() {
      $scope.user = {
        token: IngresseAPI_UserService.token,
        id: IngresseAPI_UserService.userId
      };

      $scope.calls = ingresseAPI_Preferences.httpCalls;
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

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.getTransaction = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['transaction'].identifier.model;

      ingresseAPI.getTransactionData(identifier, $scope.user.token)
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

    $scope.getSales = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields['sales']);

      ingresseAPI.getSales(filters, $scope.user.token)
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

    $scope.refund = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields['refund'].identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields['refund']);

      ingresseAPI.refund(identifier, filters, $scope.user.token)
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
      transaction: {
        label: 'Transaction',
        action: $scope.getTransaction,
        authentication: true,
        identifier: {
          label: 'transactionId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: []
      },
      refund: {
        label: 'Refund',
        action: $scope.refund,
        authentication: true,
        identifier: {
          label: 'transactionId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'reason',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          }
        ]
      },
      sales: {
        label: 'Sales',
        action: $scope.getSales,
        authentication: true,
        identifier: null,
        fields: [
          {
            label: 'id',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'channel',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'event',
            model: '',
            type: 'number',
            required: true,
            disabled: false
          },
          {
            label: 'session',
            model: '',
            type: 'text',
            required: true,
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
            label: 'status',
            model: '',
            type: 'option',
            options: ['approved','declined','pending'],
            disabled: false
          },
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'operator',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'paymentoption',
            model: '',
            type: 'option',
            options: ['tdb','bankBillet','bankCheck','creditCard','debitCard','free','money','other','payPal','wireTransfer'],
            disabled: false
          }
        ]
      }
    };
  });
