var ingresseAPI = angular.module('ingresseSDK',[]);

ingresseAPI.provider('ingresseAPI',function() {
	var publickey;
	var privatekey;
	PagarMe.encryption_key = "ek_live_lMsy9iABVbZrtgpd7Xpb9MMFgvjTYQ"; 
	//PagarMe.encryption_key = "ek_test_8vbegf4Jw85RB12xPlACofJGcqIabb";

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
						.replace(/\)/g, '%29')
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
				ticketToDTO: function(tickets){
					var ticketListDTO = [];

					for (var i = tickets.length - 1; i >= 0; i--) {
						var ticketDTO = {
							quantity: tickets[i].quantitySelected,
							session: {
								date: tickets[i].validTo.date,
								time: tickets[i].validTo.time
							},
							type: tickets[i].type,
							ticketTypeId: tickets[i].id
						}

						ticketListDTO.push(ticketDTO);
					};

					return ticketListDTO;
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
				},
				ticketReservation: function(eventId, userId, token, tickets){
					var url = 'https://api.ingresse.com/shop/' + this.generateAuthKey() + '&usertoken=' + token;

					var reservation = {
						eventId: eventId,
						userId: userId,
						tickets: this.ticketToDTO(tickets)
					}


					return $http.post(url,reservation);
				},
				generateCreditCardHash: function(creditCardNumber, creditCardHolderName, creditCardExpirationYear, creditCardExpirationMonth, creditCardCVV){
					//Create hash for pagar.me
					var creditCard = new PagarMe.creditCard();
					creditCard.cardHolderName = creditCardHolderName.toString();
					creditCard.cardExpirationMonth = creditCardExpirationMonth.toString();
					creditCard.cardExpirationYear = creditCardExpirationYear.toString();
					creditCard.cardNumber = creditCardNumber.toString();
					creditCard.cardCVV = creditCardCVV.toString();
					
					var creditCardHash;

					// pega os erros de validação nos campos do form
					var fieldErrors = creditCard.fieldErrors();

					//Verifica se há erros
					var hasErrors = false;
					for(var field in fieldErrors) { hasErrors = true; break; }

					if(hasErrors) {
						console.error("Erro na validação do cartão:",fieldErrors);
						return;
					} else {
						// se não há erros, gera o card_hash...
						return creditCard;
					}
				},
				payReservation: function(eventId, userId, token, tickets, creditCardCpf, transactionId, paymentMethod, creditCardHash) {
					var transactionDTO = {
						transactionId: transactionId,
						userId: userId,
						eventId: eventId,
						tickets: this.ticketToDTO(tickets),
						paymentMethod: paymentMethod,
						creditcard: {
							cpf: creditCardCpf,
							cardHash: creditCardHash
						}
					}

					// var url = 'https://api.ingresse.com/shop/' + this.generateAuthKey() + '&usertoken=' + token;
					// return $http.post(url,transactionDTO);

					var url = 'https://api.ingresse.com/shop/' + transactionId + this.generateAuthKey() + '&usertoken=' + token;
					return $http.get(url);

				}
			}
		}
	}
});