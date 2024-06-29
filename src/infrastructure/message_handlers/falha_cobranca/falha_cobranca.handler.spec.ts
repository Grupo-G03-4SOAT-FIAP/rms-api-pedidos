import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { pedidoDTOMock, pedidoUseCaseMock } from 'src/mocks/pedido.mock';
import { FalhaCobrancaMessageHandler } from './falha_cobranca.handler';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { messageMock } from 'src/mocks/message.mock';
import { Logger } from '@nestjs/common';
import { AtualizaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { StatusPedido, StatusPagamento } from 'src/domain/pedido/enums/pedido.enum';

describe('FalhaCobrancaMessageHandler', () => {
  let falhaCobrancaMessageHandler: FalhaCobrancaMessageHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        FalhaCobrancaMessageHandler,
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

    falhaCobrancaMessageHandler = module.get<FalhaCobrancaMessageHandler>(
      FalhaCobrancaMessageHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve consumir mensagem de falha na cobrança', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    };
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      statusPedido: StatusPedido.CANCELADO,
      statusPagamento: StatusPagamento.RECUSADO,
    };
    pedidoUseCaseMock.editarPedido.mockReturnValue(HTTPResponse);

    await falhaCobrancaMessageHandler.handleMessage(messageMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });

  it('deve lançar exceção ao consumir mensagem de falha na cobrança', async () => {
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      statusPedido: StatusPedido.CANCELADO,
      statusPagamento: StatusPagamento.RECUSADO,
    };
    pedidoUseCaseMock.editarPedido.mockRejectedValue(new Error('Erro'));

    await falhaCobrancaMessageHandler.handleMessage(messageMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });
});
