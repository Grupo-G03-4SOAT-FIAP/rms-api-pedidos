import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { SqsService } from '@ssut/nestjs-sqs';
import { IFilaNovaCobrancaAdapter } from 'src/domain/pedido/interfaces/nova_cobranca.port';

@Injectable()
export class FilaNovaCobrancaAdapter implements IFilaNovaCobrancaAdapter {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly sqsService: SqsService,
  ) {}
  async gerarPagamento(pedido: PedidoDTO) {
    const queueName = this.configService.getOrThrow<string>(
      'NOME_FILA_NOVA_COBRANCA',
    );
    try {
      await this.sqsService.send(queueName, {
        id: 'id',
        body: pedido,
      });
      this.logger.log(
        `Pedido ${pedido.id} publicado na fila ${queueName}`,
        JSON.stringify(pedido),
      );
    } catch (error) {
      this.logger.error(
        `Ocorreu um erro ao publicar o pedido ${pedido?.id} na fila ${queueName}`,
        error,
      );
      throw new Error('Ocorreu um erro ao publicar a mensagem.');
    }
  }
}
