import { Module } from '@nestjs/common';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
    controllers: [ ConversationController ],
    providers: [ ConversationService, DatabaseService ],
})
export class ConversationModule {}
