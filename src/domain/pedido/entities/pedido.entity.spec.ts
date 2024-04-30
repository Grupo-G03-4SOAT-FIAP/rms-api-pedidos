import { PedidoEntity } from './pedido.entity';
import { ItemPedidoEntity } from './item_pedido.entity';
import { StatusPagamento, StatusPedido } from '../enums/pedido.enum';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { itemPedidoEntityMock } from 'src/mocks/item_pedido.mock';
import { clienteEntityMock } from 'src/mocks/cliente.mock';

describe('PedidoEntity', () => {
  let itensPedido: ItemPedidoEntity[];
  let statusPedido: StatusPedido;
  let numeroPedido: string;
  let statusPagamento: StatusPagamento;
  let cliente: ClienteEntity;
  let clientePedido: ClienteEntity;
  let id: string;

  beforeEach(() => {
    // Defina as variáveis antes de cada teste
    itensPedido = [itemPedidoEntityMock];
    statusPedido = StatusPedido.AGUARDANDO_PAGAMENTO;
    numeroPedido = '05012024';
    statusPagamento = StatusPagamento.PENDENTE;
    cliente = clienteEntityMock;
    clientePedido = clienteEntityMock;
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma instância de PedidoEntity', () => {
    const pedido = new PedidoEntity(
      itensPedido,
      statusPedido,
      numeroPedido,
      statusPagamento,
      id,
      cliente,
      clientePedido,
    );

    expect(pedido.itensPedido).toEqual(itensPedido);
    expect(pedido.statusPedido).toEqual(statusPedido);
    expect(pedido.numeroPedido).toEqual(numeroPedido);
    expect(pedido.statusPagamento).toEqual(statusPagamento);
    expect(pedido.cliente).toEqual(cliente);
    expect(pedido.id).toEqual(id);
  });

  it('deve criar uma instância de PedidoEntity sem cliente e id', () => {
    const pedido = new PedidoEntity(
      itensPedido,
      statusPedido,
      numeroPedido,
      statusPagamento,
    );

    expect(pedido.itensPedido).toEqual(itensPedido);
    expect(pedido.statusPedido).toEqual(statusPedido);
    expect(pedido.numeroPedido).toEqual(numeroPedido);
    expect(pedido.statusPagamento).toEqual(statusPagamento);
    expect(pedido.cliente).toBeUndefined();
    expect(pedido.id).toBeUndefined();
  });
});
