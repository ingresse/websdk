angular.module('ingresseEmulatorApp')
  .controller('SidenavController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $mdSidenav, $mdDialog) {
    if (!$scope.domain) {
      $scope.domain = ingresseAPI_Preferences._host;
    } else {
      ingresseAPI_Preferences.setHost($scope.domain);
    }

    $scope.login = function () {
      IngresseAPI_UserService.login();
    };

    $scope.logout = function () {
      IngresseAPI_UserService.logout();
    };

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

    $scope.setHost = function (host) {
      if (!host || host === '') {
        return;
      }

      ipCookie('host', host, {expires: 365});
      ingresseAPI_Preferences.setHost(host);
      $scope.domain = ingresseAPI_Preferences._host;
    };

    $scope.setPrivateKey = function (key) {
      ingresseAPI_Preferences.setPrivateKey(key);
    };

    $scope.setPublicKey = function (key) {
      ingresseAPI_Preferences.setPublicKey(key);
    };

    $scope.$on('userSessionSaved', function () {
      $scope.user = {
        token: IngresseAPI_UserService.token,
        id: IngresseAPI_UserService.userId
      };
      ingresseAPI.getUser($scope.user.id, {fields:'id,name,email,type'}, $scope.user.token)
      .then(function (response) {
        $scope.user.data = response;
        $scope.user.photo = ingresseAPI.getUserPhotoUrl($scope.user.id);
      });
    });

    $scope.$watch('privateKey', function () {
      // $document.cookie = "privateKey=" + $scope.privateKey + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      if (!$scope.privateKey) {
        return;
      }
      ipCookie('privatekey', $scope.privateKey, {expires: 365});
      ingresseAPI_Preferences.setPublicKey(ipCookie('privatekey'));
    });

    $scope.$watch('publicKey', function () {
      if (!$scope.publicKey) {
        return;
      }
      // $document.cookie = "publicKey=" + $scope.publicKey + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      ipCookie('publickey', $scope.publicKey, {expires: 365});
      ingresseAPI_Preferences.setPublicKey(ipCookie('publickey'));
    });

    $scope.$on('userHasLoggedOut', function () {
      $scope.user = null;
    });

    if (ipCookie('publickey') !== "") {
      ingresseAPI_Preferences.setPublicKey(ipCookie('publickey'));
    }

    if (ipCookie('privatekey') !== "") {
      ingresseAPI_Preferences.setPrivateKey(ipCookie('privatekey'));
    }

    if (ipCookie('host') !== "") {
      $scope.setHost(ipCookie('host'));
    }

    $scope.privateKey = ingresseAPI_Preferences.privatekey;
    $scope.publicKey = ingresseAPI_Preferences.publickey;

    if (!$scope.privateKey || !$scope.publicKey) {
      $mdSidenav('left').toggle();
      $scope.showError('Para utilizar o emulador você precisa de chaves públicas e privadas. Entre em contato com a ingresse para solicitar a sua e preencha ao lado. As chaves ficarão salvas nos cookies para sua comodidade.');
    }
  });
