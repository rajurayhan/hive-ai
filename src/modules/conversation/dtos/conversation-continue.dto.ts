import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConversationContinueDto{
    @ApiProperty({ type: String, description: 'assistant Id' })
    @IsString()
    @IsNotEmpty()
    assistantId: string;

    @ApiProperty({ type: String, description: 'Thread Id' })
    @IsString()
    @IsNotEmpty()
    threadId: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsNotEmpty()
    prompt: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    prompt2: string;
}
