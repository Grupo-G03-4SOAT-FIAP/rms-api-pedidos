import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from './pagamento.service';
import {
  pagamentoAdapterMock,
  pagamentoResponseMock,
  pedidoEntityMock,
} from 'src/mocks/pedido.mock';
import { PagamentoAdapter } from 'src/infrastructure/adapters/pagamento.adapter';
import { ProcessarPagamentoErro } from '../exceptions/pedido.exception';

describe('PagamentoService', () => {
  let pagamentoService: PagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: PagamentoAdapter,
          useValue: pagamentoAdapterMock,
        },
      ],
    }).compile();

    pagamentoService = module.get<PagamentoService>(PagamentoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar um pagamento', async () => {
    pagamentoAdapterMock.gerarPagamento.mockReturnValue(pagamentoResponseMock);
    const pagamento = await pagamentoService.gerarPagamento(pedidoEntityMock);

    expect(pagamento).toBe(pagamentoResponseMock);
  });

  it('deve lançar uma exceção ao gerar um pagamento', async () => {
    const maxTentativas = 3;
    let tentativas = 0;

    pagamentoAdapterMock.gerarPagamento.mockRejectedValue(
      new Error('Ocorreu um erro ao gerar o pagamento.'),
    );

    try {
      while (tentativas < maxTentativas) {
        await pagamentoService.gerarPagamento(pedidoEntityMock);
        tentativas++;
      }
    } catch (error) {
      expect(error).toBeInstanceOf(ProcessarPagamentoErro);
      expect(error.message).toBe(
        'Não foi possível gerar o pagamento após várias tentativas',
      );
    }
  });
});
