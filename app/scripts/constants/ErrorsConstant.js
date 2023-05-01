'use strict';

angular.module('ingresseSDK')
.constant('ingresseErrors', [
  {
    codes: [56],
    message: 'A senha atual não está correta.',
  },
  {
    codes: [1001],
    message: 'Desculpe, mas você precisa selecionar pelo menos um ingresso.',
  },
  {
    codes: [1005],
    message: 'O usuário informado é diferente do usuário que gerou a transação. Você trocou de login no meio do processo? Por favor, recomece a operação.',
  },
  {
    codes: [1006],
    message: 'O campo e-mail não foi preenchido.',
  },
  {
    codes: [1007],
    message: 'O endereço de e-mail informado não é valido.',
  },
  {
    codes: [1009],
    message: 'Parâmetro do estado é inválido.',
  },
  {
    codes: [1013, 1014],
    message: 'O número de parcelas não esta correto.',
  },
  {
    codes: [1029, 1030],
    message: 'O código de desconto informado não esta correto.',
  },
  {
    codes: [1031],
    message: 'Está faltando alguma informação do cartão de crédito, verifique se você não esqueceu de preencher algo.',
  },
  {
    codes: [1032, 1033],
    message: 'Você esqueceu de preencher o campo CPF.',
  },
  {
    codes: [1060, 1061],
    message: 'Número de CPF inválido',
  },
  {
    codes: [1108],
    message: 'Ocorreu um erro durante a validação do telefone.',
  },
  {
    codes: [1109],
    message: 'Este número já foi verificado por outro usuário.',
  },
  {
    codes: [1133],
    message: 'A quantidade de endereços de e-mail informada excede o limite padrão.',
  },
  {
    codes: [1146],
    message: 'Aparentemente o número de telefone informado é invalido.',
  },
  {
    codes: [1216],
    message: (
      'Aparentemente essa não é uma Bandeira de Cartão válida para ' +
      'pagamento neste evento.'
    ),
  },
  {
    codes: [2004],
    message: 'Você já acessou a última página',
  },
  {
    codes: [2005],
    message: 'É preciso fazer login para continuar',
  },
  {
    codes: [2006],
    message: 'Sua sessão expirou. Faça o login novamente.',
  },
  {
    codes: [2007],
    message: 'Esta aplicação não possui permissão para realizar a operação de login',
  },
  {
    codes: [2008],
    message: 'Sua conexão não está segura (https)',
  },
  {
    codes: [2009],
    message: 'Aparentemente você não tem permissão para realizar esta tarefa',
  },
  {
    codes: [2011],
    message: 'Para continuar você precisa ser o dono do evento',
  },
  {
    codes: [2012],
    message: 'Tente novamente, por favor. Parece que já faz um tempo desde sua última interação.',
  },
  {
    codes: [2015],
    message: 'Opa! Parece que a configuração de dia e hora não está ok. Verifique se o dia e hora no seu computador ou celular está configurado corretamente. Cod.: 2015',
  },
  {
    codes: [2016, 2055],
    message: 'Aparentemente você não tem permissão para realizar esta tarefa.',
  },
  {
    codes: [2020],
    message: 'Senha inválida',
  },
  {
    codes: [2021],
    message: 'Seu e-mail não foi encontrado',
  },
  {
    codes: [2022],
    message: 'Não foi possível enviar o e-mail',
  },
  {
    codes: [2028],
    message: 'Desculpe, mas este usuário não possui permissão de venda para este evento.',
  },
  {
    codes: [2058],
    message: 'Código de verificação inválido.',
  },
  {
    codes: [3002],
    message: 'Desculpe, mas o evento solicitado não existe em nosso banco de dados.',
  },
  {
    codes: [3003],
    message: 'Desculpe, este usuário não existe.',
  },
  {
    codes: [3014],
    message: 'A quantidade total de ingressos selecionados não está disponível. Experimente diminuir a quantidade de ingressos.',
  },
  {
    codes: [3020],
    message: 'Desculpe, mas não há ingressos cadastrados para o evento solicitado.',
  },
  {
    codes: [3023],
    message: 'Sua sessão de compra expirou. Por favor, refaça o processo de compra.',
  },
  {
    codes: [3030],
    message: 'Não encontramos este e-mail em nossa plataforma. Certifique-se de que ele foi utilizado para criar uma conta.',
  },
  {
    codes: [3036],
    message: 'Desculpe, somente é possível estornar transações aprovadas.',
  },
  {
    codes: [3041],
    message: 'Você selecionou uma quantidade de ingressos maior do que temos disponível no estoque.',
  },
  {
    codes: [3087],
    message: 'Esse cupom não está mais disponível para uso.',
  },
  {
    codes: [5001],
    message: 'Não conseguimos nos conectar ao seu facebook... Por favor, faça o login no seu facebook e tente novamente.',
  },
  {
    codes: [5002, 5009, 5010, 5011],
    message: 'Houve um problema de comunicação com nosso gateway de pagamento. Por favor tente novamente.',
  },
  {
    codes: [6100, 6014, 6027, 6044, 90],
    message: 'Você excedeu o limite de ingressos disponíveis por conta. Para mais informações, verifique a descrição do evento.',
  },
  {
    codes: [6101],
    message: "Alguns dos ingressos selecionados possui um limite por conta e parece que você já possui esses ingressos na sua conta. Verifique suas compras e para mais informações consulte a descrição do evento.",
  },
  {
    codes: [6029],
    message: 'Para concluir sua compra, gostaríamos de confirmar algumas informações de segurança. Por favor, entre em contato conosco através do e-mail contato@ingresse.com.',
  },
  {
    codes: [6033],
    message: 'A compra de ingresso só pode ser realizada por usuários verificados.',
  },
  {
    codes: [6040],
    message: 'Esse ingresso já foi transferido.',
  },
  {
    codes: [6045],
    message: 'Este ingresso já pertence a você e está na sua carteira.',
  },
  {
    codes: [6063],
    message: '<div class="aph loader__title">Ops</div>' +
    'Este e-mail já está sendo utilizado. Caso não lembre sua ' +
    'senha, inicie o processo de redefinição de senha.',
  },
  {
    codes: [6074],
    message: '<div class="aph loader__title">Este cartão já está adicionado</div>Para ver a lista de cartões já adicionados na sua conta volte a etapa anterior.',
  },
]);
