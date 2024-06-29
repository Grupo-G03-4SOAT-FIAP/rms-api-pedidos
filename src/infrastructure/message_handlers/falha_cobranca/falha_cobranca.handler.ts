import { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import {
  StatusPagamento,
  StatusPedido,
} from 'src/domain/pedido/enums/pedido.enum';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import {
  AtualizaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class FalhaCobrancaMessageHandler {
  private _nomeFilaFalhaCobranca: string;

  constructor(
    private readonly logger: Logger,
    private configService: ConfigService,
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
  ) {
    this._nomeFilaFalhaCobranca = this.configService.getOrThrow<string>(
      'NOME_FILA_FALHA_COBRANCA',
    );
  }

  @SqsMessageHandler('falha-cobranca', false)
  public async handleMessage(message: Message) {
    this.logger.debug(
      `Nova mensagem recebida na fila falha-cobranca`,
      JSON.stringify(message),
    );
    try {
      const parsedBody: any = JSON.parse(message.Body);
      const pedidoDTO: PedidoDTO = parsedBody as unknown as PedidoDTO;
      this.logger.warn(
        `Cancelando o pedido ${pedidoDTO.id} devido a falha ao gerar cobrança...`,
      );
      const atualizaPedidoDTO: AtualizaPedidoDTO = {
        statusPedido: StatusPedido.CANCELADO,
        statusPagamento: StatusPagamento.RECUSADO,
      };
      await this.pedidoUseCase.editarPedido(pedidoDTO.id, atualizaPedidoDTO);
      this.logger.warn(`O pedido ${pedidoDTO.id} foi cancelado`);
    } catch (error) {
      this.logger.error(
        `Ocorreu um erro ao processar a mensagem com MessageId ${message?.MessageId}`,
        error,
        JSON.stringify(message),
      );
    }
  }

  @SqsConsumerEventHandler('falha-cobranca', 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    this.logger.error(
      `Ocorreu um erro ao processar a mensagem com MessageId ${message?.MessageId}`,
      error,
      JSON.stringify(message),
    );
  }
}
