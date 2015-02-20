angular.module('ingresseSDK',[]).provider('ingresseAPI_Preferences',function () {
  PagarMe.encryption_key = 'ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ';
  var publickey;
  var privatekey;
  var templates_directory = '/bower_components/ingresse-websdk/directives/';
  return{
    setPublicKey: function(key){
      publickey = key;
    },
    setPrivateKey: function(key){
      privatekey = key;
    },
    setTemplateDirectory: function (template_directory) {
      templates_directory = template_directory;
    },
    $get: function() {
      return{
        publickey: publickey,
        privatekey: privatekey,
        templates_directory: templates_directory,
        setPublicKey: function(key){
          this.publickey = key;
        },
        setPrivateKey: function(key){
          this.privatekey = key;
        },
        // PRIVATE
        _host: 'https://api.ingresse.com',
        login_return_url: 'https://dk57nqppwurwj.cloudfront.net/parseResponse.html',
        httpCalls: [],

        // PUBLIC
        pagarme_encription_key: 'ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ',
        getHost: function() {
          return this._host;
        },
        setHost: function (host) {
          this._host = host;
        },
        httpCallStarted: function (url) {
          this.httpCalls.unshift({
            url: url,
            startTime: new Date()
          });
        },
        httpCallStoped: function (url, success) {
          for (var i = this.httpCalls.length - 1; i >= 0; i--) {
            if (this.httpCalls[i].url == url) {
              this.httpCalls[i].stopTime = new Date();
              this.httpCalls[i].success = success;
              this.httpCalls[i].requestTime = (this.httpCalls[i].stopTime - this.httpCalls[i].startTime)/1000;
            }
          };
        },
        clearHttpHistory: function () {
          this.httpCalls.splice(0,this.httpCalls.length);
        }
      }
    }
  }
});
