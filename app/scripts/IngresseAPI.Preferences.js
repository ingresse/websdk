'use strict';

angular.module('ingresseSDK',[]).provider('ingresseApiPreferences',function () {
  PagarMe.encryption_key = 'ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ';
  var publickey;
  var privatekey;
  return{
    setPublicKey: function(key){
      publickey = key;
    },
    setPrivateKey: function(key){
      privatekey = key;
    },
    $get: function() {
      return{
        publickey: publickey,
        privatekey: privatekey,
        setPublicKey: function(key){
          this.publickey = key;
        },
        setPrivateKey: function(key){
          this.privatekey = key;
        },
        // PRIVATE
        _host: 'https://api.ingresse.com',
        loginReturnUrl: 'https://dk57nqppwurwj.cloudfront.net/parseResponse.html',
        httpCalls: [],

        // PUBLIC
        getHost: function() {
          return this._host;
        },
        setHost: function (host) {
          this._host = host;
        },
        httpCallStarted: function (url) {
          var domain = url.split('?')[0];
          var parameters = url.split('?')[1].split('&');

          for (var i = parameters.length - 1; i >= 0; i--) {
            if (i === 0) {
              parameters[i] = '?' + parameters[i];
            } else {
              parameters[i] = '&' + parameters[i];
            }
          }

          this.httpCalls.unshift({
            url: url,
            startTime: new Date(),
            domain: domain,
            parameters: parameters
          });
        },
        httpCallStoped: function (url, success) {
          for (var i = this.httpCalls.length - 1; i >= 0; i--) {
            if (this.httpCalls[i].url === url) {
              this.httpCalls[i].stopTime = new Date();
              this.httpCalls[i].success = success;
              this.httpCalls[i].requestTime = (this.httpCalls[i].stopTime - this.httpCalls[i].startTime) / 1000;
            }
          }
        },
        clearHttpHistory: function () {
          this.httpCalls.splice(0,this.httpCalls.length);
        }
      };
    }
  };
});
