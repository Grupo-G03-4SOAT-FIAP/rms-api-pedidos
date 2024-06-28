import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FilaNovaCobrancaAdapter } from './nova_cobranca.adapter';
import { pedidoDTOMock } from 'src/mocks/pedido.mock';
import { SqsService } from '@ssut/nestjs-sqs';
import { Logger } from '@nestjs/common';

describe('FilaNovaCobrancaAdapter', () => {
  let filaNovaCobrancaAdapter: FilaNovaCobrancaAdapter;
  let configService: ConfigService;
  let sqsService: SqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        FilaNovaCobrancaAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(),
          },
        },
        {
          provide: SqsService,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    filaNovaCobrancaAdapter = module.get<FilaNovaCobrancaAdapter>(
      FilaNovaCobrancaAdapter,
    );
    configService = module.get<ConfigService>(ConfigService);
    sqsService = module.get<SqsService>(SqsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve publicar nova cobrança', async () => {
    jest.spyOn(configService, 'getOrThrow').mockReturnValue('nova-cobranca');
    jest.spyOn(sqsService, 'send');

    await filaNovaCobrancaAdapter.gerarPagamento(pedidoDTOMock);
    expect(sqsService.send).toHaveBeenCalled();
  });

  it('deve lançar exceção ao criar nova cobrança', async () => {
    jest.spyOn(configService, 'getOrThrow').mockReturnValue('nova-cobranca');
    jest.spyOn(sqsService, 'send').mockRejectedValue(new Error('Erro'));

    await expect(filaNovaCobrancaAdapter.gerarPagamento(null)).rejects.toThrow(
      'Ocorreu um erro ao publicar a mensagem.',
    );
  });
});
