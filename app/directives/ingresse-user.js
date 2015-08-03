angular.module('ingresseSDK').directive('ingresseUser', function (ingresseAPI, ingresseApiPreferences) {
  return {
    templateUrl: ingresseApiPreferences.templates_directory + 'ingresse-user.html',
    restrict: 'A',
    scope: {
      user: '=',
      requestToken: '='
    },
    controller: function($scope, ingresseAPI, IngresseApiUserService) {
      $scope.$watch('user.id', function () {
        if (!$scope.user) {
          return;
        }

        if (!$scope.user.id) {
          return;
        }

        $scope.user.photoUrl = ingresseAPI.getUserPhotoUrl($scope.user.id);
        ingresseAPI.getUser($scope.user.id,$scope.requestToken,'name,lastname,type,email,fbUserId')
        .then(function (response) {
          $scope.user.data = response;
        });
      })
    }
  };
});
