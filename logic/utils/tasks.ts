import CONFIG from "../../config.js";
import { REDIS_KEY } from "../logic.js";
import { QuizManager, redis, RedisSub, sub } from "../redishelpers.js";
import Rand from "./rand.js";
const subClient = new RedisSub(sub);

interface TaskData {
    name:string;//the id or type of task being processed
    payload:string;
    attempts:number;
}
export   const ACTIONS ={
    LISTEN_TASKS:"start_task_listening",
    STOP_LISTEN_TASKS:"stop_task_listening"
}
export class Task extends QuizManager{

private taskId:string;
    constructor(public data:TaskData){
        super({ redisClient:redis,redisSub:subClient })
        this.taskId = Rand.randString(16);
    }
    static async create(data:TaskData){
    const instance = new this(data);
       await  instance.ship();
       return instance;
    }
   async  ship(keyName:string=REDIS_KEY.PENDING_TASKS_BY_SERVER(CONFIG.serverId), callback:Function=async()=>{}){
   await  redis.hset(keyName,this.pack());
   
   await callback();
   await this.publish({action:ACTIONS.LISTEN_TASKS, data:{serverId:CONFIG.serverId, taskName:this.data.name}}, '', `main:actions`);

    }
    async complete(keyName: string = REDIS_KEY.PENDING_TASKS_BY_SERVER(this.taskId)){
        await redis.hdel(keyName, this.data.name); //deletes the data from pending tasks
        await this.publish({ action: ACTIONS.STOP_LISTEN_TASKS, data: { serverId: CONFIG.serverId, taskName: this.data.name } }, '', `main:actions`);

    }
   private pack(){
       const payload = JSON.stringify(this.data);
    const json ={  [this.taskId]:payload};
    return json;

    }
    static async checkLock(taskId:string,data:TaskData):Promise<null| Task >{
        // moves the task from one server to this one
        
        //if this server fails it ensures the task is passed down
        //it checks the lock to see if the task is in play, if it is return null
       const exists =  await redis.set(REDIS_KEY.TASK_LOCK(taskId), CONFIG.serverId, "NX");
       if(!exists)return null;
        await redis.expire(REDIS_KEY.TASK_LOCK(taskId), 10);
        return new this(data);
        // it is now possible to recall .exec()
       
    }
    async exec(){
        this.data.attempts ++;
        const lockKey = REDIS_KEY.TASK_LOCK(this.taskId);
        await this.ship();//this is to update attempts
        await redis.set(lockKey, CONFIG.serverId, "EX", 10);//locks the task
        const lockInterval= setInterval(async ()=>{
            await redis.expire(lockKey, 10);// resets the lock 
        }, 5* 1000)
        const func:Function|undefined = TaskMap[this.data.name];
        if(!func){
            console.error('\n'+CONFIG.serverId, " : the task "+ this.data.name+ " is not in task map\n");
            return {success:false}
        }

        try {

           const data =  await  func(this);
            return { success: true, data }
        } catch (error) {
            console.error('\n' + CONFIG.serverId, " : the task " + this.data.name + error+" errror with task"+"\n");
            return { success: false }
        }
        finally{
            clearInterval(lockInterval);
            redis.del(lockKey);

        }

    }
}
export const  TaskMap:Record<string, Function> = {
    //each key will have a function to be executed
}