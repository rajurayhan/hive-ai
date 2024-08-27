import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationService } from '../services/conversation.service';
import { ConversationGenerateDto } from '../dtos/conversation-generate.dto';
import { ConversationContinueDto } from '../dtos/conversation-continue.dto';

@Controller('conversation')
@ApiTags('Conversation')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post('conversation-generate')
    @ApiOperation({ summary: 'conversation-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async transcriptGenerate(
      @Body() conversationGenerateDto: ConversationGenerateDto
    ) {
        return await this.conversationService.conversationGenerate(conversationGenerateDto);

    }

    @Post('conversation-continue')
    @ApiOperation({ summary: 'conversation-continue' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async conversationContinue(
      @Body() conversationContinueDto: ConversationContinueDto
    ) {
        return await this.conversationService.conversationContinue(conversationContinueDto);

    }

}
