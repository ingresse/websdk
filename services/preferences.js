angular.module('ingresseSDK',[]).service('Preferences',function () {
  PagarMe.encryption_key = 'ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ';
  return{
    // PRIVATE
    _mode: 'production',
    _production_host: 'https://api.ingresse.com',
    _homolog_host: 'https://apirc.ingresse.com',
    login_return_url: 'https://dk57nqppwurwj.cloudfront.net/parseResponse.html',

    // PUBLIC
    pagarme_encription_key: 'ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ',
    getHost: function() {
      if(this._mode === 'production') {
        return this._production_host;
      }

      if(this._mode === 'homolog') {
        return this._homolog_host;
      }
    },
  }
});
