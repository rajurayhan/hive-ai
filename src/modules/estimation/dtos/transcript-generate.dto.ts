import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RetryDto } from './retry.dto';

export class TranscriptGenerateDto extends RetryDto{
    @ApiProperty({ type: String, description: 'Transcript details', isArray: true })
    @IsString({each: true})
    @IsArray()
    @IsNotEmpty()
    transcripts: string[];

    @ApiProperty({ type: String })
    @IsString({each: true})
    @IsArray()
    @IsNotEmpty()
    prompts: string[];
}
