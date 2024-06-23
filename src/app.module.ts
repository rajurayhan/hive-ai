import { Module } from '@nestjs/common';
import { CommonServiceModule } from './common/modules/common-service.module';
import { EnvConfigModule } from './common/modules/env-config.module';
import { MysqlConfigModule } from './common/modules/mysql-config.module';
import { EstimationModule } from './modules/estimation/estimation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SchedulerModule } from './modules/schedular';


@Module({
  imports: [
    EnvConfigModule,
    CommonServiceModule,
    MysqlConfigModule,
    EstimationModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    SchedulerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
