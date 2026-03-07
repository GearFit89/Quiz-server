import { EventEmitter } from 'events'; // Import EventEmitter for class inheritance

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
}

/**
 * The core logic manager for handling question lifecycles
 */
export declare class QuestionManager extends EventEmitter {
    constructor(
        roomId: string, // Unique room identifier
        questions: QuestionData[], // List of questions for the session
        timerSettings: TimerSettings, // Timing configuration
        month: string // Active month for trigger calculations
    );

    public questNum: number; // The current question index
    public isStop: boolean; // Flag to halt processing
    public questEnd: boolean; // Flag for rendering completion
    public tWordTimestamp: number; // Epoch time of trigger word appearance

    /**
     * Calculates word indices based on string length and triggers
     */
    private calcWordData(questionText: string, trigWordIndex: number): WordDataResult; // Internal calculation

    /**
     * Broadcasts the question character by character
     */
    private displayToClient(questionString: string): Promise<void>; // Character streaming logic

    /**
     * Main entry point to trigger a new question cycle
     */
    public newQuestion(overrideQuestNum?: number): Promise<void>; // Primary method
}