import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoUseCase } from '../application/use_cases/pedido/pedido.use_case';
import { PedidoDTOFactory } from '../domain/pedido/factories/pedido.dto.factory';
import { PedidoFactory } from '../domain/pedido/factories/pedido.factory';
import { IPedidoDTOFactory } from '../domain/pedido/interfaces/pedido.dto.factory.port';
import { IPedidoFactory } from '../domain/pedido/interfaces/pedido.factory.port';
import { IPedidoRepository } from '../domain/pedido/interfaces/pedido.repository.port';
import { IPedidoUseCase } from '../domain/pedido/interfaces/pedido.use_case.port';
import { PedidoModel } from '../infrastructure/sql/models/pedido.model';
import { PedidoRepository } from '../infrastructure/sql/repositories/pedido/pedido.repository';
import { PedidoController } from '../presentation/rest/v1/controllers/pedido/pedido.controller';
import { SQLDTOFactory } from '../infrastructure/sql/factories/sql.dto.factory';
import { ItemPedidoModel } from '../infrastructure/sql/models/item_pedido.model';
import { ProdutoModule } from './produto.module';
import { ClienteModule } from './client.module';
import { PedidoService } from '../domain/pedido/services/pedido.service';
import { AuthenticationGuard } from '@nestjs-cognito/auth';
import { ClientePedidoModel } from 'src/infrastructure/sql/models/cliente_pedido.model';
import { PagamentoService } from 'src/domain/pedido/services/pagamento.service';
import { IPagamentoService } from 'src/domain/pedido/interfaces/pagamento.service.port';
import { IFilaNovaCobrancaAdapter } from 'src/domain/pedido/interfaces/nova_cobranca.port';
import { FilaNovaCobrancaAdapter } from 'src/infrastructure/adapters/filas/nova_cobranca/nova_cobranca.adapter';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { CobrancaMessageHandler } from 'src/infrastructure/message_handlers/nova_cobranca/nova_cobranca.handler';
import { FalhaCobrancaMessageHandler } from 'src/infrastructure/message_handlers/falha_cobranca/falha_cobranca.handler';
import { PagamentoMessageHandler } from 'src/infrastructure/message_handlers/pagamento_confirmado/pag_confirmado.handler';
import { FalhaPagamentoMessageHandler } from 'src/infrastructure/message_handlers/falha_pagamento/falha_pag.handler';

@Module({
  imports: [
    ProdutoModule,
    ClienteModule,
    TypeOrmModule.forFeature([
      PedidoModel,
      ItemPedidoModel,
      ClientePedidoModel,
    ]),
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          consumers: [
            {
              name: configService.getOrThrow<string>(
                'NOME_FILA_COBRANCA_GERADA',
              ),
              queueUrl: configService.getOrThrow<string>(
                'URL_FILA_COBRANCA_GERADA',
              ),
              region: configService.getOrThrow<string>(
                'REGION_FILA_COBRANCA_GERADA',
              ),
              sqs: new SQSClient({
                region: configService.getOrThrow<string>(
                  'REGION_FILA_COBRANCA_GERADA',
                ),
                endpoint: configService.get<string>('LOCALSTACK_ENDPOINT'),
              }),
            },
            {
              name: configService.get<string>(
                'NOME_FILA_FALHA_COBRANCA',
              ),
              queueUrl: configService.get<string>(
                'URL_FILA_FALHA_COBRANCA',
              ),
              region: configService.get<string>(
                'REGION_FILA_FALHA_COBRANCA',
              ),
              sqs: new SQSClient({
                region: configService.get<string>(
                  'REGION_FILA_FALHA_COBRANCA',
                ),
                endpoint: configService.get<string>('LOCALSTACK_ENDPOINT'),
              }),
            },
            {
              name: configService.getOrThrow<string>(
                'NOME_FILA_PAGAMENTO_CONFIRMADO',
              ),
              queueUrl: configService.getOrThrow<string>(
                'URL_FILA_PAGAMENTO_CONFIRMADO',
              ),
              region: configService.getOrThrow<string>(
                'REGION_FILA_PAGAMENTO_CONFIRMADO',
              ),
              sqs: new SQSClient({
                region: configService.getOrThrow<string>(
                  'REGION_FILA_PAGAMENTO_CONFIRMADO',
                ),
                endpoint: configService.get<string>('LOCALSTACK_ENDPOINT'),
              }),
            },
            {
              name: configService.getOrThrow<string>(
                'NOME_FILA_FALHA_PAGAMENTO',
              ),
              queueUrl: configService.getOrThrow<string>(
                'URL_FILA_FALHA_PAGAMENTO',
              ),
              region: configService.getOrThrow<string>(
                'REGION_FILA_FALHA_PAGAMENTO',
              ),
              sqs: new SQSClient({
                region: configService.getOrThrow<string>(
                  'REGION_FILA_FALHA_PAGAMENTO',
                ),
                endpoint: configService.get<string>('LOCALSTACK_ENDPOINT'),
              }),
            },
          ],
          producers: [
            {
              name: configService.getOrThrow<string>('NOME_FILA_NOVA_COBRANCA'),
              queueUrl: configService.getOrThrow<string>(
                'URL_FILA_NOVA_COBRANCA',
              ),
              region: configService.getOrThrow<string>(
                'REGION_FILA_NOVA_COBRANCA',
              ),
              sqs: new SQSClient({
                region: configService.getOrThrow<string>(
                  'REGION_FILA_NOVA_COBRANCA',
                ),
                endpoint: configService.get<string>('LOCALSTACK_ENDPOINT'),
              }),
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [PedidoController],
  providers: [
    Logger,
    CobrancaMessageHandler,
    FalhaCobrancaMessageHandler,
    PagamentoMessageHandler,
    FalhaPagamentoMessageHandler,
    PedidoUseCase,
    {
      provide: IPedidoUseCase,
      useClass: PedidoUseCase,
    },
    PedidoRepository,
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
    PedidoDTOFactory,
    {
      provide: IPedidoDTOFactory,
      useClass: PedidoDTOFactory,
    },
    PedidoFactory,
    {
      provide: IPedidoFactory,
      useClass: PedidoFactory,
    },
    PagamentoService,
    {
      provide: IPagamentoService,
      useClass: PagamentoService,
    },
    {
      provide: IFilaNovaCobrancaAdapter,
      useClass: FilaNovaCobrancaAdapter,
    },
    SQLDTOFactory,
    PedidoService,
    AuthenticationGuard,
  ],
  exports: [],
})
export class PedidoModule {}
