


import { WebSocketServer, WebSocket, Server } from 'ws';
import  fs  from 'fs/promises';
import { DATA } from "./app.js"
import { supabase, JWT_ACCESS_KEY, IS_DEV_MODE } from './mainApp.js';
import { Redis } from 'ioredis';
import jwt from 'jsonwebtoken';
import { WssFuncs } from './wss_functions.js'
import { ServerLogic } from './logic_scripts.js';
import {SupaColumns,QUESTION_TYPES,SUPA_COLUMNS, QuizUserData, Question, QuizSettings, QUIZ_KEYS, defaultQuizSettings, Tables, WsMessage, QuestionSettings, Options, SpellCheckResult, UserData, REDIS_KEY,USER_STATES,RedisSet, RedisMananger, redis, Quiz, /// <reference path=" " />
Updates
 } from './logic.js'
import { EventEmitter } from 'events';
const parseCookies = (cookies: string | undefined): Record<string, string> => {
  if (!cookies) return {};
  const allCookies: Record<string, string> = {};
  cookies.split('; ').forEach((cookie) => {
    const [name, value] = cookie.split('=');
    allCookies[ name as string] =  decodeURIComponent(value as string)
  });
  return allCookies;
};
export const Clients = new Map()
export function handleWsConnection(
  ws: WebSocketServer, // Ensure the server instance is passed or refreshible
  onConn?: () => void,
  onError?: () => void,
  onClose?: () => void,
  onListen?: () => void,
  onMessage?: () => void
) {
  ws.on('listening', () => {
    console.log('Server is listening for WebSocket connections');
    if (typeof onListen === 'function') onListen();
  });

  ws.on('connection', async (wsc: WebSocket & { cookies?: any }, req) => {
    // 1. Setup Request Context
   
     wsc.on('error', (e) => {
      console.error('WebSocket client error:', e);
       
      if (typeof onError === 'function') onError();
    });

    wsc.on('close', async (code, reason) => {
      Clients.delete(wsc.username)
      console.log(`Connection closed. Code: ${code}, Reason: ${reason}`);
      await redis.srem(REDIS_KEY.ONLINE_USERS, wsc.username)
      await redis.sadd(REDIS_KEY.OFFLINE_USERS, wsc.username)

try {
  await ServerClient.cleanUser(wsc.roomId as string)//maybe id:IoI(8SUHVBSKJjh>DJlklkja.sdfsjfskaflpooo [poop])
  await ServerClient.unsubscribeAll();
 if(cleanUp)  cleanUp();
} catch (error) {
  console.error(error)
}
      
     
      if (typeof onClose === 'function') onClose();
    });

    wsc['clientIp'] =( req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
    let id:string= 'empty';
    const cookies = parseCookies(req.headers.cookie);
    const userInit = await initUser(cookies, wsc, id);
   wsc['canUse']  = true;
  if(IS_DEV_MODE){
    
     
   if(Clients.has('a')){
     wsc.username ='b';
     console.log('user b ');
     wsc.userId ='b'
   }else{
    wsc.username ='a';
     console.log('user a ');
     wsc.userId ='a'
   }
  
    if(!userInit.userData?.id)  {
      console.error('unathhpired bit dev')
      //create a test id (fake)
      console.log(ws.clients, Clients, id)
      
      
    }; 
    if(userInit.userData?.id) console.log('success for dev', userInit.userData?.id);
    
  }else{
    if(Clients.has(id)){
      wsc['canUse']  = false;
    }
  }
    if(!userInit.userData && !IS_DEV_MODE){wsc.terminate(); console.error('unathhpired'); return;}
    id  = userInit.userData.id as string|| 'empty'
   
      if(( id as string === 'empty' || !wsc.signedIn) && !IS_DEV_MODE){wsc.terminate(); console.error('unathhpired');}
      
    Clients.set(wsc.username, wsc);
    const ServerClient = new Quiz(wsc.username,   wsc) as RedisSet
    const funcMap = new WssFuncs(wsc, wsc.username , ServerClient, 30);
    const meta = (userInit.userData.metaData || {} )as Record<string, any>;
  meta.refresh_id = '';
  meta.session_id = '';
  meta.id = '';

    ServerClient.updateFontend(Updates.PROFILE, meta);
    userInit.userData.metaData = JSON.stringify(userInit.userData.metaData) as string;
    redis.hset(REDIS_KEY.USER_PROFILE(wsc.username), userInit.userData)
  await redis.sadd(REDIS_KEY.ONLINE_USERS, wsc.username)
  ServerClient.heartBeat(30* 1000); //ping pong cleint and server 
  if(await ServerClient.isRateLimited(wsc['userId'] as string, 120, 10)) {wsc.terminate(); console.error('unathhpired rate limited'); return;}
    const cleanUp = await ServerClient.initpsubscribe();
    console.log('Client connected from:', req.socket.remoteAddress);
    if (typeof onConn === 'function') onConn();

    // 2. Error and Close Listeners
   
    // 3. Message Handling
    wsc.on('message', async (dataIn, isBinary) => {
      const dataString = isBinary ? dataIn : dataIn.toString();
      let dTS: any = { data: 'none at all' };
      let reqID: string | null = null;

      try {
        // Parse and validate incoming JSON
        const data: WsMessage = JSON.parse(dataString.toString());
       
        reqID = data.requestId;
        const eventFunction = data.func;
        const args = Array.isArray(data.args) ? data.args : [];
         console.log(`Executing: ${eventFunction}from clent username is ${wsc.username}`, args);

        if (funcMap[eventFunction as keyof typeof funcMap]) {
          try {
    const result = await (funcMap as any)[eventFunction](...args);

            dTS = result.dTS || result; // Fallback if dTS isn't the top-level key
          } catch (e: any) {
            console.error(`Error executing ${eventFunction}:`, e);
            dTS = { error: 'Internal Function Error', message: e.message };
          }
        } else {
          console.error(`Method ${eventFunction} not found`);
          dTS = { error: 'Method Not Found' };
        }
      } catch (parseError) {
        console.error('Failed to parse message:', parseError);
        dTS = { error: 'Invalid JSON format' };
      }

      // Always return the requestId so the client knows which request this belongs to
      dTS.responseToId = reqID;
      wsc.send(JSON.stringify(dTS));
      if (typeof onMessage === 'function') onMessage();
    });
  });
}
 async function initUser(incookies:Record<string,string>, wsc: WebSocket & { cookies?: any }, id:string) {
    try {
    
    const cookies = incookies
    wsc.cookies = cookies;
     console.log('coks', cookies, )
    const { refreshToken, accessToken } = cookies;
      console.log('coks', cookies,   refreshToken, 'rr')
    const vtoken = jwt.verify(refreshToken as string,JWT_ACCESS_KEY as string);
     const vtoken2 = jwt.verify(accessToken as string,JWT_ACCESS_KEY as string);
    console.log(vtoken, 'v now it is access', vtoken2)
    const token = typeof vtoken  === 'object' ? vtoken: JSON.parse(vtoken as string);
 id =  token.id; 
 const atoken = vtoken2
console.log('vtok', vtoken, atoken)


const { data, error } = await supabase
  .from(Tables.profiles)
  .select('*')
  .eq('id', id )
  .single();
  if(error) {console.error('supa', error)}
console.log('supa data', data, 'refresh', data.access_id)
console.log('refreash/refresh', data.session_id, 'verus fromcok', accessToken, data.session_id === refreshToken, atoken, 'vs', data.access_id)
      if (error || data.access_id.replaceAll('"', '') !== atoken.replaceAll('"', '')) throw new Error('User not found');
const userData:UserData ={
  username:data.username,
  id: data.id,
  signIn:true,
   status:USER_STATES.CONNECTED,
   anyomous:false,
   email:data.email,
   metaData:{...data}

}
wsc.userId = data.username;
wsc.supaId = data.id;
wsc['username'] = data.username;
wsc['teamId'] = data.team_name || data.username + (Date.now().toString() + Math.random.toString())
wsc['signedIn'] = true;


return {userData}
    }catch(e: any){
      console.log('no valid token found for ws connection', e.message);
        const userData:UserData ={
           username:'empty',
            id:'empty',
            anyomous:true,
            signIn:false,
            status:USER_STATES.DISCONNECTED

}
wsc['username'] = ''
wsc['signedIn'] = false;

return {userData}
    }
  }