import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PromptDto{
    @ApiProperty({ type: String, description: 'Action type' })
    @IsString()
    @IsNotEmpty()
    action_type: string;

    @ApiProperty({ type: String, description: 'Prompt' })
    @IsString()
    @IsNotEmpty()
    prompt_text: string;
}
