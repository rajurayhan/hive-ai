import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RetryDto } from './retry.dto';
import { PromptDto } from './prompt.dto';

export class TasksGenerateDto extends RetryDto{
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

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty()
    problemAndGoalsId: number;

    @ApiProperty({ type: String, description: 'Deliverables title' })
    @IsString()
    @IsNotEmpty()
    deliverableTitle: string;

    @ApiProperty({ type: String, description: 'Deliverables details' })
    @IsString()
    @IsOptional()
    deliverablesDetails: string;

}
