var ingresseAPI = angular.module('ingresseSDK',[]);

ingresseAPI.provider('ingresseAPI',function() {
  var publickey;
  var privatekey;

  return{
    publickey: publickey,
    privatekey: privatekey,
    setPublicKey: function(key){
      publickey = key;
    },
    setPrivateKey: function(key){
      privatekey = key;
    },
    $get: function($http,$rootScope,ezfb){
      return {
        publickey: publickey,
        privatekey: privatekey,
        generateAuthKey : function(){
          var urlencode = function(str){
            str = (str + '')
            .toString();

            return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .
            replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+');
          }

          var formatTwoCaracters = function(value){
            if(value < 10){
              value = "0" + value;
            }
            return value;
          }
          
          var now = new Date();
          var UTCYear = now.getUTCFullYear();
          var UTCMonth = formatTwoCaracters(now.getUTCMonth() + 1);
          var UTCDay = formatTwoCaracters(now.getUTCDate());
          var UTCHours = formatTwoCaracters(now.getUTCHours());
          var UTCMinutes = formatTwoCaracters(now.getUTCMinutes());
          var UTCSeconds = formatTwoCaracters(now.getUTCSeconds());

          var timestamp = UTCYear + "-" + UTCMonth + "-" + UTCDay + "T" + UTCHours + ":" + UTCMinutes + ":" + UTCSeconds + "Z";
          var data1 = this.publickey + timestamp;
          var data2 = CryptoJS.HmacSHA1(data1, this.privatekey);
          var computedSignature = data2.toString(CryptoJS.enc.Base64);
          var authenticationString = "?publickey=" + this.publickey + "&signature=" + urlencode(computedSignature) + "&timestamp=" + urlencode(timestamp);

          return authenticationString;
        },
        getEvent: function(eventId){
          var url = 'https://api.ingresse.com/event/' + eventId + this.generateAuthKey();
          return $http.get(url);
        },
        getEventTickets: function(eventId){
          var url = 'https://api.ingresse.com/event/' + eventId + '/tickets/' + this.generateAuthKey();
          return $http.get(url);
        },
        getUser: function(userid){
          var url = 'https://api.ingresse.com/user/'+ userid + this.generateAuthKey();
          return $http.get(url);
        },
        getUserPhotoUrl: function(userid){
          return 'https://api.ingresse.com/user/'+ userid +'/picture/' + this.generateAuthKey();
        },
        login: function(email, password){
          var url = 'https://api.ingresse.com/authorize/' + this.generateAuthKey();
          var data = {
            email: email,
            password: password
          }

          return $http.post(url,data);
        },
        facebookLogin: function(facebookid, email){
          var url = 'https://api.ingresse.com/login/facebook' + this.generateAuthKey();
          var data = {
            fbUserId: facebookid,
            email: email
          }
          return $http.post(url,data);
        }
      }
    }
  }
});