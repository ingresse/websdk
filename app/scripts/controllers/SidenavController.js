'use strict';

angular.module('ingresseEmulatorApp')
  .controller('SidenavController', function ($scope, ingresseApiPreferences, ingresseApiCookies, $mdSidenav, $mdDialog, $timeout) {
    $scope.init = function () {
      $scope.companyId  = 1;
      $scope.publicKey  = '';
      $scope.privateKey = '';

      $scope.loadCookies();

      if (!$scope.publicKey || !$scope.privateKey) {
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

    $scope.updateCompanyId = function (companyId) {
      $scope.companyId = companyId;

      ingresseApiPreferences.setPrivateKey(companyId);
      ingresseApiCookies('companyid', companyId, 365);
    };

    $scope.updatePrivateKey = function (privateKey) {
      $scope.publicKey = privateKey;

      ingresseApiPreferences.setPrivateKey(privateKey);
      ingresseApiCookies('privatekey', privateKey, 365);
    };

    $scope.updatePublicKey = function (publicKey) {
      $scope.publicKey = publicKey;

      ingresseApiPreferences.setPublicKey(publicKey);
      ingresseApiCookies('publickey', publicKey, 365);
    };

    $scope.loadCookies = function () {
      $scope.companyId  = (ingresseApiCookies('companyid') || 1);
      $scope.publicKey  = ingresseApiCookies('publickey');
      $scope.privateKey = ingresseApiCookies('privatekey');

      if ($scope.companyId) {
        ingresseApiPreferences.setCompanyId($scope.companyId);
      }

      if ($scope.publicKey) {
        ingresseApiPreferences.setPublicKey($scope.publicKey);
      }

      if ($scope.privateKey) {
        ingresseApiPreferences.setPrivateKey($scope.privateKey);
      }
    };

    $timeout(function () {
      //DOM has finished rendering
      $scope.init();
    });
  });
