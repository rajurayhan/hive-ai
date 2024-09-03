import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../common/services/database.service';
import OpenAI from 'openai';
import { z } from 'zod';

import { TranscriptGenerateDto } from '../dtos/transcript-generate.dto';
import { EnvConfigService } from '../../../common/services/env-config.service';
import { ProblemAndGoalGenerateDto } from '../dtos/problem-and-goal-generate.dto';
import { ScopeOfWorkGenerateDto } from '../dtos/scope-of-work-generate.dto';
import { DeliverablesGenerateDto } from '../dtos/deliverables-generate.dto';
import { TasksGenerateDto } from '../dtos/tasks-generate.dto';
import { PhaseGenerateDto } from '../dtos/phase-generate.dto';
import { runThread } from '../../../common/utility';
import { ProjectOverviewGenerateDto } from '../dtos/project-overview-generate.dto';

const PhasesResponse =   z.object({
    phases: z.array(
      z.object({
        title: z.string(),
        details: z.string(),
      })
    ),
  });

const SOWResponse =   z.object({
    phaseTitle: z.string(),
    sowList: z.array(
      z.object({
        title: z.string(),
        details: z.string(),
      })
    ),
  });

const DeliverableResponse =   z.object({
    sowTitle: z.string(),
    deliverables: z.array(
      z.object({
        title: z.string(),
        details: z.string(),
      })
    ),
  });

const TaskResponse =   z.object({
    deliverableTitle: z.string(),
    tasks: z.array(
      z.object({
        title: z.string(),
        estimated_hours: z.number(),
        cost: z.number(),
        duration: z.number(),
        duration_length: z.number(),
        details: z.string(),
        sub_tasks: z.array(
          z.object({
            title: z.string(),
            estimated_hours: z.number(),
            hourly_rate: z.number(),
            cost: z.number(),
            duration: z.number(),
            duration_length: z.number(),
            details: z.string(),
            role: z.string(),
          })
        )
      })
    ),
  });

@Injectable()
export class EstimationService {
  private openai: OpenAI;
  constructor(
      private databaseService: DatabaseService,
      private envConfigService: EnvConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.envConfigService.get('OPENAI_API_KEY')
    });
  }
  
  async transcriptGenerate(transcriptGenerateDto: TranscriptGenerateDto){
    try {
      const assistantId = this.envConfigService.get('OPENAI_ASSISTANT_ID')

      const userInput = transcriptGenerateDto.transcripts.reduce((acc, value, index)=>{
        if(transcriptGenerateDto.transcripts.length > 1){
          return [...acc, { role: 'user', content: `I am sending you my transcript with multiple steps. STEP-${index} ${value}`}];
        }else{
          return [{ role: 'user', content: value}];
        }
      },[])

      const thread = await this.openai.beta.threads.create({
        messages: userInput
      })

      const output = [];
      for (const prompt of transcriptGenerateDto.prompts) {
        await this.openai.beta.threads.messages.create(
          thread.id,
          { role: 'assistant', 'content': prompt.prompt_text},
        )
        if(prompt.action_type === 'expected-output') {
          await this.openai.beta.threads.messages.create(
            thread.id,
            { role: 'assistant', 'content': prompt.prompt_text}
          )
          const data = await runThread(this.openai, assistantId, thread.id);
          output.push(data)
        }
      }

      return {
        status: 200,
        data: {
          summery: output.join('\n'),
          threadId: thread.id,
          assistantId,
        }
      }
    }catch (error){
      console.error('transcriptGenerate.error: ',error);
    }
  }

  async problemAndGoalGenerate(problemAndGoalGenerateDto: ProblemAndGoalGenerateDto){
    try{
      const output = [];
      for (const prompt of problemAndGoalGenerateDto.prompts) {
        await this.openai.beta.threads.messages.create(
          problemAndGoalGenerateDto.threadId,
          { role: 'assistant', 'content': prompt.prompt_text}
        )
        if(prompt.action_type === 'expected-output') {
          const data = await runThread(this.openai, problemAndGoalGenerateDto.assistantId, problemAndGoalGenerateDto.threadId);
          output.push(data)
        }
      }

      return {
        status: 200,
        data: {
          problemAndGoals: output.join('\n'),
        }
      }
    }catch (error){
      console.error('problemAndGoalGenerate.error: ',error);
    }
  }
  async projectOverviewGenerate(projectOverviewGenerateDto: ProjectOverviewGenerateDto){
    try{
      const output = [];
      for (const prompt of projectOverviewGenerateDto.prompts) {
        await this.openai.beta.threads.messages.create(
          projectOverviewGenerateDto.threadId,
          { role: 'assistant', 'content': prompt.prompt_text}
        )
        if(prompt.action_type === 'expected-output') {
          const data = await runThread(this.openai, projectOverviewGenerateDto.assistantId, projectOverviewGenerateDto.threadId);
          output.push(data)
        }
      }

      return {
        status: 200,
        data: {
          projectOverview: output.join('\n'),
        }
      }
    }catch (error){
      console.error('problemAndGoalGenerate.error: ',error);
    }
  }

  async phasesGenerate(phaseGenerateDto: PhaseGenerateDto){
    try{
      const result = []
      for(const prompt of phaseGenerateDto.prompts){
        if(prompt.action_type === 'expected-output') {
          await this.openai.beta.threads.messages.create(
            phaseGenerateDto.threadId,
            { role: 'assistant', 'content': prompt.prompt_text}
          );
          const data =  await runThread(this.openai, phaseGenerateDto.assistantId, phaseGenerateDto.threadId, {
            key_name: 'phases',
            tools: [],
            response_format: PhasesResponse
          });
          result.push(...data);
        }else{
          await this.openai.beta.threads.messages.create(
            phaseGenerateDto.threadId,
            { role: 'assistant', 'content': prompt.prompt_text}
          );
        }
      }

      return {
        status: 200,
        data: {
          phases: result,
        }
      }
    }catch (e){
      console.log('phasesGenerate.error',e);
    }
  }

  async scopeOfWorkGenerate(scopeOfWorkGenerateDto: ScopeOfWorkGenerateDto){
    try{
      const phases = await this.databaseService.phase.find({
        where: {
          problemGoalID: scopeOfWorkGenerateDto.problemAndGoalsId,
          isChecked: 1
        }
      });


      const phaseData = phases.map((phase)=>({
        phaseId: Number(phase.id),
        title: phase.title,
        details: phase.details
      }));
      await this.openai.beta.threads.messages.create(
        scopeOfWorkGenerateDto.threadId,
        { role: 'user', 'content': `I am sending you my phase list: ${JSON.stringify(phaseData)}.`}
      )

      const result = []
      for(const prompt of scopeOfWorkGenerateDto.prompts){
        if(prompt.action_type === 'expected-output') {
          await this.openai.beta.threads.messages.create(
            scopeOfWorkGenerateDto.threadId,
            { role: 'assistant', 'content': `
              ${prompt.prompt_text}.
              My Phase is: 
                title: ${scopeOfWorkGenerateDto.phaseTitle},
                ${scopeOfWorkGenerateDto.phaseDetails? `details: ${scopeOfWorkGenerateDto.phaseDetails}.`:''}
              You have to create SOW list for the phase.
              Use the following JSON formatting:
                {
                    "phaseTitle" : "INSERT THE PHASE TITLE HERE",
                    "sowList" : [
                        {
                            "title" : "SOW-to-the-point-title-GOES-HERE: SOW-descriptive-title-GOES-HERE", 
                            "details" : "Describe the SOW"
                        }, 
                    ]
                }
            `}
          )
          let data = await runThread(this.openai, scopeOfWorkGenerateDto.assistantId, scopeOfWorkGenerateDto.threadId, {
            key_name: 'sowList',
            tools: [],
            response_format: SOWResponse
          });
          result.push(...data);
        }else{
          await this.openai.beta.threads.messages.create(
            scopeOfWorkGenerateDto.threadId,
            { role: 'assistant', 'content': prompt.prompt_text}
          );
        }
      }
      return {
        status: 200,
        data: {
          scopeOfWork: result,
        }
      }
    }catch (e){
      console.log('scopeOfWorkGenerate.e',e);
    }
  }

  async deliverablesGenerate(deliverablesGenerateDto: DeliverablesGenerateDto){
    try{
      const result = []
      for(const prompt of deliverablesGenerateDto.prompts){
        if(prompt.action_type !== 'expected-output') {
          await this.openai.beta.threads.messages.create(
            deliverablesGenerateDto.threadId,
            { role: 'assistant', 'content': `${prompt.prompt_text}`}
          )
        }else{
          await this.openai.beta.threads.messages.create(
            deliverablesGenerateDto.threadId,
            { role: 'assistant', 'content': `
              ${prompt.prompt_text}.
              My SOW is: 
                title: ${deliverablesGenerateDto.sowTitle},
                ${deliverablesGenerateDto.sowDetails? `details: ${deliverablesGenerateDto.sowDetails}.`:''}
              You have to create deliverable list for the SOW.
              Use the following JSON formatting:
                {
                    "sowTitle" : "INSERT THE SOW TITLE HERE",
                    "deliverables" : [
                        {
                            "title" : "DELIVERABLE-title-1-for-SOW-title-1-GOES-HERE: DELIVERABLE-descriptive-title-1-GOES-HERE. Responsible: TEAM-OR-TEAMS-RESPONSIBLE-GOES-HERE", 
                            "details" : "Describe the deliverable"
                        }, 
                    ]
                }
          `}
          )

          let data = await runThread(this.openai, deliverablesGenerateDto.assistantId, deliverablesGenerateDto.threadId, {
            key_name: 'deliverables',
            tools: [],
            response_format: DeliverableResponse
          });
          result.push(...data)
        }

      }

      return {
        status: 200,
        data: {
          deliverables: result,
        }
      }
    }catch (e){
      console.log('deliverablesGenerate.e',e);
    }
  }

  async tasksGenerate(tasksGenerateDto: TasksGenerateDto){
    try{
      const result = []
      for(const prompt of tasksGenerateDto.prompts){
        if(prompt.action_type !== 'expected-output') {
          await this.openai.beta.threads.messages.create(
            tasksGenerateDto.threadId,
            { role: 'assistant', 'content': prompt.prompt_text }
          )
        }else {
          await this.openai.beta.threads.messages.create(
            tasksGenerateDto.threadId,
            {
              role: 'assistant', 'content': `
              ${prompt.prompt_text}.
              My deliverable is: 
                title: ${tasksGenerateDto.deliverableTitle},
                ${tasksGenerateDto.deliverablesDetails? `details: ${tasksGenerateDto.deliverablesDetails}.`:''}
              You have to create multiple Task list and multiple subtask list for the deliverable.
              Use the following JSON formatting:
                {
                    "deliverableTitle" : "INSERT THE DELIVERABLE TITLE HERE",
                    "tasks" : [
                        {
                            "title" : "ParentTask-Title-GOES-HERE", 
                            "estimated_hours" : ESTIMATED-TOTAL-AMOUNT-OF-HOURS-TO-COMPLETE-THE-PARENT-INCLUDING-ESTIMATED-TIME-OF-SUBTASKS-OF-THE-PARENT-TASK-TASK-GOES-HERE-EXCLUDING-ANY-SYMBOLS-ONLY-NUMBERS-AND-DECIMALS-ONLY, 
                            "cost" : ESTIMATED-TOTAL-SUMMED-AMOUNT-OF-TIME-TO-COMPLETE-THE-PARENT-INCLUDING-ESTIMATED-TIME-OF-SUBTASKS-OF-THE-PARENT-TASK-TASK-GOES-HERE-EXCLUDING-ANY-SYMBOLS-ONLY-NUMBERS-AND-DECIMALS-ONLY, 
                            "duration" : “HOW-MANY-DAYS-OR-WEEKS-TO-COMPLETE-THE-PARTICULAR-PARENT-TASK-IN-TOTAL-IF-LESS-THAN-A-WEEK-ONLY-GIVE-HOW-MANY-BUSINESS-DAYS-BUT-ONLY-SHOW-DAYS-IF-THAT'S-THE-CASE-GOES-HERE”,
                            "duration_length" : “DAYS-OR-WEEKS-TITLE-GOES-HERE-IF-ONE-THEN-USE-SINGULAR-IF-MORE-THAN-ONE-USE-PLURAL”, 
                            "details" : "ParentTask-DESCRIPTION-GOES-HERE",
                            "sub_tasks" : [
                                {
                                    "title" : "SubTask-for-ParentTask-GOES-HERE", 
                                    "estimated_hours" : ESTIMATED-TOTAL-AMOUNT-OF-HOURS-TO-COMPLETE-THE-SUBTASK-GOES-HERE-EXCLUDING-ANY-SYMBOLS-ONLY-NUMBERS-AND-DECIMALS-ONLY, 
                                    "hourly_rate" : AVERAGE-HOURLY-RATE-OF-YOUR-SUGGESTED-ROLE-TO-COMPLETE-THIS-SUBTASK-GOES-HERE-EXCLUDING-ANY-SYMBOLS-ONLY-NUMBERS-AND-DECIMALS-ONLY, 
                                    "cost" : ESTIMATED-TOTAL-AMOUNT-OF-TIME/HOURS-TO-COMPLETE-THE-SUBTASK-MULTIPLIED-BY-THE-AVERAGE-HOURLY-RATE-OF-YOUR-SUGGESTED-ROLE-TO-COMPLETE-THIS-SUBTASK-GOES-HERE-EXCLUDING-ANY-SYMBOLS-ONLY-NUMBERS-AND-DECIMALS-ONLY, 
                                    "duration" : “NUMBER-OF-HOW-MANY-DAYS-OR-WEEKS-TO-COMPLETE-THE-PARTICULAR-SUBTASK-IN-TOTAL-IF-LESS-THAN-A-WEEK-ONLY-GIVE-HOW-MANY-BUSINESS-DAYS-BUT-ONLY-SHOW-DAYS-IF-THAT'S-THE-CASE-GOES-HERE”,
                                    "duration_length" : “DAYS-OR-WEEKS-TITLE-GOES-HERE-IF-ONE-THEN-USE-SINGULAR-IF-MORE-THAN-ONE-USE-PLURAL”,
                                    "details" : "SubTask-FOR-PARENT-TASK-VERY-DETAILED-DESCRIPTION-SO-THE-TEAM-KNOWS-WHAT-TO-COMPLETE-GOES-HERE",
                                    "role" : “SUGGESTED-ROLE-THAT-SHOULD-COMPLETE-THE-SUBTASK-GOES-HERE",
                                }
                            ]
                        }
                        ...other's task
                    ]
                }
            `}
          )
          let data = await runThread(this.openai, tasksGenerateDto.assistantId, tasksGenerateDto.threadId, {
            key_name: 'tasks',
            tools: [],
            response_format: TaskResponse
          });
          result.push(...data)
        }
      }

      return {
        status: 200,
        data: {
          tasks: result,
        }
      }
    }catch (e){
      console.log('tasksGenerate.e',e);
    }
  }
}
