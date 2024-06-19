import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TranscriptGenerateDto {
    @ApiProperty({ type: String, description: 'Transcript details' })
    @IsString()
    @IsNotEmpty()
    transcript: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
