window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  if (event.origin !== "https://dk57nqppwurwj.cloudfront.net"){
  return;
  }

  var obj = JSON.parse(event.data);
  angular.element(document.body).scope().$broadcast('ingresseAPI.userHasLogged',obj);
}

angular.module('ingresseSDK').provider('ingresseAPI',function ($httpProvider) {
  var publickey;
  var privatekey;
  $httpProvider.interceptors.push(function($q) {
    return {
      'response': function(response) {
         // do something on error
        if(!response.data.responseError){
          return response;
        }

        var error = response.data.responseError;
        var errorMessage = "";

        if(error.code === 1005) {
         errorMessage = Error("O usuário informado é diferente do usuário que gerou a transação. Você trocou de login no meio do processo? Por favor, recomeçe a operação.");
        }

        if(error.code === 1006) {
         errorMessage = Error("O campo e-mail não foi preenchido.");
        }

        if(error.code === 1007) {
         errorMessage = Error("O endereço de e-mail informado não é valido.");
        }

        if(error.code === 1013 || error.code === 1014) {
         errorMessage = Error("O número de parcelas não esta correto.");
        }

        if(error.code === 1029 || error.code === 1030) {
         errorMessage = Error("O código de desconto inforado não esta correto.");
        }

        if(error.code === 1031) {
         errorMessage = Error("Esta faltando alguma informação do cartão de crédito, verifique se você não esqueceu de preencher algo.");
        }

        if(error.code === 1032) {
         errorMessage = Error("Você esqueceu de preencher o campo CPF.");
        }

        if(error.code === 1032) {
         errorMessage = Error("Você esqueceu de preencher o campo CPF.");
        }

        if(error.code === 2001 || error.code === 2011) {
          errorMessage = Error("Parece que seu login expirou, por favor, faça o login novamente.");
        }

        if(error.code === 2011) {
          errorMessage = Error("Parece que seu login expirou, por favor, faça o login novamente.");
        }

        if(error.code === 2012) {
          errorMessage = Error("Acesso não autorizado: O usuário logado não é o dono do evento.");
        }

        if(error.code === 2013) {
          errorMessage = Error("Parece que a solicitação expirou. Por favor tente novamente.");
        }

        if(error.code === 2028) {
          errorMessage = Error("Desculpe, mas este usuário não possui permissão de venda para este evento.");
        }

        if(error.code === 5001) {
          errorMessage = Error("Não conseguimos nos conectar ao seu facebook... Por favor, faça o login no seu facebook e tente novamente.");
        }

        if(error.code === 5002) {
          errorMessage = Error("Houve um problema de comunicação com nosso gateway de pagamento. Por favor tente novamente.");
        }

        if(errorMessage == "") {
          errorMessage = Error("Houve um erro inesperado, por favor entre em contato com a ingresse e informe o código: " + error.code);
        }

        return $q.reject(errorMessage);
      }
    };
  });

  return{
    publickey: publickey,
    privatekey: privatekey,
    setPublicKey: function(key){
      publickey = key;
    },
    setPrivateKey: function(key){
      privatekey = key;
    },
    $get: function($http, $rootScope, $q, Preferences) {
      return {
        publickey: publickey,
        privatekey: privatekey,
        host: Preferences.getHost(),

        // ENCODE ANY STRING TO BE USED IN URLS
        urlencode: function(str){
          str = (str + '')
          .toString();

          return encodeURIComponent(str)
          .replace(/!/g, '%21')
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/\*/g, '%2A')
          .replace(/%20/g, '+');
        },

        /*  GENERATES THE PROPER AUTHENTICATION KEY FOR API CALLS, NEED THE PRIVATE AND PUBLIC KEYS OF APPLICATION SETTED WITH ingresseAPIProvider.

          Ex:
          angular.module('yourAppModuleName').config(function(ingresseAPIProvider){
            ingresseAPIProvider.setPublicKey('your public key');
            ingresseAPIProvider.setPrivateKey('your private key');
          });

          RETURNS THE STRING TO BE USED ON API CALLS.
        */
        generateAuthKey : function(){
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
          var authenticationString = "?publickey=" + this.publickey + "&signature=" + this.urlencode(computedSignature) + "&timestamp=" + this.urlencode(timestamp);

          return authenticationString;
        },

        /* CREATES A NEW LIST OF TICKETS WITH THE NECESSARY STRUCTURE TO SEND TO API

          PARAMETERS
          tickets = [
            {
              validTo: <moment.js object>,
              id: '',
              type: '',
              quantitySelected: '' //number of tickets the user selected.
            }
          ]
        */
        ticketToDTO: function(tickets){
          var ticketsDTO = [];

          for (var i = tickets.length - 1; i >= 0; i--) {
            var ticketDTO = {
              session:{
                date: tickets[i].validTo.format('DD/MM/YYYY'),
                time: tickets[i].validTo.format('HH:mm:ss')
              },
              ticketTypeId: tickets[i].id,
              type: tickets[i].type,
              quantity: tickets[i].quantitySelected
            }

            ticketsDTO.push(ticketDTO);
          };

          return ticketsDTO;
        },

        // GET EVENT
        getEvent: function(eventId, fields){
          var deferred = $q.defer();
          if(angular.isNumber(parseInt(eventId)) && !isNaN(eventId)){
            var url = this.host + '/event/' + eventId + this.generateAuthKey();
          }else{
            var url = this.host + '/event/' + this.generateAuthKey() + '&method=identify&link=' + eventId;
          }

          if(fields){
            url += '&fields=' + fields.toString();
          }

          $http.get(url)
          .success(function(response){
            deferred.resolve(response.responseData);
          })
          .catch(function(error){
            deferred.reject(error.message);
          });

          return deferred.promise;
        },


        // GET TICKETS OF EVENT
        getEventTickets: function(eventId){
          var deferred = $q.defer();

          var url = this.host + '/event/' + eventId + '/tickets/' + this.generateAuthKey();

          $http.get(url)
          .success(function(response){
            deferred.resolve(response.responseData);
          })
          .catch(function(error){
            deferred.reject(error.message);
          });

          return deferred.promise;
        },

        // GET USER INFO
        getUser: function(userid, token){
          var deferred = $q.defer();

          var url = this.host + '/user/'+ userid + this.generateAuthKey() + '&usertoken=' + token + '&fields=id,name,lastname,username,email,cellphone,phone,token,street,district,city,state,zip,number,complement';

          $http.get(url)
          .success(function(response){
            deferred.resolve(response.responseData);
          })
          .catch(function(error){
            deferred.reject(error.message);
          });

          return deferred.promise;
        },


        /* UPDATE USER INFO

          PARAMETERS
          userObj = {
            name: '',
            lastname: '',
            street: '',
            number: '',
            complement: '',
            district: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
          }
        */
        updateUserInfo: function(userid, token, userObj){
          var deferred = $q.defer();

          var url = this.host + '/user/' + userid + this.generateAuthKey() + '&usertoken=' + token + '&method=update';

          $http.post(url,userObj)
          .success(function(response){
            if(angular.isObject(response.responseData)){
              deferred.resolve(true);
            }else{
              deferred.reject();
            }
          })
          .error(function(error){
            deferred.reject();
          });

          return deferred.promise;
        },

        getUserPhotoUrl: function(userid){
          return this.host + '/user/'+ userid +'/picture/' + this.generateAuthKey();
        },

        login: function(){
          var url = this.host + '/authorize/' + this.generateAuthKey();
          return url + '&returnurl=' + this.urlencode(Preferences.login_return_url);;
        },

        logout: function(){
          var url = this.host + '/logout' + this.generateAuthKey();
          return url + '&returnurl=' + this.urlencode(Preferences.login_return_url);;
        },

        register: function(){
          var url = this.host + '/register' + this.generateAuthKey();
          return url + '&returnurl=' + this.urlencode(Preferences.login_return_url);;
        },

        getLoginWithFacebookUrl: function(){
          var url = this.host + '/authorize/facebook' + this.generateAuthKey() + '&returnurl=' + this.urlencode(Preferences.login_return_url);;
          return url;
        },

        getRegisterWithFacebookUrl: function(){
          var url = this.host + '/register-from-facebook' + this.generateAuthKey() + '&returnurl=' + this.urlencode(Preferences.login_return_url);;
          return url;
        },

        ticketReservation: function(eventId, userId, token, tickets, discountCode){
          var deferred = $q.defer();

          var url = this.host + '/shop/' + this.generateAuthKey() + '&usertoken=' + token;

          var reservation = {
            eventId: eventId,
            userId: userId,
            tickets: this.ticketToDTO(tickets),
            discountCode: discountCode
          }

          $http.post(url,reservation)
          .success(function(response){
            deferred.resolve(response.responseData);
          })
          .catch(function(error){
            deferred.reject(error.message);
          });

          return deferred.promise;
        },

        createPagarmeCard: function(transaction){

          //Create hash for pagar.me
          var creditCard = new PagarMe.creditCard();
          creditCard.cardHolderName = transaction.creditcard.name.toString();
          creditCard.cardExpirationMonth = transaction.creditcard.month.toString();
          creditCard.cardExpirationYear = transaction.creditcard.year.toString();
          creditCard.cardNumber = transaction.creditcard.number.toString();
          creditCard.cardCVV = transaction.creditcard.cvv.toString();

          // pega os erros de validação nos campos do form
          var fieldErrors = creditCard.fieldErrors();

          //Verifica se há erros
          var hasErrors = false;
          for(var field in fieldErrors) { hasErrors = true; break; }

          if(hasErrors) {
            var cardErrors = '';
            for (var key in fieldErrors){
              cardErrors += ' ' + fieldErrors[key];
            }
            // @TODO: Tratar o retorno dos erros de cartão em quem consome o método.
            return cardErrors;
          } else {
            // se não há erros, retorna o cartão...
            transaction.creditcard.pagarme = creditCard;
            return transaction;
          }
        },

        payReservation: function(eventId, userId, token, tickets, creditCardCpf, transactionId, paymentMethod, discountCode, creditCardNumber, creditCardHolderName, creditCardExpirationYear, creditCardExpirationMonth, creditCardCVV, installments) {

          var deferred = $q.defer();

          var self = this;

          if(paymentMethod === 'BoletoBancario'){
            var currentTransaction = {
              transactionId: transactionId,
              userId: userId,
              eventId: eventId,
              tickets: this.ticketToDTO(tickets),
              paymentMethod: paymentMethod,
              discountCode: discountCode,
            }

            var url = self.host + '/shop/' + self.generateAuthKey() + '&usertoken=' + token;

            $http.post(url,currentTransaction)
            .success(function(response){
              deferred.resolve(response.responseData);
            })
            .catch(function(error){
              deferred.reject(error.message);
            });

            return deferred.promise;
          }

          // Pagamento com Cartão de Crédito.
          var currentTransaction = {
            transactionId: transactionId,
            userId: userId,
            eventId: eventId,
            tickets: this.ticketToDTO(tickets),
            paymentMethod: paymentMethod,
            discountCode: discountCode,
            creditcard: {
              cpf: creditCardCpf,
              number: creditCardNumber,
              name: creditCardHolderName,
              year: creditCardExpirationYear,
              month: creditCardExpirationMonth,
              cvv: creditCardCVV
            }
          }

          if(installments){
            currentTransaction.installments = installments;
          }

          var transactionDTO = this.createPagarmeCard(currentTransaction);

          if(!transactionDTO){
            deferred.reject();
            return deferred.promise;
          }

          transactionDTO.creditcard.pagarme.generateHash(function(hash){
            transactionDTO.creditcard = {
              cardHash: hash,
              cpf: transactionDTO.creditcard.cpf
            }

            var url = self.host + '/shop/' + self.generateAuthKey() + '&usertoken=' + token;

            $http.post(url,transactionDTO)
            .success(function(response){
              if(response.responseData.data.status === 'declined'){
                deferred.reject();
              }

              // LIFE IS GOOD, CREDIT IS GOOD!
              if(response.responseData.data.status === 'approved'){
                deferred.resolve(response.responseData.data);
              }

              deferred.reject(new Error('Houve um erro com sua transação, o status recebido é: ' + response.responseData.data.status + ', entre em contato com a ingresse informando este erro.'));
            })
            .catch(function(error){
              deferred.reject(error.message);
            });
          });

          return deferred.promise;
        }
      }
    }
  }
});
