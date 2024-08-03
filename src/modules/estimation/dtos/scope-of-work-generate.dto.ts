import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RetryDto } from './retry.dto';

export class ScopeOfWorkGenerateDto extends RetryDto{
    @ApiProperty({ type: String, description: 'Thread Id' })
    @IsString()
    @IsNotEmpty()
    threadId: string;

    @ApiProperty({ type: String, description: 'assistant Id' })
    @IsString()
    @IsNotEmpty()
    assistantId: string;

    @ApiProperty({ type: String, isArray: true })
    @IsString({each: true})
    @IsArray()
    @IsNotEmpty()
    prompts: string[];

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty()
    serviceId: number;

}
