import {Redis} from 'ioredis';
import { EventEmitter } from 'events';
import { QuizManager , ManagerOptions, quizEvents} from './redishelpers.js';
import {
    REDIS_KEY,
    QUESTION_STATUS,
    USER_STATES,
    RoomData,
    QuizSettings,
    Question,
    ROOM_STATES,
    Options,
    UserUpdate
} from '../types.js';
import { Quiz } from './quiz.js';
import { resolve } from 'dns';
import quizContext, { getAllMetaData, getMetaData } from '../../Bible-Quizzing-App/apps/server/src/config/utils/quizCotexnt.js';

export interface QuizConfig extends ManagerOptions{
   roomId:string;
   teamObject?: Record<string, string>|null;// if null then it will a regular game. Team mode will be set to true if teamObject is provided
   bots?:string[];
   timerSettings: Record<string, any>;
   settings: QuizSettings;
   questions?: Question[];
}
export const SERVER_CHANNELS = {    
    QUIZ:(ri:string)=> 'server:'+REDIS_KEY.ROOM(ri)+':quiz',
    AI_ROOM: REDIS_KEY.AI_ROOM('*'),
    USER_PROFILE: REDIS_KEY.USER_PROFILE('*'),
    QUIZ_INIT:(ri:string) =>'server:' + REDIS_KEY.ROOM(ri) + ':init',
    QUIZ_START: (ri: string) => 'server:' + REDIS_KEY.ROOM(ri) + ':start',
    QUIZ_LOAD: (ri: string) => 'server:' + REDIS_KEY.ROOM(ri) + ':load',
};
 
export const PATTERNS = {
    QUIZ: 'server:'+REDIS_KEY.ROOM('*')+':quiz',
    AI_ROOM: REDIS_KEY.AI_ROOM('*'),
    USER_PROFILE: REDIS_KEY.USER_PROFILE('*'),
    QUIZ_INIT: 'server:' + REDIS_KEY.ROOM('*') + ':init',// this starts creating the questions
    QUIZ_START: "server:"+ REDIS_KEY.ROOM('*') + ':start',
    QUIZ_LOAD: 'server:'+ REDIS_KEY.ROOM('*') + ':load'
};
// ============================================================================
// 1. REDIS EXTRAS
// Contains connection/rate-limiting logic not strictly needed for core Quiz loop
// ============================================================================


// ============================================================================
// 2. QUIZ REDIS BASE
// Handles the dedicated pub/sub client and communication for the Quiz
// ============================================================================
export type QuizLoadStatus = 'ready'| 'loading'| 'none'
export interface ExtraMsgData { roomId:string;
     channel?:string; pattern?:string;
     }
// ============================================================================
// 3. QUIZ CLASS
// Core game logic that extends our optimized Redis Base
// ============================================================================
const GlobalQuiz = new Quiz();
export class QuizServer extends QuizManager  {
  
 
   

    constructor(config:QuizConfig) {
        super(config);
       
     
    }

    // this set all the patterns the server can listen to and the logic behind them. It also handles the main game loop and the main game logic. It is a bit of a mess but it works for now. I will refactor it later.
async init(): Promise<void> {
    await this.sub.psubscribe(PATTERNS.QUIZ, async (chan: string, msg: Record<string, any>, { roomId, channel, pattern }:ExtraMsgData) => {
        const metadata = await  getAllMetaData(roomId);
        quizContext.run({roomId, userId:msg.userId as string, metadata  }, async () => {
            this.updateFontend(msg.payload.update || 'quiz', msg.payload, msg.payload.isChar);
            if (Array.isArray(msg?.payload)) return;
           
            try { 
                if (msg.payload.last) {
                   
                    console.warn('Returning early: last user message received.');
                    return;
                }

               
                delete msg.payload.update;

                if (msg.payload.status === 'DESTROYED') {
                    console.warn('Room destroyed, cleaning up...');
                    await GlobalQuiz.destroy(roomId);
                    return;
                }

                if (!msg.payload.start && !msg.payload.answer && !msg.payload.jumpTime) {
                    return; // Ignore messages without required payload keys
                }

                let username = '';
                const [key, value] = Object.entries(msg?.payload).filter(([k, v]) => {
                    if (k === 'username') {
                        username = v as string;
                        return false;
                    }
                    return true;
                })[0] || [];

                if (!username || !key || value === undefined) {
                    return;
                }

                switch (key) {
                    case 'answer':
                        console.log(value)
                        await GlobalQuiz.handleAnswerRequest(value as string);
                        break;
                    case 'jumpTime':
                        await GlobalQuiz.handleJumpRequest();
                        break;
                    default:
                        break;
                }
            } catch (e) {
                console.error('Error in quiz listener:', e);
            }
        });
        });
        await this.sub.psubscribe(PATTERNS.QUIZ_START, async (chan: string, msg: Record<string, any>, {roomId}:ExtraMsgData) => {
            const readyFlag:QuizLoadStatus = await  (this.store.get(REDIS_KEY.QUESTIONS_LOADED_FLAG(roomId)) || 'none') as QuizLoadStatus 
          
            
           if(readyFlag === 'ready'){
 
           }else if (readyFlag === 'loading'){
               await new Promise(resolve => quizEvents.once('load:' + roomId,resolve))
           };
           GlobalQuiz.startQuiz();
            
        }   );
        await this.sub.psubscribe(PATTERNS.QUIZ_LOAD, async (chan:string, {load} : {load:boolean}, {roomId}:ExtraMsgData) =>{
            await this.store.set(REDIS_KEY.QUESTIONS_LOADED_FLAG(roomId), 'ready', 'EX', 3 * 60 * 60);
            quizEvents.emit('load:'+roomId, {load} )
        })
    await this.sub.psubscribe(PATTERNS.QUIZ_INIT, async (chan: string, { settings }: { settings:QuizSettings}, { roomId }: ExtraMsgData) => {
        await this.store.set(REDIS_KEY.QUESTIONS_LOADED_FLAG(roomId), 'loading', 'EX', 3 * 60 * 60);
        GlobalQuiz.loadQuiz(settings);
        
    })
    }

    
    // --- Placeholders for remaining logic methods ---
    
    
}