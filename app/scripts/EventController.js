angular.module('ingresseEmulatorApp')
  .controller('EventController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
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

    $scope.getEvent = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getEvent($scope.request.id, $scope.request.fields, $scope.user.token)
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

    $scope.getEventTicketTypes = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getEventTickets($scope.request.id, $scope.user.token, $scope.request.pos)
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

    $scope.getGuestList = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getGuestList($scope.request.id, $scope.user.token, $scope.request.fields, $scope.request.filters, $scope.request.page, $scope.request.pageSize)
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

    $scope.getEventCrew = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getEventCrew($scope.request.id, $scope.request.fields, $scope.user.token)
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

    $scope.getEventList = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getEventList($scope.request.fields, $scope.request.filters, $scope.request.page, $scope.request.pageSize)
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
  });
