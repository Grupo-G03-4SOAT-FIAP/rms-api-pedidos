import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { pedidoDTOMock, pedidoUseCaseMock } from 'src/mocks/pedido.mock';
import { CobrancaMessageHandler } from './cobranca.message_handler';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { messageMock } from 'src/mocks/message.mock';
import { Logger } from '@nestjs/common';
import { AtualizaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

describe('CobrancaMessageHandler', () => {
  let cobrancaMessageHandler: CobrancaMessageHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        CobrancaMessageHandler,
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

    cobrancaMessageHandler = module.get<CobrancaMessageHandler>(
      CobrancaMessageHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve consumir mensagem cobrança gerada', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    };
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      qrCode: pedidoDTOMock.qrCode,
    };
    pedidoUseCaseMock.editarPedido.mockReturnValue(HTTPResponse);

    await cobrancaMessageHandler.handleMessage(messageMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });

  it('deve lançar exceção ao consumir mensagem cobrança gerada', async () => {
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      qrCode: pedidoDTOMock.qrCode,
    };
    pedidoUseCaseMock.editarPedido.mockRejectedValue(new Error('Erro'));

    await cobrancaMessageHandler.handleMessage(messageMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });
});
