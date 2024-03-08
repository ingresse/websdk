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

Primeiro é preciso instalar as dependências para o funcionamento correto da aplicação:

``` bash
npm run deps && npm run postinstall
```

## Desenvolvendo

A WebSDK não é uma aplicação executável, portanto para testar as implementações feitas nela é necessário gerar o build final para executar as modificações em ambiente de desenvolvimento. 

Para isso é preciso seguir os seguintes passos:

- Executar o build local da aplicação utilizando o comando: ```npm run build```;
- Finalizado o processo de build copiar o arquivo ```websdk.js``` dentro do diretório ```.tmp``` localizado em: ```./websdk/.tmp/concat/scripts/websdk.js```;
- Criar um diretório ```websdk``` na raíz do ```app``` do seu projeto;
- Inserir o arquivo ```webdesk.js``` copiado, neste diretório;
- Fazer o mesmo para o arquivo de CSS dentro do diretório ```/websdk/dist/v7/styles/main.css```. Copiar e colar no diretório ```websdk``` criado na aplicação a ser executada com a websdk;
- Agora é preciso localizar e mudar o apontamento da index da aplicação para acessar os arquivos dentro da pasta criada (```websdk```), ao invés dos arquivos de produção (localizados no S3). 

Script:

``` html
<!-- <script src="https://cdn.ingresse.com/i18n/v7/scripts/websdk.js"></script> -->
<script src="../websdk/websdk.js"></script>
```

Link:
``` html
<!-- <link rel="stylesheet" href="https://cdn.ingresse.com/i18n/v7/styles/websdk.css?v=2-81-0"> -->
<link rel="stylesheet" href="../websdk/dist/v7/styles/main.css">
```

## Buid dev/prod

### PROD

Para gerar um build para produção utilize o comando:

```
$ npm run build
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

## Deploy em HML ou PROD
- Rodar build do WebSDK no PC local, vai gerar uma pasta dist
- Painel Web da AWS, S3, procurar pelo bucket cdn.ingresse.com
- Nele, há uma subpasta “websdk”
- Fazer upload de todos os arquivos que estão dentro da pasta dist local, pra essa subpasta no S3
- Finalizado o upload, ainda no Painel da AWS S3, selecionar todos os arquivos e utilizar o menu de arquivos para “Tornar Público” todos esses arquivos
- Por fim, ir até o Painel AWS CloudFront, procurar pelo cdn.ingresse.com e invalidar o
cache
