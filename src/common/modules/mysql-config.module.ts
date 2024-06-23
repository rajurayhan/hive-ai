import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigService } from '../services/env-config.service';
import { UserEntity } from '../entities/user.entity';
import { ServiceScopesEntity } from '../entities/ServiceScopes.entity';
import { MeetingSummary } from '../entities/MeetingSummary.entity';
import { MeetingTranscriptEntity } from '../entities/MeetingTranscript.entity';
import { DeliverableEntity } from '../entities/Deliberable.entity';
import { ScopeOfWorkEntity } from '../entities/ScopeOfWork.entity';
import { ProblemAndGoalEntity } from '../entities/ProblemsAndGoals.entity';
import { AssociateEntity } from '../entities/Associate.entity';
import { EntityList } from '../entities/entity.setup';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [EnvConfigService],
            useFactory: (configService: EnvConfigService) => {
                return {
                    type: 'mysql',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USER'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_DB'),
                    synchronize: false,
                    dropSchema: false,
                    logging: ['error', 'warn', 'info', 'schema', 'log'],
                    extra: {
                        charset: 'utf8_general_ci',
                    },
                    entities: EntityList,
                };
            },
        }),
    ],
    exports: [EnvConfigService],
    providers: [EnvConfigService],
})
export class MysqlConfigModule {}
