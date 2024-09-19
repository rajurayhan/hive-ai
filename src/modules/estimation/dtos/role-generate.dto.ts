import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PromptDto } from './prompt.dto';

export class ExistingRoleDto{
    @ApiProperty({ type: String, description: 'Role Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: Number, description: 'Average Hourly Rate' })
    @IsNumber()
    @IsNotEmpty()
    averageHourlyRate: number;
}

export class RoleGenerateDto{
    @ApiProperty({ type: String, description: 'Thread Id' })
    @IsString()
    @IsNotEmpty()
    threadId: string;

    @ApiProperty({ type: String, description: 'assistant Id' })
    @IsString()
    @IsNotEmpty()
    assistantId: string;

    @ApiProperty({ isArray: true, type: ExistingRoleDto })
    @IsArray()
    @ArrayMinSize(1, { message: 'Minimum 1 existing role is required' })
    @IsNotEmpty()
    existingRoles: ExistingRoleDto[];

}