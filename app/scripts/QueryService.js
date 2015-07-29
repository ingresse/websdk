angular.module('ingresseEmulatorApp').service('QueryService', function ($location, $rootScope) {
  return {
    setSelectedTab: function (tab) {
      this.selectedTab = tab;
    },
    setSearchParams: function (method, identifier, filters) {
      var key;
      var search = $location.search();

      for (key in search) {
        $location.search(key, null);
      };

      $location.search('method', method);
      if (identifier) {
        $location.search(identifier.label, identifier.model);
      }

      for (key in filters) {
        if (filters.hasOwnProperty(key)) {
          $location.search(key, filters[key]);
        }
      }
    },
    getSearchParams: function (fields) {
      var params = $location.search();
      var key;

      if (!params.method || !fields[params.method]) {
        return;
      }

      if (params.method) {
        $rootScope.$broadcast('selectedTab', params.method);
      }

      if (fields[params.method].identifier) {
        if (params[fields[params.method].identifier.label]) {
          fields[params.method].identifier.model = parseInt(params[fields[params.method].identifier.label]);
        }
      }

      for (key in params) {
        if (params.hasOwnProperty(key)) {
          for (var i = 0; i < fields[params.method].fields.length; i++) {
            if (fields[params.method].fields[i].label === key) {
              if (fields[params.method].fields[i].type === 'number') {
                fields[params.method].fields[i].model = parseInt(params[key]);
              } else if (fields[params.method].fields[i].type === 'date') {
                fields[params.method].fields[i].model = new Date(params[key]);
              } else {
                fields[params.method].fields[i].model = params[key];
              }
              break;
            }
          };
        }
      }
    }
  }
});
