import { PedidoEntity } from '../entities/pedido.entity';

export interface IPagamentoService {
  gerarPagamento(pedido: PedidoEntity): Promise<any>;
}

export const IPagamentoService = Symbol('IPagamentoService');
