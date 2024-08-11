import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { PromptDto } from './prompt.dto';

export class TranscriptGenerateDto{
    @ApiProperty({ type: String, description: 'Transcript details', isArray: true })
    @IsString({each: true})
    @IsArray()
    @IsNotEmpty()
    transcripts: string[];

    @ApiProperty({ isArray: true, type: PromptDto })
    @IsArray()
    @ArrayMinSize(1, { message: 'Minimum 1 prompt is required' })
    @IsNotEmpty()
    prompts: PromptDto[];
}
