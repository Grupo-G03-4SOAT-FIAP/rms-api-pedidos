import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from './pagamento.service';
import {
  filaNovaCobrancaAdapterMock,
  pedidoDTOMock,
} from 'src/mocks/pedido.mock';
import { IFilaNovaCobrancaAdapter } from '../interfaces/nova_cobranca.port';
import { ProcessarPagamentoErro } from '../exceptions/pedido.exception';

describe('PagamentoService', () => {
  let pagamentoService: PagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: IFilaNovaCobrancaAdapter,
          useValue: filaNovaCobrancaAdapterMock,
        },
      ],
    }).compile();

    pagamentoService = module.get<PagamentoService>(PagamentoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar cobrança', async () => {
    expect(() => pagamentoService.gerarPagamento(pedidoDTOMock)).not.toThrow();
  });

  it('deve lançar uma exceção ao gerar cobrança', async () => {
    const maxTentativas = 3;
    let tentativas = 0;

    filaNovaCobrancaAdapterMock.gerarPagamento.mockRejectedValue(
      new Error('Ocorreu um erro ao gerar o pagamento.'),
    );

    try {
      while (tentativas < maxTentativas) {
        await pagamentoService.gerarPagamento(pedidoDTOMock);
        tentativas++;
      }
    } catch (error) {
      expect(error).toBeInstanceOf(ProcessarPagamentoErro);
      expect(error.message).toBe('Não foi possível gerar o pagamento');
    }
  });
});
