'use strict';

angular.module('ingresseEmulatorApp').service('QueryService', function ($location) {
  return {
    setSelectedTab: function (tab) {
      this.selectedTab = tab;
    },
    setSearchParams: function (method, identifier, filters) {
      var key;
      var search = $location.search();

      for (key in search) {
        $location.search(key, null);
      }

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
          }
        }
      }
    },
    getFiltersByTab: function (tab) {
      return this.getFilters(tab.fields);
    },
    getFilters: function (fields) {
      var obj = {};
      var i, day, month, year;

      for (i = fields.length - 1; i >= 0; i--) {
        if (fields[i].model !== undefined) {
          if (fields[i].type === 'date') {
            day = fields[i].model.getDate().toString();
            month = fields[i].model.getMonth().toString();
            if (month.length < 2) {
              month = '0' + month;
            }
            year = fields[i].model.getFullYear().toString();
            obj[fields[i].label] = year + '-' + month + '-' + day;
          } else {
            obj[fields[i].label] = fields[i].model;
          }
        }
      }

      return obj;
    }
  };
});
