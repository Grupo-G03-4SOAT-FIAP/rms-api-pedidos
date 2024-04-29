export interface PagamentoResponse {
  qrCode: string;
  id: string;
  numeroPedido: string;
  itensPedido: {
    quantidade: number;
    produto: {
      id: string;
      nome: string;
      descricao: string;
      valorUnitario: number;
      categoria: {
        id: string;
        nome: string;
        descricao: string;
      };
    };
  }[];
  statusPagamento: string;
  StatusPedido: string;
}
