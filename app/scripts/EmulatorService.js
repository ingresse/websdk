'use strict';

angular.module('ingresseEmulatorApp').service('EmulatorService', function (ingresseApiPreferences) {
  return {
    responses: [],
    addResponse: function (json, success) {
      this.responses.unshift({
        json: json,
        http: ingresseApiPreferences.httpCalls[0],
        success: success
      });
    },
    removeResponse: function (response) {
      var i;
      for (i = this.responses.length - 1; i >= 0; i--) {
        if (this.responses[i] === response) {
          this.responses.splice(i, 1);
        }
      }
    }
  };
});
