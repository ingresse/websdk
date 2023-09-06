# Ingresse WebSDK

Para facilitar a vida de desenvolvedores que queiram criar web-apps integrados aos serviços da ingresse, nós criamos o ingresse-websdk.

Nosso SDK é um módulo do [Angular](https://angularjs.org/), basta adicionar o script no header do seu html principal e pronto!


## Instalando

Adicione no header do seu site:

```
  <script href="http://cdn.ingresse.com/websdk/scripts/websdk.js"></script>
```


## Utilização

Antes de mais nada adicione a dependência no seu módulo

```
  angular.module('SEU_APP', ['ingresseSDK']);
```

Todo APP integrado com a ingresse precisa de sua chave privada e pública para fazer chamadas a api, para configurar fica assim:

```
  angular.module('SEU_APP')
  .config(function (ingresseApiPreferencesProvider) {
      ingresseApiPreferencesProvider.setPublicKey('sua chave pública');
      ingresseApiPreferencesProvider.setPrivateKey('sua chave privada');
  });
```

Ai é só injetar nas suas controllers

```
  angular.module('SEU_APP')
  .controller('SuaController', ['ingresseAPI', function (ingresseAPI) {
      ... seu código ...
  }]);
```


## Módulos

### ingresseAPI

Este módulo é responsável por facilitar a comunicação com nossa API.

Exemplo:
```
  ingresseAPI.event.get(eventID, filters)
      .then(function (event) {
          // Do something...
      })
      .catch(function (error) {
          // Something got wrong...
      });
```

### ingresseApiPreferences

```
  ingresseApiPreferences.setHost(host); // Define o host que será usado para comunicação (api.ingresse.com | apistg.ingresse.com | apihml.ingresse.com);
  ingresseApiPreferences.getHost(); // retorna o host que esta sendo usado no momento.
  ingresseApiPreferences.httpCalls // Array com o histórico de chamadas http.
  ingresseApiPreferences.clearHttpHistory() //Limpra o histórico de chamadas http.
```


# Desenvolvimento

## Dependências

Primeiro instale as dependências:

```
$ bower install

$ npm install
```


## Buid dev/prod

### PROD

Para gerar um build para produção utilize o comando:

```
$ sudo grunt build
```

Se quiser servir este build localmente execute o comando:

```
$ sudo grunt serve:dist
```

### HOMOLOGAÇÃO

Para gerar o build com os scripts voltados para desenvolvimento, ex: sandbox do pagSeguro, utilize o comando:

```
$ sudo grunt buil:dev
```

Se quiser servir este build localmente execute o comando:

```
$ sudo grunt serve:dist
```


## Testes

Para rodar os testes localmente execute o comando:

```
$ npm test
```

