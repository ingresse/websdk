angular.module('ingresseEmulatorApp')
.controller('EmulatorController', function ($rootScope, $scope, ipCookie, ingresseAPI, ingresseAPI_Preferences, IngresseAPI_UserService, IngresseAPI_Freepass, $mdSidenav) {

  $rootScope.domain = ipCookie('host');

  $scope.httpCalls = ingresseAPI_Preferences.httpCalls;
  $scope.result = {};
  $scope.collapsed = false;
  $scope.user = {};
  $scope.eventListForm = {};

  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  $scope.$on('$viewContentLoaded', function() {
    $scope.openLeftMenu();
  });

  $scope.resetResponses = function () {
    // $scope.clearHttpHistory();
    $scope.responseUser = null;
    $scope.result = {};
  };

  $scope.clearHttpHistory = function () {
    ingresseAPI_Preferences.clearHttpHistory();
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
    // VenusActivityIndicatorService.startActivity('Carregando Eventos...');
    ingresseAPI.getEvent(form.id, form.fields, $scope.user.token)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando Eventos...');
      });
  };

  $scope.getError = function (errorClass) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando lista de erros...');
    ingresseAPI.getError(errorClass)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando lista de erros...');
      });
  };

  $scope.getEventList = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando Eventos...');
    ingresseAPI.getEventList(form.fields, form.filters, form.page, form.pageSize)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando Eventos...');
      });
  };

  $scope.getEventTickets = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando Ingressos...');
    ingresseAPI.getEventTickets(form.id, $scope.user.token, form.pos)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando Ingressos...');
      });
  };

  $scope.getUser = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando dados do usuário...');
    ingresseAPI.getUser(form.id, $scope.user.token, form.fields)
      .then(function (response) {
        $scope.responseUser = angular.copy(response);
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando dados do usuário...');
      });
  };

  $scope.getUserTickets = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando ingressos do usuário...');
    ingresseAPI.getUserTickets(form.id, $scope.user.token, form.fields, form.filters)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando ingressos do usuário...');
      });
  };

  $scope.getUserEvents = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando eventos do usuário...');
    ingresseAPI.getUserEvents(form.id, $scope.user.token, form.fields, form.filters, form.page, form.pageSize)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando eventos do usuário...');
      });
  };

  $scope.updateTicketStatus = function () {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Alterando status dos ingressos...');
    ingresseAPI.updateTicketStatus($scope.updateTicketStatusData.eventid, $scope.user.token, $scope.updateTicketStatusData.tickets)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Alterando status dos ingressos...');
      });
  };

  $scope.getCheckinReport = function () {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando dados do relatório de entrada...');
    ingresseAPI.getCheckinReport($scope.checkinReportForm.eventId, $scope.user.token)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando dados do relatório de entrada...');
      });
  };

  $scope.getGuestList = function () {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando lista de convidados...');
    ingresseAPI.getGuestList($scope.guestListForm.eventId, $scope.user.token, $scope.guestListForm.fields, $scope.guestListForm.filters)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando lista de convidados...');
      });
  };

  $scope.getTransactionData = function () {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando dados da transação...');
    ingresseAPI.getTransactionData($scope.transactionDataForm.transactionId, $scope.user.token, $scope.transactionDataForm.fields)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando dados da transação...');
      });
  };

  $scope.updateUser = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Atualizando dados do usuário...');
    ingresseAPI.updateUserInfo(form.userId, $scope.user.token, form.userdata)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Atualizando dados do usuário...');
      });
  };

  $scope.createTransaction = function () {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Gerando Transação...');
    ingresseAPI.ticketReservation($scope.createTransactionData.eventId, $scope.createTransactionData.userId, $scope.user.token, $scope.createTransactionData.tickets, $scope.createTransactionData.discountCode)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Gerando Transação...');
      });
  };

  $scope.payTransaction = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Pagando Transação...');
    ingresseAPI.payReservation(form.eventId, form.userId, $scope.user.token, form.transactionId, $scope.payTransactionFormData.tickets, form.paymentMethod, form.creditCard, form.installments)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Pagando Transação...');
      });
  };

  $scope.freepass = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Validando cortesias...');
    IngresseAPI_Freepass.send(form.eventId, form.ticketTypeId, form.isHalfPrice, form.emails, form.validate, $scope.user.token)
      .then(function (response) {
        $scope.result = response;
      })
      .catch(function (error) {
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Validando cortesias...');
      });
  };

  $scope.getSales = function (form) {
    $scope.resetResponses();
    // VenusActivityIndicatorService.startActivity('Carregando vendas...');

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
        // VenusActivityIndicatorService.error(error);
      })
      .finally(function () {
        // VenusActivityIndicatorService.stopActivity('Carregando vendas...');
      });
  };

  $scope.generateTimestamp = function () {
    var timestamp = new Date();
    return timestamp.getTime();
  };

  $scope.$on('userSessionSaved', function () {
    $scope.user = {
      token: IngresseAPI_UserService.token,
      id: IngresseAPI_UserService.userId
    };
  });

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
});
