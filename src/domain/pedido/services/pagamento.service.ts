import { Injectable } from '@nestjs/common';
import { IPagamentoService } from '../interfaces/pagamento.service.port';
import { PagamentoAdapter } from 'src/infrastructure/adapters/pagamento.adapter';
import { PedidoEntity } from '../entities/pedido.entity';
import { PagamentoResponse } from '../interfaces/pagamento.response.port';
import { ProcessarPagamentoErro } from '../exceptions/pedido.exception';

@Injectable()
export class PagamentoService implements IPagamentoService {
  constructor(private readonly pagamentoAdapter: PagamentoAdapter) {}

  async gerarPagamento(pedido: PedidoEntity): Promise<PagamentoResponse> {
    const maxTentativas = 3;
    let tentativas = 0;

    while (tentativas < maxTentativas) {
      try {
        // Tente realizar o pagamento
        return await this.pagamentoAdapter.gerarPagamento(pedido);
      } catch (error) {
        // Se ocorrer uma exceção, tente novamente
        tentativas++;
      }
    }

    // Se exceder o número máximo de tentativas, lançar uma exceção
    throw new ProcessarPagamentoErro(
      'Não foi possível gerar o pagamento após várias tentativas',
    );
  }
}
