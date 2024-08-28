import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConversationGenerateDto{
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    prompt: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    prompt2: string;
}
