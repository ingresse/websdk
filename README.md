ingresse-websdk
===============

Para facilitar a vida de desenvolvedores que queiram criar web-apps integrados aos serviços da ingresse, nós criamos o ingresse-websdk.

Nosso SDK é um módulo do angular, basta baixar o sdk, adicionar a referência nas dependências do seu APP e pronto!

## Instalando ##
O ingresse-websdk esta disponível no bower

    bower install ingresse-websdk -S

## Utilização ##

Antes de mais nada adicione a dependência no seu módulo

    angular.module('SEU_APP',['ingresseSDK']);

Todo APP integrado com a ingresse precisa de sua chave privada e pública para fazer chamadas a api, para configurar fica assim:

    angular.module('SEU_APP').config(function(ingresseAPI_PreferencesProvider) {
        ingresseAPI_PreferencesProvider.setPublicKey('sua chave pública');
	    ingresseAPI_PreferencesProvider.setPrivateKey('sua chave privada');
    });

Ai é só injetar nas suas controllers

    angular.module('SEU_APP').controller('SuaController',['ingresseAPI',function(ingresseAPI){
        ... seu código ...
    }]);

## Chamadas ##

### Get Event ###

#### Parâmetros ####
    eventid: (number) or (string) //numero do identificador do evento ou link.
    fields: [(string) array] // Informações que devem ser retornadas do evento.

#### Retorno ####
[Veja no doc](http://dev.ingresse.com/#/references/event/get-unique-event "Title")

#### Exemplo: ####
    ingresseAPI.getEvent(eventId, fields)
        .then(function(response){
            if(!result){
    			return;
    		}
    	});
