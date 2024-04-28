import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoAdapter } from './pagamento.adapter';
import { pagamentoResponseMock, pedidoEntityMock } from 'src/mocks/pedido.mock';

describe('PagamentoAdapter', () => {
  let pagamentoAdapter: PagamentoAdapter;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    pagamentoAdapter = module.get<PagamentoAdapter>(PagamentoAdapter);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar um pagamento', async () => {
    jest.spyOn(configService, 'get').mockReturnValue('http://localhost:3000');

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        body: pagamentoResponseMock,
      },
    });

    const response = await pagamentoAdapter.gerarPagamento(pedidoEntityMock);
    expect(response).toEqual(pagamentoResponseMock);
  });

  it('deve lançar uma exceção ao gerar um pagamento', async () => {
    jest.spyOn(configService, 'get').mockReturnValue('http://localhost:3000');

    jest.spyOn(axios, 'post').mockRejectedValue(new Error('Erro'));

    await expect(
      pagamentoAdapter.gerarPagamento(pedidoEntityMock),
    ).rejects.toThrow('Ocorreu um erro ao gerar o pagamento.');
  });
});
