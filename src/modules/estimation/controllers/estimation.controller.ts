import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstimationService } from '../services/estimation.service';
import { TranscriptGenerateDto } from '../dtos/transcript-generate.dto';
import { ProblemAndGoalGenerateDto } from '../dtos/problem-and-goal-generate.dto';
import { ScopeOfWorkGenerateDto } from '../dtos/scope-of-work-generate.dto';
import { DeliverablesGenerateDto } from '../dtos/deliverables-generate.dto';
import { TasksGenerateDto } from '../dtos/tasks-generate.dto';
import { PhaseGenerateDto } from '../dtos/phase-generate.dto';
import { ProjectOverviewGenerateDto } from '../dtos/project-overview-generate.dto';
import { MeetingSummeryGenerateDto } from '../dtos/meeting-summery-generate.dto';
import { RoleGenerateDto } from '../dtos/role-generate.dto';

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

    @Post('meeting-summery-generate')
    @ApiOperation({ summary: 'meeting-summery-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async meetingSummeryGenerate(
      @Body() meetingSummeryGenerateDto: MeetingSummeryGenerateDto
    ) {
        return await this.estimationService.meetingSummeryGenerate(meetingSummeryGenerateDto);

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

    @Post('project-overview-generate')
    @ApiOperation({ summary: 'project-overview-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async projectOverviewGenerate(
      @Body() projectOverviewGenerateDto: ProjectOverviewGenerateDto
    ) {
        return await this.estimationService.projectOverviewGenerate(projectOverviewGenerateDto);

    }

    @Post('phase-generate')
    @ApiOperation({ summary: 'phase-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async phasesGenerate(
      @Body() phaseGenerateDto: PhaseGenerateDto
    ) {
        return await this.estimationService.phasesGenerate(phaseGenerateDto);

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

    @Post('role-generate')
    @ApiOperation({ summary: 'role-generate' })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async roleGenerate(
      @Body() roleGenerateDto: RoleGenerateDto
    ) {
      return await this.estimationService.roleGenerate(roleGenerateDto);

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
