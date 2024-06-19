import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProblemAndGoalGenerateDto {
    @ApiProperty({ type: String, description: 'Thread Id' })
    @IsString()
    @IsNotEmpty()
    threadId: string;

    @ApiProperty({ type: String, description: 'assistant Id' })
    @IsString()
    @IsNotEmpty()
    assistantId: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
