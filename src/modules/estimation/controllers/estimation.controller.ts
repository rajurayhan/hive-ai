import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstimationService } from '../services/estimation.service';
import { TranscriptGenerateDto } from '../dtos/transcript-generate.dto';
import { ProblemAndGoalGenerateDto } from '../dtos/problem-and-goal-generate.dto';
import { ScopeOfWorkGenerateDto } from '../dtos/scope-of-work-generate.dto';
import { DeliverablesGenerateDto } from '../dtos/deliverables-generate.dto';
import { TasksGenerateDto } from '../dtos/tasks-generate.dto';

@Controller('estimation')
@ApiTags('Estimation')
export class EstimationController {
    constructor(private readonly estimationService: EstimationService) {}

    @Post('transcript-generate')
    @ApiOperation({ summary: 'transcript-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async transcriptGenerate(
      @Body() transcriptGenerateDto: TranscriptGenerateDto
    ) {
        return await this.estimationService.transcriptGenerate(transcriptGenerateDto);

    }

    @Post('problem-and-goal-generate')
    @ApiOperation({ summary: 'problem-and-goal-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async problemAndGoalGenerate(
      @Body() problemAndGoalGenerateDto: ProblemAndGoalGenerateDto
    ) {
        return await this.estimationService.problemAndGoalGenerate(problemAndGoalGenerateDto);

    }

    @Post('scope-of-works-generate')
    @ApiOperation({ summary: 'scope-of-work-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async scopeOfWorkGenerate(
      @Body() scopeOfWorkGenerateDto: ScopeOfWorkGenerateDto
    ) {
        return await this.estimationService.scopeOfWorkGenerate(scopeOfWorkGenerateDto);

    }

    @Post('deliverables-generate')
    @ApiOperation({ summary: 'deliverables-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async deliverablesGenerate(
      @Body() deliverablesGenerateDto: DeliverablesGenerateDto
    ) {
        return await this.estimationService.deliverablesGenerate(deliverablesGenerateDto);

    }

    @Post('task-generate')
    @ApiOperation({ summary: 'tasks-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async tasksGenerate(
      @Body() tasksGenerateDto: TasksGenerateDto
    ) {
        return await this.estimationService.tasksGenerate(tasksGenerateDto);

    }

}
