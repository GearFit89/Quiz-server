interface QuestionData {
    numOfIncorrect: number;//i might do one  score system that is based on the number of incorrect answers, so this would be used for that and then the correct answer woukld be subtracted from it to get a final score, this would encourage users to get the answer right the first time
    numOfCorrect:number;
    isIncorrect:boolean;
    timestampSinceCorrect:number;
    timestampSinceIncorrect:number;
}

interface QuoteData {
    id:string;
    indexesMissed:number[];
    timestampSinceMissed:number;
    
}  //small data structures to get the maxium space out of redis, this is for the quiz manager to track question and quote data, it is not used for the quiz itself but for the management of the quiz, it is stored in redis as a hash map with the question or quote id as the key and the data as the value, this allows for quick access and updates to the data without having to retrieve the entire quiz data structure
//i will most likey expand on these data structures as i go along, but for now they are simple and efficient for the purpose of tracking question and quote data in the quiz manager
//i will use a heavliy optimized timestamp minutes since the begining of 2026 to track the time since the last correct or incorrect answer for questions and quotes, this will allow me to implement features such as increasing the difficulty of questions that have been missed multiple times or providing hints for questions that have been missed recently, this will also allow me to track the performance of users over time and provide insights into which questions are more difficult for users, this data can be used to improve the quiz experience and provide a more personalized experience for users based on their performance.