import { UserEntity } from './user.entity';
import { ServiceScopesEntity } from './ServiceScopes.entity';
import { MeetingSummary } from './MeetingSummary.entity';
import { MeetingTranscriptEntity } from './MeetingTranscript.entity';
import { DeliverableEntity } from './Deliberable.entity';
import { ProblemAndGoalEntity } from './ProblemsAndGoals.entity';
import { ScopeOfWorkEntity } from './ScopeOfWork.entity';
import { AssociateEntity } from './Associate.entity';
import { PhaseEntity } from './Phase.entity';

export const EntityList = [
  UserEntity,
  PhaseEntity,
  ServiceScopesEntity,
  MeetingSummary,
  MeetingTranscriptEntity,
  DeliverableEntity,
  ProblemAndGoalEntity,
  ScopeOfWorkEntity,
  AssociateEntity
]