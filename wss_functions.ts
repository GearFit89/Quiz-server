
import  fs  from 'fs/promises';
import { supabase, JWT_ACCESS_KEY, IS_DEV_MODE} from './mainApp.js';
import RAW_BOTS from './json/bots.json'  with {type:'json'}
const BOTS:Record<string, any> = RAW_BOTS.modes;
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import https  from 'https';
import { Agent } from './AI_quizzier.js';
import { ServerLogic } from './logic_scripts.js';
import { Redis } from 'ioredis';

import {redis, sub, RedisSet, RedisMananger, Updates , IRooms, REDIS_KEY, USER_STATES, Quiz, RoomType, RoomData, QUIZZES} from './logic.js'

type int = number;
 const REDIS_HOST:string = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || '6767', 10);
//sorthand types
const ESV_API_KEY = process.env.ESV_API_KEY;
const UPDATE_TYPES = {
    PROFILE: 'profile',
    USERS: 'users',
    DATA: 'data'
};

type QuizMonth = [string, string[], string];
const quizMonths: QuizMonth[] = [
  ['october', ['1', '2', '3', '4', '5'], 'Matthew'],
  ['november', ['6', '7', '8', '9'], 'Matthew'],
  ['december', ['10', '11', '12'], 'Matthew'],
  ['january', ['13', '14'], 'Matthew'],
  ['february', ['15', '16'], 'Matthew'],
  ['march', ['Jonah'], 'Jonah'],
];

const matthew: Record<string, any> = {};
const textdemo: Record<string, string[]> = {
  '5': [
    '1 Seeing the crowds, he went up on the mountain, and when he sat down, his disciples came to him.\n',
    '2 And he opened his mouth and taught them, saying:\n\n',
    '3 “Blessed are the poor in spirit, for theirs is the kingdom of heaven.\n',
    // ... (truncated for brevity)
  ],
  '6': [
    '1 “Beware of practicing your righteousness before other people in order to be seen by them, for then you will have no reward from your Father who is in heaven.\n',
    // ... (truncated for brevity)
  ],
};
matthew['Matthew'] = textdemo;
interface QuizData {
  QUESTIONS: Record<string, object>;
   VERSES:  Record<string, object>;
    DATA: Record<string, object>;

}


const Bool = {
  'T':true,
  "F":false,
}
const ROOM_STATES ={
  PENDING:"pending", //waiting for the users to join
  STARTING:"starting",
  ACTIVEQUIZ:'quizzing',
  AWAITJUMPS:'waiting for jumps from the user',
  USERINPUT:'user is entering an input',
  WAITINGNEXT: 'users waiting for next question',
  APPEALING:'appealing',
  DONE:'done'
}


interface MSG {
  payload:string|Record<string, any>;
 channel:string;
 to:string;
 from:string;
 date?:string;
}


declare module 'ws' {
  // This "merges" your new properties into the existing WebSocket interface
  interface WebSocket {
    clientIp?: string;
    userId?: string;
    roomId?:string;
    teamId?:string;
    canUse?: boolean;
    isAlive?: boolean;
    supabase?: any;
    allQs?:Record<string, any>;
    signedIn?: boolean;
    userData?: Record<string, any>;
    isBlocked?:boolean;
    friends?:string[];
    quizId?:string;
    xp?:int;
    username:string;
    
  }
}






 export const GAMEACTIONS = {ASK:'ask', ACCEPT:'aceept', DECLINE:'Decline'}

// Define an interface for the expected incoming message structure
const Tables = {
  profiles:'profiles',
  user_stats:'user_stats',
  quizzes:'quizzes',
  quiz_questions:'quiz_questions',
  user_quiz_data:'user_quiz_data'
}
Object.freeze(Tables);
/*enum WsStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  RETRY = 'retry'
}*/

interface WsMessage {
  requestId: string;
  func: string;
  args?: any[];
  type?:string;
  data?:string|Record<string, any>
}
interface Token {
  name:string;
  id:string;
  age:string;
  payload?:string;
  token?:string
}
interface UserData {
  username: string;
  email?: string;
  id: string|null;
  
  updatedAt?: string;
  createdAt?: string;
  sessionId?: number;
  secretToken?: string;
  anyomous?: boolean;
  verified?: boolean;
  metaData?: Record<string, any>;
}
interface PublicUserData {
  username: string;
 sessionId?: number;
  xp?: number;
}
interface AuthData {
  accessToken:Token;
  refreshToken:Token;
}

interface ILook{
  color?:string;
  icon?:string;
}
export class WssFuncs {
  ws: WebSocket;
  roomId:string;
  seconds: number;
  canUse: boolean;
  //logic: ServerLogic;
 private settings: Record<string, any>;
  private friendsReq: string[];
  public redis:RedisSet;
  private friendAwaitngRes:string
  private invitesToAccept:RoomData[]
  Session:any;
  constructor(ws: WebSocket,id:string, ioredis:RedisSet, secs = 30) {
   this.ws = ws;
    this.seconds = secs;
    this.canUse = true;
    this.roomId ='empty';
    this.redis = ioredis;
    this.Session = ioredis
    this.ws.teamId = (this.ws.username as string + (Date.now() * Math.random() ).toString(34))as string
    this.friendAwaitngRes= '';
    this.friendsReq = [];
    this.settings = {};
    this.invitesToAccept = [];
    const setFriends= async ()=>{this.friendsReq = await redis.smembers(REDIS_KEY.USER_REQ_FRIENDS(this.ws.username))||[]};
    setFriends()
     redis.hset(REDIS_KEY.USER_PROFILE(this.ws.userId as string), {status:USER_STATES.CONNECTED});
     this.redis.psubscribe(REDIS_KEY.USER_REQ_INVITES(this.ws.username, '*'), (chan:string, data:Record<string, any>)=>{
     console.log(data.payload.roomId, 'game id', data.payload.game)
    this.invitesToAccept.push({...data.payload.game as RoomData,action:data.payload.action, canDecline:data.payload.canDecline, id:data.payload.roomId });
    
      this.redis.updateFontend(Updates.USERS, {game:data.payload.game,id:data.payload.roomId, channel:data.channel, opponent:data.from, action:data.payload.action, canDecline:data.payload.canDecline  })
  });
    this.redis.psubscribe(REDIS_KEY.USER_REQ_FRIENDS(this.ws.username), async (chan:string, data:Record<string, any>)=>{
      console.log(data.from, chan,)
     
      if(data?.payload?.success &&data?.from === this.friendAwaitngRes){
    await  this.redis.punsubscribe(REDIS_KEY.USER_REQ_FRIENDS(this.ws.username));
    this.ws.friends?.push(data.payload.username);
    this.redis.updateFontend(Updates.USERS, {friendUser:data.payload.username, accepted:true, success:true})
  }else{
    
        this.redis.updateFontend(Updates.USERS, { friend: data.payload, friendUser: data.payload.username })
  }
    })
  }
  
 async  acceptFriendReq(username:string, isDeclined:boolean){ 
  //ii need to test this out with supa 
  if( !(await  redis.sismember(REDIS_KEY.USER_REQ_FRIENDS(this.ws.username), username) )|| this.ws.friends?.includes(username) ){
    const  dTS = {error:'can not get friend' , success:false}
    return {dTS};  }


      await  redis.srem (REDIS_KEY.USER_REQ_FRIENDS(this.ws.username ), username);
      if(isDeclined){
        await  this.redis.publish({success:false, username:this.ws.username},'person',REDIS_KEY.USER_REQ_FRIENDS(this.ws.username) )
        const  dTS = {error:'friend declined' , success:true}
    return {dTS};  }
     const { error } = await supabase.rpc('append_friend', {
  tar_id: this.ws.username, 
  new_friend: username  
}); //adds the freind to the other users as well
const { error:reqSenderErr } = await supabase.rpc('append_friend', {
  tar_id: username, 
  new_friend: this.ws.username 
});
await  this.redis.publish({success:true, username:this.ws.username},'person',REDIS_KEY.USER_REQ_FRIENDS(this.ws.username) )
this.ws.friends?.push(username);  
if(reqSenderErr){const  dTS = {error:'can not save friend whom request it was' , success:false, msg:error}
    return {dTS};  }
    if(error){const  dTS = {error:'can not save friend' , success:false}
    return {dTS};  }
  return { dTS:{success:true}}
    }            

async setusername(user:string){
  if(!IS_DEV_MODE)return;
  this.ws.username = user;
}
  deldb(){
    if (!IS_DEV_MODE) return;
   redis.flushall();
   console.warn('redis db deletef')
  }
  async sendFriendRequests (username:string){
    if(username == this.ws.username && !IS_DEV_MODE){return {dTS:{error:'can not send friend request to ur self', success:false}}}
  if(this.ws.friends?.includes(username) || await redis.sismember(REDIS_KEY.USER_REQ_FRIENDS(username), this.ws.username) )
    {return {dTS:{succes:false}}}//checks to see if alreay friend or alreay sent request
  await  redis.sadd(REDIS_KEY.USER_REQ_FRIENDS(username), this.ws.username);
  await  redis.expire(REDIS_KEY.USER_REQ_FRIENDS(username), 60*60*24*4);
  this.friendAwaitngRes= username
  await this.redis.publish({req:'friend', username:this.ws.username},'', REDIS_KEY.USER_REQ_FRIENDS(username) )
 
  
 
  const dTS = {success:true};

   return { dTS }
  }
  handleReactBtn(){
   const  btns = {
    NEXT:'next',
    APPEAL:'appeal'
   }

  }
  async setUserLook(Look:ILook){
    if(!Look ||  (!Look?.color && !Look?.icon))return;
     await redis.hset(REDIS_KEY.USER_LOOK(this.ws.username), {color:Look.color, icon:Look.color});
    const dTS = { success: true }
    return { dTS };
  };
  async getUserLook(){
   
    const data = await redis.hgetall(REDIS_KEY.USER_LOOK(this.ws.username));
    const dTS = { success: true , data};
  
    return { dTS };   
  }
  async soloQuiz(config:RoomData){
    const status  = await redis.hget(REDIS_KEY.USER_PROFILE(this.ws.userId as string), 'status')
    if( this.Session?.isActive     ){
      await this.Session?.destroy();
      console.log('session reset')
      const  dTS = {error:'reset as u try to access other time' , success:false}
    return {dTS};
    }
      
        
    await redis.hset(REDIS_KEY.USER_PROFILE(this.ws.userId as string), {status:USER_STATES.WAITCHALLANGE});
   
  
  const roomId  = await this. Session.createRoom({quizId:config?.quizId || 's1', requiredUsers:[], settings:this.settings || {}});
  this.roomId = roomId;
  this.ws.roomId = roomId;
  const dTS =  {success:true}
return {dTS}
  }
  async openRoom(settings:Record<string, any>={}, maxUsers=4){
    settings.maxUsers = maxUsers;
    if(typeof maxUsers !== 'number' || maxUsers < 2 || maxUsers > 10){maxUsers = 4}//sanity check for max users
     const status  = await redis.hget(REDIS_KEY.USER_PROFILE(this.ws.userId as string), 'status')
    if(status ===USER_STATES.WAITCHALLANGE || this.Session?.isActive     ){
     // await this.Session?.destroy();
      console.log('session reset')
      const  dTS = {error:'can not save invite as u r waiting for one rigth now' , success:false}
    return {dTS};
    }
    
    const newRoom = async () => {
      const roomId = this.Session.createRoom({ maxUsers: maxUsers, ...this.settings, quizId:'o9' });
      await redis.hset(REDIS_KEY.USER_PROFILE(this.ws.userId as string), { status: USER_STATES.WAITCHALLANGE });
      await redis.sadd(REDIS_KEY.OPEN_ROOM, roomId)
};
    const openRooms =await  redis.scard(REDIS_KEY.OPEN_ROOM)
    console.log(await redis.smembers(REDIS_KEY.OPEN_ROOM), 'open rooms count')
     if (openRooms === 0){
      
       await newRoom();
          }else{

     const randRoom = await redis.srandmember(REDIS_KEY.OPEN_ROOM);
     await this.Session.joinRoom(randRoom);
      this.redis.updateFontend(Updates.QUIZ, {success:true})
     }
     const dTS =  {success:true}
return {dTS}
  }
  //public senhdChallenage(usersToInvite: string[], gameDetails: RoomData, canDecline: boolean): Promise<Record<string, any>>;
  async sendChallenage(config:RoomData, ): Promise<Record<string, any>>{
    
    let {requiredUsers:usersToInvite, settings, quizId, canDecline} = config;
    if(!usersToInvite || !quizId){const  dTS = {error:'can not send invite without users or quiz id' , success:false}
    return {dTS};  }
    if (usersToInvite.includes( this.ws.username) && !IS_DEV_MODE) { return { dTS: { error: 'can not send game invite request to ur self', success: false } } }
   if(typeof usersToInvite === 'string') usersToInvite = [usersToInvite];
    const status  = await redis.hget(REDIS_KEY.USER_PROFILE(this.ws.userId as string), 'status')
    if( this.Session?.isActive     ){
      await this.Session?.destroy();
      console.log('session reset')
      const  dTS = {error:'reset as u try to access other time' , success:false}
    return {dTS};
    }
      
        
    await redis.hset(REDIS_KEY.USER_PROFILE(this.ws.userId as string), {status:USER_STATES.WAITCHALLANGE});
   config.settings =  (this.settings || {}) as unknown as RoomData["settings"];
  
  const roomId  = await this. Session.createRoom(config);
  this.roomId = roomId;
  config.roomId = roomId;
  this.ws.roomId = roomId;
  for (const usernameToInvite of usersToInvite){
   await this.redis.publish({channel:REDIS_KEY.USER_REQ_INVITES(usernameToInvite, this.ws.username),game:config, action:GAMEACTIONS.ASK, canDecline, roomId:this.Session.roomId, req:'invite'}, 'person', REDIS_KEY.USER_REQ_INVITES( usernameToInvite, this.ws.username))
  await this.redis.psubscribe(REDIS_KEY.USER_REQ_INVITES( usernameToInvite, this.ws.username), async (chan:string, data:Record<string, any>):Promise<void>=> {
  await this.Session.punsubscribe(REDIS_KEY.USER_REQ_INVITES(usernameToInvite, this.ws.username))
    if(data?.payload?.action === GAMEACTIONS.DECLINE){
      console.log('declined');
       this.redis.updateFontend(Updates.USERS, data.payload)
    //await this.Session.destroy() 
  }else if(data?.payload?.action === GAMEACTIONS.ACCEPT){
        console.log('accpeted', usernameToInvite);
        this.redis.updateFontend(Updates.USERS, data.payload)
  }
    
  })
}
  const dTS =  {success:true}
return {dTS}
  }
 async  getLeaderboard(){
  let dTS = { success: true, error:'' }
  await new Promise((resolve, reject)=> {redis.zscanStream(REDIS_KEY.MAIN + 'leaderboard', {match:this.ws.username}).on('data', (result)=>{
        if(result.length){
          const [member, score] = result[0];
          console.log('current leaderboard score for user:', member, 'is', score);
          this.redis.updateFontend('leaderboard', {leaderboard:{username:member, score}, channel:REDIS_KEY.USER_PROFILE(this.ws.userId as string)})
        }else{
          console.log('user not found in leaderboard, likely first time playing');
        }
      }).on('error', (e)=>{
        reject(e);
        console.error(e, 'error fetching leaderboard data for user')
      }).on('end', ()=>{ resolve(null) });
  }).catch(e=>{console.error(e, 'error with leaderboard'); dTS = {success:false, error:'could not get leaderboard data'}});
 
return {dTS}

  }
  async answerInvite(isDeclined:boolean, roomId:string){
    const roomStatus = await redis.hget(REDIS_KEY.ROOM(roomId), 'status')
    console.log(this.invitesToAccept, 'accpet');
    let index = -1;
    const gameToP = this.invitesToAccept.find((game, i)=>{if( roomId  === game.id){
              index = i;
              return roomId === game.id
    }})
    if(  roomStatus === ROOM_STATES.ACTIVEQUIZ){
      console.log('view quiz logic or late join goes here ')
      const dTS = {success:false}
    return {dTS}
    }
    if(! gameToP|| this.Session?.isActive ){ const  dTS = {error: (!gameToP ? 'can not get room':'can not find game ') , success:false}
    return {dTS};  }
     const {id,  action, canDecline, channel} = gameToP
    if(canDecline && isDeclined) {
      await this.redis.publish({action:GAMEACTIONS.DECLINE}, '', channel as string);
      const  dTS = {error:'can not get room because it got declined' , success:true}
    return {dTS};  
    }
    if(action === GAMEACTIONS.ASK){
       await this.redis.publish({action:GAMEACTIONS.ACCEPT}, '', channel as string);
         
         await  this.Session.joinRoom(roomId);
        this.roomId = roomId;
  this.ws.roomId = roomId
         this.redis.publish({action: GAMEACTIONS.ACCEPT}, 'op', channel as string)
         this.redis.updateFontend(Updates.QUIZ, gameToP)
    }
     const dTS =  {success:true}
return {dTS}
  }
  async recordJump(){
  const id =   this.ws.userId as string;
  const idt =   this.ws.teamId as string; //team id
  const room = this.ws.roomId as string;
  const jumpTime = Date.now() +'';//coverts to string to avoid confusion
 const  dTS = {error:'can not jump yet' , success:false}
 const status =  await redis.hget(REDIS_KEY.ROOM_PLAYERS_STATES(room), id);
 console.log(status, true, room, id, status);
//if(status !== USER_STATES.AWAITJUMPS){return { dTS }; }
dTS.error = '';
dTS.success = true;
 await this.redis.updateUsers( REDIS_KEY.REACTION_TIMES(room, idt), {jumpTime}, false, {channel:REDIS_KEY.ROOM(room), update:'stream'} );
 
 return { dTS}
}
 async  recordUserInput(input:string){
    const id =   this.ws.userId as string;
  const room = this.ws.roomId as string;
 
 const  dTS = {error:'can not type yet' , success:false}
 const status =  await redis.hget(REDIS_KEY.ROOM_PLAYERS_STATES(room), id);
 if(status !== USER_STATES.ANSWERING){return { dTS }; }
dTS.error = '';
dTS.success = true;
  await this.redis.updateUsers( REDIS_KEY.ROOM(room), {answer:input}, false, {update:'stream'});
  return { dTS} 
  }

  study(e: any) {
    console.log('studying', e || ' u do not have a name go away');
    const dTS = { study: 'works' };
    return { dTS };
  }
async recordAnswerChar(char:string){
  const id = this.ws.userId as string;
  const room = this.ws.roomId as string;

  const dTS = { error: 'can not type yet for char', success: false }
  const status = await redis.hget(REDIS_KEY.ROOM_PLAYERS_STATES(room), id);
  if (status !== USER_STATES.ANSWERING) { return { dTS }; }
  dTS.error = '';
  dTS.success = true;
  await this.redis.updateUsers(REDIS_KEY.ROOM(room), { answerChar: char }, false, { update: 'stream' });
  return { dTS } 

}
async getCurStatus(){
  const data = await redis.hgetall( REDIS_KEY.ROOM_PLAYERS_STATES(this.roomId) );//this object is used as [username]:status
  return {dTS:{status:data}}
}
  async getUsersOnline(){
    const dTS = { count: await redis.scard(REDIS_KEY.ONLINE_USERS), members: await redis.smembers(REDIS_KEY.ONLINE_USERS) }
    return {dTS}
  }
async getUsersOffline(){
  if(!IS_DEV_MODE)return {dTS:{error:'u are wired'}}
  //secuity purposes to aline with user poilcy of not showing offline users in dev mode
  const dTS = { count: await redis.scard(REDIS_KEY.OFFLINE_USERS), members: await redis.smembers(REDIS_KEY.OFFLINE_USERS) }
  return { dTS }
}
  async getUserData(username:string = this.ws.username as string){
    const data:UserData = await redis.hgetall(REDIS_KEY.USER_PROFILE(username as string)) as unknown as UserData;
    delete data.email;
    delete data.sessionId;
    delete data.secretToken;
    data.id ='';
    const dTS = { success: true, data }
    return { dTS }

  }
 async computerQuiz(config:RoomData){
const botName = config.quizId || 'b1';
    if(Object.values( BOTS)){
      const botConfig = BOTS[botName];
      config.settings = {...config.settings, ...(botConfig.settings || this.settings || {}), quizId: botConfig.quizId} as unknown as RoomData["settings"];
      await this.soloQuiz(config);
     const bot =  new Agent(botConfig, this.roomId);
     await bot.init();
      const dTS = { success: true }
      return { dTS }
     }else{
      const dTS = { error: 'bot not found', success: false }
      return { dTS }
    }
  }
setSettings(settings:Record<string, any>|string){
  if(typeof settings === 'string'){ 
    this.settings = QUIZZES[settings];
    return {dTS:{success:true}}
  }
  this.settings = settings;
  return {dTS:{success:true}}
}
  async getPassage(
    month: string,
    params: Record<string, any> = { /* ... defaults ... */ },
    endpoint = 'text',
    verselens?: number,
    max_min?: string
  ) {
    // 1. Rate Limiting Check
    
  
    try {
      const { err, passage, book } = await asyncgetpassages(month, params, endpoint, max_min);
      
      if (err) {
        return { error: err };
      }
      
      const monthoi: any[] = quizMonths.find((m) => m[0] === month) || ['december', ['10', '11', '12'], 'Matthew'];
      const sortedpassage = sortPassages(passage, book, monthoi[1], verselens);
  
      // Return a clean object. 
      // The WebSocket handler will add the requestId to this.
      return { 
        success: true,
        passage: sortedpassage 
      };
  
    } catch (fatalError) {
      console.error("Critical failure in getPassage:", fatalError);
      return { error: "Internal server error" };
    }
  }
}
async function asyncgetpassages(
  query = 'december',
  params: Record<string, any> = {
    'include-headings': false,
    'include-footnotes': false,
    'include-chapter-numbers': true,
    'include-short-copyright': true,
    'include-passage-references': true,
    'inline-styles': true,
  },
  endpoint = 'text',
  max_min?: string
): Promise<any> {
  console.log('rreq startedb');
  const userInMonth = query || 'december';
  const month = quizMonths.find((Month) => Month[0] === userInMonth) || ['december', ['10', '11', '12'], 'Matthew'];
  const book = month[2] || 'Matthew';
  const Maxchp = month[1][month[1].length - 1] || '5';
  const minChp = month[1][0] || '1';

  const passageQuery = max_min || `${book}+${minChp}-${Maxchp}`;
  query = passageQuery || 'Matthew+1-5';

  console.log('query', params);
  const searchParams = new URLSearchParams(params);
  console.debug('search params', searchParams.toString());
  const url = `https://api.esv.org/v3/passage/${endpoint}/?q=${query}&${searchParams.toString()}`;
  console.debug('url', url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${ESV_API_KEY}`,
      },
    });
    if (response.ok) {
      const returnedQuery = await response.json();
      const passage = returnedQuery.passages[0];
      return { passage, month, book };
    } else {
      console.error('Error with getting passage', response.status);
      const err = 'response not ok';
      return { err, month, book };
    }
  } catch (e: any) {
    console.error('error in getting passage from esv.org', e.message);
    const err = e;
    return { err, month, book };
  }
}

function sortPassages(
  passages: string,
  book: string,
  chps: string[] = ['1', '2', '3'],
  customverselen?: number
): { esvText: Record<string, any>; sections: string[] } {
  console.log(book);
  const esvText: Record<string, any> = {};
  let chIndex = 0;
  let sections: string[] = [];
  let curBook: Record<string, any> = {};
  const regex = new RegExp(`${book} \\d`);

  let verses = passages.split('[').slice(1);

  console.debug('chapters', chps);
  let temp: string[] = [];
  for (let i = 0; i < verses.length + 2; i++) {
    let word = verses[i];

    if (word?.slice(0, 2) === '1]' && i !== 0 || i === verses.length) {
      curBook[chps[chIndex]] = temp;
      if (i === verses.length) break;
      chIndex++;
      temp = [];
      temp.push(word.replace(']', ''));
    } else {
      temp.push(word.replace(']', ''));
    }
  }

  esvText[book] = curBook;

  Object.values(curBook).forEach((chp) => {
    const len = chp.length;
    const leftOver = len % 5;
    const verselens = customverselen || Math.floor(len / 5);

    for (let i = 0; i < len; i += verselens) {
      const sectionRow = chp.slice(i, i + verselens);
      const section = sectionRow.length === verselens ? chp.slice(i, i + verselens) : chp.slice(i);
      sections.push(section);
    }
  });
  sections.push('review');
  esvText[book] = curBook;

  return { esvText, sections };
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  message: string;
  userId?: string;
  roomId?: string;
  data?: Record<string, any>;
  stackTrace?: string;
}

export class Logger {
  private logFilePath = 'app.log';
  private logBuffer: LogEntry[] = [];
  private bufferSize = 100;

  async log(
    message: string,
    level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' = 'INFO',
    context?: { userId?: string; roomId?: string; data?: Record<string, any>; error?: Error }
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      userId: context?.userId,
      roomId: context?.roomId,
      data: context?.data,
      stackTrace: context?.error?.stack,
    };

    this.logBuffer.push(entry);

    if (this.logBuffer.length >= this.bufferSize) {
      await this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      const logs = this.logBuffer.map((entry) => JSON.stringify(entry)).join('\n');
      await fs.appendFile(this.logFilePath, logs + '\n');
      this.logBuffer = [];
    } catch (err) {
      console.error('Failed to write logs:', err);
    }
  }

  async error(message: string, error: Error, context?: any): Promise<void> {
    await this.log(message, 'ERROR', { ...context, error });
  }

  async warn(message: string, context?: any): Promise<void> {
    await this.log(message, 'WARN', context);
  }

  async info(message: string, context?: any): Promise<void> {
    await this.log(message, 'INFO', context);
  }

  async debug(message: string, context?: any): Promise<void> {
    await this.log(message, 'DEBUG', context);
  }
}

export const logger = new Logger();
export const METHODS ={
  "methods": [
    "acceptFriendReq",
    "sendFriendRequests",
    "handleReactBtn",
    "sendChallenage",
    "answerInvite",
    "recordJump",
    "recordUserInput",
    "study",
    "getPassage"
  ]
}