import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { pedidoDTOMock, pedidoUseCaseMock } from 'src/mocks/pedido.mock';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { messageIdMock } from 'src/mocks/message.mock';
import { Logger } from '@nestjs/common';
import { AtualizaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { FalhaPagamentoMessageHandler } from './falha_pag.handler';
import {
  StatusPagamento,
  StatusPedido,
} from 'src/domain/pedido/enums/pedido.enum';

describe('FalhaPagamentoMessageHandler', () => {
  let falhaPagamentoMessageHandler: FalhaPagamentoMessageHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        FalhaPagamentoMessageHandler,
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

    falhaPagamentoMessageHandler = module.get<FalhaPagamentoMessageHandler>(
      FalhaPagamentoMessageHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve consumir mensagem de falha no pagamento', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    };
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      statusPagamento: StatusPagamento.RECUSADO,
      statusPedido: StatusPedido.CANCELADO,
    };
    pedidoUseCaseMock.editarPedido.mockReturnValue(HTTPResponse);

    await falhaPagamentoMessageHandler.handleMessage(messageIdMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });

  it('deve lançar exceção ao consumir mensagem de falha no pagamento', async () => {
    const atualizaPedidoDTO: AtualizaPedidoDTO = {
      statusPagamento: StatusPagamento.RECUSADO,
      statusPedido: StatusPedido.CANCELADO,
    };
    pedidoUseCaseMock.editarPedido.mockRejectedValue(new Error('Erro'));

    await falhaPagamentoMessageHandler.handleMessage(messageIdMock);

    expect(pedidoUseCaseMock.editarPedido).toHaveBeenCalledWith(
      pedidoDTOMock.id,
      atualizaPedidoDTO,
    );
  });
});
