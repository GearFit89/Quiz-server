type str = string;
type int = number;
type bool= boolean;
type float=  number;
 import  {Redis} from 'ioredis'
type arr = any[]
;

export {
  
};

export interface SupaColumns {
  id: string; // uuid maps to string
  username: string; // text maps to string
  created_at: string; // timestamptz maps to ISO string
  friends: string[]; // ARRAY_text maps to string array
  state_of_qs_answered: any; // jsonb typically maps to object or any
  modules_completed: any[]; // ARRAY_jsonb maps to an array of objects
  access_id: string; // text maps to string
  session_id: string; // text maps to string
  email: string; // text maps to string
  team_name: string; // Based on your guideline
  online_quiz_data: QuizUserData[]; // Based on your guideline
  xp: number; // bigint maps to number
  league: string; // text maps to string
  badges: any[]; // ARRAY_jsonb maps to array of objects
  avatar: any; // jsonb maps to object
  role: string; // text maps to string
  access_level: string; // text maps to string
  profile_settings: any; // jsonb maps to object
  streak: number; // typically an integer/number
}
export const SUPA_COLUMNS = {
  ID: 'id', // Unique identifier
  USERNAME: 'username', // Display name
  CREATED_AT: 'created_at', // Account creation timestamp
  FRIENDS: 'friends', // Array of friend IDs
  ANSWERED_QS: 'state_of_qs_answered', // JSON tracking answered questions
  MODULES: 'modules_completed', // Array of completed module objects
  ACCESS_ID: 'access_id', // Security access identifier
  SESSION: 'session_id', // Current active session
  EMAIL: 'email', // User email address
  TEAM: 'team_name', // Team identifier
  QUIZ_DATA: 'online_quiz_data', // Array of QuizUserData objects
  XP: 'xp', // Experience points
  LEAGUE: 'league', // Competitive tier
  BADGES: 'badges', // Earned achievements
  AVATAR: 'avatar', // Avatar configuration JSON
  ROLE: 'role', // User permission role
  ACCESS_LEVEL: 'access_level', // Permission level
  SETTINGS: 'profile_settings', // User preferences
  STREAK: 'streak' // Daily activity streak
} as const; // Ensures the values are treated as literal strings, not just strings
export interface QuizUserData {
  correctQs?:int;
  incorrectQs?:int
 username?:str;
  roomId?:str;
  xp?: number;
  PQO?:int; //Perfect Quiz Out
  IQO?:int; //imperfect Quiz out
  points:int;
  teamId?:str;
  teamName:str;
  status:str;
  Bpoints?:int;
  seatNum:int;
  BQO?:int; ///backward quiz out
}
export const Tables = {
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
export interface SpellCheckResult {
  correctedAnswer: string[]; // Array of strings after spell correction
  misspelledWords: string[]; // List of words that failed the threshold
}

export interface Options {
  spellThreshold: number; // Max Levenshtein distance allowed
  closeThreshold: number; // Max missing words allowed before returning -1
  extraThreshold: number; // Max extra words allowed before returning -1
  correction: boolean; // Whether to replace user word with correct word
  isQuote:bool;
  isOneChanceQuote?:bool;
  shouldCorrectAtErr?:bool;
}
export interface Trigs  {
  [monthnName:str]:(int | null)[];
  
}
export type QuestionTypes = 'ftv' | 'quote' | 'ftv/quote' | 'According to' | 'SQ:' | 'question';
export const QUEST_TYPES: Record<string, QuestionTypes> = {
  ftv: 'ftv',
  quote: 'quote',
  'FQ': 'ftv/quote',
  'According to': 'According to',
  'SQ:': 'SQ:',
  question: 'question'
} as const;
export interface QuestionSettings {
     month?: string[]; 
     book?:string[]
    // List of chapters selected (e.g., ['1', '2', 'Jonah'])
    chapter?: string[]; 
    verses?: string [];
    flight: ('A' | 'B' | 'C' | 'T')[];
    trigs?:Trigs;
     quizMode?: string[]; 
     type?: QuestionTypes[];
}
export type VerseSelection = 'random' | 'quiz'| 'alphabetical' | 'sequential';
// Defining a default object that satisfies the QuizSettings interface
export const defaultQuizSettings: QuizSettings = {
    // Initializing with an empty array of month strings
   type: ['ftv', 'quote', 'ftv/quote', 'According to', 'SQ:', 'question'], // Default to 'ftv'
    flight: ['A', 'B', 'C', 'T'],
    // Initializing with an empty Trigs object
    mode:'quiz',
    // Setting the default selection behavior to 'random'
  verseSelection: 'quiz',
    // Setting highlight to an empty string by default
    highlight: false,
    // Defaulting to 20 questions based on the logic threshold
    numQuestions: 20,
    // Setting the timer to 0 (off) by default
    lenOfTimer: 0,
    // Setting text display speed to 0 by default
    speed_tOf_text: 0,
    // Initializing with an empty array for quiz modes
    
};
export type modes = 'practice' | 'quiz' | 'challenge' | 'tournament';
export interface QuizSettings extends QuestionSettings {
    // Selection mode for verses (e.g., 'random', 'sequential')
  verseSelection: VerseSelection; 
    // Highlight setting based on verseSelectionH input
    highlight: bool; 
    // A flag indicating if specific chapters were selected
    mode:modes;
    // List of months selected for the quiz data pool
  
    numQuestions: int; 
    // Length of the timer in seconds for each question
    lenOfTimer: int; 
    // The scrolling or display speed of the text
    speed_tOf_text: float; 
    // List of flights selected (e.g., ['A', 'B', 'C', 'T'])
   
    // The modes active for this quiz (e.g., ['ftv', 'quote', 'ftv/quote'])
   
}
export interface WsMessage {
  requestId: string;
  func: string;
  args?: any[];
  type?:str;
  data?:str|Record<str, any>
}
export const QUESTION_TYPES = {
  QUOTE:'quote',
  FTV:'ftv',
  QFTV:'ftv/quote',
  ACCORDING:'According to',
  SQ:'SQ:',
  NORMAL:'question'

} as const 
export const REDIS_KEY = {
  // Use colons to create "folders" in Redis Insight
  MAIN: `main:`,

  OFFLINE_USERS:`main:offline_users:`,
  ONLINE_USERS: `main:online_users:`,
  ACTIVE_USER_ROOM:(user:string) =>`user:${user}:active_room`, //this is a string
  OPEN_ROOM:'open-rooms-set',
  AI_ROOM:(room:string)=>`room:${room}:ai`,//this is a hash
  TEAM_SCORE:(room:str, team:str)=>`room:${room}:${team}:scores`,//this is not currently used 
  CURRENT_ROOM_USERS:(roomId:str)=>`room:${roomId}:current_users`,
   USER_REQ_INVITES:(username:str, reqName:str)=>'user:' + username + ':req_id:' +reqName ,
   USER_REQ_FRIENDS:(username:str)=>'user:' + username + ':friend_reqs' ,//this is a set;
   USER_AUTH:(userId:str)=>'user:' + userId,
  USER_LOOK: (username: str) => 'user:' + username+':avatar',// a hset
 USER_PROFILE:(username:str)=>'user:' + username,
  ROOM: (roomId: string) => `room:${roomId}`,
  USER_INCORRECT:(user:string)=>`user:${user}:incorrect`,
  USER_CORRECT: (user: string) => `user:${user}:correct`,
  ROOM_QUESTIONS: (roomId: string) => `room:${roomId}:questions`,
  ROOM_PLAYERS_STATES: (roomId: string) => `room:${roomId}:players_states`,
  TEAM_BONUSES:(roomId:str, teamId:str, tag:str)=> `room:${roomId}:team:${teamId}:bonus_type:${tag}`,//this is a set;
  //ROOM_PLAYERS_COUNT: (roomId: string) => `room:${roomId}:players:count`,
  USER_ROOM_DATA: (roomId:str, userId: string) => `room:${roomId}:user:${userId}`,
  TEAM: (roomId:str, teamId: string) => `room:${roomId}:team:${teamId}`,
  REACTION_TIMES : (roomId:str, teamId:str) => `room:${roomId}:team:${teamId}:jump_time`
} as const;
export interface Token {
  name:string;
  id:string;
  age:string;
  payload?:string;
  token?:string
}
export const QUIZ_KEYS = {
  CORRECT:'correctQs',
  INCORRECT:'incorrectQs',
  POINTS: 'points', // Maps to points property
  USERNAME: 'username', // Maps to username property
  ROOM: 'roomId', // Maps to roomId property
  XP: 'xp', // Maps to xp property
  PERFECT_OUT: 'PQO', // Maps to PQO property
  IMPERFECT_OUT: 'IQO', // Maps to IQO property
  BACKWARD_OUT: 'BQO', // Maps to BQO property
  TEAM: 'teamId', // Maps to teamId property
  STATUS: 'status', // Maps to status property
  BONUS_POINTS: 'Bpoints', // Maps to Bpoints property
  SEAT: 'seatNum' // Maps to seatNum property
} as const;
export interface UserData {
  
  email?: string;
  id: string|null;
  username: string; 
  quizData?:QuizUserData[];
  xp?: number;
signIn:boolean;
  status:string;
  updatedAt?: string;
  createdAt?: string;
  
 
  anyomous?: boolean;
  verified?: boolean;
  metaData?: Record<string, any>|string;
}
export interface Question {
  flight: string; // Identifies the flight category
  verse?: string; // The full verse or text containing the question and answer
  ref: string; // The scripture reference
  month: string; // The primary month associated with this entry
  type: string; // The category of the entry (e.g., "question")
  chapter: string; // The biblical chapter number represented as a string
  id: number; // Unique numerical identifier
  book: string; // The name of the biblical book
  trigs: { [key: string]: number[] }; // A dictionary where keys are months and values are arrays of numbers
  answer?: string; // The specific answer to the question
  question?: string; 
  numVerses?: number;
  // The text of the question being asked
}
// Interface representing the structure of the Rooms class
// Based on logic.ts



// Interface for the base RedisManager (corrected spelling) to show inheritance context
export interface IRedisManager {
  user_id: string;
  sub: Redis;
  redis: Redis;
  channel: string;
  ws: WebSocket;
  
  // Lifecycle and Connection methods
  initpsubscribe(): Promise<void>;
  punsubscribe(pattern: string): Promise<void>;
  psubscribe(channel: string, onmessage: Function): Promise<void>;
  destroy(roomId: string, roomNS: string): Promise<void>;
  cleanUser(inroomId: string): Promise<any>;
  heartBeat(time?: number): void;

  // Data methods
  updateUsers:Function;
  updateFontend(updatetype: string, data: Record<string, any>): void;
  publish(payload: string | Record<string, any>, to: string, channel: string): Promise<void>;
  isRateLimited(id: string, secs: number, limit: number, tag?: string): Promise<boolean>;
}

// Interface for the Rooms class
export interface IRooms extends IRedisManager {
  // Properties
  userId: string;
  currQData: Record<string, any>;
  skipQId: any; // Timer ID
  questNum: number;
  timer: any; // Timer ID
  tWordTimestamp: number;
  setAiJump: Function | boolean;
  questEnd: boolean;
  maxQuestions: number;
  settings: QuizSettings;
  questions: Question[];
  month: string;
  questInterId: any; // Interval ID
  requiredUsers: string;
  lastQuest: boolean;
  roomNS: string;
  isStop: boolean;
  roomId: string;

  // Initialization and Setup
  loadQuiz(settings: QuestionSettings, type: string): Promise<void>;
  createRoom(config: RoomData): Promise<void>;
  joinRoom(roomId: string): Promise<string>;

  // Game Logic / Flow
  startQuiz(): Promise<void>;
  finish(): Promise<void>;
  
  // Game State Handling
  upXp(incrBy: number, target?: string, isInRoom?: boolean): Promise<void>;
  updateScores(scoreToUp: string, incrBy: number, target?: string, isBonus?: boolean, team?: string): Promise<void>;
  figureJumpWinner(timeToWait?: number): Promise<string | number>;
  
  // Logic Helpers
  checkAnswer(answer: string, enteredAnswer: string, options?: Options): number | [string, number];
  stripChar(input: string | string[], nums?: boolean): string | string[];
}

// Interface for the Quiz class (Extends Rooms)
export interface IQuiz extends IRooms {
  // Overrides startQuiz from Rooms
  startQuiz(): Promise<void>;
  
  // Specific to Quiz class
  readFriendReq(inpattern?: string, cout?: number, onData?: Function): Promise<string[] | Error>;
}
//sorthand types
export const UPDATE_TYPES = {
    PROFILE: 'profile',
    USERS: 'users',
    DATA: 'data'
};

type QuizMonth = [string, string[], string];
export const quizMonths: QuizMonth[] = [
  ['october', ['1', '2', '3', '4', '5'], 'Matthew'],
  ['november', ['6', '7', '8', '9'], 'Matthew'],
  ['december', ['10', '11', '12'], 'Matthew'],
  ['january', ['13', '14'], 'Matthew'],
  ['february', ['15', '16'], 'Matthew'],
  ['march', ['Jonah'], 'Jonah'],
];

export const matthew: Record<string, any> = {};
export const textdemo: Record<string, string[]> = {
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



export const USER_STATES ={
  CONNECTED:'connected',
  QUIZZING:'quzzing',
  VIEWING:'viewing',
   DISCONNECTED:'disconnected',
   ANSWERING:'answering',
  WAITINGNEXT: 'users waiting for next question',
  AWAITJUMPS:'waiting for jumps from the user',
   APPEALING:'appealing',
  WAITCHALLANGE:"waiting challenage"

}
export const boolean = {
  'T':true,
  "F":false,
}
export const ROOM_STATES ={
  PENDING:"pending", //waiting for the users to join
 
  ACTIVEQUIZ:'quizzing',
  
  DONE:'done'
}
export const RoomTypes = {
  SOLO_L: 'singles',//not used
  TEAM: 'team_challenge' ,
  TEAM_L: 'team_live' ,//not used
  SOLO:'solo',
  COMPUTER:'com',
  MULTI:'mutilfireinds'
}   

export const Updates = {
  USERS:'users',
  PROFILE:'profile',
  QUIZ:'quiz'
} as const;


export interface RedisSet {
  user_id: string;
  sub: Redis;
  redis: Redis;
  channel: string;
  initpsubscribe:() => Promise<()=>void>;
  punsubscribe: (pattern: string) => Promise<void>;
  publish: (payload:  Record<string, any>, to: string, channel: string) => Promise<void>;
   updateFontend: ( updatetype:string, data:Record<string, any>) => void;
  unsubscribeAll:() => Promise<void>;
  isRateLimited: (id: string, secs: int, limit: int, tag?: string) => Promise<boolean>;
  
  
  heartBeat: (time?: int) => void;
  
  updateUsers:(key:string,  value:Record<string, any>, hideId?:boolean, extra?:UserUpdate )=>Promise< void>;
  psubscribe: (channel: string, onmessage: Function) => Promise<void>;
  
  
  cleanUser: Function;
}
export interface UserUpdate { // Define the interface name
  usrIdToUp?: string; // Optional numeric ID for the user to update
  channel?: string; // Optional string identifying the communication channel
  update?: string;
  isChar?:bool;
  n?:bool; // Optional string containing the update content or status
} // End of interface definition
export interface MSG {
  payload:string|Record<string, any>;
 channel:string;
 to:string;
 from:string;
 date?:int;
 key?:int;
}



// Define an interface for the expected incoming message structure


//singleton format 






export type RoomType = typeof RoomTypes[keyof typeof RoomTypes];
export interface RoomData {
  questNum?:int;
  questState?:QuestionStates;
 // array of objects
 roomId?:string;
            // 'RoomType' in your example
    requiredUsers: string[]; // List of required usernames
    maxUsers: number;       // Optional: Defaults to requiredUsers.length
    team1?: string;         // Optional: Default to empty string
    team2: string; 
    settings: QuizSettings; 
     teams?:Record<string, any>
        action?:string;
        canDecline?:boolean;
       maxQuestions?:int;        
       quizId?:string;
 createdAt?:int;
  host?:string;
  status?:string;
 
  channel?:string;
  type:RoomType;
  id?:string;
  isActive?:string;
  timeActive?:int;


}
export const ROOM_COUNTS = {
  USERS:'users',
  TIME:'time',
  CURRECTQUESTION:'curQuest'
}
export type Reaction = Record<string, string> //the key is the id of the user
///the value is the actual jump time
export type QuestionStates = 'correct'| 'incorrect'| 'please_correct'| 'more'|'none'
export const QUESTION_STATUS: Record<QuestionStates, string> = {
  correct: 'correct', // Maps the 'correct' state to a display string
  incorrect: 'incorrect', // Maps the 'incorrect' state to a display string
  please_correct: 'please_correct', // Maps the 'please_correct' state to a display string
  more: 'more' ,
  none:'none'// Maps the 'more' state to a display string
}; // The 'Record' type ensures all keys from QuestionStates are present
export interface AnswerReturn {
  score: number;
  extraCount?: number;
  incorrectCount?: number;
  message?: string;
  error?: string;
  extraWords?:Record<string, int>;
   incorrectWords?:Record<string, int>;

};