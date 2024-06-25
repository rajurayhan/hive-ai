import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ENUMS } from '../../../common/enums';
import { DatabaseService } from '../../../common/services/database.service';
import { EnvConfigService } from '../../../common/services/env-config.service';

@Injectable()
export class AssociatesSyncService {
  constructor(
    private databaseService: DatabaseService,
    private envConfigService: EnvConfigService,
    ) {}

  @OnEvent(ENUMS.EventEmitterEnum.ASSOCIATES_SYNC) //The schedule for the full day
  async medicineScheduleStopEvent() {
    try {
      const fetchRequest = await fetch('https://time.cloud.lhgdev.com/en/api/payroll/users',{
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
          'X-AUTH-USER': this.envConfigService.get('PAYROLL_USER_X_AUTH_USER'),
          'X-AUTH-TOKEN': this.envConfigService.get('PAYROLL_USER_X_AUTH_TOKEN'),
        }
      });
      const response = await fetchRequest.json()
      for(const user of response?.data || []){
        this.databaseService.associateRepo.upsert({
          id: user.id,
          userName: user.username,
          name: user.name,
          email: user.email,
          hourlyRate: user.hourly_rate,
        },['id','email']).then().catch()
      }
    } catch (error){
      console.log('error', error);
    }
  }
}
