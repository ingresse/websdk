window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  if (event.origin !== "http://closepopup.ingresse.com.s3-website-us-east-1.amazonaws.com"){
  	return;
  }

  var obj = JSON.parse(event.data);
  angular.element(document.body).scope().$broadcast('ingresseAPI.userHasLogged',obj);
}

angular.module('ingresseSDK',['venusUI']).provider('ingresseAPI',function() {
	var publickey;
	var privatekey;
	PagarMe.encryption_key = "ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ";
	// PagarMe.encryption_key = "ek_test_8vbegf4Jw85RB12xPlACofJGcqIabb";

	return{
		publickey: publickey,
		privatekey: privatekey,
		setPublicKey: function(key){
		  publickey = key;
		},
		setPrivateKey: function(key){
		  privatekey = key;
		},
		$get: function($http,$rootScope,VenusActivityIndicatorService, $q){
			return {
				publickey: publickey,
				privatekey: privatekey,
				host: 'https://api.ingresse.com',
				// host: 'http://apibeta.ingresse.com',
				// host: 'http://ingresse-api.dev',

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

				/*	GENERATES THE PROPER AUTHENTICATION KEY FOR API CALLS, NEED THE PRIVATE AND PUBLIC KEYS OF APPLICATION SETTED WITH ingresseAPIProvider.

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
				getEvent: function(eventId){
					var deferred = $q.defer();

					var url = this.host + '/event/' + eventId + this.generateAuthKey();
					if(!VenusActivityIndicatorService.startActivity('Carregando dados do evento...')){
						return;
					};

					$http.get(url)
					.success(function(response){
						deferred.resolve(response);
					})
					.error(function(error){
						VenusActivityIndicatorService.error('Houve um problema de comunicação com nossos servidores, por favor, tente novamente.',error);
						deferred.reject();
					})
					.finally(function(){
						VenusActivityIndicatorService.stopActivity('Carregando dados do evento...');
					});

					return deferred.promise;
				},


				// GET TICKETS OF EVENT
				getEventTickets: function(eventId){
					var deferred = $q.defer();

					var url = this.host + '/event/' + eventId + '/tickets/' + this.generateAuthKey();
					if(!VenusActivityIndicatorService.startActivity("Carregando ingressos...")){
						deferred.reject();
					};

					$http.get(url)
					.success(function(response){
						if(typeof response.responseData != "object"){
							VenusActivityIndicatorService.error("Desculpe, houve um erro ao tentar carregar os ingressos disponíveis, por favor entre em contato com a ingresse pelo número (11) 4264-0718.",response.responseData);
							deferred.reject(response.responseData);
						}else{
							deferred.resolve(response);
						}
					})
					.error(function(error){
						VenusActivityIndicatorService.error("Houve um problema de comunicação com nossos servidores, por favor, tente novamente.", error);
						deferred.reject();
					})
					.finally(function(){
						VenusActivityIndicatorService.stopActivity("Carregando ingressos...");
					});

					return deferred.promise;
				},

				// GET USER INFO
				getUser: function(userid, token){
					var deferred = $q.defer();

					var url = this.host + '/user/'+ userid + this.generateAuthKey() + '&usertoken=' + token + '&fields=id,name,lastname,username,email,cellphone,phone,token,street,district,city,state,zip,number,complement';

					if(!VenusActivityIndicatorService.startActivity('Carregando dados do usuário...')){
						deferred.reject();
					};

					$http.get(url)
					.success(function(result) {
						VenusActivityIndicatorService.stopActivity('Carregando dados do usuário...');
						deferred.resolve(result);
					})
					.error(function(error){
						VenusActivityIndicatorService.error("Houve um problema de comunicação com nossos servidores, por favor, tente novamente.",error.responseData);
						deferred.reject();
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
					if(!VenusActivityIndicatorService.startActivity('Salvando seu cadastro...')){
						deferred.reject();
					};
					console.log('Salvando dados do usuário',userObj);
					$http.post(url,userObj).then(function(response){
						VenusActivityIndicatorService.stopActivity('Salvando seu cadastro...');
						if(response.status != 200){
							VenusActivityIndicatorService.error('Houve um problema ao tentar salvar o endereço, tente novamente.',response.statusText);
							deferred.reject();
						}

						deferred.resolve(true);
					});

					return deferred.promise;
				},

				getUserPhotoUrl: function(userid){
					return this.host + '/user/'+ userid +'/picture/' + this.generateAuthKey();
				},

				login: function(){
					var url = this.host + '/authorize/' + this.generateAuthKey();

					// return url + '&returnurl=' + this.urlencode('http://closepopup.ingresse.com.s3-website-us-east-1.amazonaws.com');

					// PRODUCTION
					return window.open(url + '&returnurl=' + this.urlencode('http://closepopup.ingresse.com.s3-website-us-east-1.amazonaws.com'),"",'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=yes,width=800,height=600');

					// HOMOLOG
					//return window.open(url + '&returnurl=' + this.urlencode('http://local.ingresse.com:9000/showcase/testeLogin.html'),"",'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=yes,width=400,height=600');
					// return window.open(url + '&returnurl=' + this.urlencode('testeLogin.html'),"",'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=yes,width=400,height=600');
				},

				ticketReservation: function(eventId, userId, token, tickets, discountCode){
					var deferred = $q.defer();

					if(!VenusActivityIndicatorService.startActivity('Reservando Ingressos...')){
						deferred.reject();
					}

					var url = this.host + '/shop/' + this.generateAuthKey() + '&usertoken=' + token;

					var reservation = {
						eventId: eventId,
						userId: userId,
						tickets: this.ticketToDTO(tickets),
						discountCode: discountCode
					}

					$http.post(url,reservation)
						.success(function(response){
							if(response.responseData.data.status == 'declined'){
								VenusActivityIndicatorService.error('Erro ao reservar ingressos. Entre em contato através do e-mail contato@ingresse.com',response);
								deferred.reject(response);
							}
							deferred.resolve(response);
						})
						.error(function(error){
							VenusActivityIndicatorService.error('Erro de comunicação com o servidor, tente novamente...',error.responseData);
						})
						.finally(function(){
							VenusActivityIndicatorService.stopActivity('Reservando Ingressos...');
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
						VenusActivityIndicatorService.error('Verifique os dados do cartão -' + cardErrors);

						return;
					} else {
						// se não há erros, retorna o cartão...
						transaction.creditcard.pagarme = creditCard;
						return transaction;
					}
				},

				payReservation: function(eventId, userId, token, tickets, creditCardCpf, transactionId, paymentMethod, discountCode, creditCardNumber, creditCardHolderName, creditCardExpirationYear, creditCardExpirationMonth, creditCardCVV) {

					var deferred = $q.defer();

					var self = this;

					if(paymentMethod == 'BoletoBancario'){
						var currentTransaction = {
							transactionId: transactionId,
							userId: userId,
							eventId: eventId,
							tickets: this.ticketToDTO(tickets),
							paymentMethod: paymentMethod,
							discountCode: discountCode,
						}

						if(!VenusActivityIndicatorService.startActivity('Gerando Boleto...')){
							deferred.reject();
						};

						var url = self.host + '/shop/' + self.generateAuthKey() + '&usertoken=' + token;

						$http.post(url,currentTransaction)
						.success(function(response){
							VenusActivityIndicatorService.stopActivity('Gerando Boleto...');
							if(response.responseData.data){
								deferred.resolve(response.responseData.data);
							}else{
								VenusActivityIndicatorService.error('Houve um erro ao gerar o boleto, tente novamente, se o erro persistir entre em contato com contato@ingresse.com',response);
								deferred.reject(response.responseData.data);
							}
						})
						.error(function(error){
							VenusActivityIndicatorService.error('Houve um erro na comunicação com nossos servidores, por favor, tente novamente. Caso o erro persista entre em contato no contato@ingresse.com',error);
							deferred.reject();
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

					var transactionDTO = this.createPagarmeCard(currentTransaction);

					if(!transactionDTO){
						deferred.reject();
						return deferred.promise;
					}else if(!VenusActivityIndicatorService.startActivity('Criptografando dados do cartão...')){
						deferred.reject();
						return deferred.promise;
					};

					transactionDTO.creditcard.pagarme.generateHash(function(hash){
						VenusActivityIndicatorService.stopActivity('Criptografando dados do cartão...');
						transactionDTO.creditcard = {
							cardHash: hash,
							cpf: transactionDTO.creditcard.cpf
						}

						if(!VenusActivityIndicatorService.startActivity('Realizando o pagamento...')){
							deferred.reject();
						};

						var url = self.host + '/shop/' + self.generateAuthKey() + '&usertoken=' + token;

						$http.post(url,transactionDTO)
						.success(function(response){

							// PAGAR.ME ERROR
							if(response.responseData.data.status == 'declined'){
								VenusActivityIndicatorService.error('Desculpe, seu cartão foi recusado. Tente novamente com outro cartão ou pague via boleto.',response);
								deferred.reject();
							}

							// LIFE IS GOOD, CREDIT IS GOOD!
							if(response.responseData.data.status == 'approved'){
								deferred.resolve(response.responseData.data);
							}
						})
						.error(function(error){
							VenusActivityIndicatorService.error('Houve um erro de comunicação com nossos servidores, por favor, tente novamente.',error);
							deferred.reject();
						})
						.finally(function(response){
							VenusActivityIndicatorService.stopActivity('Realizando o pagamento...');
						});
					});

					return deferred.promise;
				}
			}
		}
	}
});