
import { AsyncLocalStorage } from 'async_hooks';
import { DATA } from '../../app.js';
import { Question } from '../../logic_scripts.js';
import { QuizSettings, REDIS_KEY } from '../logic.js';
import { redis } from '../redishelpers.js';
import { TimerSettings } from '../../questions/base_question.js';
import { settings } from 'cluster';
export interface MetaData {
  settings?:string;
  isQuestEnd?:string;
  isStop?:string;
  questionsLen?:number;
  isLastQuest?:string;
  questionIndex?:number;
  isTimeout?:string
  timerSettings?:string
  questId?: string;
  isTeamMode?: string 
  teamObject?: string
  
}
export interface RoomMeta {
  settings: QuizSettings;
  timerSettings: TimerSettings;
  isTeamMode: boolean;
  teamObject: Record<string, string>|null;
  questionsLen: number;
  questId: string;
  questIndex: number;
  isQuestEnd: boolean;
  isLastQuest: boolean;
  isStop: boolean;
  isTimeout: boolean;
}
export const quizContext = new AsyncLocalStorage<{ roomId: string; userId: string, metadata:MetaData}>();
export const getUserId=()=>quizContext.getStore()?.userId || '';
export const getRoomId = () => quizContext.getStore()?.roomId || '';
export const getQuestId = () => quizContext.getStore()?.metadata?.questId || '';
export const getSettings = () => JSON.parse(getMetaData()?.settings || '{}') as QuizSettings;
export const getIsTeamMode = () => quizContext.getStore()?.metadata?.isTeamMode || false;
export const getTeamObject = () => JSON.parse(quizContext.getStore()?.metadata?.teamObject?? '{}') || null;
export const getMetaData = ()=> quizContext.getStore()?.metadata ;
export const getAllMetaData=async  (ri:string)=>await redis.hgetall(REDIS_KEY.ROOM(ri));

export const setMetaDataObject = async (data: Record<string, string>) => {
    await redis.hset(REDIS_KEY.ROOM(getRoomId()), data);
}
export function turnQuestToId(questions: Question[]): number[] {
  return questions.map(({ id }) => id);
}
export const boolToStrng = (bool:boolean)=> bool ? 't': 'f';
export const stringToBool = (string:string) => string ==='t';
export async function setMetaData(field:string, value:string|number|boolean){
  await redis.hset(REDIS_KEY.ROOM(getRoomId()), {[field]:value})
}
export function getQuestion(id?: string | number, questions = DATA): Question {

    if(!id)id= getQuestId();
    if (!questions?.at(typeof id === 'string' ? Number(id) : id || 1)) console.error("the thing asked for a id that dont; esxits", id)
    return questions?.at(typeof id === 'string' ? Number(id) : id || 1) || DATA[0];
}

export default quizContext;