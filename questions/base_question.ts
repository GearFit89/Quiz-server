import { EventEmitter } from 'events'; // Import the standard Node.js EventEmitter
//import { QuestionData, TimerSettings, QuestionManager } from './base_question';
// Helper function to handle async delays without blocking the thread
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Resolves after ms milliseconds
//import { EventEmitter } from 'events'; // Import EventEmitter for class inheritance

/**
 * Configuration for timing logic between question segments
 */
export interface TimerSettings {
  questionInterval: number; // Interval for character rendering in ms
  waitAfterQuest: number; // Delay after a question ends
  waitBetween: number; // Delay between full question cycles
  waitFromHead: number; // Delay after header appears
}

/**
 * Structure for the raw question data
 */
export interface QuestionData {
  type: string; // The category of the question
  ref?: string; // Reference for 'quote' types
  question?: string; // The text for standard questions
  answer?: string; // The answer text for 'ftv' types
  verse?: string; // Verse text fallback for 'ftv'
  numVerses?: number; // Optional count of verses
  trigs: Record<string, number[]>; // Month-based trigger word indices
}

/**
 * Result of the trigger word calculation
 */
export interface WordDataResult {
  tWord: string; // The actual word targeted
  startIndex: number; // Starting char index in the full string
  endIndex: number; // Ending char index
}export interface QuestionEvents {
  updateUsers: (roomId: string, data: any, force?: boolean, options?: any) => void; // Event to update Redis user states
  finish: () => void; // Event to trigger the end of the quiz
  switchStatus: (oldStatus: string, newStatus: string) => void; // Event to change player states
  publish: (roomId: string, payload: any) => void; // Event to send the WebSocket string payload
  nextQuestion: (nextQuestNum: number) => void; // Event to trigger the next question timeout
  error: (err: any, context: string) => void; // Event to handle caught errors
}

/**
 * The core logic manager for handling question lifecycles
 */
// export declare class QuestionManager extends EventEmitter {
//   constructor(
//     roomId: string, // Unique room identifier
//     questions: QuestionData[], // List of questions for the session
//     timerSettings: TimerSettings, // Timing configuration
//     month: string // Active month for trigger calculations
//   );

//   public questNum: number; // The current question index
//   public isStop: boolean; // Flag to halt processing
//   public questEnd: boolean; // Flag for rendering completion
//   public tWordTimestamp: number; // Epoch time of trigger word appearance

//   /**
//    * Calculates word indices based on string length and triggers
//    */
//   private calcWordData(questionText: string, trigWordIndex: number): WordDataResult; // Internal calculation

//   /**
//    * Broadcasts the question character by character
//    */
//   private displayToClient(questionString: string): Promise<void>; // Character streaming logic

//   /**
//    * Main entry point to trigger a new question cycle
//    */
//   public newQuestion(overrideQuestNum?: number): Promise<void>; // Primary method
// // }
// The main class managing the lifecycle of a single question
export class QuestionManager extends EventEmitter {
  public questNum: number = 0; // Tracks the current question index
  public isStop: boolean = false; // Flag to halt the character loop and timers
  public questEnd: boolean = false; // Flag indicating if the question has fully rendered
  public tWordTimestamp: number = Infinity; // Timestamp of when the trigger word was shown

  private skipQId: NodeJS.Timeout | undefined; // Holds the timeout ID for skipping a question
  private clientQuestId: string = ''; // Unique ID generated per question for the client

  // Class constructor initializing the required state variables
  constructor(
    private roomId: string, // The Redis room ID string
    private questions: QuestionData[], // Array of loaded question objects
    private timerSettings: TimerSettings, // Configuration for question timings
    private month: string // The active month for trigger word lookup
  ) {
    super(); // Call the EventEmitter parent constructor
  }

  // Helper method to calculate random numbers (kept internal as requested)
  private chanceRange(min: number, max: number): number {
    const range = max - min + 1; // Calculate total possible numbers
    return Math.floor(Math.random() * range) + min; // Return a random integer within bounds
  }

  // Method to extract the exact character positions of the trigger word
  private calcWordData(questionText: string, trigWordIndex: number): WordDataResult {
    const words = questionText.split(' '); // Split the question string into an array of words
    const textBefore = words.slice(0, trigWordIndex).join(' '); // Rebuild string of all words before the trigger

    const startIndex = trigWordIndex === 0 ? 0 : textBefore.length + 1; // Calculate starting char index (accounting for spaces)
    const tWord = words[trigWordIndex] ?? ''; // Extract the target word safely
    const endIndex = startIndex + Math.max(0, tWord.length - 1); // Calculate ending char index

    return { tWord, startIndex, endIndex }; // Return the formatted word data object
  }

  // Method to stream the question character by character to the clients
  private async displayToClient(questionString: string): Promise<void> {
    this.isStop = false; // Ensure the stop flag is reset before looping
    this.questEnd = false; // Mark that the question is currently rendering
    let testQuestHolder = ''; // Server-side string builder for debugging
    const questChars = questionString.split(''); // Convert the full string into an array of characters
    const time = this.timerSettings.questionInterval || 80; // Fetch the configured rendering speed

    // FIXED: Changed || to && to prevent the infinite loop bug
    for (let i = 0; i < questChars.length && !this.isStop; i++) {
      const char = questChars[i]; // Grab the current character
      testQuestHolder += char; // Append it to the debug string

      // Emit the publish event instead of calling Redis directly
      this.emit('publish', this.roomId, { payload: [this.clientQuestId, char, i + 1] });

      await wait(time); // Pause execution to simulate the typing effect
    } // End of the sequential loop

    console.warn('Completed quest string:', testQuestHolder); // Log the final constructed string to verify order
    this.questEnd = true; // Mark the question as fully rendered
    this.questNum++; // Increment the question counter for the next round

    // Emit the final question mark/end signal
    this.emit('publish', this.roomId, { payload: [this.clientQuestId, '?', questChars.length] });
  }

  // The main entry point to start generating a new question
  public async newQuestion(overrideQuestNum?: number): Promise<void> {
    if (overrideQuestNum !== undefined) this.questNum = overrideQuestNum; // Apply override if provided
    const questNum = this.questNum; // Create a local reference
    console.warn('Starting quest index:', questNum); // Log the start

    try {
      this.isStop = true; // Force any active loops from previous questions to stop
      if (this.skipQId) clearTimeout(this.skipQId); // Clear any pending skip timeouts
    } catch (e) {
      this.emit('error', e, 'timer_cleanup'); // Emit error instead of crashing
    }

    try {
      if (questNum >= this.questions.length) { // Check if we have exhausted the question array
        console.warn('Quiz over - no more questions'); // Log completion
        this.emit('updateUsers', this.roomId, { end: true }, true); // Emit state update
        this.emit('finish'); // Trigger the finish teardown logic
        return; // Exit the function immediately
      }

      // Initial delays before formatting
      if (questNum !== 0) await wait(this.timerSettings.waitAfterQuest || 3000); // Wait if not the first question
      this.emit('updateUsers', this.roomId, { question: { wait: true } }, true, { channel: this.roomId }); // Set UI to waiting state
      await wait(this.timerSettings.waitBetween || 4000); // Wait between questions

      const questObj = this.questions[questNum]; // Fetch the current question object
      if (!questObj) { // Safety check if object is undefined
        this.emit('updateUsers', this.roomId, { end: true }, true); // Force UI end state
        this.emit('finish'); // Emit finish
        return; // Exit
      }

      this.clientQuestId = `${Date.now()}90quest90${Math.random()}`; // Generate unique client tracking ID
      const types = ['ftv', 'quote']; // Allowed randomized types
      const type = questObj.type === 'ftv/quote' ? types[this.chanceRange(0, 1)] : questObj.type; // Decide strict type

      let finalQuestionString = type === 'quote' ? questObj.ref as string : questObj.question as string; // Pick base string

      // Calculate trigger indices using fallback defaults if missing
      const trigWordIndex = type === 'quote'
        ? questObj.trigs[this.month]?.[2] || 56660
        : questObj.trigs[this.month]?.[0] || 3000;

      // Calculate start and end indices dynamically using the new method
      const wordData = this.calcWordData(finalQuestionString, trigWordIndex);
      console.log('Word Data:', wordData); // Log calculated trigger bounds

      this.emit('updateUsers', this.roomId, { question: { wait: false } }, true, { channel: this.roomId }); // Lift waiting state

      // Format headers and specialized question text
      if (type === 'According to') { // Enum equivalent
        finalQuestionString = 'According to ' + finalQuestionString; // Prefix string
        this.emit('updateUsers', this.roomId, { question: { head: "Question" } }, true); // Set basic header
      } else {
        const header = `${questObj.numVerses ? questObj.numVerses + ' Verse' : ''} ${type === 'sq' ? 'Situation Question' : type.charAt(0).toUpperCase() + type.slice(1)}`; // Dynamically build header
        this.emit('updateUsers', this.roomId, { question: { head: header } }, true); // Set specific header
      }

      // Slice arrays for FTV questions specifically
      if (type === 'ftv') {
        const sourceArr = questObj.answer?.split(' ') || questObj.verse?.split(' ') || []; // Find the correct source array
        finalQuestionString = sourceArr.slice(0, trigWordIndex > 4 ? trigWordIndex + 1 : 5).join(' '); // Re-join up to the slice point
      }

      await wait(this.timerSettings.waitFromHead || 2000); // Final delay before rendering text
      this.emit('switchStatus', '*', 'waiting for jumps from the user'); // Change player states
      this.emit('publish', this.roomId, { payload: [this.clientQuestId, "Question: ", 0] }); // Broadcast the prefix

      if (type === 'sq') this.questEnd = true; // SQs are instantly marked as ended

      await this.displayToClient(finalQuestionString); // Delegate to the rendering loop

      // Setup the timeout for moving to the next question if nobody answers
      this.skipQId = setTimeout(() => {
        if (this.isStop) return; // Prevent triggering if game halted
        console.warn('Next question coming as this question timed out.'); // Log timeout
        this.emit('switchStatus', '*', 'users waiting for next question'); // Reset player states

        // FIXED: Now calls nextQuestion event with the updated questNum instead of 0
        this.emit('nextQuestion', this.questNum);
      }, 5675); // Timeout duration

    } catch (error) {
      this.emit('error', error, 'newQuestion_execution'); // Safely emit uncaught execution errors
    }
  }
}