import { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import {
  AtualizaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class CobrancaMessageHandler {
  private _nomeFilaCobrancaGerada: string;

  constructor(
    private readonly logger: Logger,
    private configService: ConfigService,
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
  ) {
    this._nomeFilaCobrancaGerada = this.configService.getOrThrow<string>(
      'NOME_FILA_COBRANCA_GERADA',
    );
  }

  @SqsMessageHandler('cobranca-gerada', false)
  public async handleMessage(message: Message) {
    this.logger.debug(
      `Nova mensagem recebida na fila cobranca-gerada`,
      JSON.stringify(message),
    );
    try {
      const parsedBody: any = JSON.parse(message.Body);
      const pedidoDTO: PedidoDTO = parsedBody as unknown as PedidoDTO;
      this.logger.log(
        `Associando QR Code ao pedido ${pedidoDTO.id}`,
        pedidoDTO.qrCode,
      );
      const atualizaPedidoDTO: AtualizaPedidoDTO = {
        qrCode: pedidoDTO.qrCode,
      };
      await this.pedidoUseCase.editarPedido(pedidoDTO.id, atualizaPedidoDTO);
    } catch (error) {
      this.logger.error(
        `Ocorreu um erro ao processar a mensagem`,
        error,
        JSON.stringify(message),
      );
    }
  }

  @SqsConsumerEventHandler(
    /** name: */ 'queueName',
    /** eventName: */ 'processing_error',
  )
  public onProcessingError(error: Error, message: Message) {
    // report errors here
    this.logger.error(
      `Ocorreu um erro ao processar a mensagem`,
      error,
      JSON.stringify(message),
    );
  }
}
