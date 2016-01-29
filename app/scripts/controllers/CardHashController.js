'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
      $routeProvider
          .when('/cardHash', {
              templateUrl: 'views/emulator.html',
              controller: 'CardHashController',
              reloadOnSearch: false
          });
  })
  .controller('CardHashController', function ($scope, Payment, IngresseApiUserService, EmulatorService, QueryService) {
      $scope.request = {};

      /**
       * On view load get user credentias and
       * query params to fill up the form
       */
      $scope.$on('$viewContentLoaded', function () {
        $scope.credentials = IngresseApiUserService.credentials;
        QueryService.getSearchParams($scope.fields);
      });

      /**
       * Generate card hash for pagarme and pagseguro
       */
      $scope.generateCardHash = function () {
         $scope.isLoading = true;

         var params      = QueryService.getFiltersByTab($scope.fields.cardHash),
             transaction = $scope.formatTransactionParams(params),
             payment     = new Payment();

         // Set transaction and define the gateway
         payment
           .setTransaction(transaction)
           .setGateway();

         // Execute the payment to generate the cardhash and sender hash
         payment.execute()
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

      /**
       * Format transaction params
       * @param {object} params - From filled params
       */
      $scope.formatTransactionParams = function (params) {
        var transaction = {
          creditcard: {
            name  : params['creditcard.name'],
            number: params['creditcard.number'],
            month : params['creditcard.month'],
            year  : params['creditcard.year'],
            flag  : params['creditcard.flag'],
            cvv   : params['creditcard.cvv']
          },
          gateway: {
            name   : params['gateway.name'],
            session: params['gateway.session']
          },
          paymentMethod: params.paymentMethod
        };

        return transaction;
      };

      /**
       * From fileds
       */
      $scope.fields = {
        cardHash: {
          label: 'CardHash',
          action: $scope.generateCardHash,
          authentication: true,
          fields: [{
            label: 'paymentMethod',
            model: '',
            type: 'option',
            options: ['CartaoCredito', 'BoletoBancario'],
            disabled: false
          }, {
            label: 'gateway.name',
            model: '',
            type: 'option',
            options: ['pagarme', 'pagseguro'],
            disabled: false
          }, {
            label: 'gateway.session',
            model: '',
            type: 'text',
            disabled: false
          }, {
            label: 'creditcard.name',
            model: '',
            type: 'text',
            disabled: false
          }, {
            label: 'creditcard.month',
            model: '',
            type: 'option',
            options: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            disabled: false
          }, {
            label: 'creditcard.year',
            model: '',
            type: 'option',
            options: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
            disabled: false
          }, {
            label: 'creditcard.number',
            model: '',
            type: 'text',
            disabled: false
          }, {
            label: 'creditcard.cvv',
            model: '',
            type: 'text',
            disabled: false
          }, {
            label: 'creditcard.flag',
            model: '',
            type: 'option',
            options: ['visa', 'mastercard', 'amex', 'diners', 'elo'],
            disabled: false
          }]
        }
      };
  });

