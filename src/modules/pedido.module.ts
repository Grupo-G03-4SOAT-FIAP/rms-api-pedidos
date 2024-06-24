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
import { CobrancaMessageHandler } from 'src/infrastructure/message_handlers/cobranca/cobranca.message_handler';

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
    PedidoUseCase,
    CobrancaMessageHandler,
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
