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

    $scope.getFiltersByTab = function (tab) {
        var obj = {};
        var i, day, month, year;

        for (i = tab.fields.length - 1; i >= 0; i--) {
            if (tab.fields[i].model) {
                if (tab.fields[i].type === 'date') {
                    day = tab.fields[i].model.getDate().toString();
                    month = tab.fields[i].model.getMonth().toString();
                    if (month.length < 2) {
                        month = '0' + month;
                    }
                    year = tab.fields[i].model.getFullYear().toString();
                    obj[tab.fields[i].label] = year + '-' + month + '-' + day;
                } else {
                    obj[tab.fields[i].label] = tab.fields[i].model;
                }
            }
        }

        return obj;
    };

    $scope.get = function () {
        $scope.isLoading = true;

        var filters = $scope.getFiltersByTab($scope.fields.balance);

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

    $scope.fields = {
        balance: {
            label: 'Balance',
            action: $scope.get,
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
