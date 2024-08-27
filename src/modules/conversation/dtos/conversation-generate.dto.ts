import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationGenerateDto{
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
