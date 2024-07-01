export enum StatusPagamento {
  PAGO = 'pago',
  RECUSADO = 'recusado',
  PENDENTE = 'pendente',
  ERRO = 'erro',
}

export enum StatusPedido {
  AGUARDANDO_PAGAMENTO = 'aguardando_pagamento',
  RECEBIDO = 'recebido',
  EM_PREPARACAO = 'em_preparacao',
  PRONTO = 'pronto',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}
