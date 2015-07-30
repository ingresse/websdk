angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/emulator.html',
        controller: 'HomeController'
      });
  })
  .controller('HomeController', function ($scope, ingresseAPI, EmulatorService, QueryService) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.request = {};
      QueryService.getSearchParams($scope.fields);
    });

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      var i, day, month, year;

      for (i = tab.fields.length - 1; i >= 0; i--) {
        if (tab.fields[i].model) {
          if (tab.fields[i].type === 'date') {
            day = tab.fields[i].model.getDate().toString();
            month = tab.fields[i].model.getMonth().toString();
            if (month.length < 2) {
              month = "0" + month;
            }
            year = tab.fields[i].model.getFullYear().toString();
            obj[tab.fields[i].label] = year + "-" + month + "-" + day;
          } else {
            obj[tab.fields[i].label] = tab.fields[i].model;
          }
        }
      }

      return obj;
    };

    $scope.getSections = function () {
      $scope.result = {};
      $scope.isLoading = true;

      ingresseAPI.home.getSections()
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

     $scope.getCover = function () {
      $scope.result = {};
      $scope.isLoading = true;

      ingresseAPI.home.getCover()
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
      sections: {
        label: 'sections',
        action: $scope.getSections,
        authentication: false
      },
      cover: {
        label: 'cover',
        action: $scope.getCover,
        authentication: false
      }
    };
  });
