
import { WebSocketServer, WebSocket } from 'ws';
import  fs  from 'fs/promises';
import { DATA } from "./app.js"
import { supabase, JWT_ACCESS_KEY, IS_DEV_MODE } from './mainApp.js';
import { Redis } from 'ioredis';

import RAW_QUIZZES from "./json/quizzes.json" with { type: "json" };
export const QUIZZES:Record<string, any> = RAW_QUIZZES;
import { WssFuncs } from './wss_functions.js'
import AnswerLogic from './CheckAns.js';
import { ServerLogic } from './logic_scripts.js';
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
  
  QuestionStates,
  SupaColumns,
  QuizUserData,
  SpellCheckResult,
  Options,
  Trigs,
  QuestionSettings,
  QuizSettings,
  WsMessage,
  Token,
  UserData,
  Question,
  IRedisManager,
  IRooms,
  IQuiz,
  RedisSet,
  MSG,
  RoomData
} from './types.js'; // Change this to the actual path of your file
import { EventEmitter } from 'events';
import FileLogger from './Logger.js';
import { resolve } from 'dns';
import { devNull } from 'os';
type int = number;
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

type arr = any[]
// const REDIS_HOST:string = process.env.REDIS_HOST || 'localhost';
//const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || '6767', 10);
const REDIS_URL = process.env.MY_REDIS_URL /// for render to give me the url for this libary 
const ESV_API_KEY = process.env.ESV_API_KEY;

export const redis = new Redis(REDIS_URL as string, {
  family:0,
  tls:{
  ///rejectUnauthorized:true,
  
}});
export  const sub = redis.duplicate()
async function testRedisFeatures() {
  // Create a standard client for regular commands and publishing
  
  // Create a dedicated client for subscribing (subscribers cannot run regular commands)
 

  // --- 1. PUB/SUB ---
  sub.subscribe('news-channel'); // Subscribe to a specific channel
  sub.on('message', (channel, message) => { // Listen for messages
    console.log(`Received from ${channel}: ${message}`); // Log the received message
  });

  await redis.publish('news-channel', 'Hello from ioredis!'); // Publish a message to the channel

  // --- 2. STREAMS (Persistent Message Queues) ---
  const streamKey = 'mystream'; // Define the stream key name
  await redis.xadd(streamKey, '*', 'user', 'alice', 'action', 'login'); // Add entry to stream
  
  const streamData = await redis.xrange(streamKey, '-', '+'); // Read all entries in the stream
  console.log('Stream Entries:', JSON.stringify(streamData)); // Log the stream data

  // --- 3. PIPELINING (Performance optimization) ---
  // Sends multiple commands in one network round-trip
  const pipeline = redis.pipeline(); // Start a pipeline instance
  pipeline.set('key1', 'value1'); // Queue a SET command
  pipeline.set('key2', 'value2'); // Queue another SET command
  pipeline.get('key1');           // Queue a GET command
  const results = await pipeline.exec(); // Execute all queued commands at once
  console.log('Pipeline results:', results); // Log results (format: [[err, result], ...])

  // --- 4. TRANSACTIONS (MULTI/EXEC) ---
  // Ensures commands are executed atomically
  await redis.multi() // Start an atomic transaction
    .set('account:1', '100') // Add command to transaction
    .set('account:2', '200') // Add command to transaction
    .exec(); // Execute the transaction

  // Cleanup connections
  
}

// Execute the test function

redis.on('error', (error:any)=>{
  console.error('redis is not  running', error)
})
sub.on('error', (error:any)=>{
  console.error('redis sub is not  running', error)
})
function waitRedisReady(redis:Redis): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if the connection is already ready to avoid waiting indefinitely
    if (redis.status === 'ready') { // Access the current status of the ioredis instance
      return resolve(); // Resolve immediately if already connected
    }

    const onReady = () => { // Define the success handler
      cleanup(); // Remove listeners to prevent memory leaks
      resolve(); // Resolve the promise
    };

    const onError = (err: Error) => { // Define the failure handler
      cleanup(); // Remove listeners to prevent memory leaks
      reject(err); // Reject the promise with the error object
    };

    const cleanup = () => { // Helper to remove listeners
      redis.removeListener('ready', onReady); // Detach ready listener
      redis.removeListener('error', onError); // Detach error listener
    };

    redis.once('ready', onReady); // Use once to ensure it only fires once
    redis.once('error', onError); // Use once to catch the first error event
  });
}
 export async function  isRateLimited (id:string, secs:int, limit:int, tag:string=''):Promise<boolean>{
  const key = `${id}:rates:${tag}`
 
   const rate = await redis.incr(key);
  
     if(rate === 1){
      await redis.expire(key, secs);
     }
 
 return rate > limit;

}
const WNATRESET = true;
type obj = Record<string|number, any>

declare module 'ws' {
  // This "merges" your new properties into the existing WebSocket interface
  export interface WebSocket {
    clientIp?: string;
    userId?: string;
    roomId?:string;
    teamId?:string;
    teams:string[];
    canUse?: boolean;
    isAlive?: boolean;
    supabase?: any;
    allQs?:Record<string, any>;
    signedIn?: boolean;
    userData?: Record<string, any>;
    isBlocked?:boolean;
    friends?: string[]
    quizId?:string;
    xp?:int;
    supaId?:string;
    username:string;
    
  }
}





  
class RedisMananger  extends EventEmitter implements RedisSet {
  public user_id: string;
  public sub: Redis;
  lags:int[];
  startTime:int;
  protected isHost:boolean;
  public redis: Redis;
private heartId: any;
  public channel: string;
  key:int;
  isActive:boolean;
  protected xpOffset:int;
 protected xpMutliplier:int
 public store: Redis;
 public  ws:WebSocket;
 private patternHandlers = new Map<string, Function>();
  constructor(id:string, channel:string, ws:WebSocket) {
    super();
    this.lags = []
    this.startTime = 0;
    this.user_id = id;
   this.xpOffset = 10;
   this.xpMutliplier = 10
    this.isHost =false
    this.ws = ws
    this.redis = redis;
     this.sub = sub;
     this.key = 0;
     this.isActive =false;
          this.store = redis;
     this.channel = channel;
    this.heartId = 'empty';
   
    // Base class connamestructor logic (if any)
  }

  // Define the handler as a class property if possible to ensure persistence
  private msgHandler = async (pattern: string, channel: string, message: string) => {
    const handler = this.patternHandlers.get(pattern); // Get registered handler

    if (handler) {
      try {
        const data = JSON.parse(message); // Convert string to object

        // Professional Check: Ensure data exists before accessing properties
        

        await handler(channel, data); // Execute custom logic
      } catch (e) {
        console.error("Pattern message parse error", e); // Catch parsing or handler errors
      }
    }
  }

  public async initpsubscribe() {
    // 1. Force cleanup of any existing listener to prevent duplicates
    this.sub.off('pmessage', this.msgHandler);

    // 2. Attach the listener
    this.sub.on('pmessage', this.msgHandler);

    // 3. Return cleanup for the caller (e.g., React useEffect or Socket close)
    return () => {
      this.sub.off('pmessage', this.msgHandler); // Remove specific listener
    };
  }
  public async punsubscribe(pattern: string) {
  // Determine the target pattern, using the class default if none provided
  console.log('unscribing ',  pattern)
  const targetPattern = pattern || this.channel;

  // 1. Tell the Redis server to stop sending messages for this pattern
  await this.sub.punsubscribe(targetPattern);

  // 2. Remove the callback from the local Map to free up memory
  this.patternHandlers.delete(targetPattern);

  // Log the cleanup for debugging purposes
  console.log(`Unsubscribed from pattern: ${targetPattern}`);
}
  public async psubscribe(channel:string, onmessage:Function) {
     const chan = channel || this.channel;
     this.patternHandlers.set(chan, onmessage)
     await this.sub.psubscribe(chan);
   
   console.log('sub to ', channel, this.patternHandlers)
    
    
      
  }
  async unsubscribeAll() {
    for (const pattern of this.patternHandlers.keys()) {
      await this.punsubscribe(pattern);

      }
    }
public async updateUsers(
  key: string, // The key for the hash set
  value: Record<string, any>, // The value to be stored
  hideId: boolean = false, // Toggle for ID inclusion
  payload?:UserUpdate // Optional deconstructable payload
): Promise<void> { // Returns a promise with no value
  // Deconstruct with default values from the payload or an empty object to avoid scope errors
  const { // Start of deconstruction
    usrIdToUp = undefined, // Extract user ID or default to undefined
    channel = undefined, // Extract channel or default to undefined
    update = undefined, n= false , isChar=false// Extract update type or default to undefined
  } = payload ?? {}; // Use nullish coalescing to handle missing payload
  !isChar && console.log('key' , key, 'valuse', value)
    const data = {...value, username:usrIdToUp ?? this.ws.userId};
    const valueStr = typeof value ==='object'? JSON.stringify(value):value;
    const data2 = {[usrIdToUp ?? this.ws.userId as string]:valueStr};
   if(!n)  await this.store.hset(key, (hideId ? value :data2) as Record<string, any>);
    //this.updateFontend( update || 'quiz', data, isChar );
    await this.publish({update:update || 'quiz', ...data}, 'all_quizzes', channel || this.channel, isChar);
}
public updateFontend( updatetype:string, data:Record<string, any>, isChar?:boolean){
  if(Array.isArray(data)){
    
    
    this.ws.send(JSON.stringify( data));
    return;}
    this.ws.send(JSON.stringify({payload:{update:updatetype, ...data}}));
  !isChar &&  console.log('\n---------------\n----\n\n',JSON.stringify({payload:{update:updatetype, data}}), 'data being sent touser ', this.ws.username, '\n\n-------')
  }
 public async publish (payload:Record<string, any> , to:string, channel:string, isChar?:boolean){
  const msg:MSG = {
    from : this.user_id,
    to,date:Date.now(),
    key:this.key,
    payload,
    channel: channel 


  }
  const msgStr = JSON.stringify ( msg )
  
  this.key++;//helpful for making sure msg are in order
 await  this.redis.publish(channel, msgStr);
   if (Array.isArray(payload)) {  return; }
   !isChar &&  console.log(`\n<<---------publish------->>\n\nPublsihing ${msgStr} on channel ${channel}\n`)

}
public heartBeat (time:int =30 * 1000){
   
  this.ws.on('pong', ()=>{this.ws.isAlive = true;
    this.lags.push( Date.now() - this.startTime);
    if (this.lags.length > 10) this.lags.shift();//keeps it short
  })
  this.ws.isAlive = true; //start as active 
 this. heartId =  setInterval(() => {

    
   
    if(!this.ws.isAlive) {clearInterval(this.heartId);this.ws.terminate(); console.log(`conn closed because inactive too long (id:${this.user_id}`)}
    this.ws.isAlive = false;
    this.startTime = Date.now()
    this.ws.ping();
    
  },time );  

}
public async destroy(roomId:string, roomNS:string){
  this.isActive = false;
  const stream = redis.scanStream({count:4
    ,match:`*${roomId}*`
  })
  stream.on('data',  (data:any[])=>{
    if(data.length){
     redis.del(data);
     
    }
  });
  stream.on('end', ()=>{
    console.log('finished deleting data from', roomId)
  })

    await this.punsubscribe(roomNS),
    await this.updateUsers(roomNS, {status:"DESTROYED"})
  

  }
public async isRateLimited (id:string, secs:int, limit:int, tag:string=''):Promise<boolean>{
  const key = `${id}:rates:${tag}`
 
   const rate = await this.store.incr(key);
  
     if(rate === 1){
      await this.store.expire(key, secs)
     }
//  if(IS_DEV_MODE && WNATRESET){
//   const s =redis.scanStream({
//     match:'*',
//     count:100
//   })
// s.on('data', (daily)=>{
// if(daily.length){
//   redis.del(daily)
// }
// })
// }
 return rate > limit;

}
// this shuts happens on close and deletes data not used
public async  cleanUser (inroomId:string) {

  try {
  
  if(this.heartId !== 'empty'){
    clearInterval(this.heartId);
    this.heartId = 'empty'
  }
  //await this.unsubscribeAll();
await this.punsubscribe(REDIS_KEY.ROOM(this.ws.roomId as string))
  const roomId = this.ws.roomId || inroomId;
  if( !roomId || !this.user_id) return { error: {message:'ids are missing'}}
  if(this.isHost) await this.destroy(inroomId as string, REDIS_KEY.ROOM(inroomId as string))
 await  this.store.del(REDIS_KEY.USER_ROOM_DATA(roomId, this.user_id))
 
 console.log(`Cleaned up Redis and Heartbeat for: ${this.user_id}`);
  }catch(e:any){
    console.error("Cleanup failed or Redis already closed:", e);
    return {e}
  }
}
 

}


// This extracts the values ('1 on 1' | 'team_battle') into a reusable Type

class Rooms extends RedisMananger {
  public userId:string;
  public currQData:Record<string, any>
  public skipQId:any;
  questNum:int;
  private isTimeout:boolean;
  timer:any;
  bots:string[];
  tWordTimestamp:int;
  setAiJump:Function|boolean;
  questEnd = false;
  maxQuestions:int;
  settings:QuizSettings;
  questions:Question[];
  timerSettings:Record<string, int>
  public month:string;
  public questInterId:any;
  protected hasError:boolean;
 public requiredUsers:string[];
 lastQuest:boolean
 isTeamGame:boolean;
 teamObject:Record<string, string>;//maps user to team
 private isReady:boolean;
  public roomNS:string; //room name space
public isStop:boolean;
  public roomId:string;
  constructor(userId: string,   ws:WebSocket) {
    super(userId, REDIS_KEY.ROOM('') ,  ws);
     this.userId = userId;
     this.isStop = true;
     this.requiredUsers= []
     this.roomNS = '';
     this.skipQId;
     this.questEnd = false;
     this.questInterId;
     this.roomId = '';
     this.timer;
     this.isTimeout = false;
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
  async loadQuiz(configSettings: QuizSettings) {
    try {
      const settings = { ...defaultQuizSettings, ...configSettings };
      const limit = settings.numQuestions || 20;

      // Filter questions based on settings or fallback to all DATA
      let pool = ServerLogic.multiFilter(DATA, settings);
      if (!pool || pool.length === 0) pool = DATA;

      // Determine if we need to generate a quiz or just slice the pool
      if (settings.verseSelection === 'quiz') {
        this.questions = await ServerLogic.generateQuiz(3, 2, limit, pool);
      } else {
        this.questions = pool.slice(0, limit);
      }

      // Safety check: if generation failed, slice the pool
      if (this.questions.length === 0) {
        this.questions = pool.slice(0, limit);
      }

      console.log(`Quiz loaded with ${this.questions.length} questions for room ${this.roomId}`);
      this.isReady = true;
      this.emit('load');
    } catch (err) {
      console.error('loadQuiz error:', err, 'Room:', this.roomId);
    }
  }
  chancePercent (per:int){
    const num = per / 100;
    return Math.random () < num
  }
  chanceFloat (per:int){
    
    return Math.random () < per
  }
  chanceRange(min: number, max: number): number { // Use number type
    const range = max - min + 1; // Calculate total spread including max
    const randomValue = Math.floor(Math.random() * range) + min; // Apply floor to range
    return randomValue; // Return final integer
  } // End function
  async checkStartCondition() {
     console.log('loading')
    // If questions aren't loaded yet, wait for them
    if (!this.isReady) {
      console.log('waitnig')
     
        // Wait for the 'load' event if it hasn't happened yet
        await new Promise(resolve => this.once('load', resolve));
    }
    
    // START THE QUIZ
    console.log('startkjhhhhhhhhhhhhhhhfs');
    //this.store.hset(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), {[this.ws.username as string]:USER_STATES.WAITINGNEXT})
    (REDIS_KEY.ROOM(this.roomId), {start:true}, true, {n:true});
    await this.startQuiz();
    await this.switchStatus('*', USER_STATES.WAITINGNEXT)
    await redis.hset(REDIS_KEY.ROOM(this.roomId), { status: ROOM_STATES.ACTIVEQUIZ })
}   
   async createRoom(config: RoomData ) {
     this.isHost = true;
     const oldroomID = await redis.get(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username))
    if(oldroomID){
      console.warn('user already in room, cleaning up old room first\nioioioioioioioioioioioioioioioioioioioioioioioioioioi\n')
      await this.cleanUser(oldroomID);
    }
    this.isActive = true;
const type = config.type in RoomTypes ? config.type:'quiz'
    const requiredUsers = (config.requiredUsers as string[] ?? []);
    requiredUsers.push(this.ws.username)
    const maxUsers = config.maxUsers ?? requiredUsers.length;
    const team1 = (config.team1 ?? this.ws.teamId) as string;
    const team2 = (config.team2 ?? (Date.now() * Math.random() ).toString(16)+this.ws.username )as string;
   if(config.quizId?.includes('c')){ this.settings = {...defaultQuizSettings, ...config.settings}}else{
      this.settings =   QUIZZES[config.quizId || 's1' ].settings ?? QUIZZES['s1'].settings as QuizSettings;
   };
    const teams = [team1, team2];
  console.log ('config for quiz', config,maxUsers )
    if (config?.settings?.month && config.settings.month.length > 0) {
    // Assign from the correct path: config.settings.montha
    this.month = config.settings.month[config.settings.month.length -1]; 
    // Fallback to a default value if the check fails
    this.month = 'march'; // Use a valid month from your questionsData.json
}
console.log('month;', this.month);
    this.loadQuiz(config.settings as QuizSettings);
   await  redis.set(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username), this.roomId, "EX", 60 * 60 * 3);
    let teamIndex = 0;
    
      const teamsObj = requiredUsers.reduce((acc: Record<string, string>, val: string, index: int) => {
    // Determine which team this user belongs to based on the index
    
    const teamKey = teams[index % teams.length]; 
    
    acc[val] = teamKey; // Assign the value to the dynamic key
    
    return acc; // CRITICAL: Always return the accumulator
}, {});
this.teamObject = teamsObj;
console.log ('\n',teamsObj, '\n')
    const roomId = ((Date.now() * Math.random()).toString(16) + this.ws.userId) as string; // Multiply time by random, convert to hex, then append userId
    this.channel = REDIS_KEY.ROOM(roomId);
    this.roomNS =REDIS_KEY.ROOM(roomId);
    this.roomId = roomId;
    this.requiredUsers = requiredUsers;
    const roomConfig= {
      createdAt:Date.now(),
        host:this.ws.username,
        type:type,
        isActive:"T",
        questState:'none',
        id:roomId,
        timeActive:0,
        questNum:0,
        status:ROOM_STATES.PENDING,
        team1,
        maxQuestions:20,
        team2,
        requiredUsers:JSON.stringify(requiredUsers),
        maxUsers,
      settings: JSON.stringify(this.settings),
        teams:JSON.stringify(config.teams || teamsObj)
       
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
 await this.updateUsers(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), {userConfig}, false, {channel:REDIS_KEY.ROOM(roomId)})
 // Inside createRoom method in logic.ts

// ... pipeline execution ...





// FIX: Subscribe first to ensure we don't miss messages
console.log(this.roomNS, true , 'vs ',REDIS_KEY.ROOM(roomId))
await this.psubscribe(REDIS_KEY.ROOM(roomId), async (chan: string, msg: Record<string, any>) => {
  this.updateFontend(msg.payload.update || 'quiz', msg.payload, msg.payload.isChar);
  if (Array.isArray(msg?.payload))return;
  console.log('reciedtuiyui');
  
    try{

   if(!msg?.payload?.question?.char) console.log('------\n\nmsg ', msg, '\n\n\n\n-------\n\n\n')
  // Logic for handling "Last User" message from others
    if (msg.payload.last) {
        this.checkStartCondition();
        console.warn('returning early\n\n');
        return;
    }
    // ... rest of your switch/case logic


// FIX: Explicitly check start condition immediately for Solo play


// Helper method to consolidate the start logic

        
        this.ws['roomId'] = roomId;
        delete msg.payload.update; // Clean up the payload for easier access
        // const users = await redis.hgetall(REDIS_KEY.CURRENT_ROOM_USERS(this.roomId))
        if(msg.payload.status === 'DESTROYED'){
          console.warn('room destroyed, cleaning up client side')
          await this.cleanUser(roomId);
          return;
        };
        if(!msg.payload.start && !msg.payload.answer && !msg.payload.jumpTime){
          console.warn('------|N___\n_______-------no start, answer, or jumpTime in payload, ignoring message-____------|\n\n')
          return;
        }
          let username = ''
            const [key, value ]= Object.entries (msg?.payload).filter(([k, v])=>{
              if(k === 'username'){
username = v as string;
return false;
              }    
              return true;      
            })[0] 
             console.log('-----\n\n\nkey ', key, 'value', value, 'username', username, 'msg', msg, '\n\n\n\n-----')
         if(!username || !key || value === undefined){
          console.error(msg , 'msg', username, 'is undefined', key, value)
          return;
         }
          switch (key) {
            case 'answer':
                const question = this.questions[this.questNum];
              const options = {isQuote:question.type === 'ftv/quote', 
                 correction:true, closeThreshold:2, extraThreshold:2, spellThreshold:3
               }
              const results:Record<string, any> = {
                question:{
                '1':'correct',
                '-1':'incorrect',
                '0':'more'},
                'ftv/quote': {
                '1':'correct',
                '-1':'incorrect',
                '0':'please_correct'
              },
                quote: {
              '1': 'correct',
                '-1': 'incorrect',
                  '0': 'please_correct'
          },
                ftv: {
              '1': 'correct',
                '-1': 'incorrect',
                  '0': 'please_correct'
                }, 'SQ: ': {
                  '1': 'correct',
                  '-1': 'incorrect',
                  '0': 'more'
                }, 'According to': {
                  '1': 'correct',
                '-1': 'incorrect',
                '0': 'more'
              },
              }
             
            
              if(!this.questEnd){
               
               const {score:result } =  this.checkAnswer(question.question as string, value as string, options);
                console.warn('\nchecking for question\n')
               
               console.warn('answer ', value, 'quest', question, 'result', result)
               if(result == 1){
               await  this.updateUsers(REDIS_KEY.ROOM(this.roomId), {questState:QUESTION_STATUS.correct});
               this.questEnd = true
               return;
               }else if(result == 0){
                 await  this.updateUsers(REDIS_KEY.ROOM(this.roomId), {questState:QUESTION_STATUS.more});
                   return;
               } else {
               await  this.middleQuiz('incorrect', false, username)
               
               };  
               return;
              }else{
              console.warn('\nchecking for anwer\n')
               const {score:result} =  this.checkAnswer(question.answer as string, value as string, options);
               console.warn('answer ', value, 'quest', question, 'result', result)
               console.log('calling middle')
              if (result === 0) {
                await this.updateUsers(REDIS_KEY.ROOM(this.roomId), { questState: QUESTION_STATUS.more }); return};
              await this.middleQuiz(results[question.type as string][result.toString()], false, username)
              }
              break;
          case 'jumpTime':
            this.publish({stopTimer:true}, '', REDIS_KEY.AI_ROOM(this.roomId))
            this.isStop = true;
            this.isStop = true
             clearTimeout(this.skipQId)
            this. timer = setTimeout(async () => {
              this.isTimeout =true;
              console.log('useraneme at incorrect for before ques', username)
             await  this.middleQuiz('incorrect', false, username );
             console.warn(this.questNum, 'q num')
                        }, this.timerSettings.questionAnswer || 32 * 1000);
         const winner  = await  this.figureJumpWinner(this.timerSettings?.jumpWinner || undefined);
         console.log('winner is ', winner )
         await this.updateUsers(REDIS_KEY.ROOM(roomId), { winner:true }, false, {update:'stream', n:true})
         if(this.bots.includes(winner as string)){
          console.log('runing ai')
          await this.publish({isanswer:true, isQuestion:!this.questEnd, questNum:this.questNum, question:this.questions[this.questNum],time:this.tWordTimestamp}, 'ai', REDIS_KEY.AI_ROOM(this.roomId))
         }
         if(winner !== 0){
           await this.switchStatus(USER_STATES.AWAITJUMPS, USER_STATES.ANSWERING, winner as string);
           
          console.log('end of quest')
         }else{
          console.log('\n\ntie!!!!!!!!!!!!!!!!!!!!!!\n\n\t')
         }
            default:
              break;
          }


   }catch(e){
    console.error(e, 'error with mian body quia boy at host')
   }})
     if (requiredUsers.length === 1 || maxUsers == 1 ) { // Or length === 1 depending on your logic
       //  start immediately
       console.log((requiredUsers.length === 1), maxUsers == 1)
       this.checkStartCondition();
     }
     
return roomId;
      
  }
  

 async  joinRoom(roomId:string){
  
  if(! this.store.exists(REDIS_KEY.ROOM(roomId))){console.error(`Room ${roomId} doesn't exsit`); return;}
console.log('room id ', roomId)
 const {requiredUsers, maxUsers, teams } =   await this.store.hgetall(REDIS_KEY.ROOM(roomId));
 const usernames = JSON.parse(requiredUsers as string);
 const maxium =  Number(maxUsers as string);
 const teamObj = JSON.parse(teams)
 let userCount:int=-1;
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
     }
     this.publish({ last: true }, '', REDIS_KEY.ROOM(roomId))
   }
        this.ws['roomId'] = roomId;
        await redis.hset(REDIS_KEY.CURRENT_ROOM_USERS(roomId), {[this.ws.userId as string]:this.ws.username});

   } const oldroomID = await redis.get(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username))
   if (oldroomID) {
     console.warn('user already in room, cleaning up old room first\nioioioioioioioioioioioioioioioioioioioioioioioioioioi\n')
     await this.cleanUser(oldroomID);
   }
   await redis.set(REDIS_KEY.ACTIVE_USER_ROOM(this.ws.username), roomId, "EX", 60 * 60 * 3);
this.isActive = true;
 await this.psubscribe(REDIS_KEY.ROOM(roomId)+':quiz', this.handleQuizMsgs)
 await this.psubscribe(REDIS_KEY.ROOM(roomId), this.handleUserMsgs);
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
   await this.updateUsers(REDIS_KEY.USER_ROOM_DATA(roomId, this.userId), {userConfig},  false, {channel:REDIS_KEY.ROOM(roomId)} )
  }
  async  handleUserMsgs(chan:string, data:obj){
  //logic here
  if(data?.payload.end){await this.finish()}
  this.updateFontend(Updates.USERS, data.payload)
 }
 async  handleQuizMsgs(chan:string, data:obj){
//logic here
console.log(true, false, true, chan)
this.store.hset(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), {[this.ws.username as string]:USER_STATES.WAITINGNEXT})
this.punsubscribe(chan);
this.updateFontend(data.payload.update, data?.payload)
 

 }
public async startQuiz(){
     await this.store.sadd(ROOM_COUNTS.TIME, Date.now());

  }
  async upXp( incrBy:int, target?:string,  isInRoom:boolean=false){
    console.log('xp going up$$$$$$$$$$$$$$$$$$\n\n\n$$$$$$$$$$$$\n\n,', incrBy)
    if(isInRoom){
     await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(this.roomId, target || this.userId), 'xp', incrBy);
     return;
    }
     await this.store.hincrby(REDIS_KEY.USER_PROFILE( target || this.userId), 'xp', incrBy);
  }
 async updateScores( scoreToUp:string, incrBy:int, target?:string, isBonus?:boolean, _team?:string){
  const user =  target || this.userId
  //if(scoreToUp === QUIZ_KEYS.POINTS){
    const team = this.teamObject[user];
    if(!team){console.error('team not good' ,team); return;}
    if(scoreToUp !== 'points'){
      await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(this.roomId, target || this.userId), scoreToUp, incrBy)///user quiz data is updated
      //await this.updateUsers(REDIS_KEY.ROOM(this.roomId), { score: { [scoreToUp]: incrBy, username: target || this.userId }, username: target || this.userId }, true, { usrIdToUp: user, update: 'quiz' })

      return;
    }
   await this.updateUsers(REDIS_KEY.ROOM(this.roomId), { teamScore: { [scoreToUp]: incrBy, username: target || this.userId }, username: target || this.userId }, true, { usrIdToUp: user, update: 'quiz' }) 
     await this.store.incrby(REDIS_KEY.TEAM_SCORE(this.roomId, team), incrBy)//only the team gets the points
   if(!isBonus)  {await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(this.roomId, user), scoreToUp, incrBy);   
    await this.upXp(((incrBy+this.xpOffset)*this.xpMutliplier))
    const tag = this.questions[this.questNum].type === QUESTION_TYPES.QFTV ?'qftv':'question'
    const memberCount = await redis.sadd(REDIS_KEY.TEAM_BONUSES(this.roomId,this.ws.teamId as string,tag ), target || this.userId);
    if(memberCount >= 3 && this.isTeamGame) {  await this.store.incrby(REDIS_KEY.TEAM_SCORE(this.roomId, team),20)//team bonus
      await this.updateUsers(REDIS_KEY.ROOM(this.roomId), { teamScore: { [scoreToUp]:20, username: target || this.userId }, username: target || this.userId }, true, { usrIdToUp: user, update: 'quiz' }) 

  }
   await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(this.roomId, target || this.userId), scoreToUp, incrBy)///user quiz data is updated
    await this.updateUsers(REDIS_KEY.ROOM(this.roomId), { score: { [scoreToUp]: incrBy, username: target || this.userId },  username: target || this.userId }, true, {usrIdToUp:user, update:'quiz'}) 
  
 
        

  }}
  protected async switchStatus(curStatus:string|'*', newStatus:string, target?:string){
    console.log('swiching status ', curStatus, 'to', newStatus, 'tar', target ?? 'none')
    console.warn('swiching status ', curStatus, 'to', newStatus, 'tar', target ?? 'none')
   const data = await this.store.hgetall( REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId) );

   const newStatui:Record<string, any>= {}
   Object.entries( data).forEach(([id, status])=>{
    console.log('status ', id, status, 'data', data)
        if((curStatus === '*' || status === curStatus) && !target && status  !== USER_STATES.VIEWING){newStatui[id]={status:newStatus}; return;}else 
       if((curStatus === '*' ||status === curStatus )|| target === id){newStatui[id]={status: newStatus}} 
   })
  console.warn('stua', data, newStatui)
  const newData:Record<string, any>= {}
  
      Object.entries (newStatui).forEach(([id, status])=>{newData[id]= status.status});
      console.error(newData, 'nd', data, 'd', target || 'none ', 'tar', curStatus, 'cs', newStatui, 'ns',newStatus );
      if(Object.values(newData).length === 0 ){
        console.error('the new daya is bad  ',  newData);
        console.log('the new daya is bad  ', newData);
        return
      };
    await redis.hset(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), newData);
      newData.target = target ?? false
      newData.oldStatus = curStatus;
     
     await this.updateUsers(REDIS_KEY.ROOM(this.roomId), {status:newData}, false, {n:true})
  }
  // Define the background function
async  processScoreBackground(state: QuestionStates, user: any, isBonus: boolean): Promise<number> {
  // Use a switch to determine scoring logic based on state
  const status  = await redis.hget(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), user)
    const data= (await redis.hgetall(REDIS_KEY.USER_ROOM_DATA(this.roomId, this.ws.userId as string))) as unknown as  QuizUserData;
    await this.updateUsers(REDIS_KEY.ROOM(this.roomId), {questionState:state}, false, user )
  const {points, correctQs,  incorrectQs, xp,  seatNum, teamId} = data;
  switch (state) {
    case 'correct': // Logic for correct answers
      if (this.lastQuest && isBonus) {
        await redis.incrby(QUIZ_KEYS.POINTS, 40)
      //nus for last question
      } else if (isBonus) {
        await this.updateScores(QUIZ_KEYS.POINTS, 10, user); // Standard bonus
      } else {
        if(correctQs ===  4){
        
         const typeOut=  incorrectQs||0 > 1 ?QUIZ_KEYS.IMPERFECT_OUT:QUIZ_KEYS.PERFECT_OUT
           await this.updateScores(typeOut, 1, user)
           typeOut === QUIZ_KEYS.IMPERFECT_OUT ?await this.updateScores(QUIZ_KEYS.POINTS, 0 , user):  await this.updateScores(QUIZ_KEYS.POINTS, 20, user);
        }
        await this.updateScores(QUIZ_KEYS.POINTS, 20, user); // Regular points
         await this.updateScores(QUIZ_KEYS.CORRECT, 1, user);
      

      }
      return 0;
      break; // CRITICAL: Prevents falling through to the 'incorrect' case

    case 'incorrect': // Logic for incorrect answers
      await this.incorrect(isBonus, user, state, incorrectQs)
      return -1;
      break; // CRITICAL: Prevents falling through

    case 'please_correct': // Logic for requests to fix an answer
      return 1; // Signal for UI to prompt correction
    
    case 'more': // Logic for requesting more info
      return 2; // Signal for UI to show more info

    default: // Error handling for unknown states
      console.error(state); // Logs the invalid state
      return 3
      break;
  }
}
async incorrect(isBonus:boolean, user:string, inStatus?:string, inincorrectQs?:int){
  const status  =inStatus ||  await redis.hget(REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId), user)
   const incorrectQs = inincorrectQs || ((await redis.hgetall(REDIS_KEY.USER_ROOM_DATA(this.roomId, this.ws.userId as string))) as unknown as  QuizUserData).incorrectQs;
  
  if (this.lastQuest && !isBonus ) {
        await this.updateScores(QUIZ_KEYS.POINTS, -20, user); 
      } else {
        if(incorrectQs === 2){
          console.warn('switching to view')
              await this.switchStatus(status as string, USER_STATES.VIEWING, user );
             await this.updateScores(QUIZ_KEYS.BACKWARD_OUT, 1, user);
          await this.updateScores(QUIZ_KEYS.POINTS, -20 , user)// penalty error out 
        }
        await this.updateScores(QUIZ_KEYS.POINTS, -10, user); // Regular penalty
         await this.updateScores(QUIZ_KEYS.INCORRECT, 1, user);
      }
}
   protected async middleQuiz(state:QuestionStates, isBonus:boolean=false, user:string){
    //when this is called it happens during the new qusetion state
   
    await  this.updateUsers(REDIS_KEY.ROOM(this.roomId), {questState:state}, true)
    const  status  = await  this.processScoreBackground(state, user,  isBonus) //maybe await/not await to avoid blocking
     if([1, 2].includes(status)){return;}
    
      console.log('new question', this.questNum)
     await this.newQuestion(this.questNum);
     clearTimeout(this.timer);

  }
   public async figureJumpWinner (timeToWait:int=3000):Promise<string|int> {
   await new Promise(resolve=>setTimeout(resolve, timeToWait))
    const bestTimes:Record<string, string|int> [] = [];
   for ( const team of this.ws.teams ){
    
    const data =await this.store.hgetall(REDIS_KEY.REACTION_TIMES(this.roomId, team as string) );
  
    const teamTimes = Object.entries(data).filter(([id])=>!id.startsWith('_')).map(([id, jump]) => ({ // Convert object entries into an array of objects
        id, // Set the id from the entry key
      time: Number(JSON.parse(jump).jumpTime) // Convert the entry value to a primitive number
          })).sort((a, b) => a.time - b.time);
           // Correctly access the time property for comparison
           if(teamTimes.length > 0){
       bestTimes.push({id:teamTimes[0].id, time:teamTimes[0].time});
           }
        console.log(data, 'data', teamTimes, 'tts', bestTimes )
      }
       const team1Winner = bestTimes[0];
       const team2Winner = bestTimes[1] ?? {id:'', time:Infinity };
      if(team1Winner === team2Winner){return 0}//teams tied
      return team1Winner.time < team2Winner.time ? team1Winner.id: team2Winner.id; //either team 1 or team 2 won.

    };




    protected async newQuestion(_:int, timeNotused:int=1000):Promise<void>{
     const  questNum = this.questNum;
      console.warn('start quest', questNum);
      try{
     if( this.questInterId) this.isStop = true;
      this.skipQId && clearTimeout(this.skipQId)
      }catch(e){
        console.error(e, 'e with timers')
      }
      const time = this.timerSettings.questionInterval || 80;
      try{
      if(questNum >= this.questions.length){
        console.log('quiz over')
        console.warn('quiz over\n&*((((((((((((((((&&&&&&&&&&&************************8|n\n\n\n\n\n\t****quiz over_-=-__>>------->>>>>')
        await this.updateUsers(REDIS_KEY.ROOM(this.roomId), {end:true}, true)
       await this.finish()
       // await this.switchStatups('*', USER_STATES.VIEWING);
        return;
      }
   (!this.isTimeout && questNum !== 0) &&  await new Promise<void>((resolve)=> setTimeout(() => {
        resolve();
      
        
      }, this.timerSettings.waitAfterQuest|| 3000))
      this.isTimeout = false;
       await this.updateUsers(REDIS_KEY.ROOM_QUESTIONS(this.roomId), {question:{wait:true}}, true, {channel:REDIS_KEY.ROOM(this.roomId)});
        await new Promise<void>((resolve) => setTimeout(resolve, this.timerSettings.waitBetween || 4000));
     
       
      // 1. Setup basic data from your existing structure
const questObj  = this.questions[questNum];
      if(!questObj){
        console.log(questNum, this.questions, 'quest is bad bad')
        console.error('no question object found for quest num ', questNum, 'questions array', this.questions)
        await this.updateUsers(REDIS_KEY.ROOM(this.roomId), { end: true }, true)
        await this.finish()
        return;
      }
      const clientQuestId = `${Date.now()}90quest90${Math.random()}`;
const types = ['ftv', 'quote']
const type = questObj.type ==='ftv/quote' ? types[this.chanceRange(0, 1)]: questObj.type
      let question = type === 'quote' ? this.questions[questNum].ref as string: this.questions[questNum].question as string; // Original full string
    const words = question.split(' '); // Split by space to find word positions
      const trigWordIndex = type === 'quote' ? this.questions[questNum].trigs[this.month][2]||56660 :this.questions[questNum].trigs[this.month][0]||3000; // The index of the T-word

    // 2. Calculate the Start Index
    // We join all words BEFORE the trigger word with spaces to find the character count
    const textBefore = words.slice(0, trigWordIndex).join(' '); // Reconstruct string before T-word
    
    // The start index is the length of textBefore + 1 (for the space), 
    // unless it is the very first word (index 0).
    const startIndex = trigWordIndex === 0 ? 0 : textBefore.length + 1; // Start char index

    // 3. Calculate the End Index
    let tWord = '';
    let endIndex = -1
    try {
       tWord = words[trigWordIndex] ?? ''; // The target word itself
     endIndex = startIndex + tWord.length - 1; // End char inde
    } catch (error) {
      
      console.log(error, 'error wiht trigger word')
    }finally{
      console.log(tWord, endIndex, startIndex, question, questObj, trigWordIndex)
    }
   
      await this.updateUsers(REDIS_KEY.ROOM_QUESTIONS(this.roomId), { question: { wait: false } }, true, { channel: REDIS_KEY.ROOM(this.roomId) });
if(type === QUESTION_TYPES.ACCORDING){
      question = 'According to ' +question;
  await this.updateUsers(REDIS_KEY.ROOM_QUESTIONS(this.roomId), { question: { head: "Question" } }, true);
      
      }else{
   const header = `${questObj.numVerses  ? questObj.numVerses + ' Verse':''} ${type === QUESTION_TYPES.SQ ? 'Situation Question':type.charAt(0).toUpperCase() +type.slice(1)}`
  await this.updateUsers(REDIS_KEY.ROOM_QUESTIONS(this.roomId), {question:{head:header}}, true);
}
     // const regex = /ftv|quote|ftv\/quote/

   if(type === 'ftv'){
     
     question = (
       questObj.answer?.split(' ').slice(0, trigWordIndex > 4 ? trigWordIndex + 1 : 5) ||
       questObj.verse?.split(' ').slice(0, trigWordIndex > 4 ? trigWordIndex + 1 : 5) ||
       []
     ).join(' ');
   if(!question){
    console.error('quesiton ftv is not working', questObj)
    return;
   }
  
  }

    
        await new Promise<void>((resolve) => setTimeout(resolve, this.timerSettings.waitFromHead || 2000)); // Create a promise that resolves after 2000ms
        await this.switchStatus('*', USER_STATES.AWAITJUMPS);
       
        await redis.publish(REDIS_KEY.ROOM(this.roomId), JSON.stringify({ payload: [clientQuestId, "Question: ", 0] })) //each question starts with Question: 
     if(type === QUESTION_TYPES.SQ){
      this.questEnd = true;
     }
        const quest = question.split('');
       let char:string;
       let i:int = 0;
       this.questEnd = false 
       this.isStop= false;
        this.tWordTimestamp = Infinity; 
    const awaitQuest = ():Promise<void>=>{   return new Promise( resolve=>{
       this.questInterId= setInterval(async ()=>{
        if(i === quest.length || this.isStop){clearInterval(this.questInterId); resolve(); return;}
        char = quest[i];  
      
        if(!char)console.error('char,', char, 'of quest', questObj, question)
        
         await redis.publish(REDIS_KEY.ROOM(this.roomId), JSON.stringify({ payload:  [clientQuestId, char, i+1] }) )//this is for the ai to know when to react
        i++;

      }, time);
      
    });
  };
         await awaitQuest();
        this.questEnd = true;
        console.warn('end quest', questNum);
        this.questNum++;
        
        await redis.publish(REDIS_KEY.ROOM(this.roomId), JSON.stringify({ payload: [clientQuestId, '?', i] }))//this is for the ai to know when to react
        

        this.skipQId =  setTimeout(async ()=>{
         if( this.isStop ){return}
         console.warn(true, false, true, 'next question coming as this questions has timed out.')
          await  this.switchStatus('*' ,USER_STATES.WAITINGNEXT)
         await this.newQuestion(0)
        }, 5675);

      
      }catch(error){
       
        console.error('errror with new question", ', error)
      }
    }
async whileQGoing(i:int, start:int, end:int){
  if(i === start){
    this.tWordTimestamp = Date. now();
  await this.publish({trig:true, time:this.tWordTimestamp}, 'ai', REDIS_KEY.AI_ROOM(this.roomId))
  }
}
async finish(){
  try {
  const {data, error}  = await ServerLogic.readProfileData(SUPA_COLUMNS.ID, this.ws.supaId )
  
  const {online_quiz_data:oqd} = data as any ?? [];
  const online_quiz_data = Array.isArray(oqd) ? oqd : [];
  
  const teamScore = await redis.get(REDIS_KEY.TEAM_SCORE(this.roomId, this.ws.teamId as string))  || 0;
  const rawData = await redis.hgetall(REDIS_KEY.USER_ROOM_DATA(this.roomId, this.ws.username))
  const dataToSave: QuizUserData = {
      ...rawData,
      points: parseInt(rawData.points || '0'), // Converts string '20' to number 20
      xp: parseInt(rawData.xp || '0'),         // Converts string to number
      seatNum: parseInt(rawData.seatNum || '1'), // Converts string to number
      status: rawData.status || 'finished' ,
      teamScore // Ensures status is a string
    } as any;
    
    delete dataToSave.username;//not needed
   online_quiz_data.push(dataToSave);
   redis.del(REDIS_KEY.ACTIVE_USER_ROOM(this.roomId));
   await redis.zincrby(REDIS_KEY.MAIN + 'leaderboard', dataToSave.points, this.ws.username)
  const {success} =await ServerLogic.updateUserProfile(this.ws.supaId, {[SUPA_COLUMNS.QUIZ_DATA]:online_quiz_data}, 'update')
if(!data || error || !success){
    console.error(error, 'could not save data');
    this.updateFontend('error', {error:{message:'data saved to save'}, why:error} )
  }}
  catch(e:any){
    console.error(e, 'could not save data');
    this.updateFontend('error', {error:{message:'data saved to save'}, why:e} )
  }
  finally{
    this.cleanUser(this.roomId)
  }
}
      
  
 
/**
 * Validates the user's input against a target answer using 
 * fuzzy matching and frequency analysis.
 */
  checkAnswer(actaulAnswer: string, input: string, options:Options){
  const  answerChecker = new AnswerLogic();
  return answerChecker.checkAnswer(actaulAnswer, input, options);
}
}

class Quiz extends Rooms{
   constructor(userId: string,   ws:WebSocket){
    super(userId,   ws)
   }
  public async startQuiz(){
    console.error(this.questNum,'iopaffffffff')
     await this.store.sadd(ROOM_COUNTS.TIME, Date.now());
   await this.newQuestion(this.questNum);
  }

       readFriendReq (inpattern?:string, cout:int=100, onData?:Function):Promise<string[]|Error>{
        return new Promise((resolve, reject)=>{     
          const pattern = inpattern 
          const allKeys:string[] = []
      
           const inData= (data:string)=> {
           if (data.length) { // Check if the batch actually contains keys
             allKeys.push(...data); // Add the found keys to our master list
             if (onData) onData(data, allKeys)
           }
         }
    const stream =  this.store.scanStream({match:pattern,
      count:cout,
    })
    stream.on('data', inData)
    stream.once('end', ()=>{
      console.log('end');
      stream.off('data', inData);
      resolve(allKeys);
      
          return;
    })
    stream.once('error', (e)=>{
      stream.off('data', inData);
      console.error(e);
     reject(new Error('failed to load data, for user:'+this.ws.username +' key name:'+ pattern))
    })
    })
  }


}
    // Rooms class constructor

export * from './types.js'
export {   Rooms, RedisMananger , Quiz};
