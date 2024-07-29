import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RetryDto } from './retry.dto';

export class TranscriptGenerateDto extends RetryDto{
    @ApiProperty({ type: String, description: 'Transcript details' })
    @IsString()
    @IsNotEmpty()
    transcript: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
