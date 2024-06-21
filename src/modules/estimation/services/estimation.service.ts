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
      console.log('Polling for run status...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds

      const run = await this.openai.beta.threads.runs.retrieve(threadId, runId)
      runStatus = run.status;
    }

    if (runStatus === 'completed' || runStatus === 'incomplete') {
      console.log('Run completed, fetching messages...');

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
      console.log('Run ended with status:', runStatus);
      return null;
    }
  }


  async transcriptGenerate1() {
    try {
      const a= `Josh Wilhelm: I didn't even get a chance to review the notes yet. So I'm looking at those right now.

Marketing Team: You know, we just have few items. More likely on this spreadsheet about this past clients. Yeah. the video for the gym

Josh Wilhelm: So it's going to ask you is it helpful for those notes that I put in from? the notetaker afterwards Yes, yes. It is okay.

Marketing Team: Mmm Yeah It saves a lot of time because I don't have to you know, think about the right wordings because I just have to tweak a little bit for those notes for the AI. So yeah, it's very helpful. So me. I know nadios to me that yeah, it's very helpful.

Josh Wilhelm: So let me show you while we're waiting for Patrick. This is the tool that we're using right now. and if Patrick comes on and I'm still sharing my screen. Just tell me so I can. Sure. stop sharing it, but Okay, so let's take tiny duck. For example. mmm So you can see my screen, right?

Marketing Team: Yes, I can see.

Josh Wilhelm: Okay. The tool that we have that we've been working on raju's been. Doing an excellent job. Is this is the tool here? so the way it works, so just for regular meetings. mmm We have this meeting summary right here. So you just put in some basic information so like for example put in the title. Of the meeting. So this was the one for today, right? So tiny duck by weekly you could even if you wanted to you could take the task name from the meeting agenda. mmm So just take that it doesn't really matter which one we we use but you could put that in there. Okay. And then meeting type would be obviously with a client. And then the click up link that would be for this tasklink right here the meeting agenda. So you copy that. And then this is the recording link. So this link right here for the actual recording. We just take this. And then paste this in here. right Okay. And then all we have to do is click on Save. That's it. So we're gonna have a loader that's gonna be like loading just showing you that it's working in the background right now. We don't have that. It is working in the background. You just you wouldn't know it unless you know what it's doing. but once it's done, it'll come back with a confirmation say like a check mark that says this has been completed and now is is done and I'll show you what that looks like here in a second. So the longer obviously the recording is the longer it takes to produce. You know, what were the summary of The Call? okay. No commands at all. He just have to hit the save button, correct? Correct. Yeah, so there's a couple things that are being worked on right now behind the scenes or that the team's working on. Okay. So see how just a data successfully saved. Okay, so now it's been added to the list. And you see down here at the bottom. It's this last one.

Marketing Team: Oh, yeah.

Josh Wilhelm: So 1221, okay. So right here, they're still working on the styling of it. But if you click on the eyeball. It'll show you the meeting summary within all of the next steps and who's responsible for what and whatever. then if you wanted to edit it, like You know. let's say it's not quite right. So you need to tweak it a little bit. This little pencil icon you click on. And it'll have the message up here. And then what you see on the left side is the part you would edit. So like if I said the meaning began with casual greetings and a brief discussion about let's say Santa. and the holidays notice that it's already updated over here on the right side. So it says the meaning began with yeah. casual greeting about okay, so I can then obviously delete this because So the benefit to this is that when you get down into this part that says what the next steps are. These would be your task, right? So this is where you could add Yes. additional if there was anything missed or you could delete something. Mm-hmm. That's not exactly accurate or whatever you want to do. Once you're done with it, then you can simply just copy over here on the right hand side. So I just select from the very top. Go all the way down and then hit copy on my keyboard. and then I can go right over to the task and say and then I paste it. All right, so notice that it's copied everything over, right?

Marketing Team: Yeah. Mmm.

Josh Wilhelm: So eventually what's going to happen though, just so you're aware Is right now it does not do this, but the team's working on it. Is that when you hit so when you like I showed you the first time you enter in the meeting name you enter in the meeting type as long as you put in a click up link in here and then the recording link. It will automatically add it to the task as a comment. That's cool. So it'll add it immediately as soon as it's done and then that way you Mmm, okay. know, you can it's it's kind of almost instantaneous kind of thing. If let's say we didn't have regular tldv recording. That right now you could put in any transcript information in here and it would do kind of the same thing. But this this allows you to not if Okay. you have the tldv recording link, you don't then have to put in the transcript, you know to copy and paste it. It'll it'll pull it automatically. Got it. Okay. And then this way you can always go Yep. back on to previous meetings. You'll be able to then access them and see what needs to be. modified you know, if you need to edit something on here, then you can but that way we make it a little bit more efficient so that it's it's just a little bit faster easier. So you're not having to do lots of extra steps.

Marketing Team: Got it. this cool

Josh Wilhelm: Yeah, it's pretty cool. So it's it's hopefully going to save us a little bit more time. mmm example And making sure that we get all these items off. right so Yep, so that's that's what we're working with at the moment. So. Um, let's see. Yeah, so we're just working on styling right? So there's some issues with how it looks. It's not exactly perfect, but we'll continue modifying that so that eventually it'll get even better and better and better. So it's in a very rough draft, you know stage right now, but it'll make it faster and easier. for all of us and then the one that we're doing also two is this project sow so it allows us kind of similar to that where we can take the transcript. of the conversation and then we can just automatically turn it into a summary problems and goals project overview scope of work and then deliverables. So it's been a long process in the making but hopefully this will speed things up for all of us. Yes, it will. Let me make sure to grab that link for that. tiny deck one Yeah, I don't it doesn't do proper spacing on the line. So it That's the part bugging me currently, but I know it's gonna get fixed here soon. So. All right. Well, let's go ahead and call it then. And then can you send? Patrick, you know kind of a Merry Yeah, we have. Christmas, you know message and we'll talk to him if he's because we do every week or every other week Within. every week Every week, okay.

Marketing Team: hmm. It's

Josh Wilhelm: Yeah, so maybe ask him what is availability is for next week in that same email. okay. Okay. All right, Anna. I will talk with you later. If I don't talk to you for some reason tomorrow or whatever. Have a Merry Christmas.

Marketing Team: Um, you don't have a meeting with Mike. Sorry tomorrow for days. um Should they be joining? I think I have two but it's all the same. It's like the SG by weekly meeting with Mike and weekly meeting with Mike from the SG. I have those two on my calendar. So I just

Josh Wilhelm: Oh, yeah. No, you don't need to be a part of those so you don't have to worry about them. Yeah. so cool. got it. All right, we'll have a Merry Christmas and if I probably will talk to you sometime next week. I would have guessed but just in case. afterwards Yeah, just after Christmas. So just in case if I don't have a hmm happy New Year as well. Yeah you. And congratulations again on the wedding. I didn't realize you you were already And thank you. married. Yes. so congrats

Marketing Team: Thank you Josh. Appreciate you.

Josh Wilhelm: No problem. Alright, I will talk to you later. Thank you. Thank you. Bye.`
      const prompt = `
          Meeting Summarizer 2.0 specializes in transforming meeting transcripts into organized, clear summaries following a specific format requested by the user. The summaries are structured to include sections for Insights, which capture Call/Meeting Participants, Issues & Risks (with hazard icons), Next Steps/Tasks (detailed with check mark icons, participant names, task titles, context, deliverables, and details), Questions Discussed (with question mark icons), Timeline (with clock icons), and Decisions Made (with exclamation mark icons). Each item within these sections will include a transcript timestamp if available, making it easier for users to reference back to the audio or video recording for further context. The Outline section summarizes the call into topics discussed, with each item related to the topic and transcript times, if available. This format ensures that summaries are comprehensive, easy to navigate, and highlight the most critical aspects of the meetings, including action items, decisions, key points discussed, and timelines, with visual cues for better readability and reference. Here is the formatting and styling to use:

### Insights

**Call/Meeting Participants**
 - {Each participant's name as an individual bullet point}

**Issues & Risks**
 - {hazard icon or emjoi} {Each issue and/or risk mentioned in the call/meeting is separated by a bullet point} - ({Transcript time discussed if available})

**Next Steps / Tasks**
- **{Participants Name}**
    - {check mark icon or emoji} **{Participants Name} will {Task title}** - ({Transcript time of task discussed if available}): {context, deliverables, and details of task}

**Questions Discussed**
 - {question mark icon or emjoi} {Each question mentioned in the call/meeting is separated by a bullet point} - ({Transcript time discussed if available})

**Timeline**
 - {clock mark icon or emjoi} {Each timeline item mentioned in the call/meeting is separated by a bullet point} - ({Transcript time discussed if available})

**Decisions Made**
 - {excalamation mark icon or emjoi} {Each decision mentioned in the call/meeting is separated by a bullet point} - ({Transcript time discussed if available})

### Outline

**{Summarize the call into topics discussed}**
 - {Each item related to the topic mentioned in the call/meeting is separated by a bullet point} - ({Transcript time discussed if available})
          `
      /*const myAssistant = await this.openai.beta.assistants.create({
        instructions:
          "You are an AI assistant that helps people with problem analysis and task estimation.",
        name: "Problem Analyst and Task  Estimator",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-turbo",
      });*/



      /*const thread = await this.openai.beta.threads.create({
        messages: [
          { role: 'assistant', content: prompt},
          { role: 'assistant', 'content': 'You will always return output in markdown format with proper line breaks.'},
          { role: 'user', content: a},
        ]
      })*/
      /*const threadMessages = await this.openai.beta.threads.messages.list(
        "thread_1OBv9w6btfe85RX05dgRnso5"
      );*/
      /*await this.openai.beta.threads.messages.create('thread_1OBv9w6btfe85RX05dgRnso5', {
        role: 'assistant',
        content: `Help me turn the following transcript from a virtual meeting with a potential client into bullet points that address the client's problems and goals. The potential client is looking for help from our company to solve their problems and accomplish their goals with the services we offer. To also help give you some further understanding, eventually, the information you put together will be used in a scope of work that I will work on later.

It should look like the following format, do not use bold styling for any of the bullet points:

###Problems
 - {CLIENT-COMPANY-NAME} {DETAILS OF THE PROBLEMS THAT THE CLIENT DISCUSSED ON OUR CALL/MEETING}


###Goals
 - {CLIENT-COMPANY-NAME} {DETAILS OF THE GOALS THAT THE CLIENT DISCUSSED ON OUR CALL/MEETING}`
      })*/
     /* await this.openai.beta.threads.messages.create('thread_1OBv9w6btfe85RX05dgRnso5', {
        role: 'assistant',
        content: `Help me turn the following transcript from a virtual meeting with a potential client into bullet points that address the client's problems and goals. The potential client is looking for help from our company to solve their problems and accomplish their goals with the services we offer. To also help give you some further understanding, eventually, the information you put together will be used in a scope of work that I will work on later.

It should look like the following format, do not use bold styling for any of the bullet points:

###Problems
 - {CLIENT-COMPANY-NAME} {DETAILS OF THE PROBLEMS THAT THE CLIENT DISCUSSED ON OUR CALL/MEETING}


###Goals
 - {CLIENT-COMPANY-NAME} {DETAILS OF THE GOALS THAT THE CLIENT DISCUSSED ON OUR CALL/MEETING}`
      })*/
       /*await this.openai.beta.threads.messages.create('thread_1OBv9w6btfe85RX05dgRnso5', {
        role: 'assistant',
        content: `I need your help in creating a very detailed bullet list for a scope of work based on the following Problems & Goals bullet list I created before. I need your help in making sure the new scope of work list you will be creating is very detailed and expanded upon as much as you can so we make sure nothing is missed for the project scope. I will end up using what you come up with in a proposal for a potential client who reached out to our company, asking us for help in the form of the services we offer. Be sure to add in quality control and testing items if not already mentioned in the list that I am providing you with. Please feel free to add the additional scope of work points that you think are missing and need to be added based on the main service the client is asking for our help with.`
      })
      const data = await this.runThread('thread_1OBv9w6btfe85RX05dgRnso5');*/
      /*await this.openai.beta.threads.messages.create('thread_1OBv9w6btfe85RX05dgRnso5', {
        role: 'assistant',
        content: `
          I need your help in creating a very detailed bullet list for a scope of work based on the following Problems & Goals bullet list I created before. I need your help in making sure the new scope of work list you will be creating is very detailed and expanded upon as much as you can so we make sure nothing is missed for the project scope. I will end up using what you come up with in a proposal for a potential client who reached out to our company, asking us for help in the form of the services we offer. Be sure to add in quality control and testing items if not already mentioned in the list that I am providing you with. Please feel free to add the additional scope of work points that you think are missing and need to be added based on the main service the client is asking for our help with.
          Generate a JSON response with an array of objects. Each object should have the following fixed structure:
          {
              "title": "scope of work title",
              "details": "Scope of work details"
          }
          Make sure the output structure does not change in each request.
        `,
      },)
      const data = await this.runThread('thread_1OBv9w6btfe85RX05dgRnso5','{ "type": "json_object" }');*/
      const message  = await this.openai.beta.threads.messages.create('thread_1OBv9w6btfe85RX05dgRnso5', {
        role: 'assistant',
        content: `
          I need your help in creating a very detailed bullet list for a scope of work based on the following Problems & Goals bullet list I created before. I need your help in making sure the new scope of work list you will be creating is very detailed and expanded upon as much as you can so we make sure nothing is missed for the project scope. I will end up using what you come up with in a proposal for a potential client who reached out to our company, asking us for help in the form of the services we offer. Be sure to add in quality control and testing items if not already mentioned in the list that I am providing you with. Please feel free to add the additional scope of work points that you think are missing and need to be added based on the main service the client is asking for our help with.
          Generate a JSON response with an array of objects. Each object should have the following fixed structure:
          {
              "title": "scope of work title",
              "details": "Scope of work details"
          }
          Make sure the output structure does not change in each request.
        `,
      },)
      const data = await this.runThread('thread_1OBv9w6btfe85RX05dgRnso5','{ "type": "json_object" }');
      console.log('data',data);

      /*const myAssistants = await this.openai.beta.assistants.list();

      console.log(myAssistants.data);*/


      return {
        data: data
      }
    } catch (error) {
      console.log('error',error);
      //throw new HttpException(error.message, error.status);
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
    console.log('.............',data);
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
