import { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import {
  StatusPagamento,
  StatusPedido,
} from 'src/domain/pedido/enums/pedido.enum';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import { AtualizaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class FalhaPagamentoMessageHandler {
  private _nomeFilaFalhaPagamento: string;

  constructor(
    private readonly logger: Logger,
    private configService: ConfigService,
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
  ) {
    this._nomeFilaFalhaPagamento = this.configService.getOrThrow<string>(
      'NOME_FILA_FALHA_PAGAMENTO',
    );
  }

  @SqsMessageHandler('falha-pagamento', false)
  public async handleMessage(message: Message) {
    this.logger.debug(
      `Nova mensagem recebida na fila falha-pagamento`,
      JSON.stringify(message),
    );
    try {
      const idPedido: string = message.Body;
      this.logger.warn(`Cancelando o pedido ${idPedido}...`);
      const atualizaPedidoDTO: AtualizaPedidoDTO = {
        statusPagamento: StatusPagamento.RECUSADO,
        statusPedido: StatusPedido.CANCELADO,
      };
      this.logger.warn(
        `O pedido ${idPedido} foi cancelado`,
      );
      await this.pedidoUseCase.editarPedido(idPedido, atualizaPedidoDTO);
    } catch (error) {
      this.logger.error(
        `Ocorreu um erro ao processar a mensagem com MessageId ${message?.MessageId}`,
        error,
        JSON.stringify(message),
      );
    }
  }

  @SqsConsumerEventHandler('falha-pagamento', 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    this.logger.error(
      `Ocorreu um erro ao processar a mensagem com MessageId ${message?.MessageId}`,
      error,
      JSON.stringify(message),
    );
  }
}
