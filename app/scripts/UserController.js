angular.module('ingresseEmulatorApp')
  .controller('UserController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $routeParams, $mdSidenav, $mdDialog, $location) {
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

    $scope.getUser = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.getUser($scope.request.id, $scope.user.token, $scope.request.fields)
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
      ingresseAPI.getUserTickets($scope.request.id, $scope.user.token, $scope.request.fields, $scope.request.filters, $scope.request.page, $scope.request.pageSize)
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
      ingresseAPI.getUserEvents($scope.request.id, $scope.user.token, $scope.request.fields, $scope.request.filters, $scope.request.page, $scope.request.pageSize)
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

    $scope.updateUserInfo = function () {
      $scope.result = {};
      $scope.isLoading = true;
      ingresseAPI.updateUserInfo($scope.request.id, $scope.user.token, $scope.request.userObj)
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
  });
