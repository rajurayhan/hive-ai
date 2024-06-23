import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ENUMS } from '../../common/enums';

@Injectable()
export class SchedulerService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
    ) {}
    @Cron(CronExpression.EVERY_5_MINUTES, {
        timeZone: 'GMT',
        name: ENUMS.EventEmitterEnum.ASSOCIATES_SYNC,
    })
    associatesSync() {
        this.eventEmitter.emit(
          ENUMS.EventEmitterEnum.ASSOCIATES_SYNC
        );
    }
}
