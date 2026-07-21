import { shuffleArray, alphabeticalSort } from "../../Bible-Quizzing-App/apps/server/src/config/utils/array.js";
import { WebSocketServer, WebSocket } from 'ws';
import  fs  from 'fs/promises';
import { DATA } from "../app.js"
import { supabase, JWT_ACCESS_KEY, IS_DEV_MODE } from '../mainApp.js';
import { Redis } from 'ioredis';
import Rand from "../../Bible-Quizzing-App/apps/server/src/config/utils/rand.js";
import RAW_QUIZZES from "../json/quizzes.json" with { type: "json" };
export const QUIZZES:Record<string, any> = RAW_QUIZZES;
import { BOTS, WssFuncs } from '../wss_functions.js'
import AnswerLogic from '../answer-logic.js';
import { ServerLogic } from '../logic_scripts.js';
import {
  // Constants
  UserUpdate,
  SUPA_COLUMNS,
  Tables,
  defaultQuizSettings,
  QUESTION_TYPES,
  REDIS_KEY,
  QUIZ_KEYS,
  UPDATE_TYPES,
  quizMonths, 
  matthew,
  textdemo,
  USER_STATES,
  boolean,
  ROOM_STATES,
  RoomTypes,
  Updates,
  ROOM_COUNTS,
  QUESTION_STATUS,
  // Types and Interfaces
  
  RoomType,
  
  
  QuizUserData,
  
  QuizSettings,
  
  Question,
  
  RoomData,
  QuestionStates
} from '../types.js'; // Change this to the actual path of your file
import { EventEmitter } from 'events';
import FileLogger from '../Logger.js';
import { QuizManager, redis, sub as rSub, RedisSub } from "./redishelpers.js";
import { SERVER_CHANNELS } from "./server.js";
import { MetaData, RoomMeta } from "../../Bible-Quizzing-App/apps/server/src/config/utils/quizCotexnt.js";
const sub = new RedisSub(rSub);
 const logger = new FileLogger();
 logger.clear();//clear the file for now 
console.log = (...args: any[]): void => {
  // Convert all arguments to a single string separated by spaces
  const message = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');

  logger.log(message); // Write the message to your log file

  // Optional: Uncomment the line below if you still want to see logs in the terminal too
  // originalConsoleLog(...args); 
};
type obj = Record<string, any>;
interface RoomConfig extends MetaData{
  questNum?:number;
    questState?:QuestionStates;
   // array of objects
   roomId?:string;
              // 'RoomType' in your example
      requiredUsers: string[] | string; // List of required usernames
      maxUsers: number;       // Optional: Defaults to requiredUsers.length
      team1?: string;         // Optional: Default to empty string
      team2?: string; 
      
       teams?:Record<string, any>
          action?:string;
          canDecline?:boolean;
         maxQuestions?:number;        
         quizId?:string;
   createdAt?:number;
    host?:string;
    status?:string;
   
    channel?:string;
    type:RoomType;
    id?:string;
    isActive?:string;
    timeActive?:number;
}
export class Rooms extends QuizManager {
  public userId:string;
  public currQData:Record<string, any>
  public skipQId:any;
  questNum:number;
  
  timer:any;
  checkflag=false;
  bots:string[];
  tWordTimestamp:number;
  setAiJump:Function|boolean;
  questEnd = false;
  maxQuestions:number;
  settings:QuizSettings;
  questions:number[];
  timerSettings:Record<string, number>
  public month:string;
  questData:Question[]=[]; 
  public questnumbererId:any;
  protected hasError:boolean;
 public requiredUsers:string[];
 lastQuest:boolean
 isTeamGame:boolean;
 teamObject:Record<string, string>;//maps user to team
 private isReady:boolean;
  public roomNS:string; //room name space
public isStop:boolean;
isActive:boolean;
  public roomId:string;
  constructor(userId: string,   ws:WebSocket) {
    super({redisClient:redis, redisSub: sub});
     this.userId = userId;
     this.isStop = true;
     this.requiredUsers= []
     this.roomNS = '';
     this.skipQId;
     this.questEnd = false;
     this.questnumbererId;
     this.roomId = '';
     this.timer;
    this.isActive = false;
     this.timerSettings={};
     this.bots= [];
     this.teamObject= {}
     this.isTeamGame = false;
     this.tWordTimestamp = Infinity;
     this.currQData = {}
     this.isReady= false;
     this.month = 'march';
     this.settings = defaultQuizSettings;
     this.questions = [];
     this.hasError = false;
     this.questNum =0;
  this.setAiJump= false;
   this.maxQuestions = 20;
     this.lastQuest = false
  };
  
  
  
  private async  start() {
     console.log('loading')
    await this.publish({start:true}, '', SERVER_CHANNELS.QUIZ_START(this.roomId),)
    
    //this.store.hset(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), {[this.ws.username as string]:USER_STATES.WAITINGNEXT})
  }
   
  public async destroy(roomId:string, roomNS?:string){
    this.isActive = false;
    this.isStop = true;
    
    function awaitDisater(){
      return new Promise((resolve, reject)=>{
    const stream = redis.scanStream({count:4
      ,match:`*${roomId}*`
    })
    stream.on('data',  (data:any[])=>{
      if(data.length){
       redis.del(data);
       
      }
    });
    stream.on('error', (err:any)=>{reject(err)});
    stream.on('end', ()=>{
      resolve(null)
      console.log('finished deleting data from', roomId)
    });;
  });
  };
    await awaitDisater();
      await this.sub.punsubscribe(REDIS_KEY.ROOM(roomId)),
        await this.updateUsers(REDIS_KEY.ROOM(roomId), {status:"DESTROYED"})
    
  
    }

  
   async create(config: RoomData ) {
    
     const oldroomID = await redis.get(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username))
    if(oldroomID){
      console.warn('user already in room, cleaning up old room first\nioioioioioioioioioioioioioioioioioioioioioioioioioioi\n')
      await this.destroy(oldroomID);
    };
     const roomId = ((Date.now() * Math.random()).toString(16) + this.ws.userId) as string; // Multiply time by random, convert to hex, then append userId
     
     this.roomNS = REDIS_KEY.ROOM(roomId);
     this.roomId = roomId; // generate a unique room ID using timestamp and random number, convert to hex, and append userId for extra uniqueness
     await redis.set(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username), this.roomId);
     //the active room is helpful for knowing if a user is already in a room and for cleanup if they try to make another one
     
    this.isActive = true;
const type = config.type as string in RoomTypes ? config.type:'quiz'
    const requiredUsers = (config.requiredUsers as string[] ?? []);
    requiredUsers.push(this.ws.username)
    const maxUsers = config.maxUsers ?? requiredUsers.length;
    const team1 = (config.team1 ?? this.ws.teamId) as string;
    const team2 = (config.team2 ?? (Date.now() * Math.random() ).toString(16)+this.ws.username )as string;
   if(config.quizId?.includes('c')){ this.settings = {...defaultQuizSettings, ...config.settings}}else{
      this.settings =   QUIZZES[config.quizId || 's1' ]?.settings ?? QUIZZES['s1'].settings as QuizSettings;
   };
   if(config.quizId?.includes('!')) {
     const incorrectQs = await redis.hgetall(REDIS_KEY.ROOM(roomId) + ':question_incorrect');
    this.questData = Object.keys(incorrectQs).map((id:string)=>DATA[parseInt(id)])
   }
   if(config.quizId?.includes('b')){
    this.settings= BOTS[config.quizId || 'bot1']?.settings ?? defaultQuizSettings
   }
    const teams = [team1, team2];
  console.log ('config for quiz', config,maxUsers )
    if (config?.settings?.month && config.settings.month.length > 0) {
    // Assign from the correct path: config.settings.montha
    this.month = config.settings.month[config.settings.month.length -1]; 
    // Fallback to a default value if the check fails
    this.month = 'march'; // Use a valid month from your questionsData.json
}
console.log('month;', this.month);
    
    let teamIndex = 0;
    
      const teamsObj = requiredUsers.reduce((acc: Record<string, string>, val: string, index: number) => {
    // Determine which team this user belongs to based on the index
    
    const teamKey = teams[index % teams.length]; 
    
    acc[val] = teamKey; // Assign the value to the dynamic key
    
    return acc; // CRITICAL: Always return the accumulator
}, {});
this.teamObject = teamsObj;
console.log ('\n',teamsObj, '\n')
   await this.publish({init:true},'', SERVER_CHANNELS.QUIZ_INIT(roomId))
    this.requiredUsers = requiredUsers;
    const roomConfig:RoomConfig= {
      createdAt:Date.now(),
        host:this.ws.username,
        type:type as string in RoomTypes ? type as string : 'quiz',
        isActive:"t",
        questState:'none',
        id:roomId,
        timeActive:0,
        questionIndex:0,
        isLastQuest:"f",
        isQuestEnd:"f",
        isStop:"f",
        isTeamMode: config.teams ? 't':'f',
        isTimeout:"f",
        status:ROOM_STATES.PENDING,
        team1,
        maxQuestions:20,
        team2,
        requiredUsers:JSON.stringify(requiredUsers),
        maxUsers,
      settings: JSON.stringify(this.settings),
        teamObject:JSON.stringify(config.teams || teamsObj)
       
    };
    //ws .teams is the team names
    this.ws.teams  = teams;
   //this lets the code know that you control the game and to oprate there 
    const expireTime = 60 * 60 * 3;
    
    // 1. Initialize a pipeline for batched operations
const pipeline = this.store.pipeline(); // Batching prevents multiple network round-trips

// 2. Prepare the common metadata
const timestamp = Date.now().toString(); // Use a string for Redis compatibility

// 3. Set the questions hash (using your temporary placeholder logic)
pipeline.hset(REDIS_KEY.ROOM_QUESTIONS(roomId), { 
  "1": "", 
  "_createdAt": timestamp // Tracking creation time
}); 

// 4. Initialize Reaction Times hashes with placeholders
pipeline.hset(REDIS_KEY.REACTION_TIMES(roomId, team1), { 
  "_init": "true", 
  "_createdAt": timestamp 
});
pipeline.hset(REDIS_KEY.REACTION_TIMES(roomId, team2), { 
  "_init": "true", 
  "_createdAt": timestamp 
});

// 5. Initialize Team data hashes
pipeline.hset(REDIS_KEY.TEAM(roomId, team1), { 
  
  "_createdAt": timestamp 
});
pipeline.hset(REDIS_KEY.TEAM(roomId, team2), { 
  
  "_createdAt": timestamp 
});

// 6. Execute all commands in the Redis queue
await pipeline.exec(); // Returns results as an array of [error, result]
        await Promise.all([
    
    this.store.hset(this.roomNS, roomConfig), // Initialize the room hash data
    this.store.sadd(`room:${roomId}:users_conn`, this.ws.username), // Increment the initial user count
    this.store.hset(REDIS_KEY.ROOM_PLAYERS_STATES(roomId), { [this.userId]: USER_STATES.CONNECTED }), // Set host state
          this.store.expire(`room:${roomId}:users_conn`,   expireTime),
    // Set expiration (TTL) for all keys related to this room
    this.store.expire(this.roomNS, expireTime), //vaild
    this.store.expire(REDIS_KEY.ROOM_PLAYERS_STATES(roomId), expireTime),//vaild
    this.store.expire(REDIS_KEY.ROOM_QUESTIONS(roomId), expireTime),//vaild
    this.store.expire(REDIS_KEY.REACTION_TIMES(roomId, team1), expireTime),
     this.store.expire(REDIS_KEY.REACTION_TIMES(roomId, team2), expireTime),
    this.store.expire(REDIS_KEY.TEAM(roomId, team1), expireTime),
    this.store.expire(REDIS_KEY.TEAM(roomId, team2), expireTime),
     
    redis.hset(REDIS_KEY.CURRENT_ROOM_USERS(roomId), {[this.ws.userId as string]:this.ws.username}),
          redis.expire(REDIS_KEY.CURRENT_ROOM_USERS(roomId), expireTime)
  ]);
const userConfig:QuizUserData ={
   username:this.ws.username,
   roomId,
   xp:0,
   status:USER_STATES.CONNECTED,
   seatNum:1,
   points:0,
   teamId:this.ws.teamId,
   teamName:''

 }  ;
     await redis.expire(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), expireTime)
 await this.updateUsers(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), {userConfig}, false, {channel:REDIS_KEY.ROOM(roomId)})
 // Inside createRoom method in logic.ts

// ... pipeline execution ...





// FIX: Subscribe first to ensure we don't miss messages
console.log(this.roomNS, true , 'vs ',REDIS_KEY.ROOM(roomId))

     if (requiredUsers.length === 1 || maxUsers == 1 ) { // Or length === 1 depending on your logic
       //  start immediately
       console.log((requiredUsers.length === 1), maxUsers == 1)
       this.start();
     }
     
return roomId;
      
  }
  
  async  join(roomId:string){
  
  if(! this.store.exists(REDIS_KEY.ROOM(roomId))){console.error(`Room ${roomId} doesn't exsit`); return;}
console.log('room id ', roomId)
 const {requiredUsers, maxUsers, teams } =   await this.store.hgetall(REDIS_KEY.ROOM(roomId));
 const usernames = JSON.parse(requiredUsers as string);
 const maxium =  Number(maxUsers as string);
 const teamObj = JSON.parse(teams)
 let userCount:number=-1;
 if(usernames.includes( this.ws.username) || usernames.length === 0){
      userCount = await this.store.scard(roomId + ROOM_COUNTS.USERS)
      
      if(userCount === maxium){
        //this may changed to allow veiwing quizzies
         //await this.store.hincrby(this.roomNS, ROOM_COUNTS.USERS,-1 )
        console.error(`Room ${roomId} is full${userCount} ${maxium}`); 
        return
   
      }
      
      await this.store.sadd(roomId +ROOM_COUNTS.USERS, this.ws.username)
     
       await  this.updateUsers(REDIS_KEY.ROOM_PLAYERS_STATES(roomId), {status:USER_STATES.CONNECTED});
   if(userCount === -1) { console.error(`Room ${roomId} user ${this.userId} is not in room`); return; }
   if ((userCount !== -1 && maxium === userCount) || IS_DEV_MODE) {
     console.log(maxium === userCount)
     if (await redis.sismember(REDIS_KEY.OPEN_ROOM, roomId)) {
       await redis.srem(REDIS_KEY.OPEN_ROOM, roomId)
     await this.start()
   }
        this.ws['roomId'] = roomId;
        await redis.hset(REDIS_KEY.CURRENT_ROOM_USERS(roomId), {[this.ws.userId as string]:this.ws.username});

   } const oldroomID = await redis.get(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username))
   if (oldroomID) {
     console.warn('user already in room, cleaning up old room first\nioioioioioioioioioioioioioioioioioioioioioioioioioioi\n')
     await this.destroy(oldroomID)
   }
   //await redis.set(REDI;S_KEY.ACTIVE_USER_ROOM(this.ws.username), roomId, "EX", 60 * 60 * 3);
this.isActive = true;
 await this.sub.psubscribe(REDIS_KEY.ROOM(roomId)+':quiz', this.handleQuizMsgs)
 await this.sub.psubscribe(REDIS_KEY.ROOM(roomId), this.handleUserMsgs);
 redis.scanStream({match:REDIS_KEY.USER_ROOM_DATA(roomId, '*')}).on('data', async (data:any[])=>{
  if(data.length){
   
   for(const key of data){
    if(!data) continue;
    const userConfig = await this.store.hgetall(key);
    if(!userConfig) continue;
      await this.updateUsers(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), { userConfig }, false, { channel: REDIS_KEY.ROOM(roomId) })
    }
    
  }
})
 const userConfig:QuizUserData ={
   username:this.ws.username,
   
   roomId,
   xp:0,
   status:USER_STATES.CONNECTED,
   seatNum:userCount,
   points:0,
   teamId: usernames.length === 1? this.ws.teamId: teamObj[this.ws.username],
  teamName:''
 }
   const expireTime = 60 * 60 * 3;
   await redis.expire(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), expireTime)
   // 1. Initialize a pipeline for batched operations
   await this.updateUsers(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), {userConfig},  false, {channel:REDIS_KEY.ROOM(roomId)} )
  }
}
 private async  handleUserMsgs(chan:string, data:obj){
  //logic here
  if(data?.payload.end){await this.finish()}
  this.updateFontend(Updates.USERS, data.payload)
 }
 async  handleQuizMsgs(chan:string, data:obj){
//logic here
console.log(true, false, true, chan)
this.store.hset(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), {[this.ws.username as string]:USER_STATES.WAITINGNEXT})
this.sub.punsubscribe(chan);
this.updateFontend(data.payload.update, data?.payload)
 

 }
 async finish(){
     try {
         const { data, error } = await ServerLogic.readProfileData(SUPA_COLUMNS.ID, this.ws.supaId)
 
         const { online_quiz_data: oqd } = data as any ?? [];
         const online_quiz_data = Array.isArray(oqd) ? oqd : [];
 
         const teamScore = await this.store.get(REDIS_KEY.TEAM_SCORE(this.roomId, this.ws.teamId as string)) || 0;
         const rawData = await this.store.hgetall(REDIS_KEY.USER_ROOM_DATA(this.roomId, this.ws.username))
         const dataToSave: QuizUserData = {
             ...rawData,
             points: parseInt(rawData.points || '0'), // Converts string '20' to number 20
             xp: parseInt(rawData.xp || '0'),         // Converts string to number
             seatNum: parseInt(rawData.seatNum || '1'), // Converts string to number
             status: rawData.status || 'finished',
             teamScore // Ensures status is a string
         } as any;
 
         delete dataToSave.username;//not needed
         online_quiz_data.push(dataToSave);
         this.store.del(REDIS_KEY.ACTIVE_USER_ROOM(this.roomId));
         await this.store.zincrby(REDIS_KEY.MAIN + 'leaderboard', dataToSave.points, this.ws.username)
         const { success } = await ServerLogic.updateUserProfile(this.ws.supaId, { [SUPA_COLUMNS.QUIZ_DATA]: online_quiz_data }, 'update')
         if (!data || error || !success) {
             console.error(error, 'could not save data');
             this.updateFontend('error', { error: { message: 'data saved to save' }, why: error })
         }
     }
     catch (e: any) {
         console.error(e, 'could not save data');
         this.updateFontend('error', { error: { message: 'data saved to save' }, why: e })
     }
     finally {
         //his.cleanUser(this.roomId)
     }
 }
private async startQuiz(){
     await this.publish({ start: true }, 'all_quizzes', SERVER_CHANNELS.QUIZ_INIT(this.roomId), true);

  }
  
    



      
  
 
/**
 * Validates the user's input against a target answer using 
 * fuzzy matching and frequency analysis.
 */
  
}