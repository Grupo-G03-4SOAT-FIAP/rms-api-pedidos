import { PedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

export interface IPagamentoService {
  gerarPagamento(pedido: PedidoDTO): Promise<any>;
}

export const IPagamentoService = Symbol('IPagamentoService');
