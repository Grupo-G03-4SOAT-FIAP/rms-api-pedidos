/* istanbul ignore file */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('DB_HOST'),
      port: this.configService.getOrThrow<number>('DB_PORT'),
      username: this.configService.getOrThrow<string>('DB_USERNAME'),
      password: this.configService.getOrThrow<string>('DB_PASSWORD'),
      database: this.configService.getOrThrow<string>('DB_NAME'),
      ssl: this.configService.get<string>('DB_SSL')?.toLowerCase() === 'true',
      entities: [__dirname + '/../../../**/*.model.{js,ts}'],
      synchronize: true,
    };
  }
}
