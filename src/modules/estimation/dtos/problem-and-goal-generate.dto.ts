import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { RetryDto } from './retry.dto';
import { PromptDto } from './prompt.dto';

export class ProblemAndGoalGenerateDto{
    @ApiProperty({ type: String, description: 'Thread Id' })
    @IsString()
    @IsNotEmpty()
    threadId: string;

    @ApiProperty({ type: String, description: 'assistant Id' })
    @IsString()
    @IsNotEmpty()
    assistantId: string;

    @ApiProperty({ isArray: true, type: PromptDto })
    @IsArray()
    @ArrayMinSize(1, { message: 'Minimum 1 prompt is required' })
    @IsNotEmpty()
    prompts: PromptDto[];
}
