
import { EventEmitter } from "stream";
import  { Redis } from 'ioredis'
import { REDIS_KEY, UserUpdate} from "../types.js";
//note remeber that ws has the userId and username property

const REDIS_URL = process.env.MY_REDIS_URL /// for render to give me the url for this libary 
export const quizEvents = new EventEmitter();

export const redis = new Redis(REDIS_URL as string, {
    family: 0,
    tls: {
        ///rejectUnauthorized:true,

    }
});

export const sub = redis.duplicate();
export class RedisManager extends EventEmitter {
    protected store: Redis;
    protected ws: any;
    private heartId: any = 'empty';
    private lags: number[] = [];
    private startTime: number = 0;

    constructor(redisClient: Redis, ws?: any|null) {
        super();
        this.store = redisClient;
        this.ws = ws || null;
    }

    public heartBeat(time: number = 30 * 1000): void {
        if(!this.ws) return;
        this.ws.on('pong', () => {
            this.ws.isAlive = true;
            this.lags.push(Date.now() - this.startTime);
            if (this.lags.length > 10) this.lags.shift(); // keeps it short
        });

        this.ws.isAlive = true;
        this.heartId = setInterval(() => {
            if (!this.ws.isAlive) {
                clearInterval(this.heartId);
                this.ws.terminate();
                console.log(`Connection closed because inactive too long`);
            }
            this.ws.isAlive = false;
            this.startTime = Date.now();
            this.ws.ping();
        }, time);
    }

    public async isRateLimited(id: string, secs: number, limit: number, tag: string = ''): Promise<boolean|null> {
        if (!this.ws) return null;
        const key = `${id}:rates:${tag}`;
        const rate = await this.store.incr(key);
        if (rate === 1) {
            await this.store.expire(key, secs);
        }
        return rate > limit;
    }

    public async cleanUser( userId: string): Promise<any> {
        try {
            if (this.heartId !== 'empty') {
                clearInterval(this.heartId);
                this.heartId = 'empty';
            }
            if (!userId) return { error: { message: 'IDs are missing' } };

           // await this.store.del(REDIS_KEY.USER_ROOM_DATA(roomId, userId));
            console.log(`Cleaned up Redis and Heartbeat for: ${userId}`);
        } catch (e: any) {
            console.error("Cleanup failed:", e);
            return { e };
        }
    }
}
export interface ManagerOptions{
    ws?:WebSocket|null;
    redisClient?:Redis;
    redisSub?:RedisSub;
}


// Handles the dedicated pub/sub client and communication for the Quiz
// ============================================================================
export class RedisSub  {
   
    protected sub: Redis; // Dedicated subscriber instance
    protected ws: any;
    private patternHandlers = new Map<string, Function>();

    constructor(redisSub: Redis, ws?: WebSocket) {
       
       
        // ioredis allows duplicating clients easily to create a dedicated sub instance
        this.sub = redisSub// must be a subcirber
       
           
          
        // Listen to all psubscribe messages
        this.sub.on('pmessage', this.msgHandler.bind(this));
    }

    private async msgHandler(pattern: string, channel: string, message: string) {
        const handler = this.patternHandlers.get(pattern);
        const roomId = channel.split('room:')[1].replace(':quiz', '')
        if (handler) {
            try {
                const data = JSON.parse(message);
                await handler(channel, data, { roomId, channel, pattern });
            } catch (e) {
                console.error("Pattern message parse error", e);
            }
        }
    }

    public async psubscribe(pattern: string, onmessage: Function): Promise<void> {
        this.patternHandlers.set(pattern, onmessage);
        await this.sub.psubscribe(pattern);
        console.log(`Subscribed to pattern: ${pattern}`);
    }
public async punsubscribeAll(){
    
   const keys =  this.patternHandlers.keys();
   for (const key of keys){
    await this.punsubscribe(key)
   }
}
    public async punsubscribe(pattern: string): Promise<void> {
        await this.sub.punsubscribe(pattern);
        this.patternHandlers.delete(pattern);
        console.log(`Unsubscribed from pattern: ${pattern}`);
    }

    
}

export const redisSubClient = new RedisSub(sub);
export class QuizManager extends RedisManager {
    protected sub: RedisSub;
    constructor({ ws, redisClient = redis, redisSub = redisSubClient }: ManagerOptions={}) {

        super(redisClient, ws);
        this.sub = redisSub;


    }
    public updateFontend(updatetype: string, data: Record<string, any>, isChar?: boolean): void {
        if (Array.isArray(data)) {
            this.ws.send(JSON.stringify(data));
            return;
        }
        this.ws.send(JSON.stringify({ payload: { update: updatetype, ...data } }));
        if (!isChar) {
            console.log(`Sending to user:`, { update: updatetype, ...data });
        }
    }

    public async publish(payload: Record<string, any>, to: string, channel: string, isChar?: boolean): Promise<void> {
        const msg = {
            from: 'server', // Adjust if needed
            to,
            date: Date.now(),
            payload,
            channel
        };
        await this.store.publish(channel, JSON.stringify(msg));
    }

    public async updateUsers(key: string, value: Record<string, any>, hideId: boolean = false, payload?: UserUpdate): Promise<void> {
        const { usrIdToUp, channel, update, n = false, isChar = false } = payload ?? {};
        const targetUserId = usrIdToUp ?? this.ws.userId;
        const data = { ...value, username: targetUserId };

        const valueStr = typeof value === 'object' ? JSON.stringify(value) : value;
        const data2 = { [targetUserId as string]: valueStr };

        if (!n) {
            await this.store.hset(key, (hideId ? value : data2) as Record<string, any>);
        }
        await this.publish({ update: update || 'quiz', ...data }, 'all_quizzes', channel || key, isChar);
    }
    async cleanUp(roomId: string) {

        await this.sub.punsubscribeAll();
        await this.cleanUser(this.ws.userId);
        console.log('cleaned up sub,  room:', roomId, ' user:', this.ws.userId)
        //clean up the room logic

    }

}