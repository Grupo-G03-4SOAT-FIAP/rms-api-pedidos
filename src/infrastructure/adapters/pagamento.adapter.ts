import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PagamentoResponse } from 'src/domain/pedido/interfaces/pagamento.response.port';
import { PedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class PagamentoAdapter {
  constructor(private configService: ConfigService) {}
  async gerarPagamento(pedido: PedidoDTO): Promise<PagamentoResponse> {
    try {
      const response = await axios.post(
        this.configService.get<string>('URL_API_PAGAMENTOS'),
        pedido,
      );
      return response.data.body;
    } catch (error) {
      throw new Error('Ocorreu um erro ao gerar o pagamento.');
    }
  }
}
