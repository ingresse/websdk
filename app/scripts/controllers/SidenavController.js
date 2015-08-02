'use strict';

angular.module('ingresseEmulatorApp')
  .controller('SidenavController', function ($scope, ingresseApiPreferences, ipCookie, $mdSidenav, $mdDialog, $timeout) {
    $scope.init = function () {
      $scope.loadCookies();

      $scope.privateKey = ingresseApiPreferences.privatekey;
      $scope.publicKey = ingresseApiPreferences.publickey;

      if (!$scope.privateKey || !$scope.publicKey) {
        $mdSidenav('left').toggle();
        $scope.showError('Para utilizar o emulador você precisa de chaves públicas e privadas. Entre em contato com a ingresse para solicitar a sua e preencha ao lado. As chaves ficarão salvas nos cookies para sua comodidade.');
      }
    };

    $scope.showError = function (text) {
      var alert = $mdDialog.alert({
        title: 'Erro',
        content: text,
        ok: 'Close'
      });
      $mdDialog
        .show(alert)
        .finally(function () {
          alert = undefined;
        });

      $scope.selectedIndex = 0;
    };

    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };

    $scope.updatePrivateKey = function (privateKey) {
      ipCookie('privatekey', privateKey, {expires: 365});
      ingresseApiPreferences.setPrivateKey(privateKey);
    };

    $scope.updatePublicKey = function (publicKey) {
      ipCookie('publickey', publicKey, {expires: 365});
      ingresseApiPreferences.setPublicKey(publicKey);
    };

    $scope.loadCookies = function () {
      var publicKey = ipCookie('publickey');
      var privateKey = ipCookie('privatekey');

      if (publicKey) {
        ingresseApiPreferences.setPublicKey(publicKey);
      }

      if (privateKey) {
        ingresseApiPreferences.setPrivateKey(privateKey);
      }
    };

    $timeout(function () {
      //DOM has finished rendering
      $scope.init();
    });
  });
