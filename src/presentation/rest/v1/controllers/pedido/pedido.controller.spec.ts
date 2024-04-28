import { Test, TestingModule } from '@nestjs/testing';
import { PedidoController } from './pedido.controller';
import { NotFoundException } from '@nestjs/common';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { ClienteNaoLocalizadoErro } from 'src/domain/cliente/exceptions/cliente.exception';
import { PedidoNaoLocalizadoErro } from 'src/domain/pedido/exceptions/pedido.exception';
import {
  atualizaPedidoDTOMock,
  criaPedidoDTOMock,
  pedidoDTOMock,
  pedidoUseCaseMock,
} from 'src/mocks/pedido.mock';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { clienteDTOMock, clienteDTONotIdMock } from 'src/mocks/cliente.mock';

describe('PedidoController', () => {
  let pedidoController: PedidoController;
  let pedidoId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register({
          identityProvider: {
            region: 'eu-west-1',
          },
        }),
      ],
      providers: [
        PedidoController,
        {
          provide: IPedidoUseCase,
          useValue: pedidoUseCaseMock,
        },
      ],
    }).compile();

    pedidoController = module.get<PedidoController>(PedidoController);
    pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer checkout de pedido', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTOMock,
    };

    pedidoUseCaseMock.criarPedido.mockReturnValue(HTTPResponse);

    const result = await pedidoController.checkout(
      clienteDTOMock.cpf,
      clienteDTOMock.nome,
      clienteDTOMock.email,
      criaPedidoDTOMock,
    );

    expect(pedidoUseCaseMock.criarPedido).toHaveBeenCalledWith(
      clienteDTONotIdMock,
      criaPedidoDTOMock,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve fazer checkout de pedido e retornar NotFoundError', async () => {
    pedidoUseCaseMock.criarPedido.mockRejectedValue(
      new ClienteNaoLocalizadoErro('Cliente informado não existe'),
    );

    await expect(
      pedidoController.checkout(
        clienteDTOMock.cpf,
        clienteDTOMock.nome,
        clienteDTOMock.email,
        criaPedidoDTOMock,
      ),
    ).rejects.toThrow(new NotFoundException('Cliente informado não existe'));
    expect(pedidoUseCaseMock.criarPedido).toHaveBeenCalledWith(
      clienteDTONotIdMock,
      criaPedidoDTOMock,
    );
  });

  it('deve retornar a fila de pedidos', async () => {
    pedidoUseCaseMock.listarPedidosRecebido.mockResolvedValue([pedidoDTOMock]);

    const result = await pedidoController.fila();

    expect(pedidoUseCaseMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar a fila de pedidos vazia', async () => {
    pedidoUseCaseMock.listarPedidosRecebido.mockResolvedValue([]);

    const result = await pedidoController.fila();

    expect(pedidoUseCaseMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(result).toStrictEqual([]);
  });

  it('deve atualizar um pedido', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    };

    pedidoUseCaseMock.editarPedido.mockResolvedValue(HTTPResponse);

    const result = await pedidoController.atualizar(
      pedidoId,
      atualizaPedidoDTOMock,
    );

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoId,
      atualizaPedidoDTOMock,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve atualizar um pedido e retornar NotFoundError', async () => {
    pedidoUseCaseMock.editarPedido.mockRejectedValue(
      new PedidoNaoLocalizadoErro('Pedido informado não existe'),
    );

    await expect(
      pedidoController.atualizar(pedidoId, atualizaPedidoDTOMock),
    ).rejects.toThrow(new NotFoundException('Pedido informado não existe'));
    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoId,
      atualizaPedidoDTOMock,
    );
  });

  it('deve buscar um pedido', async () => {
    pedidoUseCaseMock.buscarPedido.mockResolvedValue(pedidoDTOMock);

    const result = await pedidoController.buscar(pedidoId);

    expect(pedidoUseCaseMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve buscar um pedido e retornar NotFoundError', async () => {
    pedidoUseCaseMock.buscarPedido.mockRejectedValue(
      new PedidoNaoLocalizadoErro('Pedido informado não existe'),
    );

    await expect(pedidoController.buscar(pedidoId)).rejects.toThrow(
      new NotFoundException('Pedido informado não existe'),
    );
    expect(pedidoUseCaseMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve retornar uma lista de pedidos', async () => {
    pedidoUseCaseMock.listarPedidos.mockResolvedValue([pedidoDTOMock]);

    const result = await pedidoController.listar();

    expect(pedidoUseCaseMock.listarPedidos).toHaveBeenCalledWith();
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista de pedidos vazia', async () => {
    pedidoUseCaseMock.listarPedidos.mockResolvedValue([]);

    const result = await pedidoController.listar();

    expect(pedidoUseCaseMock.listarPedidos).toHaveBeenCalledWith();
    expect(result).toStrictEqual([]);
  });
});
