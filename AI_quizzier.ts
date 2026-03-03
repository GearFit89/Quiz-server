import { WssFuncs } from "./wss_functions.js";
import WebSocket from "ws";
import * as L from "./logic.js";
 import {DATA} from './app.js'
import { Question } from "./logic_scripts.js";

/**
 * A mock WebSocket implementation for AI Agents.
 * This handles event listeners and common properties to prevent runtime errors.
 */
class AIWebSocket extends EventTarget { 
  public isAi;// Extend EventTarget to handle .addEventListener()
  public readonly userId: string; // Custom property for AI ID
  public readonly username: string; // Custom property for AI Name
  public readyState: number = 1; // 1 = OPEN. Mimic a successful connection.
  public url: string = "ws://ai-internal-agent"; // Fake connection URL
  public binaryType: BinaryType = "blob"; // Default WebSocket binary type

  constructor(aiId: string, name:string) { // Initialize the agent
    super(); // Initialize EventTarget
    this.isAi = true; // Custom flag to identify this as an AI WebSocket
    this.userId = `AI_Bot_${aiId}`; // Assign unique ID
    this.username = name; // Assign unique username
  } // End constructor

  /**
   * Mimics the standard WebSocket send method.
   */
  on (){}; // Placeholder for on method to prevent errors
  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void { // Standard signature
    try { // Wrap in error handling
      console.log(`${this.username} sent: ${data}`); // Log the message
    } catch (err) { // Handle potential log failures
      console.error("Send failed", err); // Log the error
    } // End try-catch
  } // End send

  /**
   * Mimics the standard close/terminate method.
   */
  public close(code?: number, reason?: string): void { // Standard close signature
    this.readyState = 3; // 3 = CLOSED state
    console.log(`${this.username} connection closed. Code: ${code}`); // Log closure
    const event = new CloseEvent('close', { code, reason }); // Create standard close event
    this.dispatchEvent(event); // Trigger listeners
  } // End close

  /**
   * Specific method for terminating (often used in 'ws' library).
   */
  public terminate(): void { // Manual termination method
    this.close(1001, "Terminated by agent"); // Close with 'Going Away' code
  } // End terminate
} // End class

// Usage




// Define a type for probabilities to improve code readability
type Probability = number; // A value between 0 and 1

// Define the core configuration for the Quiz Bot simulation
interface QuizBotConfig { 
  name: string; // Name of the bot for identification
  // Minimum time in ms before the bot "jumps" on a question
  minReactionTimeMs: number; 
  // Maximum time in ms the bot will wait to answer
  maxReactionTimeMs: number; 
  // Chance (0-1) that the bot will "jump" before the question finishes
   minAns:number;
   maxAns:number;
  // Chance the bot knows the answer immediately vs. having to "think"
  knowledgeBaseDepth: Probability; 
  // Chance the bot misinterprets a similar Bible verse (creates a "realistic" error)
  verseConfusionRate?: Probability; 
  // Probability of a "mechanical failure" or "timeout" simulating a slow buzzer
  
  // An optional array of specific Bible books the bot is "expert" in
  specializedBooks?: string[]; 
  // Whether the bot is allowed to guess if it doesn't know the answer
  isAggressiveStrategy? : boolean; 
} 

// Example of a "Professional" bot setup

export class Agent {
    public aiId:string;
    private roomId:string;
    private Session:L.Quiz;
    private wsf:WssFuncs;
    private jumpTimeout: NodeJS.Timeout | null = null; // To track the jump timeout
    protected config:QuizBotConfig;
    constructor(config:QuizBotConfig={
minReactionTimeMs: 79, 
minAns:78,
name:'QuizBot Max',
  maxAns:1200,
  // Never waits longer than 1.5 seconds
  maxReactionTimeMs: 1500, 
  knowledgeBaseDepth: 0.80
    }, roomId:string) {
      
       const aiId ='ai' + Date.now().toString()+ Math.random().toString();
      const ws = new AIWebSocket(aiId, config.name) as unknown as WebSocket;
      this.roomId = roomId;
       const myRedis = new L.RedisMananger(aiId, L.REDIS_KEY.AI_ROOM(aiId), ws)
    
        this.wsf = new WssFuncs(ws, aiId, myRedis)
         this.aiId = aiId;
         this.config = config;
         this.Session = new L.Quiz(aiId, ws );
         this.jumpTimeout = null; // Initialize jump timeout
    }
    async init(){
       await this.Session.psubscribe(L.REDIS_KEY.AI_ROOM(this.roomId), (chan:string, data:Record<string, boolean|string|L.Question>)=>{
        if(data.trig){
            const time:number = new Number(data.time) as number;
                 const timeToJump = this.Session.chanceRange(this.config.minReactionTimeMs, this.config.maxReactionTimeMs)
                 this.jumpTimeout = setTimeout(this.wsf.recordJump, timeToJump);
        }else if(data.isanswer){
          const isCorrect = this.Session.chanceFloat(this.config.knowledgeBaseDepth)
          if(isCorrect){
            const quest = data.question as L.Question
            this.wsf.recordUserInput(quest.answer as string)
          }else{
            const randNum = this.Session.chanceRange(this.config.minAns, this.config.maxAns);
           const q=  DATA[randNum]
            this.wsf.recordUserInput(data.isQuestion ? q.question: q.answer as string)
          }

          
                
        }else if(data.stopTimer && this.jumpTimeout){
          clearTimeout(this.jumpTimeout);
          this.jumpTimeout = null; // Reset the timeout
         }
       });
      
    }
}


