import { Module } from '@nestjs/common';
import { CommonServiceModule } from './common/modules/common-service.module';
import { EnvConfigModule } from './common/modules/env-config.module';
import { MysqlConfigModule } from './common/modules/mysql-config.module';
import { EstimationModule } from './modules/estimation/estimation.module';


@Module({
  imports: [
    EnvConfigModule,
    CommonServiceModule,
    MysqlConfigModule,
    EstimationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
