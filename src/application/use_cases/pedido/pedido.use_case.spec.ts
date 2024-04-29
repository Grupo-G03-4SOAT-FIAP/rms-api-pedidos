import { Test, TestingModule } from '@nestjs/testing';
import { PedidoUseCase } from './pedido.use_case';
import { IPedidoRepository } from 'src/domain/pedido/interfaces/pedido.repository.port';
import { IPedidoFactory } from 'src/domain/pedido/interfaces/pedido.factory.port';
import { IPedidoDTOFactory } from 'src/domain/pedido/interfaces/pedido.dto.factory.port';
import { PedidoNaoLocalizadoErro } from 'src/domain/pedido/exceptions/pedido.exception';
import {
  atualizaPedidoDTOMock,
  criaPedidoDTOMock,
  pagamentoResponseMock,
  pagamentoServiceMock,
  pedidoDTOFactoryMock,
  pedidoDTOMock,
  pedidoEntityMock,
  pedidoFactoryMock,
  pedidoModelMock,
  pedidoRepositoryMock,
} from 'src/mocks/pedido.mock';
import {
  clienteDTOMock,
  clienteModelMock,
  clienteRepositoryMock,
} from 'src/mocks/cliente.mock';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { IPagamentoService } from 'src/domain/pedido/interfaces/pagamento.service.port';
import { StatusPagamento } from 'src/domain/pedido/enums/pedido.enum';

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;
  let pedidoId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoUseCase,
        {
          provide: IPedidoRepository,
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IClienteRepository,
          useValue: clienteRepositoryMock,
        },
        {
          provide: IPedidoFactory,
          useValue: pedidoFactoryMock,
        },
        {
          provide: IPagamentoService,
          useValue: pagamentoServiceMock,
        },
        {
          provide: IPedidoDTOFactory,
          useValue: pedidoDTOFactoryMock,
        },
      ],
    }).compile();

    pedidoUseCase = module.get<PedidoUseCase>(PedidoUseCase);
    pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido com sucesso', async () => {
    pedidoFactoryMock.criarEntidadePedido.mockReturnValue(pedidoEntityMock);
    pedidoRepositoryMock.criarPedido.mockReturnValue(pedidoModelMock);
    pagamentoServiceMock.gerarPagamento.mockReturnValue(pagamentoResponseMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);
    pedidoFactoryMock.criarEntidadeCliente.mockReturnValue(pedidoEntityMock);
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(clienteModelMock);
    clienteRepositoryMock.criarCliente.mockReturnValue(clienteModelMock);
    clienteRepositoryMock.editarCliente.mockReturnValue(clienteModelMock);

    const result = await pedidoUseCase.criarPedido(
      clienteDTOMock,
      criaPedidoDTOMock,
    );

    expect(pedidoFactoryMock.criarEntidadePedido).toHaveBeenCalledWith(
      criaPedidoDTOMock,
    );
    expect(pedidoRepositoryMock.criarPedido).toHaveBeenCalledWith(
      pedidoEntityMock,
    );
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTOMock,
    });
  });

  it('deve editar o status de um pedido com sucesso', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoRepositoryMock.editarStatusPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.editarPedido(
      pedidoId,
      atualizaPedidoDTOMock,
    );

    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(pedidoRepositoryMock.editarStatusPedido).toHaveBeenCalledWith(
      pedidoId,
      atualizaPedidoDTOMock.statusPedido,
    );
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    });
  });

  it('deve editar o status de um pedido e pagamento com sucesso', async () => {
    atualizaPedidoDTOMock.statusPagamento = StatusPagamento.PAGO;

    const pedidoModelPagoMock = pedidoModelMock;
    pedidoModelPagoMock.statusPedido = 'em_preparacao';
    pedidoModelPagoMock.statusPagamento = 'pago';

    pedidoDTOMock.statusPedido = 'em_preparacao';
    pedidoDTOMock.statusPagamento = 'pago';

    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoRepositoryMock.editarStatusPagamento.mockReturnValue(
      pedidoModelPagoMock,
    );
    pedidoRepositoryMock.editarStatusPedido.mockReturnValue(
      pedidoModelPagoMock,
    );
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.editarPedido(
      pedidoId,
      atualizaPedidoDTOMock,
    );

    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(pedidoRepositoryMock.editarStatusPagamento).toHaveBeenCalledWith(
      pedidoId,
      atualizaPedidoDTOMock.statusPagamento,
    );
    expect(pedidoRepositoryMock.editarStatusPedido).toHaveBeenCalledWith(
      pedidoId,
      atualizaPedidoDTOMock.statusPedido,
    );
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelPagoMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    });
  });

  it('deve retornar erro ao editar um pedido não existe', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(null);

    await expect(
      pedidoUseCase.editarPedido(pedidoId, atualizaPedidoDTOMock),
    ).rejects.toThrow(
      new PedidoNaoLocalizadoErro('Pedido informado não existe'),
    );
    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve buscar um pedido por id', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.buscarPedido(pedidoId);

    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve retornar erro ao buscar um pedido que não existe', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(null);

    await expect(pedidoUseCase.buscarPedido(pedidoId)).rejects.toThrow(
      new PedidoNaoLocalizadoErro('Pedido informado não existe'),
    );
    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve listar todos os pedidos', async () => {
    pedidoRepositoryMock.listarPedidos.mockReturnValue([pedidoModelMock]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([pedidoDTOMock]);

    const result = await pedidoUseCase.listarPedidos();

    expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([
      pedidoModelMock,
    ]);
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista vazia de pedidos', async () => {
    pedidoRepositoryMock.listarPedidos.mockReturnValue([]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([]);

    const result = await pedidoUseCase.listarPedidos();

    expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    pedidoRepositoryMock.listarPedidosRecebido.mockReturnValue([
      pedidoModelMock,
    ]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([pedidoDTOMock]);

    const result = await pedidoUseCase.listarPedidosRecebido();

    expect(pedidoRepositoryMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([
      pedidoModelMock,
    ]);
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    pedidoRepositoryMock.listarPedidosRecebido.mockReturnValue([]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([]);

    const result = await pedidoUseCase.listarPedidosRecebido();

    expect(pedidoRepositoryMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });
});
