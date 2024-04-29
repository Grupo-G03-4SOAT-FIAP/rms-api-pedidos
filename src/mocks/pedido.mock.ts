import { Repository } from 'typeorm';
import {
  clienteModelMock,
  clienteEntityMock,
  clienteDTOMock,
} from './cliente.mock';
import {
  itemPedidoDTOMock,
  itemPedidoEntityMock,
  itemPedidoEntityNotIdMock,
  itemPedidoModelMock,
} from './item_pedido.mock';
import { PedidoModel } from 'src/infrastructure/sql/models/pedido.model';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import {
  StatusPagamento,
  StatusPedido,
} from 'src/domain/pedido/enums/pedido.enum';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

// Mock para simular dados da tabela pedido no banco de dados
export const pedidoModelMock = new PedidoModel();
pedidoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModelMock.numeroPedido = '05012024';
pedidoModelMock.itensPedido = [itemPedidoModelMock];
pedidoModelMock.cliente = clienteModelMock;
pedidoModelMock.statusPagamento = 'pendente';
pedidoModelMock.statusPedido = 'aguardando_pagamento';
pedidoModelMock.criadoEm = '2024-01-25T00:05:04.941Z';
pedidoModelMock.atualizadoEm = '2024-01-25T00:05:04.941Z';

// Mock para simular dados da entidade pedido com todos os itens
export const pedidoEntityMock = new PedidoEntity(
  [itemPedidoEntityMock],
  StatusPedido.AGUARDANDO_PAGAMENTO,
  '05012024',
  StatusPagamento.PENDENTE,
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  clienteEntityMock,
  clienteEntityMock,
  '2024-01-25T00:05:04.941Z',
  '2024-01-25T00:05:04.941Z',
);

// Mock para simular dados da entidade pedido sem data criação e atualização
export const pedidoEntityNotDateMock = new PedidoEntity(
  [itemPedidoEntityMock],
  StatusPedido.AGUARDANDO_PAGAMENTO,
  '05012024',
  StatusPagamento.PENDENTE,
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  clienteEntityMock,
  clienteEntityMock,
);

// Mock para simular dados da entidade pedido sem id
export const pedidoEntityNotIdMock = new PedidoEntity(
  [itemPedidoEntityNotIdMock],
  StatusPedido.AGUARDANDO_PAGAMENTO,
  '05012024',
  StatusPagamento.PENDENTE,
);

// Mock para simular dados da entidade pedido sem cliente
export const pedidoEntityNotClienteMock = new PedidoEntity(
  [itemPedidoEntityMock],
  StatusPedido.AGUARDANDO_PAGAMENTO,
  '05012024',
  StatusPagamento.PENDENTE,
);

// Mock para simular o DTO com os dados recebidos pelo usuario ao criar um pedido
export const criaPedidoDTOMock = new CriaPedidoDTO();
criaPedidoDTOMock.itensPedido = [
  { produto: '0a14aa4e-75e7-405f-8301-81f60646c93d', quantidade: 2 },
];
criaPedidoDTOMock.cpfCliente = '83904665030';

// Mock para simular o DTO com os dados recebidos pelo usuario ao atualizar um pedido
export const atualizaPedidoDTOMock = new AtualizaPedidoDTO();
atualizaPedidoDTOMock.statusPedido = StatusPedido.RECEBIDO;

// Mock para simular o DTO com dados de pedido enviados para o usuario ao responder uma requisição
export const pedidoDTOMock = new PedidoDTO();
pedidoDTOMock.id = pedidoModelMock.id;
pedidoDTOMock.numeroPedido = pedidoModelMock.numeroPedido;
pedidoDTOMock.itensPedido = [itemPedidoDTOMock];
pedidoDTOMock.statusPagamento = pedidoModelMock.statusPagamento;
pedidoDTOMock.statusPedido = pedidoModelMock.statusPedido;
pedidoDTOMock.criadoEm = '2024-01-25T00:05:04.941Z';
pedidoDTOMock.atualizadoEm = '2024-01-25T00:05:04.941Z';
pedidoDTOMock.cliente = clienteDTOMock;
pedidoDTOMock.qrCode = '00020101021243650016COM';

export const pagamentoResponseMock = {
  qrCode: '00020101021243650016COM',
  id: '0a14aa4e-75e7-405f-8301-81f60646c93d',
  numeroPedido: '05012024',
  itensPedido: {
    quantidade: 1,
    produto: {
      id: '0a14aa4e-75e7-405f-8301-81f60646c93d',
      nome: 'Produto X',
      descricao: 'Teste Produto X',
      valorUnitario: 29.9,
      categoria: {
        id: '0a14aa4e-75e7-405f-8301-81f60646c93d',
        nome: 'Lanche',
        descricao: 'Lanche X Tudo',
      },
    },
  },
  statusPagamento: 'pendente',
  statusPedido: 'aguardando_pagamento',
};

// Mock jest das funções do typeORM interagindo com a tabela pedido
export const pedidoTypeORMMock: jest.Mocked<Repository<PedidoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<PedidoModel>>> as jest.Mocked<
  Repository<PedidoModel>
>;

// Mock jest das funções do repository pedido
export const pedidoRepositoryMock = {
  criarPedido: jest.fn(),
  editarStatusPedido: jest.fn(),
  editarStatusPagamento: jest.fn(),
  buscarPedido: jest.fn(),
  listarPedidos: jest.fn(),
  listarPedidosRecebido: jest.fn(),
};

// Mock jest da função do factory sql dto de pedido
export const pedidoSQLDTOFactoryMock = {
  criarPedidoDTO: jest.fn(),
};

// Mock jest das funções da factory que cria entidade pedido
export const pedidoFactoryMock = {
  criarItemPedido: jest.fn(),
  criarEntidadeCliente: jest.fn(),
  criarEntidadePedido: jest.fn(),
};

// Mock jest das funções da factory que cria DTO pedido
export const pedidoDTOFactoryMock = {
  criarPedidoDTO: jest.fn(),
  criarListaPedidoDTO: jest.fn(),
  criarListaItemPedidoDTO: jest.fn(),
};

// Mock jest das funções do service que cria numero do pedido
export const pedidoServiceMock = {
  gerarNumeroPedido: jest.fn(),
};

// Mock jest das funções do use case pedido
export const pedidoUseCaseMock = {
  criarPedido: jest.fn(),
  editarPedido: jest.fn(),
  buscarPedido: jest.fn(),
  listarPedidos: jest.fn(),
  listarPedidosRecebido: jest.fn(),
};

// Mock jest das funções do adapter pagamento
export const pagamentoAdapterMock = {
  gerarPagamento: jest.fn(),
};

// Mock jest das funções do service pagamento
export const pagamentoServiceMock = {
  gerarPagamento: jest.fn(),
};
