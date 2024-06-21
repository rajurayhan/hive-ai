import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../common/services/database.service';
import OpenAI from 'openai';
import { TranscriptGenerateDto } from '../dtos/transcript-generate.dto';
import { EnvConfigService } from '../../../common/services/env-config.service';
import { ProblemAndGoalGenerateDto } from '../dtos/problem-and-goal-generate.dto';
import { ScopeOfWorkGenerateDto } from '../dtos/scope-of-work-generate.dto';
import { DeliverablesGenerateDto } from '../dtos/deliverables-generate.dto';
import { chunkArray } from '../../../common/functions';
import { IsNull } from 'typeorm';
import { TasksGenerateDto } from '../dtos/tasks-generate.dto';


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

  async runThread(assistantId: string , threadId: string, response_format?: string) {
    if (!threadId) {
      throw new Error('Thread ID is undefined or invalid');
    }



    const runCreate = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      model: 'gpt-4o',
      ...( response_format && { response_format: {
          type: 'json_object'
        },
        tools: [],
      } )
    })

    runCreate.status
    const runId = runCreate.id;

    let runStatus = runCreate.status;
    while (runStatus === 'queued' || runStatus === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds

      const run = await this.openai.beta.threads.runs.retrieve(threadId, runId)
      runStatus = run.status;
    }

    if (runStatus === 'completed' || runStatus === 'incomplete') {

      const messagesData = await this.openai.beta.threads.messages.list(threadId,{
        run_id: runId
      })
      if(response_format){
        return messagesData.data
          .filter((msg: { role: string; }) => msg.role === 'assistant')
          .reduce((accu, msg) => {
            const message = msg.content.reduce((contentAccu: [], content: any) => {
              try {
                const jsonData = JSON.parse(content.text?.value);
                if (Array.isArray(jsonData)) {
                  return [...contentAccu, ...jsonData];
                } else {
                  const keys = Object.keys(jsonData);
                  if (keys.length === 0) return contentAccu
                  return [...contentAccu, ...jsonData[keys[0]]];
                }
              } catch {
                return contentAccu
              }
            }, [])
            return [...accu, ...message];
          }, []);

      }else{
        return messagesData.data.filter((msg: { role: string; }) => msg.role === 'assistant')
          .map((msg: any) => msg.content.map((content: { text: { value: any; }; }) => content.text?.value).join(' '))
          .join('\n');
      }
    } else {
      return null;
    }
  }

  async transcriptGenerate(transcriptGenerateDto: TranscriptGenerateDto){
    const assistantId = this.envConfigService.get('OPENAI_ASSISTANT_ID')
    const thread = await this.openai.beta.threads.create({
      messages: [
        { role: 'user', content: transcriptGenerateDto.transcript},
        { role: 'assistant', content: transcriptGenerateDto.prompt},
        { role: 'assistant', 'content': 'You will always return output in markdown format with proper line breaks.'},
      ]
    })
    const data = await this.runThread(assistantId, thread.id);
    return {
      status: 200,
      data: {
        summery: data,
        threadId: thread.id,
        assistantId,
      }
    }
  }

  async problemAndGoalGenerate(problemAndGoalGenerateDto: ProblemAndGoalGenerateDto){
    await this.openai.beta.threads.messages.create(
      problemAndGoalGenerateDto.threadId,
      { role: 'assistant', 'content': problemAndGoalGenerateDto.prompt}
    )
    await this.openai.beta.threads.messages.create(
      problemAndGoalGenerateDto.threadId,
      { role: 'assistant', 'content': 'You will always return output in markdown format with proper line breaks.'}
    )
    const data = await this.runThread(problemAndGoalGenerateDto.assistantId, problemAndGoalGenerateDto.threadId);
    return {
      status: 200,
      data: {
        problemAndGoals: data,
      }
    }
  }
  async scopeOfWorkGenerate(scopeOfWorkGenerateDto: ScopeOfWorkGenerateDto){
    try{
      const serviceScopes = await this.databaseService.serviceScopeRepo.find({
        where: {
          serviceId: scopeOfWorkGenerateDto.serviceId
        }
      });
      const serviceScopesJson = JSON.stringify(serviceScopes.map(scope=>({
        scopeId: scope.id,
        title: String(scope.name).replace(/<\/?[^>]+(>|$)/g, ""),
      })));

      await this.openai.beta.threads.messages.create(
        scopeOfWorkGenerateDto.threadId,
        { role: 'assistant', 'content': scopeOfWorkGenerateDto.prompt}
      )
      await this.openai.beta.threads.messages.create(
        scopeOfWorkGenerateDto.threadId,
        { role: 'user', 'content': `My existing scope of work list is: ${serviceScopesJson}. You need to create a new scope of work list without my list.`}
      )
      await this.openai.beta.threads.messages.create(
        scopeOfWorkGenerateDto.threadId,
        { role: 'assistant', 'content': `
        Generate a JSON response with an array of objects. Each object should have the following fixed structure:
        [
          {
              "title": "scope of work title (String)",
              "details": "Scope of work detail (String)"
          },
          write other's
        ]
        Make sure the output structure does not change in each request.
      `}
      )
      const data = await this.runThread(scopeOfWorkGenerateDto.assistantId, scopeOfWorkGenerateDto.threadId, '{ "type": "json_object" }');
      return {
        status: 200,
        data: {
          scopeOfWork: data,
        }
      }
    }catch (e){
      console.log('e',e);
    }
  }

  async deliverablesGenerate(deliverablesGenerateDto: DeliverablesGenerateDto){
    try{
      const scopeOfWorks = await this.databaseService.scopeOfWork.find({
        where: {
          problemGoalID: deliverablesGenerateDto.problemAndGoalsId,
          serviceScopeId: IsNull()
        }
      });
      const scopeOfWorkChunk = chunkArray(scopeOfWorks, 20);
      for(let i = 0; i < scopeOfWorkChunk.length; i += scopeOfWorkChunk.length) {
        const scopes= scopeOfWorkChunk[i];
        const scopeData = scopes.map((scope)=>({
          scopeOfWorkId:scope.id,
          title:scope.title,
          scopeText: scope.scopeText
        }));
        await this.openai.beta.threads.messages.create(
          deliverablesGenerateDto.threadId,
          { role: 'user', 'content': `${i===0?`I am sending you my scope of work list with multiple steps. STEP-${i+1}`:'I am sending you my scope of work list'} : ${JSON.stringify(scopeData)}.`}
        )
      }
      await this.openai.beta.threads.messages.create(
        deliverablesGenerateDto.threadId,
        { role: 'assistant', 'content': `${deliverablesGenerateDto.prompt}. You need to create multiple deliverable list for each scope of work`}
      )

      await this.openai.beta.threads.messages.create(
        deliverablesGenerateDto.threadId,
        { role: 'assistant', 'content': `
        Return a single list of JSON objects with the structure. Each object should have the following fixed structure:
        [
          {
              "scopeOfWorkId": "Scope of work id",
              "title": "Deliverable title (String)",
              "details": "Deliverable detail (String)"
          },
          write other's
        ]
        Make sure the output structure does not change in each request.
      `}
      )
      const deliverables = await this.runThread(deliverablesGenerateDto.assistantId, deliverablesGenerateDto.threadId, '{ "type": "json_object" }');
      return {
        status: 200,
        data: {
          deliverables: (deliverables as any[]).map(deliverable=>({
            ...deliverable,
            scopeOfWorkId: Number(String(deliverable.scopeOfWorkId).split('-')[0]),
          }))
          ,
        }
      }
    }catch (e){
      console.log('e',e);
    }
  }

  async tasksGenerate(tasksGenerateDto: TasksGenerateDto){
    try{
      const deliverables = await this.databaseService.deliverableRepo.find({
        where: {
          problemGoalId: tasksGenerateDto.problemAndGoalsId,
          serviceScopeId: IsNull()
        }
      });
      const deliverablesChunk = chunkArray(deliverables, 20);
      for(let i = 0; i < deliverablesChunk.length; i += deliverablesChunk.length) {
        const deliverable= deliverablesChunk[i];
        const deliverableData = deliverable.map((deliverable)=>({
          deliverableId:deliverable.id,
          title:deliverable.title,
          details: deliverable.deliverablesText
        }));
        await this.openai.beta.threads.messages.create(
          tasksGenerateDto.threadId,
          { role: 'user', 'content': `${i===0?`I am sending you my deliverable list with multiple steps. STEP-${i+1}`:'I am sending you my scope of work list'} : ${JSON.stringify(deliverableData)}.`}
        )
      }
      await this.openai.beta.threads.messages.create(
        tasksGenerateDto.threadId,
        { role: 'assistant', 'content': `${tasksGenerateDto.prompt}. You need to create multiple tasks and subtasks list for each deliverable`}
      )

      await this.openai.beta.threads.messages.create(
        tasksGenerateDto.threadId,
        { role: 'assistant', 'content': `
        Return a single list of JSON objects with the structure. Each object should have the following fixed structure:
        [
          {
              "deliverableId": "deliverable id",
              "title": "Task title (String)",
              "subTasks": ["Sub Task 1 (String)", "Sub Task 2(String)", "Sub Task.... N"]
          },
          write other's
        ]
        Make sure the output structure does not change in each request.
      `}
      )
      const tasks = await this.runThread(tasksGenerateDto.assistantId, tasksGenerateDto.threadId, '{ "type": "json_object" }');
      return {
        status: 200,
        data: {
          tasks: (tasks as any[]).map(task=>({
            ...task,
            deliverableId: Number(String(task.deliverableId).split('-')[0]),
          }))
          ,
        }
      }
    }catch (e){
      console.log('e',e);
    }
  }
}
