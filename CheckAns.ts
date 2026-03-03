
import { Options, AnswerReturn } from "./types.js";


class AnswerLogic {
    private readonly commonWords: Set<string> = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'on', 'for', 'with', 'as', 'was', 'at', 'by', 'an', 'be', 'this', 'from']);

    public checkAnswer(
        answer: string,
        enteredAnswer: string,
        options: Options = {
            spellThreshold: 2,
            closeThreshold: 2,
            correction: true,
            extraThreshold: 2,
            isQuote: false,
            isOneChanceQuote: false,
            shouldCorrectAtErr: false
        }
    ): AnswerReturn {
        try {
            // 1. Sanity Checks
            if (enteredAnswer === answer) return { score: 1 };
            if (!enteredAnswer || !answer) return { score: -1 };
            const {cleanans, switched } = this.manageAnswer(answer, false, enteredAnswer);
            // 2. Preparation & Cleaning
            switched && console.warn(switched, 'switched with chcj answer')
            const changedEntr = switched ? switched : enteredAnswer;
            const cleanAns =cleanans.map(w => this.stripChar(w) as string).filter(Boolean);
            const cleanEntrAns = changedEntr.split(/\s+/).map(w => this.stripChar(w) as string).filter(Boolean);
            
            if (cleanAns.join(' ') === cleanEntrAns.join(' ')) return { score: 1 };

            // 3. Fuzzy Logic (Spellcheck)
            const { correctedAnswer } = this.spellCheck(cleanAns, cleanEntrAns, {
                correction: options.correction,
                threshold: options.spellThreshold,
                spellIndexEnd: 2,
                spellIndexStart: 2
            });

            // 4. Quote Specific Logic
            if (options.isQuote) {
                const targetComparison = options.shouldCorrectAtErr
                    ? cleanAns.slice(0, correctedAnswer.length)
                    : cleanAns;

                if (correctedAnswer.join(' ') === targetComparison.join(' ')) {
                    return { score: 1 };
                }
                return options.isOneChanceQuote ? { score: -1 } : { score: 0 };
            }

            // 5. Frequency Analysis (The "Bag of Words" check)
            // We filter out common words to focus on the "meaningful" content
            const filterCommons = (arr: string[]) => arr.filter(w => !this.commonWords.has(w.toLowerCase()));

            const fixedEntr = filterCommons(correctedAnswer);
            const fixedAns = filterCommons(cleanAns);

            const entrCount = this.wordsCount(fixedEntr);
            const ansCount = this.wordsCount(fixedAns);

            // Calculate discrepancies
            let incorrectCount = 0;
            let extraCount = 0;
            const incorrectWords:Record<string, number> = {}
            const extraWords: Record<string, number> = {}
            const allWords = new Set([...Object.keys(ansCount), ...Object.keys(entrCount)]);

            allWords.forEach(word => {
                const target = ansCount[word] || 0;
                const actual = entrCount[word] || 0;
                if (actual < target) { incorrectCount += (target - actual); incorrectWords[word]= (target - actual )};
                if ((actual > target )&& (!cleanAns.includes(word))) {extraCount += (actual - target);extraWords[word]=actual-target}
            });

            // 6. Final Evaluation
            if ((correctedAnswer === cleanAns) || (fixedAns === fixedEntr) || (answer.includes('and') && incorrectCount == 0)) {
                // Note: This returns 1 even if "common words" are missing. 
                // If you want to require "the", "and", etc., compare correctedAnswer vs cleanAns here.
                return { score: 1 };
            }

            if (extraCount > options.extraThreshold || incorrectCount > options.closeThreshold) {
                return { score: -1, extraCount, incorrectCount,extraWords, incorrectWords, message: `You got ${incorrectCount} words incorrect ${extraCount && `\n You added ${extraCount} words`}` }
            }

            return { score: 0, extraCount, incorrectCount };
        } catch (error) {
            console.error('error with check answer');
            return { score: -1, };
        }
    }

    private wordsCount(input: string[] = []): Record<string, number> {
        const objectCount: Record<string, number> = {};
        // Loop and increment count for each word
        input.forEach(word => {
            objectCount[word] = (objectCount[word] || 0) + 1;
        });
        return objectCount;
    }

    public stripChar(input: string | string[], nums: boolean = false): string | string[] {
        const charToStripArr = ['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ', '\n', '\r', '\t', '[', ']', '{', '}', '—', '–', '|'];
        if (nums) charToStripArr.push('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        const charToStrip = new Set(charToStripArr);

        const processString = (string: string): string => {
            if (typeof string !== 'string') return '';
            // Sanitize string
            return string.toLowerCase().trim().split('').filter(char => !charToStrip.has(char)).join('');
        };

        return Array.isArray(input) ? input.map(processString) : processString(input);
    }

    private levenshtein(a: string, b: string): number {
        const matrix: number[][] = [];
        // Standard Levenshtein distance algorithm
        for (let i = 0; i <= a.length; i++) matrix[i] = [i];
        // Init columns
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                // Check character equality
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    // Calculate minimum of delete, insert, substitute
                    matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1);
                }
            }
        }
        return matrix[a.length][b.length];
    }
    checkAlt(ogphars: string, altans: string[], corspondAns: string[]) {
        // Keep spaces initially to allow word boundaries (\b) to work correctly
        let switched = ogphars.toLowerCase(); // Initialize with lowercase version of original

        // Iterate through provided alternative phrases
        for (let i = 0; i < altans.length; i++) {
            // Escape special regex characters in the alternative phrase
            const escapedAlt = altans[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Sanitize for regex
            // Use double backslash for boundaries in a template string
            const regex = new RegExp(`\\b${escapedAlt}\\b`, 'gi'); // Create regex with word boundaries

            // If the pattern is found in the current string
            if (regex.test(switched)) {
                // Replace the alternative with the corresponding correct answer
                switched = switched.replace(regex, corspondAns[i]); // Perform replacement
            } // End pattern check
        } // End loop

        // Strip punctuation and spaces only after replacements are finished
        return this.stripChar(switched) as string; // Final sanitization
    }

    manageAnswer(ans:string, issplit = false, og = '') {
        //removes () and[] from answers
        let inAns;
        let lastWord;
        let altPhar = '';
        let exANs = [];
        let altans = [];
        let cleanans = [];
        let corspondAns = [];
        let isAlt = false;
        let isEx = false;

        //iterator 
        let ii = 0;
        //let exANs = null;
        if (!issplit) {
            inAns = ans.split(/\s+/);
        } else {
            inAns = ans;
        }
        //if(inAns.includes('(') || inAns.includes('[')){
        for (let i of inAns) {
            if (i.includes('[') || isEx) {
                //maybe
                isEx = true;
                exANs.push(i);
                if (i.includes(']')) {
                    isEx = false;
                }
            } else if (i.includes('(') || isAlt) {
                //i.includes('(') || isAlt){
                //altans.pop()
                isAlt = true;

                altPhar += `${i} `;
                if (i.includes(')') || i.includes(',')) {

                    corspondAns.push(lastWord);
                    altans.push(altPhar);
                    altPhar = '';
                }
                if (i.includes(')')) {
                    isAlt = false;

                    //altans.push(altPhar.join(' '));
                }
                //
            } else {
                //altans.push(i)
                lastWord = i;
                cleanans.push(i);
            }
            ii++;
        }
        corspondAns = corspondAns || [] as string[];
        const switched = this.checkAlt(og, altans, corspondAns as string[]);
    return {cleanans, altans, corspondAns, exANs, switched};
    }
    private spellCheck(answer: string[] = [], enteredAnswer: string[] = [], options = { threshold: 2, correction: true, spellIndexEnd: 2, spellIndexStart: 2 }) {
        const correctedAnswer: string[] = [];
        const misspelledWords: string[] = [];

        // Map through the entered answer
        enteredAnswer.forEach((enteredWord, index) => {
            let bestMatch = enteredWord;
            let minDistance = Infinity;
            const targetIndexStart = index - options.spellIndexStart
            const targetIndexEnd = index + options.spellIndexStart;

            // Check against all target words witin 2  for the closest match
            for (let i = targetIndexStart; i > targetIndexEnd; i++) {
                const targetWord = answer[i]
                const distance = this.levenshtein(targetWord, enteredWord);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestMatch = targetWord;
                }
            };

            // Apply correction if within threshold
            if (minDistance <= options.threshold) {
                correctedAnswer.push(options.correction ? bestMatch : enteredWord);
            } else {
                correctedAnswer.push(enteredWord);
                misspelledWords.push(enteredWord);
            }
        });

        return { correctedAnswer, misspelledWords };
    }
    
};
export default AnswerLogic;