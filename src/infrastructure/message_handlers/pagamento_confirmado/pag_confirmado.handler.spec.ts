import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { pedidoDTOMock, pedidoUseCaseMock } from 'src/mocks/pedido.mock';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { messageIdMock } from 'src/mocks/message.mock';
import { Logger } from '@nestjs/common';
import { AtualizaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { PagamentoMessageHandler } from './pag_confirmado.handler';
import {
  StatusPagamento,
  StatusPedido,
} from 'src/domain/pedido/enums/pedido.enum';

describe('PagamentoMessageHandler', () => {
  let pagamentoMessageHandler: PagamentoMessageHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        PagamentoMessageHandler,
        {
          provide: IPedidoUseCase,
          useValue: pedidoUseCaseMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    pagamentoMessageHandler = module.get<PagamentoMessageHandler>(
      PagamentoMessageHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve consumir mensagem de pagamento confirmado', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    };
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      statusPagamento: StatusPagamento.PAGO,
      statusPedido: StatusPedido.EM_PREPARACAO,
    };
    pedidoUseCaseMock.editarPedido.mockReturnValue(HTTPResponse);

    await pagamentoMessageHandler.handleMessage(messageIdMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });

  it('deve lançar exceção ao consumir mensagem de pagamento confirmado', async () => {
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      statusPagamento: StatusPagamento.PAGO,
      statusPedido: StatusPedido.EM_PREPARACAO,
    };
    pedidoUseCaseMock.editarPedido.mockRejectedValue(new Error('Erro'));

    await pagamentoMessageHandler.handleMessage(messageIdMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });
});
