import { alphabeticalSort, shuffleArray } from "../../Bible-Quizzing-App/apps/server/src/config/utils/array.js";
import Rand
 from "../../Bible-Quizzing-App/apps/server/src/config/utils/rand.js";
 import config from '../json/score.json' with {"type": "json"};
 import TimerMap, { Timers } from "../../Bible-Quizzing-App/apps/server/src/config/utils/timerMap.js";
 import { QuizManager, RedisManager , redis as store, sub as rSub, RedisSub, quizEvents, redis} from "./redishelpers.js";
import { DATA } from "../app.js";
import { ServerLogic } from '../logic_scripts.js';
import { QUIZ_KEYS, ScoringConfig, QUESTION_TYPES, QUESTION_STATUS, QuestionStates, QuizSettings, QuizUserData, defaultQuizSettings, ROOM_STATES } from "../types.js";
import { REDIS_KEY, SUPA_COLUMNS, USER_STATES, Question } from "../types.js";
import { QuizConfig, SERVER_CHANNELS } from "./server.js";
import quizContext, { getQuestion, getRoomId, getUserId, getIsTeamMode, getSettings, getTeamObject, getQuestId, getMetaData, setMetaData, stringToBool, boolToStrng, getAllMetaData } from "../../Bible-Quizzing-App/apps/server/src/config/utils/quizCotexnt.js";
import { QuestionManager, TimerSettings } from "../questions/base_question.js";
async function getQuestData({keys=false}){
  const data =await redis.hgetall(REDIS_KEY.USER_PROFILE(getUserId() as string) + ':question_incorrect')
return keys ? Object.keys(data): data
}
//helper func to save time
function parseNumber(num:string|number):number{

  
  return typeof num === 'string'  ? parseInt(num) : num;
}
//string is room ids 
const scoringConfig:ScoringConfig = config as any as ScoringConfig;
const sub = new RedisSub(rSub)
export class Quiz extends QuizManager {

    constructor() {
        super({});
            
        
      
     
      this.store = store;
     
      
    }
   
   async startQuiz () {

this.updateUsers (REDIS_KEY.ROOM(getRoomId()), {start:true, settings:{...getSettings || {}, ...(await this.getData()).timerSettings}}, true, {n:true});
    await this.startQuiz();
    await this.switchStatus('*', USER_STATES.WAITINGNEXT)
    await redis.hset(REDIS_KEY.ROOM(getRoomId()), { status: ROOM_STATES.ACTIVEQUIZ })

   }
    
   
    
   
    
   
   
    
  async upXp(incrByInt: number, target?: string, isInRoom: boolean = false, { extra=0, multipy=1 }: { extra?:number, multipy?:number}={}){
    const calculateXP = (baseXp: number) => {
      return (baseXp + extra) * multipy;
    };
    const incrBy = calculateXP(incrByInt);
    console.log('xp going up$$$$$$$$$$$$$$$$$$\n\n\n$$$$$$$$$$$$\n\n,', incrBy);
     await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), { score: { [QUIZ_KEYS.XP]: { username: target, score: incrBy } } })
   
       if(isInRoom){
        await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(getRoomId(), target ||''), 'xp', incrBy);
        return;
       }
        await this.store.hincrby(REDIS_KEY.USER_PROFILE( target ||''), 'xp', incrBy);
     }
    async updateScores( scoreToUp:string, incrBy:number, target:string, isBonus:boolean=false, user_team?:string){
     const user =  target
     //if(scoreToUp === QUIZ_KEYS.POINTS){
       const team = user_team || getTeamObject()?.[target]
       
       if(scoreToUp !== 'points'){
         await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(getRoomId(), target ), scoreToUp, incrBy)///user quiz data is updated
         //await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), { score: { [scoreToUp]: incrBy, username: target ||'' }, username: target ||'' }, true, { usrIdToUp: user, update: 'quiz' })
   
         return;
       }
      await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), { teamScore: { [scoreToUp]: incrBy, team }, username: target ||'' }, true, {n:true, update: 'quiz' }) 
    if(getIsTeamMode())    await this.store.incrby(REDIS_KEY.TEAM_SCORE(getRoomId(), team), incrBy)//only the team gets the points
      if(!isBonus)  {
        
        await this.store.hincrby(REDIS_KEY.USER_ROOM_DATA(getRoomId(), user), scoreToUp, incrBy);   /// now the use score is updated
        if (getIsTeamMode()) await this.caculateTeamBonus(team, target) //since this is not a bonus we caculate wether or nor they a bonus
        await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {score: { [QUIZ_KEYS.POINTS]:{username:target, score:incrBy}}})
          //now we we update the frontend that the user got points
       
        
           
   
     }}
     async   caculateTeamBonus(team:string, target:string){
      const scoreToUp = QUIZ_KEYS.POINTS
     
       const tag = getQuestion()?.type === QUESTION_TYPES.QFTV ? 'qftv' : 'question'
       const memberCount = await this.store.sadd(REDIS_KEY.TEAM_BONUSES(getRoomId(), this.ws.teamId as string, tag), target || '');
       if (memberCount >= 3 ) {
         await this.store.incrby(REDIS_KEY.TEAM_SCORE(getRoomId(), team), 20)//team bonus
         await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), { teamScore: { [QUIZ_KEYS.POINTS]: 20, team}}, true, {  update: 'quiz', n:true })

       }
       
     }
     protected async switchStatus(curStatus:string|'*', newStatus:string, target?:string){
       console.log('swiching status ', curStatus, 'to', newStatus, 'tar', target ?? 'none')
       console.warn('swiching status ', curStatus, 'to', newStatus, 'tar', target ?? 'none')
      const data = await this.store.hgetall( REDIS_KEY.ROOM_PLAYERS_STATES(getRoomId()) );
   
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
       await this.store.hset(REDIS_KEY.ROOM_PLAYERS_STATES(getRoomId()), newData);
         newData.target = target ?? false
         newData.oldStatus = curStatus;
        
        await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {status:newData}, false, {n:true})
     }
     // Define the background function
  async processScoreBackground(state: QuestionStates, user: string, isBonus: boolean): Promise<number> {
    const data = (await this.store.hgetall(REDIS_KEY.USER_ROOM_DATA(getRoomId(), user))) as unknown as QuizUserData;
    const { correctQs, incorrectQs } = data;
    const isLastQuest =  getMetaData()?.questionIndex  ===  (getMetaData()?.questionsLen || 0) - 1
    // 1. Calculate XP with Offset and Multiplier
    const calculateXP = (baseXp: number) => {
      return (baseXp + scoringConfig.globals.xpOffset) * scoringConfig.globals.xpMultiplier;
    };

    if (state === 'correct') {
      await this.addCorrectQuest();

      if (isBonus) {
        // --- BONUS MODE LOGIC ---
        const bonusRules = scoringConfig.modes.bonus.correct;
        const points = isLastQuest ? bonusRules.isLastQuest : bonusRules.points;

        await this.updateScores(QUIZ_KEYS.POINTS, points as number, user, true);
        await this.updateScores(QUIZ_KEYS.XP, calculateXP(bonusRules.xp), user, true);
      } else {
        // --- REGULAR MODE LOGIC ---
        const regRules = scoringConfig.modes.regular.correct;

        // Handle "Out" Logic
        if (correctQs === regRules.perfectOut.threshold) {
          const isPerfect = (incorrectQs || 0) <= 1;
          const typeOut = isPerfect ? QUIZ_KEYS.PERFECT_OUT : QUIZ_KEYS.IMPERFECT_OUT;
          const outPoints = isPerfect ? regRules.perfectOut.points : regRules.imperfectOut.points;

          await this.updateScores(typeOut, 1, user);
          await this.updateScores(QUIZ_KEYS.POINTS, outPoints as number, user);
        }

        await this.updateScores(QUIZ_KEYS.POINTS, regRules.basePoints, user);
        await this.upXp( calculateXP(regRules.baseXp), user);
        await this.updateScores(QUIZ_KEYS.CORRECT, 1, user);
      }
      return 0;

    } else if (state === 'incorrect') {
      // Delegate to incorrect handler
      await this.handleIncorrect(isBonus, user, incorrectQs || 0);
      return -1;
    }

    return 3; // Default/Error
  }

  async handleIncorrect(isBonus: boolean, user: string, currentIncorrect: number) {
    const status = await this.store.hget(REDIS_KEY.ROOM_PLAYERS_STATES(getRoomId()), user);
    await this.addIncorrectQuest();
    const isLastQuest = await getMetaData()?.questionIndex  === (await getMetaData()?.questionsLen  || 0) - 1
     if (isBonus) {
      // Bonus mode usually has no penalty, or defined here
      await this.updateScores(QUIZ_KEYS.POINTS, scoringConfig.modes.bonus.incorrect.points, user, true);
    } else {
      const regInc = scoringConfig.modes.regular.incorrect;

      // Check for Backward Out (Quiz Out)
      if (currentIncorrect === regInc.backwardOut.threshold) {
        await this.switchStatus(status as string, USER_STATES.VIEWING, user);
        await this.updateScores(QUIZ_KEYS.BACKWARD_OUT, 1, user);
        await this.updateScores(QUIZ_KEYS.POINTS, regInc.backwardOut.penalty as number, user);
      }

      const penalty = isLastQuest ? regInc.lastQuestPenalty : regInc.basePenalty;
      await this.updateScores(QUIZ_KEYS.POINTS, penalty, user);
      await this.updateScores(QUIZ_KEYS.INCORRECT, 1, user);
    }
  }
      protected async middleQuiz(state:QuestionStates, isBonus:boolean=false, user:string){
       //when this is called it happens during the new qusetion state
      
       await  this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {questState:state}, true)
       const  status  = await  this.processScoreBackground(state, user,  isBonus) //maybe await/not await to avoid blocking
        if([1, 2].includes(status)){return;}
       
         console.log('new question', )
        await this.nextQuestion();
       
        
   
     }
     private async nextQuestion(){
        await this.store.hincrby(REDIS_KEY.ROOM(getRoomId()), 'questionIndex', 1)
     }
     getQuest(){
      return getQuestion();
     }
     
           public async figureJumpWinner (timeToWait:number=3000):Promise<string|number> {
      await new Promise(resolve=>setTimeout(resolve, timeToWait))
       const bestTimes:Record<string, string|number> [] = [];
      for ( const team of this.ws.teams ){
       
       const data =await this.store.hgetall(REDIS_KEY.REACTION_TIMES(getRoomId(), team as string) );
     
       const teamTimes = Object.entries(data).filter(([id])=>!id.startsWith('_')).map(([id, jump]) => ({ // Convert object entries numbero an array of objects
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
   
   
   
   async finish(){
    try {
        const { data, error } = await ServerLogic.readProfileData(SUPA_COLUMNS.ID, this.ws.supaId)

        const { online_quiz_data: oqd } = data as any ?? [];
        const online_quiz_data = Array.isArray(oqd) ? oqd : [];

        const teamScore = await this.store.get(REDIS_KEY.TEAM_SCORE(getRoomId(), this.ws.teamId as string)) || 0;
        const rawData = await this.store.hgetall(REDIS_KEY.USER_ROOM_DATA(getRoomId(), this.ws.username))
        const dataToSave: QuizUserData = {
            ...rawData,
            points: parseNumber(rawData.points || '0'), // Converts string '20' to number 20
            xp: parseNumber(rawData.xp || '0'),         // Converts string to number
            seatNum: parseNumber(rawData.seatNum || '1'), // Converts string to number
            status: rawData.status || 'finished',
            teamScore // Ensures status is a string
        } as any;

        delete dataToSave.username;//not needed
        online_quiz_data.push(dataToSave);
        this.store.del(REDIS_KEY.ACTIVE_USER_ROOM(getRoomId()));
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
        //his.cleanUser(getRoomId())
    }
}
async addIncorrectQuest(){
  const question =getQuestion();
  await this.store.hincrbyfloat(REDIS_KEY.USER_PROFILE(getUserId() as string )+':question_incorrect' , question.id+'', 1.00);
  //await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {question, questState:QUESTION_STATUS.incontroversial}, false, {update:'quiz'})
  }
  async addCorrectQuest() {
    const question = getQuestion()
    await this.store.hincrbyfloat(REDIS_KEY.USER_PROFILE(getUserId() as string) + ':question_incorrect', question.id + '', -0.5);
    //await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {question, questState:QUESTION_STATUS.incontroversial}, false, {update:'quiz'})
  }
async loadQuiz(configSettings: QuizSettings) {
    try {
      const settings = { ...defaultQuizSettings, ...configSettings }
      const limit = settings.numQuestions || 20;
  
    let questionsToUse:Question []= [];
      // Filter questions based on settings or fallback to all DATA
      const idsToQuests = ((await getQuestData({ keys: true }) || []) as unknown as  number[]).map((id)=>DATA[id]) || []
      let pool = ServerLogic.multiFilter(idsToQuests ?? DATA, settings);
      if (!pool || pool.length === 0) pool = DATA;

      // Determine if we need to generate a quiz or just slice the pool
      if (settings.verseSelection === 'quiz') {
        questionsToUse = await ServerLogic.generateQuiz(3, 2, limit, pool);
      } else if(settings.verseSelection === 'random') {
        const shuffledPool = shuffleArray(pool);
        questionsToUse =shuffledPool.slice(0, limit);
      }else if (settings.verseSelection === 'alphabetical') { 
        const alphabeticallySortedPool = alphabeticalSort(pool, 'answer'); // Assuming 'answer' is the key to sort by
        questionsToUse = alphabeticallySortedPool.slice(0, limit);
      }else{
        questionsToUse = pool.slice(0, limit);
      }
      // Safety check: if generation failed, slice the pool
      if (questionsToUse.length === 0) {
        questionsToUse = pool.slice(0, limit);
      }
      const questIdsToSave = questionsToUse.map(q=>q.id);
      await this.store.rpush(REDIS_KEY.ROOM_QUESTIONS(getRoomId()), ...questIdsToSave);///load all questions to redis
      console.log(`Quiz loaded with ${questionsToUse.length} questions for room ${getRoomId()}`);
      await setMetaData('questionsLen', questionsToUse.length);
      await setMetaData('questionIndex', 0);
      await setMetaData('questId', questionsToUse[0].id);
      //this sets expire tim e for the question 3 hrs saferthe quiz should be done by then and it will save some space in redis
      await this.store.expire(REDIS_KEY.ROOM_QUESTIONS(getRoomId()), 60 * 60 * 3);
     await this.publish({load:true}, '', SERVER_CHANNELS.QUIZ_LOAD(getRoomId()))
      console.log(questionsToUse)
    } catch (err) {
      console.error('loadQuiz error:', err, 'Room:', getRoomId());
    }
  }
  private async getData() {
    const settings = await getSettings() as QuizSettings;
    const question = getQuestion();
    const timer = settings.lenOfTimer || 30 * 1000;
    const timerSettings: TimerSettings = {
      waitFromHead: 2 * 1000,
      questionInterval: settings.speed_tOf_text || 80,
      waitAfterQuest: 4 * 1000,
      waitBetween: 3 * 1000,
      timer,
      jumpWinner: 2700
//more time to answer if no timer mode, otherwise its 2.7 seconds to give some time for the user to react and for the server to process the jump request
// the jump winner seems useless, but really it improves the user experience to have a little bit of time after the timer runs out before the jump request is processed, otherwise it can feel very abrupt and jarring, especially if there is any lag in the server processing the request. It also gives a small window for users to still answer if they were just a fraction of a second too late, which can be more satisfying and less frustrating.
                                                                                                       

    }
    return { settings, timerSettings, timer, question}
    
  }
 async  handleAnswerRequest(value:string, ){
   const { timer, timerSettings, settings, question} = await this.getData()
                  const username = getUserId();
   const Question = new QuestionManager(getRoomId(), question, timerSettings, settings?.month?.[settings?.month?.length-1] || 'march' )
  const checkAnswer = Question.checkAnswer;
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
               
              const roomId = getRoomId();
              
              const isQuestEnd:boolean = stringToBool( await getMetaData()?.isQuestEnd as string ) as boolean;
                if(!isQuestEnd){
                 //this means the user interuppeted the question
                 const {score:result } =  checkAnswer(!isQuestEnd, value as string);
                  console.warn('\nchecking for question\n')
                 
                 console.warn('answer ', value, 'quest', question, 'result', result)
                 if(result == 1){
                 await  this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {questState:QUESTION_STATUS.correct});
                await setMetaData('isQuestEnd', boolToStrng(true))
                 return;
                 }else if(result == 0){
                   await  this.updateUsers(REDIS_KEY.ROOM(getRoomId()), {questState:QUESTION_STATUS.more});
                     return;
                 } else {
                  await this.addIncorrectQuest();
                 await  this.middleQuiz('incorrect', false, username)
                 
                 };  
                 return;
                }else{
                  //the question ended normally
                console.warn('\nchecking for anwer\n')
                 const {score:result} =  checkAnswer(!isQuestEnd, value as string, );
                 console.warn('answer ', value, 'quest', question, 'result', result)
                 console.log('calling middle')
                if (result === 0) {
                  await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), { questState: QUESTION_STATUS.more }); return};
                await this.middleQuiz(results[question.type as string][result.toString()], false, username)
                }
                
            
 }
 async handleJumpRequest(){
  const {isStop, isQuestEnd, isTimeout, questionIndex, bots} = getMetaData() as Record<string, any>;
  const username = getUserId();
  const { timer, timerSettings } = await this.getData()
  await  this.publish({ stopTimer: true }, '', REDIS_KEY.AI_ROOM(getRoomId()))

  await setMetaData("isStop", boolToStrng(true));
   
   Timers.delete(`${getRoomId()}:skip`);
  Timers.setTimer (`${getRoomId()}:timer`, async () => {
     if ( timer === 0) return;//no timer mode
   await setMetaData('isTimeout',boolToStrng(true));
     console.log('useraneme at incorrect for before ques', username)
     await this.middleQuiz('incorrect', false, username);
     console.warn(questionIndex, 'q num')
   }, timer || 32 * 1000);
   const winner = await this.figureJumpWinner(timerSettings?.jumpWinner || undefined);
   console.log('winner is ', winner)
   await this.updateUsers(REDIS_KEY.ROOM(getRoomId()), { winner: true }, false, { update: 'stream', n: true })
   if (bots.includes(winner as string)) {
     console.log('runing ai')
     await this.publish({ isanswer: true, isQuestion: !isQuestEnd, questNum: questionIndex, question: getQuestion() }, 'ai', REDIS_KEY.AI_ROOM(getRoomId()))
   }
   if (winner !== 0) {
     await this.switchStatus(USER_STATES.AWAITJUMPS, USER_STATES.ANSWERING, winner as string);

     console.log('end of quest')
   } else {
     console.log('\n\ntie!!!!!!!!!!!!!!!!!!!!!!\n\n\t')

 }
}
public async destroy(roomId:string, roomNS?:string){
  
  
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
}