'use strict';

/**
* ingresse.emulator Module
*
* Description
*/

angular.module('ingresse.emulator', ['ingresseSDK']).directive('ingresseEmulator', function () {
  // Runs during compile
  return {
    scope: {}, // {} = isolate, true = child, false/undefined = no change
    controller: function ($scope, ingresseApiCookies, ingresseAPI, ingresseApiPreferences, IngresseApiUserService, IngresseAPI_Freepass, VenusActivityIndicatorService) {
      $scope.domain = ingresseApiCookies('env');

      if (!$scope.domain) {
        $scope.domain = ingresseApiPreferences._host;
      } else {
        ingresseApiPreferences.setHost($scope.domain);
      }

      $scope.httpCalls = ingresseApiPreferences.httpCalls;
      $scope.result = {};
      $scope.collapsed = false;
      $scope.user = {};
      $scope.eventListForm = {};

      $scope.resetResponses = function () {
        // $scope.clearHttpHistory();
        $scope.responseUser = null;
        $scope.result = {};
      };

      $scope.setHost = function (host) {
        if (!host || host === '') {
          return;
        }

        ingresseApiCookies('env', host, 365);
        ingresseApiPreferences.setHost(host);
        $scope.domain = host;
      };

      $scope.setPrivateKey = function (key) {
        ingresseApiPreferences.setPrivateKey(key);
      };

      $scope.setPublicKey = function (key) {
        ingresseApiPreferences.setPublicKey(key);
      };

      $scope.clearHttpHistory = function () {
        ingresseApiPreferences.clearHttpHistory();
      };

      $scope.updateTicketStatusAddTicket = function () {
        $scope.updateTicketStatusData.tickets.push({
          ticketCode: '',
          ticketStatus: '',
          ticketTimestamp: $scope.generateTimestamp()
        });
      };

      $scope.updateTicketStatusRemoveTicket = function (ticket) {
        var i;

        for (i = $scope.updateTicketStatusData.tickets.length - 1; i >= 0; i--) {
          if ($scope.updateTicketStatusData.tickets[i] === ticket) {
            $scope.updateTicketStatusData.tickets.splice(i, 1);
          }
        }
      };

      $scope.getEvent = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando Eventos...');
        ingresseAPI.getEvent(form.id, form.fields, $scope.user.token)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando Eventos...');
          });
      };

      $scope.getEventCrew = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando Vendedores...');
        ingresseAPI.getEventCrew(form.id, form.fields, $scope.user.token)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando Vendedores...');
          });
      };

      $scope.getEventSalesTimeline = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando vendas...');

        ingresseAPI.getEventSalesTimeline(form.eventId, $scope.user.token, form.filters)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando vendas...');
          });
      };

      $scope.getError = function (errorClass) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando lista de erros...');
        ingresseAPI.getError(errorClass)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando lista de erros...');
          });
      };

      $scope.getEventList = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando Eventos...');
        ingresseAPI.getEventList(form.fields, form.filters, form.page, form.pageSize)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando Eventos...');
          });
      };

      $scope.getEventTickets = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando Ingressos...');
        ingresseAPI.getEventTickets(form.id, $scope.user.token, form.pos)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando Ingressos...');
          });
      };

      $scope.getUser = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando dados do usuário...');
        ingresseAPI.getUser(form.id, $scope.user.token, form.fields)
          .then(function (response) {
            $scope.responseUser = angular.copy(response);
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando dados do usuário...');
          });
      };

      $scope.getUserTickets = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando ingressos do usuário...');
        ingresseAPI.getUserTickets(form.id, $scope.user.token, form.fields, form.filters)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando ingressos do usuário...');
          });
      };

      $scope.getUserEvents = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando eventos do usuário...');
        ingresseAPI.getUserEvents(form.id, $scope.user.token, form.fields, form.filters, form.page, form.pageSize)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando eventos do usuário...');
          });
      };

      $scope.updateTicketStatus = function () {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Alterando status dos ingressos...');
        ingresseAPI.updateTicketStatus($scope.updateTicketStatusData.eventid, $scope.user.token, $scope.updateTicketStatusData.tickets)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Alterando status dos ingressos...');
          });
      };

      $scope.getCheckinReport = function () {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando dados do relatório de entrada...');
        ingresseAPI.getCheckinReport($scope.checkinReportForm.eventId, $scope.user.token)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando dados do relatório de entrada...');
          });
      };

      $scope.getVisitsReport = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando dados do relatório de visitas...');
        ingresseAPI.getVisitsReport(form.eventId, form.filters, $scope.user.token)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando dados do relatório de visitas...');
          });
      };

      $scope.getGuestList = function () {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando lista de convidados...');
        ingresseAPI.getGuestList($scope.guestListForm.eventId, $scope.user.token, $scope.guestListForm.fields, $scope.guestListForm.filters)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando lista de convidados...');
          });
      };

      $scope.getTransactionData = function () {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando dados da transação...');
        ingresseAPI.getTransactionData($scope.transactionDataForm.transactionId, $scope.user.token, $scope.transactionDataForm.fields)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando dados da transação...');
          });
      };

      $scope.getTransactionReport = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando relatório de transações...');

        ingresseAPI.getTransactionReport(form.eventId, $scope.user.token, form.filters)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando relatório de transações...');
          });
      };

      $scope.getSalesReport = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando relatório de vendas...');

        ingresseAPI.getSalesReport(form.eventId, $scope.user.token, form.filters)
          .then(function(response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando relatório de vendas...');
          });
      };

      $scope.updateUser = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Atualizando dados do usuário...');
        ingresseAPI.updateUserInfo(form.userId, $scope.user.token, form.userdata)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Atualizando dados do usuário...');
          });
      };

      $scope.createTransaction = function () {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Gerando Transação...');
        ingresseAPI.ticketReservation($scope.createTransactionData.eventId, $scope.createTransactionData.userId, $scope.user.token, $scope.createTransactionData.tickets, $scope.createTransactionData.discountCode)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Gerando Transação...');
          });
      };

      $scope.getProducerSalesGroupReport = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando relatório de vendas dos grupos...');

        ingresseAPI.getProducerSalesGroupReport(form.producerId, $scope.user.token, form.filters)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando relatório de vendas dos grupos...');
          });
      };

      $scope.getProducerCustomerProfile = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando perfil dos clientes...');

        ingresseAPI.getProducerCustomerProfile(form.producerId, $scope.user.token)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando perfil dos clientes...');
          });
      };

      $scope.getProducerCostumers = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando clientes...');
        ingresseAPI.getProducerCostumers(form.producerId, $scope.user.token, form.filters)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          VenusActivityIndicatorService.error(error.message);
        })
        .finally(function () {
          VenusActivityIndicatorService.stopActivity('Carregando clientes...');
        });
      };

      $scope.getProducerSalesForCostumer = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando Vendas para o cliente...');

        ingresseAPI.getProducerSalesForCostumer(form.identifier, $scope.user.token, form.filter)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          VenusActivityIndicatorService.error(error.message);
        })
        .finally(function () {
          VenusActivityIndicatorService.stopActivity('Carregando Vendas para o cliente...');
        });
      };

      $scope.payTransaction = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Pagando Transação...');
        ingresseAPI.payReservation(form.eventId, form.userId, $scope.user.token, form.transactionId, $scope.payTransactionFormData.tickets, form.paymentMethod, form.creditCard, form.installments)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Pagando Transação...');
          });
      };

      $scope.freepass = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Validando cortesias...');
        IngresseAPI_Freepass.send(form.eventId, form.ticketTypeId, form.isHalfPrice, form.emails, form.validate, $scope.user.token)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Validando cortesias...');
          });
      };

      $scope.getSales = function (form) {
        $scope.resetResponses();
        VenusActivityIndicatorService.startActivity('Carregando vendas...');

        if (form.from) {
          form.filters.from = moment(form.from).format('YYYY-MM-DD');
        } else {
          form.filters.from = null;
        }

        if (form.to) {
          form.filters.to = moment(form.to).format('YYYY-MM-DD');
        } else {
          form.filters.to = null;
        }

        ingresseAPI.getSales($scope.user.token, form.filters, form.page)
          .then(function (response) {
            $scope.result = response;
          })
          .catch(function (error) {
            VenusActivityIndicatorService.error(error.message);
          })
          .finally(function () {
            VenusActivityIndicatorService.stopActivity('Carregando vendas...');
          });
      };

      $scope.generateTimestamp = function () {
        var timestamp = new Date();
        return timestamp.getTime();
      };

      $scope.login = function () {
        IngresseApiUserService.login();
      };

      $scope.logout = function () {
        IngresseApiUserService.logout();

        $scope.user = null;
      };

      $scope.refund = function (form) {
        VenusActivityIndicatorService.startActivity('Estornando Pagamento...');
        ingresseAPI.refund($scope.user.token, form.transactionId, form.reason)
        .then(function (response) {
          $scope.result = response;
        })
        .catch(function (error) {
          VenusActivityIndicatorService.error(error.message);
        })
        .finally(function () {
          VenusActivityIndicatorService.stopActivity('Estornando Pagamento...');
        });
      };

      $scope.updateTicketStatusData = {
        tickets: [{
          ticketCode: '',
          ticketStatus: '',
          ticketTimestamp: $scope.generateTimestamp()
        }]
      };

      $scope.createTransactionData = {
        tickets: [{
          ticketTypeId: '',
          quantity: 0,
          type: 'Inteira',
          session: {
            date: '',
            time: ''
          }
        }]
      };

      $scope.payTransactionFormData = {
        tickets: [{
          ticketTypeId: '',
          quantity: 0,
          type: 'Inteira',
          session: {
            date: '',
            time: ''
          }
        }]
      };

      $scope.$on('userSessionSaved', function () {
        $scope.user = {
          token: IngresseApiUserService.token,
          id: IngresseApiUserService.userId
        };
      });

      $scope.$on('userHasLoggedOut', function () {
        $scope.user = null;
      });

      $scope.$watch('companyId', function () {
        // $document.cookie = 'companyid=' + $scope.companyId + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
        if (!$scope.companyId) {
          return;
        }
        ingresseApiCookies('companyid', $scope.companyId, 365);
      });

      $scope.$watch('privateKey', function () {
        // $document.cookie = 'privateKey=' + $scope.privateKey + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
        if (!$scope.privateKey) {
          return;
        }
        ingresseApiCookies('privatekey', $scope.privateKey, 365);
      });

      $scope.$watch('publicKey', function () {
        if (!$scope.publicKey) {
          return;
        }
        // $document.cookie = 'publicKey=' + $scope.publicKey + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
        ingresseApiCookies('apikey', $scope.publicKey, 365);
      });

      if (ingresseApiCookies('companyid') !== '') {
        ingresseApiPreferences.setCompanyId(ingresseApiCookies('companyid'));
      }

      if (ingresseApiCookies('apikey') !== '') {
        ingresseApiPreferences.setPublicKey(ingresseApiCookies('apikey'));
      }

      if (ingresseApiCookies('privatekey') !== '') {
        ingresseApiPreferences.setPrivateKey(ingresseApiCookies('privatekey'));
      }

      if (ingresseApiCookies('env') !== '') {
        $scope.setHost(ingresseApiCookies('env'));
      }

      $scope.privateKey = ingresseApiPreferences.privatekey;
      $scope.publicKey = ingresseApiPreferences.apikey;
    },
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: 'views/ingresse-emulator.html'
  };
});
