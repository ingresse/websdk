'use strict';

angular.module('ingresseEmulatorApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/event', {
                templateUrl: 'views/emulator.html',
                controller: 'EventController',
                reloadOnSearch: false
            });
    })
    .controller('EventController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
        $scope.request = {};

        $scope.$on('$viewContentLoaded', function () {
            $scope.credentials = IngresseApiUserService.credentials;
            QueryService.getSearchParams($scope.fields);
        });

        $scope.get = function () {
            $scope.isLoading = true;

            var identifier = $scope.fields.event.identifier.model;
            var filters = QueryService.getFiltersByTab($scope.fields.event);

            QueryService.setSearchParams('event', $scope.fields.event.identifier, filters);

            ingresseAPI.event.get(identifier, filters, $scope.credentials.token)
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

            ingresseAPI.event.getCheckinReport(identifier, $scope.credentials.token)
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
            var filters = QueryService.getFiltersByTab($scope.fields.updateTicketStatus);

            QueryService.setSearchParams('updateTicketStatus', $scope.fields.updateTicketStatus.identifier, filters);

            filters.ticketTimestamp = new Date().toISOString();

            ingresseAPI.event.updateTicketStatus(identifier, filters, $scope.credentials.token)
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

        $scope.getTicketTypes = function () {
            $scope.isLoading = true;

            var identifier = $scope.fields.eventTicketTypes.identifier.model;
            var filters = QueryService.getFiltersByTab($scope.fields.eventTicketTypes);

            QueryService.setSearchParams('eventTicketTypes', $scope.fields.eventTicketTypes.identifier, filters);

            ingresseAPI.event.getTicketTypes(identifier, filters, $scope.credentials.token)
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

        $scope.getTicketTypesForSession = function () {
            $scope.isLoading = true;

            var identifier = $scope.fields.eventTicketTypesForSession.identifier.model;
            var filters = QueryService.getFiltersByTab($scope.fields.eventTicketTypesForSession);

            QueryService.setSearchParams('eventTicketTypesForSession', $scope.fields.eventTicketTypesForSession.identifier, filters);

            ingresseAPI.event.getTicketTypesForSession(identifier, filters, $scope.credentials.token)
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

        $scope.getCrew = function () {
            $scope.isLoading = true;

            var identifier = $scope.fields.crew.identifier.model;
            var filters = QueryService.getFiltersByTab($scope.fields.crew);

            QueryService.setSearchParams('crew', $scope.fields.crew.identifier, filters);

            ingresseAPI.event.getCrew(identifier, filters, $scope.credentials.token)
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

        $scope.getAttributes = function () {
          $scope.isLoading = true;

          var identifier = $scope.fields.attributes.identifier.model;
          var filters = QueryService.getFiltersByTab($scope.fields.attributes);

          QueryService.setSearchParams('attributes', $scope.fields.attributes.identifier, filters);

          ingresseAPI.event.getAttributes(identifier, filters)
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

        $scope.getList = function () {
            $scope.isLoading = true;

            var filters = QueryService.getFiltersByTab($scope.fields.eventSearch);

            QueryService.setSearchParams('user', null, filters);

            ingresseAPI.event.getList(filters)
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

        $scope.update = function () {
            $scope.isLoading = true;

            var _eventId = $scope.fields.update.identifier.eventId;
            var _token   = $scope.credentials.token;
            var _data    = QueryService.getFiltersByTab($scope.fields.update);

            ingresseAPI.event.update(_eventId, _data, _token)
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
                action: $scope.get,
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
                label: 'Search',
                action: $scope.getList,
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
                label: 'Tickets',
                action: $scope.getTicketTypes,
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
                        label: 'pos',
                        model: '',
                        type: 'checkbox',
                        disabled: false
                    },
                    {
                        label: 'passkey',
                        model: '',
                        type: 'text',
                        disabled: false
                    }
                ]
            },
            eventTicketTypesForSession: {
                label: 'Session Tickets',
                action: $scope.getTicketTypesForSession,
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
                        label: 'sessionId',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
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
                post: true,
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
            crew: {
                label: 'Crew',
                action: $scope.getCrew,
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
            attributes: {
                label: 'Attributes',
                action: $scope.getAttributes,
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
                        label: 'filters',
                        model: '',
                        type: 'text',
                        disabled: false
                    }
                ]
            },
            update: {
                label: 'update',
                action: $scope.update,
                authentication: true,
                post: true,
                identifier: {
                    label: 'eventId',
                    model: '',
                    type: 'object',
                    disabled: false,
                    required: true
                },
                fields: [
                    {
                        label: 'aiddp',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                    {
                        label: 'obs2',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                    {
                        label: 'formalName',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                    {
                        label: 'address',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                    {
                        label: 'cnpj',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                    {
                        label: 'cpf',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                    {
                        label: 'cityNumber',
                        model: '',
                        type: 'text',
                        disabled: false
                    },
                ]
            },
        };
    });
