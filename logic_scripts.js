
import { supabase as spClient, JWT_ACCESS_KEY, DataBaseServiceKey, DBurlKey } from './mainApp.js';




/**
 * @typedef {Object} Question
 * @property {string} flight - Identifies the flight category
 * @property {string} verse - The full verse or text containing the question and answer
 * @property {string} ref - The scripture reference
 * @property {string} month - The primary month associated with this entry
 * @property {string} type - The category of the entry
 * @property {string} chapter - The biblical chapter number
 * @property {number} id - Unique numerical identifier
 * @property {string} book - The name of the biblical book
 * @property {Object.<string, number[]>} trigs - Dictionary of months mapped to numeric arrays
 * @property {string} answer - The specific answer to the question
 * @property {string} question - The text of the question
 */
    
const Question = {
    "flight": "B", // Assigning the flight category
    "verse": "Who did Jesus not come to call? The righteous", // The verse text
    "ref": "Matthew 9:13", // The biblical reference
    "month": "november", // Month identifier
    "type": "question", // Data type
    "chapter": "9", // Chapter string
    "id": 413, // Numeric ID
    "book": "Matthew", // Book name
    "trigs": { // Trigger mapping object
        "november": [3, 14], // Array for November
        "december": [3, 14] // Array for December
    },
    "answer": " The righteous", // Answer string
    "question": "Who did Jesus not come to call" // Question string
};





class Logic{
    constructor (){
        this.numVs = [1, 2, 3]    
    this.quizMonths = [
        ['october', [1, 2, 3, 4, 5]],
        ['november', [6, 7, 8, 9]], 
        ['december', [10, 11, 12]],
        ['january', [13, 14]],
        ['february', [15, 16]],
        ['march', ['Jonah']]
    ];
  
    this.booksNums = new Set();
    this.chpsNums = new Set();  
    this.c = 0
    this.quiMonths = ['october', 'november', 'december', 'january', 'february', 'march'];
}
multiFilter (items, criteria) {
    if(!items || !criteria) return;
    return items.filter(item => {
        return Object.keys(criteria).every(key => {
            if(item[ key ] === null || item[ key ]=== undefined){
                // if the key donest;s exist on the item skip it
                return true;
            };
            if (Array.isArray(criteria[key])) {
                return criteria[key].includes(item[key]);
            }
            if (typeof criteria[key] === 'object' && criteria[key] !== null) {
                return Object.keys(criteria[key]).some(objKey => 
                    item[key] && item[key][objKey] === criteria[key][objKey]
                );
            }
            return item[key] === criteria[key];
        });
    });
};
async updateUserProfile(id, actionArg,  action='update'){
    
    try {
   //actionArg  is an object
    const { error, data } = await spClient.from('profiles')[action](actionArg).eq('id', id).select().single()
    if(error) throw error
    return { success: true, data };
    }catch(e){
        console.error(e.message, 'error obj', e)
        return { success: false, error: e.message };
    }
}
async readProfileData( column, columnValue, selArg='*'){
  
    try {
    
    const { error, data } = await spClient.from('profiles').select(selArg).eq(column,columnValue)
    if(error) throw error
    return { success: true, data };
    }catch(e){
        console.error(e.message, 'error obj', e)
        return { success: false, error: e.message };
    }
}
ad(pr, ar, nu) {
        for (let i = 0; i < nu; i++) {
            ar.push(pr);
        }
    }
    
    async generateQuiz(quoteC = 3, ftvC = 2, lengthQuiz, selVerses=[]) {
        const shuffle = (array) => {
    // Iterate from the last element down to the first
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    // Return the randomized array
    return array;
};
        // quotes and ftvs
        let qf = [];
        let rAt = []
        //questions
        let rSq =[]
        let qs= []
        let rQ = []
        let rFQ = []
        let atC = Math.floor(Math.random() * 4 + 1);
        let sqC = Math.floor(Math.random() * 4 );
        const lenQ = lengthQuiz - quoteC + ftvC;
        const alrand = sqC + atC;
        let qC = lengthQuiz - alrand;
        //adds the stuff
        this.ad('question', qs, qC);
        this.ad('SQ:', qs, sqC);
        this.ad('According to', qs, atC);
        this.ad('quote', qf, quoteC);
        this.ad('ftv', qf, ftvC);
        qf = shuffle(qf);
        qs = shuffle(qs);
        let qfnum = 1; 
        let ii = 0;
       for (const verse of selVerses) {
    // Check type and push to the corresponding array
    if (verse.type === 'According to') rAt.push(verse);
    // Use else if to skip unnecessary checks once a match is found
    else if (verse.type === 'SQ:') rSq.push(verse);
    // Group standard questions
    else if (verse.type === 'question') rQ.push(verse);
    // Group verse quotes
    else if (verse.type === 'ftv/quote') rFQ.push(verse);
}

// Shuffle each category individually after grouping
rAt = shuffle(rAt); // Randomize 'According to' pool
rSq = shuffle(rSq); // Randomize 'SQ:' pool
rQ = shuffle(rQ);  // Randomize 'question' pool
rFQ = shuffle(rFQ); // Randomize 'ftv/quote' pool
        let endselVerses = [];
        ///console.warn('this po')
        for (let i = 0; i < lengthQuiz; i++) {
            if (i === qfnum) {  
                //declare ftv globally
                //ftv = qs[ii]
                
                const yV =rFQ[ii];
               if(yV) yV.type = qf[ii];
                endselVerses.push(yV);
                qfnum += 4;
                ii++;
            } else {
                if (qs[i] === 'question') {
                    endselVerses.push(rQ[i]);
                } else if (qs[i] === 'SQ:') {
                    endselVerses.push(rSq[i]);
                } else {
                    endselVerses.push(rAt[i]);
                }
            }
        }
        this.delog(endselVerses, 'hope');
        return endselVerses;
    }

async startApp(settings=this.quizSet, customQuestions=[]) {
    this.quizSettings = settings;
    if(!this.quizSettings){ console.error('nothing in settings'); this.manageModal('An error has happened. Contact support');return new Error('quizSettings empty')}
    this.answers = [];
    this.correctCount = 0;
    if (!this.verse_dict || !this.question_dict || !this.readyLoad) {
        this.manageModal('Content is still loading please wait a moment');
        return; //show a friendly wait message and have the user reclick the start button
    }
   
    let checker = false;
        
        
        
      
         
    
                
              
                async function WaitForLoad() {
                    
                    
                   const state =  await Selectdata.bind(this)();
                   if (state === 'stop') return;
                    this.delog2(this.selVerses, 'selverses after select data');
                    async function loadgen(d20 = 20) {
                        if (this.genQuiz) {
                            let F;
                            let Q;
                            let numQuizQuests = d20;
                            if (this.quizSettings.flights.includes('C')) {
                                Q = 0;
                                F = 5;
                            }
                            if (this.quizSettings.flights.includes('B')) {
                                Q = 0;
                                F = 5;
                            }
                            if (this.quizSettings.flights.includes('A')) {
                                Q = 2;
                                F = 3;
                            }
                            if (this.quizSettings.flights.includes('T')) {
                                Q = 3;
                                F = 2;
                            }
                            await this.generateQuiz(Q, F, numQuizQuests);
                            return;
                        } else {
                            return;
                        }
                    }
                    
                    this.delog2(this.selVerses, 'selverses');
                    
                    this.speeddetext = this.quizSettings.speed_tOf_text;
                    this.Time = this.quizSettings.lenOfTimer;
                    this.running = true;
                    
                    
                    await this.loadVerseDicts;
                    this.ftvQ = ['ftv', 'quote']
                    if (this.quizSettings.verseSelection === "random") {
                        this.selVerses = shuffle(this.selVerses);
                    }else if(this.quizSettings.verseSelection === "alphabet"){
                        this.selVerses = this.sortBy(this.selVerses);
                       
                    }
                    const ftvQ = ['ftv', 'quote'];
                    this.questionsMap = this.selVerses.map(v=>{
                        if(v.type === 'ftv/quote'){
                            v.type = ftvQ[Math.floor(Math.random())];
                        }
                        v.state = 'none';
                        return v;
                    })
                    this.delog(this.questionsMap)
                    await loadgen.bind(this)();
                    
                   
                       
                  
                    
                     this.new_quote(
                        this.quizSettings.quizMode,
                        this.quizSettings.numQuestions,
                        this.quizSettings.verseSelection, this.speeddetext, true);
                    this.progressBar.style.width = '0%';
                    this.delog(this.selVerses);
                  
                    //generateQuiz(2,3,20)
                    if (this.quizSettings.lenOfTimer === 0) {
                        this.numberElement.style.display = 'none';
                    } else {
                        this.quiztimer(this.Time);
                    }

                    return;
                }
                
                
                await WaitForLoad.bind(this)();
                
    
                
            
        
        ///settings event 
        /* when the user clicks the settings icon, this code runs here*/
        
         
        if (this.next) {
            /*this event handles when the user clicks next*/
            ///////////////////////////////////////////////
            ////////////////NEXT EVENT ////////////////////
            ////////////////////////////////////////////// 
            this.next.addEventListener("click", async () => {
                this.isend = false;
                console.warn( this.currentVerseIndex,'cVI going up', this.currentVerseIndex +1 )
                this.currentVerseIndex++;
                //this.cnum = this.currentVerseIndex; //
                this.prevScenes.push(this.card.innerHTML);
                this.sceneIndex++;
               
                this.upNumQ();
                this.id('submit').style.display = 'block';
                this.updateProgressBar();
                this.counterToMax += 1;
            
              
                await this.new_quote(
                    this.quizSettings.quizMode,
                    this.quizSettings.numQuestions,
                    this.quizSettings.verseSelection, this.speeddetext);
                    if (this.quizSettings.lenOfTimer === 0) {
                        this.numberElement.style.display = 'none';
                    } else {
                        this.quiztimer(this.Time);
                    }
                    if(this.stop) return
                //progressBar.style.width = '0%';
                //delog(selVerses)
                this.dragElements();
                //generateQuiz(2,3,20)
             
            
            //await runNext.bind(this)
            });
        }
    }





hightestMonth(inMonths){
   const higestmoth =  this.quiMonths.indexOf(inMonths[inMonths.length -1]);
   const figureMonths = this.quiMonths.slice(0, higestmoth + 1);
   //this.delog(allMpnthsCurrent)
   const chps = this.quizMonths.map(Month=> {
    if(figureMonths.includes(Month[0])) return Month[1].join(' ')} ).join(' ').split(' ');
   
   return {figureMonths, chps};


}
    fliterOutQs(inquestions=this.selVerses, ob={}){
        const allmoths = this.quizMonths.map(month=>month[0])
        const allchps  = this.quizMonths.map(month=>month[1].join(' ')).join(' ').split(' ')
        const allflights = ['A', 'B', 'C', 'T']
        const alltypes = ['quote', 'ftv', 'SQ:', 'According to', 'question', 'ftv/quote']
        const months = ob.m ? ob.m : allmoths;
    
        const {chps} = this.hightestMonth(months)
        const flights = ob.f ? ob.f : allflights;
        const types = ob.t ? ob.t : alltypes;
        this.delog( 'next', months, chps, flights, types)
        const reslult = inquestions.filter(Verse=>{
            let Test = months.includes(Verse.month) && flights.includes(Verse.flight) && types.includes(Verse.type) && Verse.verse && chps.includes(Verse.chapter);
            
            return Test
        })
        this.delog(reslult, 'result')
        return reslult;


    }

spellCheck(answer=[], enteredAnswer=[], options = { threshold: false, correction: true, percent: 0.4}) {
  const correctedAnswer = [];
const misspelledWords = [];
if(!options.threshold) options.threshold = Math.ceil(answer.length * (options.percent));
for (let i = 0; i < answer.length; i++) {
   const actualWord = answer[i];
   const enteredWord = enteredAnswer[i] || "";

   const distance = this.levenshteinDistance(actualWord.toLowerCase(), enteredWord.toLowerCase());

   if (distance <= options.threshold) {
       correctedAnswer.push(options.correction ? actualWord : enteredWord);
   } else {
       correctedAnswer.push(enteredWord);
       misspelledWords.push(enteredWord);
   }
}
   this.corAnswers = correctedAnswer;
   this.misspelledWords = misspelledWords;
return { correctedAnswer, misspelledWords };
}
delog(...args) {
  //checks for debug mode 
  if(args){
  if (this.deblog) {
      //this.delog(...args);
   this.debugLogs.push(...args)
      
  }
}
}


    sortBy(inquestions=this.selVerses, mode='alpha'){
      //---- by alphabet ---- \\
      let byVerseAbet;
      let ByUniqueness;
      if(mode.includes('alpha')){
       byVerseAbet  = inquestions.sort((a, b)=>{
          const A = a.verse.toUpperCase()
          const B = b.verse.toUpperCase()
          if(A > B){
              return 1;

          }else if( A === B){
              return 0; 
          }else{
              return -1;

          }
          


      })
  }
          if(mode.includes('trigger')){
              byVerseAbet = inquestions.sort((a, b)=>{
                     const A = Number(a.split('#')[1]) || 0;
                     const B = Number(b.split('#')[1]) || 0;
                     if(A - B > 0){
                       return 1
                     }else if (A-B < 0){
                      return -1
                     }else{
                      return 0
                     }
      })
  }
         return  byVerseAbet;

    }    
    checkAnswer (answer=[], enteredAnswer=[], threshold=3) {

      const commonWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'on', 'for', 'with', 'as', 'was', 'at', 'by', 'an', 'be', 'this', 'from'];
     const cleanAns = answer.split(' ').map(w=>this.stripChar(w))
     const cleanEntrAns = enteredAnswer.split(' ').map(w=>this.stripChar(w))
     const {correctedAnswer, misspelledWords} = this.spellCheck(cleanAns, cleanEntrAns, { correction:true})
        this.delog('correctedAnswer', correctedAnswer, 'misspelledWords', misspelledWords)
 const    fixedAns =   correctedAnswer.filter(word=> !commonWords.includes(word.toLowerCase()))
      const entrCout =  this.wordsCount(fixedAns)
      const ansCout =  this.wordsCount(answer)
      coutState= {}
      let incorrectCout = 0
      for (let i in entrCout){
          if(!ansCout[i]){
              coutState[i] = 'extraIncorrectWords';
              continue;
          }
          const diff = (ansCout[i] - entrCout[i] )
          incorrectCout += diff < 0 ? 0 : diff;
          if(entrCout[i] === ansCout[i]){
             coutState[i] = 'correct'
          }else if(entrCout[i -1] === ansCout[i]  || entrCout[i -3] === ansCout[i] || entrCout[i -2] === ansCout[i]){

          }
         
      }

      if(Object.values( coutState).every(e=> e === 'correct') || fixedAns.join(' ') === answer.join(' ')){
          return 1;
      }else if(incorrectCout <= threshold){
        return 0;
      } else {
          return -1;
      }
    }
    wordsCount(input=[]){
      const objectCount = {};
      input.forEach(w => {objectCount[w] = 0}); /// initilaizes teh count
      input.forEach(word => {
          if (objectCount.hasOwnProperty(word)) {
              objectCount[word] += 1;
          } else {
              objectCount[word] = 1;
          }
      });
      return objectCount;

    }

stripChar(input, messaa = false ) {
  // Define the set of characters to be stripped
  const charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ', '\n', '\r', '\t', '[', ']', '{', '}', '—', '–', '|']);
  const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  if(messaa){ nums.forEach (n=> {charToStrip.add(n)} )}
  // Helper function to process a single string
  const processString = (str) => {messaa='no message'
      // Ensure the input is a string before proceeding
      if (typeof str !== 'string') {
          console.warn('stripChar received a non-string element in the array.', messaa);
          return ''; // Return an empty string for invalid elements
      }
      // Convert to lowercase, trim whitespace, and filter out unwanted characters
      return str.toLowerCase().trim().split('').filter(char => !charToStrip.has(char)).join('');
  };
  
  // Check if the input is an array
  if (Array.isArray(input)) {
      // If it's an array, use .map() to process each string element
      return input.map(str => processString(str));
  } else if (typeof input === 'string') {
      // If it's a single string, process it directly
      return processString(input);
  } else {
      // Handle cases where the input is neither a string nor an array
      console.warn('stripChar received an invalid input type. Expected a string or an array of strings.', messaa);
      return '';
  }
}
}
// Nexport default serverLogic;
const ServerLogic = new Logic()
export  { ServerLogic }