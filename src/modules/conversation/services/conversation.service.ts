import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../common/services/database.service';
import OpenAI from 'openai';

import { EnvConfigService } from '../../../common/services/env-config.service';
import { runThread } from '../../../common/utility';
import { ConversationGenerateDto } from '../dtos/conversation-generate.dto';
import { ConversationContinueDto } from '../dtos/conversation-continue.dto';
import { MAX_LENGTH, splitTextIntoChunks } from '../../../common/utility';

@Injectable()
export class ConversationService {
  private openai: OpenAI;
  constructor(
      private databaseService: DatabaseService,
      private envConfigService: EnvConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.envConfigService.get('OPENAI_API_KEY')
    });
  }



  async conversationGenerate(conversationGenerateDto: ConversationGenerateDto){
    try {
      const assistantId = this.envConfigService.get('OPENAI_CONVERSATION_ID');

      const thread = await this.openai.beta.threads.create({
        messages: [
          ...splitTextIntoChunks(conversationGenerateDto.prompt, MAX_LENGTH).map(prompt => (
            {
              role: 'user',
              content: prompt
            }
          )) as { role: 'user' | 'assistant', content: string }[],
          ...(conversationGenerateDto.prompt2 && [{
            role: 'user',
            content: conversationGenerateDto.prompt2
          }] as { role: 'user' | 'assistant', content: string }[])

        ],
      })

      const data = await runThread(this.openai, assistantId, thread.id);

      return {
        status: 200,
        data: {
          message: data,
          threadId: thread.id,
          assistantId,
        }
      }
    }catch (error){
      throw new BadRequestException(`Can't generate the conversation`);
    }
  }
  async conversationContinue(conversationContinueDto: ConversationContinueDto){
    try {
      const assistantId = conversationContinueDto.assistantId;
      await this.openai.beta.threads.messages.create(
        conversationContinueDto.threadId,
        { role: 'user', 'content': conversationContinueDto.prompt}
      )

      if(conversationContinueDto.prompt2){
        await this.openai.beta.threads.messages.create(
          conversationContinueDto.threadId,
          { role: 'user', 'content': conversationContinueDto.prompt2}
        )
      }

      const data = await runThread(this.openai, assistantId, conversationContinueDto.threadId);
      return {
        status: 200,
        data: {
          message: data,
        }
      }
    }catch (error){
      throw new BadRequestException(`Can't generate the conversation`);
    }
  }
}
