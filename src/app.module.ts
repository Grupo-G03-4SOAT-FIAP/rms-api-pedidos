import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './adapters/outbound/database/postgres.config.service';

import { AppController } from './adapters/inbound/rest/v1/controllers/app/app.controller';
import { AppUseCase } from './domain/use_cases/app/app.use_case';

import { ProdutoModel } from './adapters/outbound/models/produto.model';
import { ProdutoController } from './adapters/inbound/rest/v1/controllers/produtos/produtos.controller';
import { IProdutoUseCase } from './domain/ports/produto/produto.use_case.port';
import { ProdutoUseCase } from './domain/use_cases/produtos/produtos.use_case';
import { IProdutoRepository } from './domain/ports/produto/produto.repository.port';
import { ProdutoRepository } from './adapters/outbound/repositories/produto/produto.repository';

import { CategoriaModel } from './adapters/outbound/models/categoria.model';
import { CategoriaController } from './adapters/inbound/rest/v1/controllers/categorias/categorias.controller';
import { ICategoriaUseCase } from './domain/ports/categoria/categoria.use_case.port';
import { CategoriaUseCase } from './domain/use_cases/categorias/categorias.use_case';
import { ICategoriaRepository } from './domain/ports/categoria/categoria.repository.port';
import { CategoriaRepository } from './adapters/outbound/repositories/categoria/categoria.repository';
import { PedidoModel } from './adapters/outbound/models/pedido.model';
import { PedidoRepository } from './adapters/outbound/repositories/pedido/pedido.repository';
import { IPedidoRepository } from './domain/ports/pedido/pedido.repository.port';
import { ClienteModel } from './adapters/outbound/models/cliente.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProdutoModel,
      CategoriaModel,
      PedidoModel,
      ClienteModel,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [AppController, ProdutoController, CategoriaController],
  providers: [
    AppUseCase,
    ProdutoUseCase,
    ProdutoRepository,
    CategoriaUseCase,
    CategoriaRepository,
    PedidoRepository,
    {
      provide: IProdutoUseCase,
      useClass: ProdutoUseCase,
    },
    {
      provide: IProdutoRepository,
      useClass: ProdutoRepository,
    },
    {
      provide: ICategoriaUseCase,
      useClass: CategoriaUseCase,
    },
    {
      provide: ICategoriaRepository,
      useClass: CategoriaRepository,
    },
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
  ],
})
export class AppModule {}
