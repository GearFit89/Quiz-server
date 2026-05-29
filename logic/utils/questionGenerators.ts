import { Question } from "../../logic_scripts.js";
import { shuffleArray } from "./array.js";
import Rand from "./rand.js";
import { abbreviateBook, shortenText } from "./utils.js";
//macth, fill in blanks, multiple choice, true false, for Bible Quizzing website
export interface FillIn extends Question {
    type:'fill-in';
    blanksIndexes:number[];// the indexes of the words that are blanked out
    

}

export function createFillInBlankQuestion(text:string, question:Question): FillIn|Question {
    const words = text.split(' ');
    if(words.length < 5 ) return question;
    let answers:string[] = [];
    let questionWithBlanks = words;
    const blanksIndexes:number[] = [];
   for (let i = Rand.randomInt(0, 2); i < words.length; ) {
        const word = words[i];
            questionWithBlanks[i] = ' ___ '; 
        answers.push(word);
        blanksIndexes.push(i);
     i += Rand.randomInt(1, 3); // Randomly skip 1 to 3 words
   }
   return {
    
    ...question,
       type: 'fill-in',
    question: questionWithBlanks.join(' '),
    answer: answers.join(','),
    blanksIndexes
     // Store answers as a comma-separated string
   } as FillIn;
}
export interface TrueFalse extends Question {
    type:'true-false';
    correctAnswer:'True'|'False';
    questText:string;
}
//we combine the question and answer to create a true false question, we can also add some random wrong answers to make it more challenging
export function createTrueFalseQuestion( question:Question, questions:Question[]): Question {
    const pool = shuffleArray(questions)
    const isTrue = Rand.randomBool();
    let answer = question.answer;
    if (!isTrue) {
        const filteredPool = pool.filter(q => q.id!== question.id);
        // For false questions, we can either change the answer to something else or just mark it as false
        answer = filteredPool[Rand.randomInt(0, filteredPool.length -1)].answer  // This is a simple approach; you could also generate a plausible wrong answer
    }
    return {
        ...question,
        type: 'true-false',
        questText: `${question.question}?\n ${question.answer} (True or False)`,
        answer,
        correctAnswer: isTrue ? 'True' : 'False'
    } as TrueFalse ;
}


export interface MultipleChoice extends Question {
    type:'multiple-choice';
    choices:string[];
}


export function createMultipleChoiceQuestion(numChoices:number, question:Question, questions:Question[]): Question {
    const pool = shuffleArray(questions)
    const choices = 
     pool.filter(q => q.id !== question.id).slice(0, numChoices-1).map(q => q.answer);
    choices.push(question.answer); // Add the correct answer to the choices
    

    
    const shuffledChoices = shuffleArray(choices) // Shuffle choices
    return {
        ...question,
        type: 'multiple-choice',
        
        choices: shuffledChoices,
        answer: question.answer
    } as MultipleChoice;
}

export interface MatchQuestion extends Question {
    type: 'match';
    pairs: { left: string; right: string }[];
}

export function createMatchQuestion(
    text: string,
    length: number,
    question: Question, // Assuming Question interface has book, chapter, verse, etc.
    questions: any[],
    { left = 'question', right = 'answer' }: { left?: 'question' | 'ref'; right?: 'answer' | 'verse' } = {}
): MatchQuestion {

    // Define a helper function to extract and format the correct string // New line
    const extractField = (q: Question, field: string): string => { // New line
        // Check if the requested field is 'ref' // New line
        if (field === 'ref') { // New line
            // Return the abbreviated book, a space, chapter, colon, and verse // New line
            return `${abbreviateBook(q.book)} ${q.chapter}:${q.verse}`; // New line
        } // New line
        // Return the standard property from the object if it is not 'ref' // New line
        return(q as any )[field] // New line
    }; // New line

    const pairs: { left: string; right: string }[] = [];
    const pool = shuffleArray(questions).filter(q => q.id !== question.id);

    // Push the primary question's pair using the helper function // New line
    pairs.push({ left: extractField(question, left), right: extractField(question, right) }); // New line

    pool.slice(0, length - 1).forEach(q => {
        // Push the distractors' pairs using the helper function // New line
        pairs.push({ left: extractField(q, left), right: extractField(q, right) }); // New line
    });

    const shuffledPairs = shuffleArray(pairs);

    return {
        ...question,
        type: 'match',
        question: text,
        pairs: shuffledPairs,
        answer: question.answer // Inherits the answer from the base question
    };
}