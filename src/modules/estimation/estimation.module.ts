import { Module } from '@nestjs/common';
import { EstimationController } from './controllers/estimation.controller';
import { EstimationService } from './services/estimation.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
    controllers: [ EstimationController ],
    providers: [ EstimationService, DatabaseService ],
})
export class EstimationModule {}
