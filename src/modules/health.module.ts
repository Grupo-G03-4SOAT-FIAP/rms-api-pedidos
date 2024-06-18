import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from 'src/presentation/rest/v1/controllers/health/health.controller';

@Module({
    imports: [TerminusModule],
    controllers: [HealthController],
})
export class HealthModule { }