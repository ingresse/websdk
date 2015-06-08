angular.module('ingresseEmulatorApp')
  .controller('SidenavController', function ($scope, ingresseAPI, IngresseAPI_UserService, ingresseAPI_Preferences, ipCookie, $mdSidenav) {
    if (!$scope.domain) {
      $scope.domain = ingresseAPI_Preferences._host;
    } else {
      ingresseAPI_Preferences.setHost($scope.domain);
    }

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.login = function () {
      IngresseAPI_UserService.login();
    };

    $scope.logout = function () {
      IngresseAPI_UserService.logout();
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

    $scope.$watch('privateKey', function () {
      // $document.cookie = "privateKey=" + $scope.privateKey + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      if (!$scope.privateKey) {
        return;
      }
      ipCookie('privatekey', $scope.privateKey, {expires: 365});
    });

    $scope.$watch('publicKey', function () {
      if (!$scope.publicKey) {
        return;
      }
      // $document.cookie = "publicKey=" + $scope.publicKey + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      ipCookie('publickey', $scope.publicKey, {expires: 365});
    });

    $scope.$on('userSessionSaved', function () {
      $scope.user = {
        token: IngresseAPI_UserService.token,
        id: IngresseAPI_UserService.userId
      };
      ingresseAPI.getUser($scope.user.id, $scope.user.token, ['id','name','email','type'])
      .then(function (response) {
        $scope.user.data = response;
        $scope.user.photo = ingresseAPI.getUserPhotoUrl($scope.user.id);
      });
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

    if (ipCookie.host !== "") {
      $scope.setHost(ipCookie.host);
    }

    $scope.privateKey = ingresseAPI_Preferences.privatekey;
    $scope.publicKey = ingresseAPI_Preferences.publickey;
  });
