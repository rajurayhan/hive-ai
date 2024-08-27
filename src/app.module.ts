import { Module } from '@nestjs/common';
import { CommonServiceModule } from './common/modules/common-service.module';
import { EnvConfigModule } from './common/modules/env-config.module';
import { MysqlConfigModule } from './common/modules/mysql-config.module';
import { EstimationModule } from './modules/estimation/estimation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SchedulerModule } from './modules/schedular';
import { ConversationModule } from './modules/conversation/conversation.module';


@Module({
  imports: [
    EnvConfigModule,
    CommonServiceModule,
    MysqlConfigModule,
    EstimationModule,
    ConversationModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    SchedulerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
