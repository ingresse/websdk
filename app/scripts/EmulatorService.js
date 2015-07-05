angular.module('ingresseEmulatorApp')
    .service('EmulatorService', function (ingresseAPI_Preferences) {
        return {
            responses: [],
            addResponse: function (json, success) {
                this.responses.unshift({
                    json: json,
                    http: ingresseAPI_Preferences.httpCalls[0],
                    success: success
                });
            },
            removeResponse: function (response) {
                for (var i = this.responses.length - 1; i >= 0; i--) {
                    if (this.responses[i] === response) {
                        this.responses.splice(i,1);
                    }
                };
            }
        }
    });
