import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RetryDto {
    @ApiProperty({ type: String, description: 'Retry' })
    @IsOptional()
    @IsBoolean()
    retry: string;
}
