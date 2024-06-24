import { Inject, Injectable } from '@nestjs/common';
import { IPagamentoService } from '../interfaces/pagamento.service.port';
import { IFilaNovaCobrancaAdapter } from '../interfaces/nova_cobranca.port';
import { ProcessarPagamentoErro } from '../exceptions/pedido.exception';
import { PedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class PagamentoService implements IPagamentoService {
  constructor(
    @Inject(IFilaNovaCobrancaAdapter)
    private readonly filaNovaCobrancaAdapter: IFilaNovaCobrancaAdapter,
  ) {}

  async gerarPagamento(pedido: PedidoDTO) {
    try {
      await this.filaNovaCobrancaAdapter.gerarPagamento(pedido);
    } catch (error) {
      throw new ProcessarPagamentoErro('Não foi possível gerar o pagamento');
    }
  }
}
