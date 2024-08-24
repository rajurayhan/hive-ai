import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { Repository } from 'typeorm/repository/Repository';
import { ServiceScopesEntity } from '../entities/ServiceScopes.entity';
import { DeliverableEntity } from '../entities/Deliberable.entity';
import { ScopeOfWorkEntity } from '../entities/ScopeOfWork.entity';
import { ProblemAndGoalEntity } from '../entities/ProblemsAndGoals.entity';
import { AssociateEntity } from '../entities/Associate.entity';
import { PhaseEntity } from '../entities/Phase.entity';

@Injectable()
export class DatabaseService {
    public dataSource: DataSource;
    constructor(private readonly _dataSource: DataSource) {
        this.dataSource = _dataSource;
    }
    private getRepo<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
        return this.dataSource.getRepository<Entity>(this.dataSource.getMetadata(target).tableName);
    }

    get serviceScopeRepo(): Repository<ServiceScopesEntity> {
        return this.getRepo(ServiceScopesEntity);
    }
    get associateRepo(): Repository<AssociateEntity> {
        return this.getRepo(AssociateEntity);
    }
    get problemAndGoalRepo(): Repository<ProblemAndGoalEntity> {
        return this.getRepo(ProblemAndGoalEntity);
    }
    get deliverableRepo(): Repository<DeliverableEntity> {
        return this.getRepo(DeliverableEntity);
    }
    get scopeOfWork(): Repository<ScopeOfWorkEntity> {
        return this.getRepo(ScopeOfWorkEntity);
    }
    get phase(): Repository<PhaseEntity> {
        return this.getRepo(PhaseEntity);
    }
}
