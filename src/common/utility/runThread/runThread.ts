import * as AssistantsAPI from 'openai/src/resources/beta/assistants';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export async function runThread(openai, assistantId: string , threadId: string, jsonResponse?: {
  tools: Array<AssistantsAPI.AssistantTool>,
  response_format: z.infer<any>
  key_name: string
}) {
  if (!threadId) {
    throw new Error('Thread ID is undefined or invalid');
  }

  const stream = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    stream: true,
    model: 'gpt-4o-2024-08-06',
    ...(jsonResponse && {
      response_format: zodResponseFormat(jsonResponse.response_format as any, jsonResponse.key_name),
      tools: jsonResponse.tools,
    })
  })
  let result = jsonResponse? [] : '' ;
  for await (const event of stream) {
    if(event.event === 'thread.message.completed' && event.data.object=== 'thread.message'){
      if(jsonResponse && Array.isArray(result)){
        result.push(
          ...event.data.content.flatMap((content)=>{
            if(content.type === 'text'){
              console.log('content.text.value',content.text.value);
              return JSON.parse(content.text.value)[jsonResponse.key_name];
            }
            return []
          })
        );

      }else{
        result = result + event.data.content.reduce((accue,content)=>{
          if(content.type === 'text'){
            return accue + content.text.value;
          }
          return accue
        },'')

      }
    }
  }
  return result;
}
