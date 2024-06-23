import { Global, Module } from '@nestjs/common';

import { SchedulerService } from './scheduler.service';
import { AssociatesSyncService } from './business-logic/associates-sync-service.service';
import { DatabaseService } from '../../common/services/database.service';

@Global()
@Module({
    providers: [SchedulerService, AssociatesSyncService, DatabaseService],
    exports: [],
})
export class SchedulerModule {}
