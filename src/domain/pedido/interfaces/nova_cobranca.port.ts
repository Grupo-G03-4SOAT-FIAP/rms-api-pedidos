import { PedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

export interface IFilaNovaCobrancaAdapter {
  gerarPagamento(pedido: PedidoDTO);
}

export const IFilaNovaCobrancaAdapter = Symbol('IFilaNovaCobrancaAdapter');
