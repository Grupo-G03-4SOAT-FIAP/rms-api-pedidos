import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import { PagamentoResponse } from 'src/domain/pedido/interfaces/pagamento.response.port';

@Injectable()
export class PagamentoAdapter {
  constructor(private configService: ConfigService) {}
  async gerarPagamento(pedido: PedidoEntity): Promise<PagamentoResponse> {
    try {
      const response = await axios.post(
        this.configService.get<string>('URL_API_PAGAMENTO'),
        pedido,
      );
      return response.data.body;
    } catch (error) {
      throw new Error('Ocorreu um erro ao gerar o pagamento.');
    }
  }
}
