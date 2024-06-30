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
export class PagamentoMessageHandler {
  private _nomeFilaPagamentoConfirmado: string;

  constructor(
    private readonly logger: Logger,
    private configService: ConfigService,
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
  ) {
    this._nomeFilaPagamentoConfirmado = this.configService.getOrThrow<string>(
      'NOME_FILA_PAGAMENTO_CONFIRMADO',
    );
  }

  @SqsMessageHandler('pagamento-confirmado', false)
  public async handleMessage(message: Message) {
    this.logger.debug(
      `Nova mensagem recebida na fila pagamento-confirmado`,
      JSON.stringify(message),
    );
    try {
      const idPedido: string = message.Body;
      this.logger.debug(`Confirmando pagamento do pedido ${idPedido}...`);
      const atualizaPedidoDTO: AtualizaPedidoDTO = {
        statusPagamento: StatusPagamento.PAGO,
        statusPedido: StatusPedido.EM_PREPARACAO,
      };
      this.logger.log(
        `O pedido ${idPedido} ${StatusPagamento.PAGO} foi enviado para ${StatusPedido.EM_PREPARACAO}`,
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

  @SqsConsumerEventHandler('pagamento-confirmado', 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    this.logger.error(
      `Ocorreu um erro ao processar a mensagem com MessageId ${message?.MessageId}`,
      error,
      JSON.stringify(message),
    );
  }
}
