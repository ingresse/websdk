"use strict";

angular.module("ingresseSDK").constant("ingresseErrors", [
  {
    locale: "pt-BR",
    codes: [56],
    message: "A senha atual não está correta.",
  },
  {
    locale: "pt-BR",
    codes: [102],
    message:
      "Parece que você já realizou compras com esse cupom de desconto que está utilizando e atingiu o limite. Remova o cupom utilizado para prosseguir com a compra.",
  },
  {
    locale: "pt-BR",
    codes: [103],
    message:
      "Parece que você já realizou compras com esse cupom de desconto e atingiu seu limite. Remova o cupom utilizado para prosseguir com a compra.",
  },
  {
    locale: "pt-BR",
    codes: [1001],
    message: "Desculpe, mas você precisa selecionar pelo menos um ingresso.",
  },
  {
    locale: "pt-BR",
    codes: [1005],
    message:
      "O usuário informado é diferente do usuário que gerou a transação. Você trocou de login no meio do processo? Por favor, recomece a operação.",
  },
  {
    locale: "pt-BR",
    codes: [1006],
    message: "O campo e-mail não foi preenchido.",
  },
  {
    locale: "pt-BR",
    codes: [1007],
    message: "O endereço de e-mail informado não é valido.",
  },
  {
    locale: "pt-BR",
    codes: [1009],
    message: "Parâmetro do estado é inválido.",
  },
  {
    locale: "pt-BR",
    codes: [1013, 1014],
    message: "O número de parcelas não esta correto.",
  },
  {
    locale: "pt-BR",
    codes: [1029, 1030],
    message: "O código de desconto informado não esta correto.",
  },
  {
    locale: "pt-BR",
    codes: [1031],
    message:
      "Está faltando alguma informação do cartão de crédito, verifique se você não esqueceu de preencher algo.",
  },
  {
    locale: "pt-BR",
    codes: [1032, 1033],
    message: "Você esqueceu de preencher o campo CPF.",
  },
  {
    locale: "pt-BR",
    codes: [1060, 1061],
    message: "Número de CPF inválido",
  },
  {
    locale: "pt-BR",
    codes: [1108],
    message: "Ocorreu um erro durante a validação do telefone.",
  },
  {
    locale: "pt-BR",
    codes: [1109],
    message: "Este número já foi verificado por outro usuário.",
  },
  {
    locale: "pt-BR",
    codes: [1133],
    message:
      "A quantidade de endereços de e-mail informada excede o limite padrão.",
  },
  {
    locale: "pt-BR",
    codes: [1146],
    message: "Aparentemente o número de telefone informado é invalido.",
  },
  {
    locale: "pt-BR",
    codes: [1216],
    message:
      "Aparentemente essa não é uma Bandeira de Cartão válida para pagamento neste evento.",
  },
  {
    locale: "pt-BR",
    codes: [2004],
    message: "Você já acessou a última página",
  },
  {
    locale: "pt-BR",
    codes: [2005],
    message: "É preciso fazer login para continuar",
  },
  {
    locale: "pt-BR",
    codes: [2006],
    message: "Sua sessão expirou. Faça o login novamente.",
  },
  {
    locale: "pt-BR",
    codes: [2007],
    message:
      "Esta aplicação não possui permissão para realizar a operação de login",
  },
  {
    locale: "pt-BR",
    codes: [2008],
    message: "Sua conexão não está segura (https)",
  },
  {
    locale: "pt-BR",
    codes: [2009],
    message: "Aparentemente você não tem permissão para realizar esta tarefa",
  },
  {
    locale: "pt-BR",
    codes: [2011],
    message: "Para continuar você precisa ser o dono do evento",
  },
  {
    locale: "pt-BR",
    codes: [2012],
    message:
      "Tente novamente, por favor. Parece que já faz um tempo desde sua última interação.",
  },
  {
    locale: "pt-BR",
    codes: [2015],
    message:
      "Opa! Parece que a configuração de dia e hora não está ok. Verifique se o dia e hora no seu computador ou celular está configurado corretamente. Cod.: 2015",
  },
  {
    locale: "pt-BR",
    codes: [2016, 2055],
    message: "Aparentemente você não tem permissão para realizar esta tarefa.",
  },
  {
    locale: "pt-BR",
    codes: [2020],
    message: "Senha inválida",
  },
  {
    locale: "pt-BR",
    codes: [2021],
    message: "Seu e-mail não foi encontrado",
  },
  {
    locale: "pt-BR",
    codes: [2022],
    message: "Não foi possível enviar o e-mail",
  },
  {
    locale: "pt-BR",
    codes: [2028],
    message:
      "Desculpe, mas este usuário não possui permissão de venda para este evento.",
  },
  {
    locale: "pt-BR",
    codes: [2058],
    message: "Código de verificação inválido.",
  },
  {
    locale: "pt-BR",
    codes: [3002],
    message:
      "Desculpe, mas o evento solicitado não existe em nosso banco de dados.",
  },
  {
    locale: "pt-BR",
    codes: [3003],
    message: "Desculpe, este usuário não existe.",
  },
  {
    locale: "pt-BR",
    codes: [3014],
    message:
      "A quantidade total de ingressos selecionados não está disponível. Experimente diminuir a quantidade de ingressos.",
  },
  {
    locale: "pt-BR",
    codes: [3020],
    message:
      "Desculpe, mas não há ingressos cadastrados para o evento solicitado.",
  },
  {
    locale: "pt-BR",
    codes: [3023],
    message:
      "Sua sessão de compra expirou. Por favor, refaça o processo de compra.",
  },
  {
    locale: "pt-BR",
    codes: [3030],
    message:
      "Não encontramos este e-mail em nossa plataforma. Certifique-se de que ele foi utilizado para criar uma conta.",
  },
  {
    locale: "pt-BR",
    codes: [3036],
    message: "Desculpe, somente é possível estornar transações aprovadas.",
  },
  {
    locale: "pt-BR",
    codes: [3041],
    message:
      "Você selecionou uma quantidade de ingressos maior do que temos disponível no estoque.",
  },
  {
    locale: "pt-BR",
    codes: [3087],
    message: "Esse cupom não está mais disponível para uso.",
  },
  {
    locale: "pt-BR",
    codes: [5001],
    message:
      "Não conseguimos nos conectar ao seu facebook... Por favor, faça o login no seu facebook e tente novamente.",
  },
  {
    locale: "pt-BR",
    codes: [5002, 5009, 5010, 5011],
    message:
      "Houve um problema de comunicação com nosso gateway de pagamento. Por favor tente novamente.",
  },
  {
    locale: "pt-BR",
    codes: [6100, 6014, 6027, 6044, 90],
    message:
      "Você excedeu o limite de ingressos disponíveis por conta. Para mais informações, verifique a descrição do evento.",
  },
  {
    locale: "pt-BR",
    codes: [6101],
    message:
      "Alguns dos ingressos selecionados possui um limite por conta e parece que você já possui esses ingressos na sua conta. Verifique suas compras e para mais informações consulte a descrição do evento.",
  },
  {
    locale: "pt-BR",
    codes: [6029],
    message:
      "Para concluir sua compra, gostaríamos de confirmar algumas informações de segurança. Por favor, entre em contato conosco através do e-mail contato@ingresse.com.",
  },
  {
    locale: "pt-BR",
    codes: [6033],
    message:
      "A compra de ingresso só pode ser realizada por usuários verificados.",
  },
  {
    locale: "pt-BR",
    codes: [6040],
    message: "Esse ingresso já foi transferido.",
  },
  {
    locale: "pt-BR",
    codes: [6045],
    message: "Este ingresso já pertence a você e está na sua carteira.",
  },
  {
    locale: "pt-BR",
    codes: [6063],
    message:
      '<div class="aph loader__title">Ops</div>' +
      "Este e-mail já está sendo utilizado. Caso não lembre sua " +
      "senha, inicie o processo de redefinição de senha.",
  },
  {
    locale: "pt-BR",
    codes: [6074],
    message:
      '<div class="aph loader__title">Este cartão já está adicionado</div>Para ver a lista de cartões já adicionados na sua conta volte a etapa anterior.',
  },
  {
    locale: "es-ES",
    codes: [56],
    message: "La contraseña actual no es correcta.",
  },
  {
    locale: "es-ES",
    codes: [102],
    message:
      "Parece que ya has realizado compras con este cupón de descuento que estás utilizando y has alcanzado el límite. Elimina el cupón utilizado para continuar con la compra.",
  },
  {
    locale: "es-ES",
    codes: [103],
    message:
      "Parece que ya has realizado compras con este cupón de descuento y has alcanzado su límite. Elimina el cupón utilizado para continuar con la compra.",
  },
  {
    locale: "es-ES",
    codes: [1001],
    message: "Lo siento, pero debes seleccionar al menos una entrada.",
  },
  {
    locale: "es-ES",
    codes: [1005],
    message:
      "El usuario proporcionado es diferente al usuario que generó la transacción. ¿Cambiaste de inicio de sesión en medio del proceso? Por favor, reinicia la operación.",
  },
  {
    locale: "es-ES",
    codes: [1006],
    message: "El campo de correo electrónico no ha sido completado.",
  },
  {
    locale: "es-ES",
    codes: [1007],
    message: "La dirección de correo electrónico proporcionada no es válida.",
  },
  {
    locale: "es-ES",
    codes: [1009],
    message: "El parámetro del estado es inválido.",
  },
  {
    locale: "es-ES",
    codes: [1013, 1014],
    message: "El número de cuotas no es correcto.",
  },
  {
    locale: "es-ES",
    codes: [1029, 1030],
    message: "El código de descuento proporcionado no es correcto.",
  },
  {
    locale: "es-ES",
    codes: [1031],
    message:
      "Falta alguna información de la tarjeta de crédito, verifica si no olvidaste completar algo.",
  },
  {
    locale: "es-ES",
    codes: [1032, 1033],
    message: "Olvidaste completar el campo de CPF.",
  },
  {
    locale: "es-ES",
    codes: [1060, 1061],
    message: "Número de CPF inválido.",
  },
  {
    locale: "es-ES",
    codes: [1108],
    message: "Ocurrió un error durante la validación del teléfono.",
  },
  {
    locale: "es-ES",
    codes: [1109],
    message: "Este número ya fue verificado por otro usuario.",
  },
  {
    locale: "es-ES",
    codes: [1133],
    message:
      "La cantidad de direcciones de correo electrónico proporcionada excede el límite estándar.",
  },
  {
    locale: "es-ES",
    codes: [1146],
    message: "Aparentemente, el número de teléfono proporcionado es inválido.",
  },
  {
    locale: "es-ES",
    codes: [1216],
    message:
      "Aparentemente, esta no es una Bandera de Tarjeta válida para el pago en este evento.",
  },
  {
    locale: "es-ES",
    codes: [2004],
    message: "Ya has accedido a la última página.",
  },
  {
    locale: "es-ES",
    codes: [2005],
    message: "Es necesario iniciar sesión para continuar.",
  },
  {
    locale: "es-ES",
    codes: [2006],
    message: "Tu sesión ha expirado. Inicia sesión nuevamente.",
  },
  {
    locale: "es-ES",
    codes: [2007],
    message:
      "Esta aplicación no tiene permisos para realizar la operación de inicio de sesión.",
  },
  {
    locale: "es-ES",
    codes: [2008],
    message: "Tu conexión no es segura (https).",
  },
  {
    locale: "es-ES",
    codes: [2009],
    message: "Aparentemente, no tienes permisos para realizar esta tarea.",
  },
  {
    locale: "es-ES",
    codes: [2011],
    message: "Para continuar, debes ser el propietario del evento.",
  },
  {
    locale: "es-ES",
    codes: [2012],
    message:
      "Inténtalo nuevamente, por favor. Parece que ha pasado un tiempo desde tu última interacción.",
  },
  {
    locale: "es-ES",
    codes: [2015],
    message:
      "¡Ups! Parece que la configuración de fecha y hora no está bien. Verifica si la fecha y hora en tu computadora o celular están configuradas correctamente. Cod.: 2015",
  },
  {
    locale: "es-ES",
    codes: [2016, 2055],
    message: "Aparentemente, no tienes permisos para realizar esta tarea.",
  },
  {
    locale: "es-ES",
    codes: [2020],
    message: "Contraseña inválida.",
  },
  {
    locale: "es-ES",
    codes: [2021],
    message: "Tu correo electrónico no se encontró.",
  },
  {
    locale: "es-ES",
    codes: [2022],
    message: "No fue posible enviar el correo electrónico.",
  },
  {
    locale: "es-ES",
    codes: [2028],
    message:
      "Lo siento, pero este usuario no tiene permisos de venta para este evento.",
  },
  {
    locale: "es-ES",
    codes: [2058],
    message: "Código de verificación inválido.",
  },
  {
    locale: "es-ES",
    codes: [3002],
    message:
      "Lo siento, pero el evento solicitado no existe en nuestra base de datos.",
  },
  {
    locale: "es-ES",
    codes: [3003],
    message: "Lo siento, este usuario no existe.",
  },
  {
    locale: "es-ES",
    codes: [3014],
    message:
      "La cantidad total de entradas seleccionadas no está disponible. Intenta disminuir la cantidad de entradas.",
  },
  {
    locale: "es-ES",
    codes: [3020],
    message:
      "Lo siento, no hay entradas registradas para el evento solicitado.",
  },
  {
    locale: "es-ES",
    codes: [3023],
    message:
      "Tu sesión de compra ha expirado. Por favor, vuelve a realizar el proceso de compra.",
  },
  {
    locale: "es-ES",
    codes: [3030],
    message:
      "No encontramos este correo electrónico en nuestra plataforma. Asegúrate de que se haya utilizado para crear una cuenta.",
  },
  {
    locale: "es-ES",
    codes: [3036],
    message: "Lo siento, solo es posible reembolsar transacciones aprobadas.",
  },
  {
    locale: "es-ES",
    codes: [3041],
    message:
      "Has seleccionado una cantidad de entradas mayor a la que tenemos disponible en el inventario.",
  },
  {
    locale: "es-ES",
    codes: [3087],
    message: "Este cupón ya no está disponible para su uso.",
  },
  {
    locale: "es-ES",
    codes: [5001],
    message:
      "No pudimos conectar con tu Facebook... Por favor, inicia sesión en tu Facebook y vuelve a intentarlo.",
  },
  {
    locale: "es-ES",
    codes: [5002, 5009, 5010, 5011],
    message:
      "Hubo un problema de comunicación con nuestra pasarela de pago. Por favor, inténtalo nuevamente.",
  },
  {
    locale: "es-ES",
    codes: [6100, 6014, 6027, 6044, 90],
    message:
      "Has excedido el límite de entradas disponibles por cuenta. Para obtener más información, consulta la descripción del evento.",
  },
  {
    locale: "es-ES",
    codes: [6101],
    message:
      "Algunas de las entradas seleccionadas tienen un límite por cuenta y parece que ya tienes esas entradas en tu cuenta. Verifica tus compras y consulta la descripción del evento para obtener más información.",
  },
  {
    locale: "es-ES",
    codes: [6029],
    message:
      "Para completar tu compra, nos gustaría confirmar algunos detalles de seguridad. Por favor, ponte en contacto con nosotros a través del correo electrónico contacto@ingresse.com.",
  },
  {
    locale: "es-ES",
    codes: [6033],
    message:
      "La compra de entradas solo puede ser realizada por usuarios verificados.",
  },
  {
    locale: "es-ES",
    codes: [6040],
    message: "Esta entrada ya ha sido transferida.",
  },
  {
    locale: "es-ES",
    codes: [6045],
    message: "Esta entrada ya te pertenece y está en tu billetera.",
  },
  {
    locale: "es-ES",
    codes: [6063],
    message:
      '<div class="aph loader__title">Ops</div>' +
      "Este e-mail já está sendo utilizado. Caso não lembre sua " +
      "senha, inicie o processo de redefinição de senha.",
  },
  {
    locale: "es-ES",
    codes: [6074],
    message:
      '<div class="aph loader__title">Este cartão já está adicionado</div>Para ver a lista de cartões já adicionados na sua conta volte a etapa anterior.',
  },
]);
