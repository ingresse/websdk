'use strict';

angular.module('ingresseEmulatorApp').config(function ($routeProvider) {
    $routeProvider
        .when('/balance', {
            templateUrl: 'views/emulator.html',
            controller: 'BalanceController',
            reloadOnSearch: false
        });
})
.controller('BalanceController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
        $scope.credentials = IngresseApiUserService.credentials;
        QueryService.getSearchParams($scope.fields);
    });

    $scope.get = function () {
        $scope.isLoading = true;

        var filters = QueryService.getFiltersByTab($scope.fields.balance);

        QueryService.setSearchParams('event', null, filters);

        ingresseAPI.balance.get(filters, $scope.credentials.token)
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

    $scope.describe = function (method) {
        return ingresseAPI.balance.describe(method);
    };

    $scope.fields = {
        balance: {
            label: 'Balance',
            action: $scope.get,
            documentationUrl: $scope.describe('get'),
            authentication: true,
            identifier: null,
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
                },
                {
                    label: 'event',
                    model: '',
                    type: 'number',
                    disabled: false
                },
                {
                    label: 'operator',
                    model: '',
                    type: 'number',
                    disabled: false
                },
                {
                    label: 'salesgroup',
                    model: '',
                    type: 'number',
                    disabled: false
                }
            ]
        }
    };
});
