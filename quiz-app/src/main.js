/**
 * @class  QuizCompanion
 * @description
 * The `QuizCompanion` class is a comprehensive utility designed to manage and facilitate quiz-related functionalities. 
 * It handles quiz initialization, question generation, answer validation, user interaction, and more. 
 * The class is highly configurable and supports various quiz types, including quotes, FTVs, and questions.
 * 
 * @param {boolean} debugMode - Enables or disables debug logging for the class.
 * @param {string} type - The type of quiz being managed (e.g., "review", "study").
 * @param {object|string} config - Configuration for the quiz. Can be an object for settings, an array for questions, or "nothing" for default behavior.
 * 
 * @property {boolean} deblog - Indicates whether debug mode is enabled.
 * @property {string} QUIZID - A unique identifier for the quiz session.
 * @property {string} QUIZTYPE - The type of quiz being managed.
 * @property {object} quizSettings - Stores settings for the quiz, such as highlight mode and speed of text.
 * @property {object} question_dict - Stores processed question data.
 * @property {object} verse_dict - Stores processed quote/FTV data.
 * @property {Array} selVerses - The selected verses/questions for the quiz.
 * @property {Array} answers - Stores the user's answers and their correctness.
 * @property {boolean} isrendered - Indicates whether the quiz content is fully rendered.
 * @property {boolean} running - Indicates whether the quiz is currently running.
 * @property {boolean} isend - Indicates whether the quiz has ended.
 * @property {number} correctCount - Tracks the number of correct answers.
 * @property {number} currentQNum - Tracks the current question number.
 * @property {number} Time - Stores the timer length for the quiz.
 * @property {number} speeddetext - Stores the speed of text display in milliseconds.
 * @property {boolean} dragEnabled - Indicates whether drag-and-drop functionality is enabled.
 * @property {string} STATE - Indicates the current state of the application (e.g., "local").
 * @property {string} URL - The base URL for fetching data.
 * @property {Array} quizMonths - Stores information about quiz months and their corresponding chapters.
 * @property {Array} books - Stores the list of books used in the quiz.
 * @property {Array} questTypes - Stores the types of questions supported by the quiz.
 * @property {Array} qs - Stores the types of questions for the current quiz session.
 * @property {Array} timeouts - Stores timeout IDs for managing delayed text rendering.
 * 
 * @method Start()
 * @description Starts the quiz by displaying the main quiz scene and hiding the start scene.
 * 
 * @method initializeQuiz()
 * @description Initializes the quiz by loading questions and quotes/FTVs, and processes them into usable formats.
 * @returns {Promise<object>} Returns an object containing all questions and quotes/FTVs.
 * 
 * @method loadQuestions()
 * @description Fetches and processes question data from a file.
 * @returns {Promise<object>} Returns a dictionary of processed questions.
 * 
 * @method loadQuotes()
 * @description Fetches and processes quote/FTV data from a file.
 * @returns {Promise<object>} Returns a dictionary of processed quotes/FTVs.
 * 
 * @method processQuestions(data)
 * @description Processes raw question data into a structured format.
 * @param {string} data - The raw question data as a string.
 * @returns {object} A dictionary of processed questions.
 * 
 * @method processQuotes(data)
 * @description Processes raw quote/FTV data into a structured format.
 * @param {string} data - The raw quote/FTV data as a string.
 * @returns {object} A dictionary of processed quotes/FTVs.
 * 
 * @method generateQuiz(quoteC, ftvC, lengthQuiz)
 * @description Generates a quiz by selecting and shuffling questions and quotes/FTVs.
 * @param {number} quoteC - The number of quotes to include.
 * @param {number} ftvC - The number of FTVs to include.
 * @param {number} lengthQuiz - The total length of the quiz.
 * @returns {Promise<void>}
 * 
 * @method checkAns()
 * @description Validates the user's answer and updates the quiz state accordingly.
 * @returns {boolean} Returns true if the answer is correct, false otherwise.
 * 
 * @method correct(result)
 * @description Updates the quiz state based on whether the user's answer is correct or incorrect.
 * @param {string} result - The result of the answer ("right" or "wrong").
 * 
 * @method delay_text(txt, elm, par, delay, COLOR, id1, id2)
 * @description Renders text with a typing animation and optional highlighting.
 * @param {string} txt - The text to render.
 * @param {string} elm - The HTML element to use for rendering.
 * @param {string} par - The parent element ID.
 * @param {number} delay - The delay between each character in milliseconds.
 * @param {string} COLOR - The color of the text.
 * @param {number|string} id1 - The word index to highlight.
 * @param {number|string} id2 - The character index to highlight.
 * @returns {Promise<void>}
 * 
 * @method findUniqueTriggerWord(ARRAY, _obj, currentVerseNumber, classwordname, classCHAR, stop)
 * @description Finds a unique trigger word or character in a verse.
 * @param {Array} ARRAY - The array of words in the current verse.
 * @param {Array|object} _obj - The object or array of other verses to compare against.
 * @param {string} currentVerseNumber - The current verse number.
 * @param {string} classwordname - The CSS class for highlighting words.
 * @param {string} classCHAR - The CSS class for highlighting characters.
 * @param {boolean} stop - Whether to stop at the unique word.
 * @returns {Promise<object>} Returns an object containing the unique word and character indices.
 * 
 * @method manageAnswer(ans, issplit, og)
 * @description Processes and manages the correct answer, including alternative answers and exceptions.
 * @param {string} ans - The correct answer.
 * @param {boolean} issplit - Whether the answer is already split into words.
 * @param {string} og - The original user input.
 * @returns {Array} Returns an array containing the processed answer components.
 * 
 * @method levenshtein(a, b, Percent)
 * @description Calculates the Levenshtein distance between two strings.
 * @param {string} a - The first string.
 * @param {string} b - The second string.
 * @param {number} Percent - The percentage similarity threshold.
 * @returns {boolean|number} Returns true if the similarity is above the threshold, otherwise returns the distance.
 * 
 * @method updateClientInfo(info, name, setItem)
 * @description Updates or retrieves client information from localStorage.
 * @param {object} info - The information to store.
 * @param {string} name - The key for localStorage.
 * @param {boolean} setItem - Whether to set or get the item.
 * @returns {object|null} Returns the stored information or null if not found.
 * 
 * @method fliterOutQs(inquestions, ob)
 * @description Filters questions based on specified criteria.
 * @param {Array} inquestions - The array of questions to filter.
 * @param {object} ob - The filtering criteria.
 * @returns {Array} Returns the filtered questions.
 * 
 * @method sortBy(inquestions, mode)
 * @description Sorts questions based on the specified mode.
 * @param {Array} inquestions - The array of questions to sort.
 * @param {string} mode - The sorting mode ("alpha" or "trigger").
 * @returns {Array} Returns the sorted questions.
 * 
 * @method clear(par3)
 * @description Clears the current quiz state and resets the UI.
 * @param {string} par3 - The parent element ID to clear.
 * 
 * @method hightestMonth(inMonths)
 * @description Determines the highest month and its corresponding chapters.
 * @param {Array} inMonths - The array of months to evaluate.
 * @returns {object} Returns an object containing the highest month and chapters.
 * 
 * @method manageModal(mtxt, set, modalid, mcon, closebtn, btntxt, onModalClose, onModalOpen)
 * @description Manages the display and behavior of a modal dialog.
 * @param {string} mtxt - The modal text content.
 * @param {boolean} set - Whether to apply settings on modal close.
 * @param {string} modalid - The modal element ID.
 * @param {string} mcon - The modal content element ID.
 * @param {string} closebtn - The close button element ID.
 * @param {string} btntxt - The close button text.
 * @param {Function} onModalClose - Callback for when the modal closes.
 * @param {Function} onModalOpen - Callback for when the modal opens.
 */
const SETTINGSHTML = `<!--settings head--><div id="settings-full">
    <div id="startScene" class="start-scene-container">
        <div class="start-scene-card" id="overflow-set">
            <h2 class="title">Quiz Setup</h2>
            <p class="subtitle">Customize your practice session.</p>

            <form id="quizOptionsForm">
                <div class="overflow-set">
                <!---sel-->
                
                <div class="option-section" id="vs">
                    <h3 class="section-title">Verse Selection</h3>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="verseSelection" value="random" checked>
                            <span class="radio-custom"></span>
                            Random
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="verseSelection" value="byReference">
                            <span class="radio-custom"></span>
                            By Reference
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="verseSelection" value="alphabet" >
                            <span class="radio-custom"></span>
                            Alphabetically
                        </label>
                    </div>
                </div>
                <!---sel-->
                <div class="option-section" id="qt">
                    <h3 class="section-title">Question Type</h3>
                    <div class="checkbox-container">
                        <label class="toggle-label"><input type="checkbox" name="quizMode" value="quote" checked>Quotes</label>
                        <label class="toggle-label"><input type="checkbox" name="quizMode" value="ftv" checked title="Finish the Verse"> FTV</label>
                        <label class="toggle-label"><input type="checkbox" name="quizMode" value="SQ:" checked> SQ</label>
                        <label class="toggle-label"><input type="checkbox" name="quizMode" value="According to" checked>According to </label>
                        <label class="toggle-label"><input type="checkbox" name="quizMode" value="question"  checked title="Regluar questions">Questions</label>
                    </div>
                </div>
              
                <!---sel-->
                
                <div class="option-section"id="nq">
                    <h3 class="section-title">Number of Questions</h3>
                    <input type="number" id="numQuestions" name="numQuestions" value="20" min="1" max="100" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                </div>
                <!---sel-->
                    <div class="option-section extra">
                        <h3 class="section-title">Length of Timer (Length of zero will be no timer)</h3>
                        <input type="number" id="secs" name="numQuestions" value="30" min="0" max="1000" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    </div>
                    <!---sel-->
                    <div class="option-section extra">
                        <h3 class="section-title">Speed of Text (In milliseconds)</h3>
                        <div class="range-display-container">
                            <!-- This is your existing range input. -->
                            <input type="range" id="speed" name="numQuestions" value="0" min="0" max="2000">
                            <!-- Add a new span element to display the current value. -->
                            <span id="speedValue">0</span>
                        </div>
                    </div>
                    <!---sel-->
                    <div class="option-section extra"id="mc">
                        <h3 class="section-title">Question Selection</h3>
                        <div class="radio-group">
                            <label  id="month" class="radio-label">
                                <input type="radio" name="monthSelected" value="month" checked>
                                <span class="radio-custom"></span>
                                 By Months
                            </label>
                            <label id="chapter" class="radio-label">
                                <input type="radio" name="monthSelected" value="chapter">
                                <span class="radio-custom"></span>
                                 By Chapters
                            </label>
                        </div>
                    </div>
                    <div id="chapters" class="checkbox-container"></div>
                    <div id="monthDiv" class="option-section">
                        
                        <h3 class="section-title">Select Months</h3>
                        <div class="checkbox-container">
                            <label class="toggle-label"><input type="checkbox" name="month" value="october"> October</label>
                            <label class="toggle-label"><input type="checkbox" name="month" value="november"> November</label>
                            <label class="toggle-label"><input type="checkbox" name="month" value="december"> December</label>
                            <label class="toggle-label"><input type="checkbox" name="month" value="january"> January</label>
                            <label class="toggle-label"><input type="checkbox" name="month" value="february"> February</label>
                            <label class="toggle-label"><input type="checkbox" name="month" value="march"> March</label>
                        </div>
                    </div>
                    <!---sel-->
                <div class="option-section extra" id="tw">
                    <h3 class="section-title">Trigger Words</h3>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" id="highlight"name="verseSelectionH" value="highlight" checked>
                            <span class="radio-custom"></span>
                            Highlight
                        </label>
                        <label class="radio-label">
                            <input type="radio"id="ingore" name="verseSelectionH" value="ingore">
                            <span class="radio-custom"></span>
                            Ingore
                        </label>
                        <label class="radio-label">
                            <input type="radio" id="stop" name="verseSelectionH" value="stop" >
                            <span class="radio-custom"></span>
                            Stop at Word
                        </label>
                    </div>
                </div>
                <!---sel-->
                <div class="option-section" id="fgs ">
                    <h3 class="section-title">Flight</h3>
                    <div class="checkbox-container">
                        <label class="toggle-label"><input type="checkbox" name="flight" value="A" checked> A</label>
                        <label class="toggle-label"><input type="checkbox" name="flight" value="B" checked> B</label>
                        <label class="toggle-label"><input type="checkbox" name="flight" value="C" checked> C</label>
                        <label class="toggle-label"><input type="checkbox" name="flight" value="T" checked> T</label>
                    </div>
                </div>
                <!--sel-->
            </div>
                 <!--button-start-->
               <a id="startQuizButton2"> <button type="submit" class="button" id="startQuizButton" >Start Quiz</button></a>
                 
            </form>
        </div>
    </div>
    </div></div> <!--bottom-->`;


const mhtml = `<dialog class="modal" id="settings"> 
        <div class="modal-content" id="modaldiv">
            <h3 id="modalh3">Settings</h3>
           <!-- <div class="option-section">
                        <h3 class="section-title">Length of Timer (Length of zero will be no timer)</h3>
                        <input type="number" id="secs" name="numQuestions" value="30" min="0" max="1000" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    </div>
                    <div class="option-section">
                        <h3 class="section-title">Speed of Text (In seconds)</h3>
                        <input type="range" id="speed" name="numQuestions" value="0" min="0" max="1000" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    </div>-->
            
            <p id="modalMessage"></p>
            
            </div>
            <br>
            
            
            <button id='closeModalBtn' class="button">OK</button>
        
    </dialog>`





class HtmlContentHandling {
    constructor(htmlScenesArray, idOfDivToDisplay, warp=true){
        this.warp = warp;
        this.Display = document.getElementById(idOfDivToDisplay);   
        this.htmlToDisplay = htmlScenesArray;
        this.currenthtmlDisplay = [];
        this.currentSceneIndex = 0;
        this.prev = 0
        this.scenes;
    }
    init(){
        console.log(this.htmlToDisplay[this.currentSceneIndex])
        this.Display.innerHTML = this.htmlToDisplay[this.currentSceneIndex];
        this.currentSceneIndex = 0; // Reset currentSceneIndex to 0 on init
    }
    changeScene(index, newData){
        const i = index || this.htmlToDisplay.length;
        this.htmlToDisplay[i] = newData

    }
    add(data){this.htmlToDisplay.push(data)}
    displayHTMLScene(sceneName) {
        const scene = this.htmlToDisplay.find(scene => scene.name === sceneName);
        if (scene) {
            return scene.content;
        } else {
            console.error(`Scene "${sceneName}" not found.`);
            return null;
        }
    }
    nextScene(){
        // logic to go to next scene
        this.currenthtmlDisplay.push(this.htmlToDisplay[this.currentSceneIndex]);
        this.currentSceneIndex++;
        if(this.currentSceneIndex >= this.htmlToDisplay.length){
           if(this.warp) {this.currentSceneIndex = 0; }else {return;}
        }
        this.Display.innerHTML =  this.htmlToDisplay[this.currentSceneIndex];
        
    }
    back(){
        if(this.currentSceneIndex === 0) {
            this.currentSceneIndex = 1;
        }
        // logic to go to previous scene
        this.currenthtmlDisplay.push(this.htmlToDisplay[this.currentSceneIndex]);
        this.currentSceneIndex--;
        this.Display.innerHTML =  this.htmlToDisplay[this.currentSceneIndex];
    }
prevoiusScene(){
    //this.Display.innerHTML = this.currenthtmlDisplay[];
    //this.prev--
    console.log(this.currenthtmlDisplay)
        // logic to go to previous scene
        //this.currenthtmlDisplay.push(this.displayHTMLScene(this.htmlToDisplay[this.currentSceneIndex]));
        ///this.currentSceneIndex--;
        //this.Display.innerHTML =  this.currenthtmlDisplay[this.currentSceneIndex];
    }
    set scenes (arrayOfScenes){
        if(typeof arrayOfScenes !== 'array') {console.error('scenes must be an array'); return;}
        this.htmlToDisplay = arrayOfScenes;
    }
 }

 
  
/**
 * Initializes and starts the Web Speech API (SpeechRecognition) for voice recording and transcription.
 * This function requires browser support for the SpeechRecognition interface (e.g., Chrome, Edge).
 * recognition is the instance of the class
 * @param {Function} onResultCallback - Function to call with the transcribed text when a result is ready.
 * @param {Function} onStartCallback - Function to call when recording successfully starts.
 * @param {Function} onEndCallback - Function to call when recording stops (either manually or automatically).
 * @param {Function} toStop -Use to add event listners and stop it with .stop()
 * @param {Function} onErrorCallback - Function to call if an error occurs.
 * @returns {Object|null} The SpeechRecognition instance if supported, otherwise null.
 */
function startVoiceRecognition(onResultCallback, onStartCallback, onEndCallback, onErrorCallback, toStop) {
    // Comment: Check for the presence of the SpeechRecognition object (with vendor prefix for compatibility).
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Comment: Check for browser support and return null if not available.
    if (!SpeechRecognition) {
        console.error("Speech Recognition is not supported in this browser."); // Comment: Log the lack of support.
        return null; // Comment: Return null to indicate failure.
    }

    // Comment: Create a new instance of the SpeechRecognition service.
    const recognition = new SpeechRecognition(); 
    
    // Comment: Configure the recognition settings.
    recognition.interimResults = false; // Comment: Only return the final, most confident transcription result.
    recognition.continuous = false; // Comment: Stop listening after a single utterance is detected.
    recognition.lang = 'en-US'; // Comment: Set the language to English (US) for transcription accuracy.

    // --- Event Handlers ---

    // Comment: Handler for when the service begins listening.
    recognition.onstart = () => {
        if (onStartCallback) onStartCallback(); // Comment: Call the user-provided start callback function.
    };

    // Comment: Handler for when a successful transcription result is available.
    recognition.onresult = (event) => {
        // Comment: Extract the most confident transcribed text from the results array.
        const transcript = event.results[0][0].transcript; 
        if (onResultCallback) onResultCallback(transcript); // Comment: Pass the text to the user-provided result callback.
    };

    // Comment: Handler for when the service stops (finished or manually stopped).
    recognition.onend = () => {
        if (onEndCallback) onEndCallback(); // Comment: Call the user-provided end callback function.
    };

    // Comment: Handler for errors during the recognition process.
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error); // Comment: Log the error to the console.
        if (onErrorCallback) onErrorCallback(event.error); // Comment: Pass the error to the user-provided error callback.
    };
if(toStop) toStop()
    // Comment: Start the recognition service.
    try {
        recognition.start(); // Comment: Initiate the browser's microphone listening.
        return recognition; // Comment: Return the instance so it can be stopped later if needed.
    } catch (e) {
        // Comment: Catch potential errors if the service is already running or permission is denied.
        console.error("Could not start recognition:", e); // Comment: Log the startup error.
        if (onErrorCallback) onErrorCallback("Startup failed."); // Comment: Notify the user of the startup failure.
        return null; // Comment: Return null on failure.
    }
}




const mockQuestions = [
    { ref: "Matthew 11:07-08", id: 1, verse: "Where, did Jesus ask, did the crowds go out to see a man dressed in soft clothing? The wilderness?", month: "october" },
    { ref: "Matthew 11:08", id: 2, verse: "Where are those who wear soft clothing? In kings' houses", month: "november" },
    { ref: "Matthew 11:09", id: 3, verse: "Who is more than a prophet? John (John the Baptist)", month: "december" },
    { ref: "Matthew 11:09", id: 4, verse: "About whom did Jesus say, 'Yes, I tell you, and more than a prophet'? John (John the Baptist)", month: "january" },
    { ref: "Matthew 11:10", id: 5, verse: "Who will I send before your face? My messenger", month: "february" },
    { ref: "Matthew 11:10", id: 6, verse: "What will my messenger prepare before you? Your way", month: "march" },
    { ref: "Matthew 11:11", id: 7, verse: "Who is greater than John the Baptist? The one who is least in the kingdom", month: "october" },
    { ref: "Matthew 11:11", id: 8, verse: "Than whom is no one greater among those born of women? John the Baptist", month: "november" },
    { ref: "Matthew 11:12", id: 9, verse: "When has the kingdom of heaven suffered violence? The days of John the Baptist until now", month: "december" },
    { ref: "Matthew 11:12", id: 10, verse: "What has the kingdom of heaven suffered from the days of John the Baptist until now? Violence", month: "january" },
    { ref: "Matthew 11:12", id: 11, verse: "By what do the violent take it? Force", month: "february" }
];


class

QuizCompanion {
    constructor(debugMode=true, type ,config='nothing') {
      this.debugLogs = [];
      this.errors ={}
      console.log(this.debugLogs) ///lilve array 
        this.id = (word) => {
            const defluatWord = {style: {display:'block'}, message: `Element with id "${word}" not found.`};
            let word1 = document.getElementById(word);
            if(!word1) {    console.error(`Element with id "${word}" not found.`); }
            return word1;
        };
        this.allQuestionsTrigs  = [];
    this. numVs = [1,2,3]
    this.chpsNums = new Set([])
    this.booksNums = new Set([])
    this.flights = ['A', "B", "C", "T"]
    if( this.id('study-anchor')) this.setHref = this.id('study-anchor');
                        this.quotesSorted = {}
                        this.ftvsSorted = {};

        this.manageModal = (mtxt = "hi", set = false, modalid = 'settings', mcon = "modaldiv", closebtn = 'closeModalBtn', btntxt='Ok', onModalClose='', onModalOpen='') =>{
            const modal = this.id(modalid);
            const modalContent = this.id(mcon);
            const closeBtn = this.id(closebtn);
            modalContent.innerHTML = mtxt;
            closeBtn.style.display = 'none';
            
            closeBtn.style.display = 'block';
            closeBtn.textContent = btntxt
            this.running = false;
            clearInterval(this.timerid);
            const secsInput2 = document.getElementById('secs1');
            const speedInput2 = document.getElementById('speed1');
            const sv = this.id('speedValue1');
            
            if (secsInput2 && this.Time) {
                secsInput2.value = this.Time;
            }
            if (speedInput2 && this.speeddetext && sv) {
                speedInput2.value = this.speeddetext;
                sv.textContent = this.speeddetext;
            }
           const trigSet =  this.id(this.quizSettings.highlight);
           if(trigSet) trigSet.checked = true
            if(onModalOpen) onModalOpen()
            modal.showModal();
            
            closeBtn.addEventListener('click', () => {
                closeBtn.style.display = 'none';
                if(onModalClose) onModalClose()
                modal.close();
                if (set) {
                    const verseSelectionElementH = document.querySelector('input[name="verseSelectionH"]:checked');
                    if (verseSelectionElementH) {
                        this.quizSettings.highlight = verseSelectionElementH.value;
                    }
                    const lenOfTimerElement1 = document.getElementById('secs1');
                    if (lenOfTimerElement1) {
                        this.Time = parseInt(lenOfTimerElement1.value);
                    }
                    const speed_tOf_text1 = document.getElementById('speed1');
                    if (speed_tOf_text1) {
                        if (typeof (parseFloat(speed_tOf_text1.value)) != 'number') {
                            this.quizSettings.speed_tOf_text = 0;
                        } else {
                            this.speeddetext = parseFloat(speed_tOf_text1.value);
                        }
                    }
                    let textType;
                    const MODE = document.querySelector('input[name="type"]:checked');
                    if (MODE) {
                        textType = MODE.value;
                    }
                    
                    this.running = true;
                    if (this.isrendered) {
                        this.quiztimer(this.TimeLeft);
                    }
                    if (textType === 't') {
                        this.vD.style.display = 'none';
                        this.vC.style.display = 'none';
                        this.ver.style.display = 'block';
                        this.dragEnabled = false;
                    } else {
                        this.vD.innerHTML = '';
                        this.vC.innerHTML = '';
                        this.ver.value = '';
                        this.vD.style.display = 'block';
                        this.vC.style.display = 'block';
                        this.ver.style.display = 'none';
                        
                        if (this.isrendered) {
                            this.dragElements();
                        }
                        this.dragEnabled = true;
                    }
                }
            });
        }
        this.stopTimer = false
        this.isDeep  = false;
        this.isend = false;
        this.subFinish  = this.id('submit-finish')
       this.stopDiv = this.id('stop-text');
       if(this.stopDiv) this.stopDiv.style.display = 'none'
        this. qHead =  this.id('quizHeader');
        this.isVerse = false;
        this.numberElement = document.querySelector('.timer-number');
         this.finishQ=  this.id('finish-question')
                   if(this.finishQ)  this.finishQ.style.display = 'none';
                   this.card= this.id('card');
                   this.prevScenes =[];
                   this.sceneIndex =0;
        this.dialogue= mhtml;
        this.reviewDiv = this.id('review')
        if(this.reviewDiv)this.reviewDiv.style.display = 'none'
        this.QUIZTYPE = type
        const now = new Date()
        this.QUIZID =  `${now.toLocaleTimeString()}$date$ ${Date.now().toString() + Math.random().toString(36).substring(2, 9)}$type$${type}`
        this.SETTINGSHTML=  SETTINGSHTML.split('<!--sel-->')
        this.SHEAD = this.SETTINGSHTML[0]
        this.SBODY = this.SETTINGSHTML.slice(1,-2)
        this.SFOOT= this.SETTINGSHTML[this.SETTINGSHTML.length -1]
        const Ids = JSON.parse(localStorage.getItem('quizIds')|| '[]')
        const ID = this.QUIZID
       this.moreSet = this.id('more-settings');
      
        this.retryBtn = this.id('retry')
        this.QUIZSECENE = ``
        this.currentVerseIndex = 0; 
        this.running = true;
        this.genQuiz = false;
        const testIsGenQuiz = this.id('isGenQuiz');
        if (testIsGenQuiz) {
            this.genQuiz = true;
        }
        const speedInput = this.id('speed'); // Gets the range input element.
        const speedValueSpan = this.id('speedValue'); // Gets the span element to display the value.
        
        // Listen for the 'input' event, which fires continuously as the slider is moved.
        if (speedInput && speedValueSpan) {
            speedInput.addEventListener('input', (event) => {
                // Update the text content of the span with the current value of the input.
                speedValueSpan.textContent = event.target.value;
            });
        }
        this.quizMonths = [
            ['october', ['1', '2', '3', '4', '5'], 'Matthew'], 
            ['november', ['6', '7', '8', '9'], 'Matthew'], 
            ['december', ['10', '11', '12'], 'Matthew'], 
            ['january', ['13', '14'], 'Matthew'], 
            ['february', ['15', '16'], 'Matthew'], 
            ['march', ['Jonah'], 'Jonah']
          ];
        this.selverses = true;
        const resetclient = document.getElementById('resetclient');
        if (resetclient) {
            this.selverses = false;
            resetclient.addEventListener('click', () => {
                localStorage.removeItem('storedQsArray');
                this.selVerses= [];
                this.updateClientInfo(this.selVerses, 'storedQsArray', true);
                alert('Client Data has been reset');
            });                
        }
        let  selectedMonths = [];
        let divChp = '';
        const questionSelectionDiv = this.id('monthDiv');
        const switchCToMonth = this.id('month');
        const switchMToChapter = this.id('chapter');
        if (switchCToMonth && questionSelectionDiv) {
            switchCToMonth.addEventListener('click', () => {
                questionSelectionDiv.innerHTML = `<h3 class="section-title">Select Months</h3>
                            <div class="checkbox-container">
                                <label class="toggle-label"><input type="checkbox" name="month" value="october"> October</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="november"> November</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="december"> December</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="january"> January</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="february"> February</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="march"> March</label>
                            </div>`;
            });
        }
        this.delog(switchMToChapter)
        if (switchMToChapter && questionSelectionDiv) {
            switchMToChapter.addEventListener('click', () => {
                //this.quizMonths.forEach
                this.delog('wroking')
                //selectedMonths = []
                const monthCheckboxes = document.querySelectorAll('input[name="month"]:checked');
                if (monthCheckboxes) {
                    monthCheckboxes.forEach((checkbox) => {
                        selectedMonths.push(checkbox.value);
                    });
                }
                divChp = `<h3 class="section-title">Select Chapters</h3> 
                <div class="checkbox-container">`;
                //sets deflault chapters 
                //selectedMonths = selectedMonths ? selectedMonths : ['october'];
                this.quizMonths.forEach(month=>{
                    if(selectedMonths.includes(month[0])){
                        month[1].forEach(chp=>{
            //this.delog(month[0], month[1], chp, month, 'mohr' )
                        
                            divChp += `<label class="toggle-label"><input type="checkbox" name="chp" value="${chp}"> ${chp}</label>`
                    })
                        }


                })
                divChp += `</div>`;
                //this.delog(divChp);
                divChp = `<h3 class="section-title">Select Chapters</h3> 
                <div class="checkbox-container">
              <label class="toggle-label"><input type="checkbox" name="chp" value="1"> 1</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="2"> 2</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="3"> 3</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="4"> 4</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="5"> 5</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="6"> 6</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="7"> 7</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="8"> 8</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="9"> 9</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="10"> 10</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="11"> 11</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="12"> 12</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="13"> 13</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="14"> 14</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="15"> 15</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="16"> 16</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="Jonah"> Jonah</label>
                </div>`
                questionSelectionDiv.innerHTML = divChp;
                
            });
        }
        this.STATE = 'local'
        this.URL = this.STATE === 'local' ? 'http://localhost:3000': 'render web';

        this.books = ['Matthew', 'Jonah']
        this.progressBar = this.id('progressBar')
        this.currentQNum = 1
        this.question_dict2 = [];
        this.verse_dict2 = [];
        this.Time = null;
        this.exANs = []; 
        this.altans = [];
        this.cleanans = [];
        this.speeddetext = null;
        this.ftvTriggerI = null;
        this.trigChar = null;
        this.question_dict = [];
        this.QUEST = null;
        this.randwords = [];
        this.qs = [];
        this.micBtn = this.id('micBtn')
        this.currerentVerse = null;
        this.startTimer = false;
        this.counterToMax = 0;
        this.questTypes = ['ftv', 'quote'];
        this.quizSettings = {};
        this.quiMonths = ['october', 'november', 'december', 'january', 'february', 'march'];
        this.selVerses = [];
        this.quoteRefArr = [];
        this.isrendered = false;
        this.TimeLeft = 30;
        this.dragEnabled = true;
        this.deblog = debugMode
       if(this.deblog){ console.log('Debug Mode on', debugMode) }else {console.log('Debug mode off', debugMode)}
        this.cnum = 0;
        this.timerid = null;
        this.globalquestype = null;
        this.printDiv = this.id('print')
        this.quest = null;
        this.ftv = null;
        this.morebtn = this.id("More");
        this.next = this.id('next');
        this.btnTOModal = this.id('BTN');
        this.vD = this.id('versedrop');
        this.vC = this.id('verse-con');
        //move this line 
       
        this.delog(this.clientanswers);
        this.correctCount = 0;
        this.plsc = this.id('pleasebtn');
        this.answers = [];
        this.remainingText = '';
        this.numverses = 1;
        this.verse_dict = null;
        this.ANS = null;
        this.readyLoad = false;
        this.ANS2 = null;
        this.isquote = false;
        this.isftv = false; 
        this.ver = this.id('verse');
        this.timerbtn = this.id('timer');
        this.c = 0; // counter
        
        this.allChps =  this.quizMonths.map(month=>month[1].join(' ')).join(' ').split(' ')
        this.corspondAns = []; // Added missing property
        this.notriggers = []; // Added missing property
        if(typeof config ==='array'){this.selVerses = config; this.config='questions'; console.warn('problem')}else if(typeof config ==='object'){
            this.quizSet = config; this.config = 'settings'
          }else if (config==='nothing'){this.delog('all good', )} else{
              throw new Error('config must be a object or an array')
          };
          this.delog('config', config)
          Ids.push({
            id:ID,
            config:this.config,
            type:type,
            settings:this.quizSet
            

        })
        delog(Ids)
        localStorage.setItem('quizIds', JSON.stringify(Ids))
    }

    Start() {
        let main = this.id('nextScene');
        let startScene = document.getElementById('startScene');
        
        if (main && startScene) {
            main.style.display = 'block';
            startScene.style.display = 'none';
        }
    }
    
    async loadQuestions(     ) {
        try {
            const questResponse = await fetch('QuestioniTBQN.txt');
            if (!questResponse.ok) {
                throw new Error(`Questions failed fetch ${questResponse.status}`);
            }
            const questionsText = await questResponse.text();
            this.delog('data from questions has been loaded as text', questionsText);
            const returnQ = await this.processQuestions(questionsText);
            this.delog(returnQ);
            return returnQ;
        } catch (error) {
            console.error('Failed loading Questions', error);
        }
    }
    
    async loadQuotes() {
        try {
            // Fetch the quotes_ftvs.txt file
            const response = await fetch('./quotes_ftvs.txt'); // Adjust the path if necessary
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get the text content of the file
            const data = await response.text();
            //this.delog('Fetched data:', data); // Debugging log
            
            // Process the fetched data
            const returnq = await this.processQuotes(data);
            return returnq;
        } catch (error) {
            console.error('Error loading quotes:', error);
        }
    }
    async loadCompleteQuestionDict(){
        console.log(this.ftvsSorted)
       const { allQs } =  JSON.parse(localStorage.getItem('allQuestions') || JSON.stringify(await this.initializeQuiz()))  
       const allContent = {...this.clientanswers, ...allQs }
       console.warn('allContent', allContent, allQs, this.clientanswers)   
       let  allQuestions = []
      for(const q of  Object.values(  allContent )){
        const {monthsTrigs:trigs} = await  this.setTrigForAllMonths(q);
          if(q.aq) q.aq = null;
       const   [question, answer] = q.verse.includes('?') ?  q.verse.split('?'): ['ftv/quote', q.verse]
          allQuestions.push( {...q, trigs, answer, question})

     }
     console.warn('allQuestions', allQuestions)
     localStorage.setItem('allQuestions', JSON.stringify({allQuestions}))
     return allQuestions
    }
    async setTrigForAllMonths(verse, dict=false){
        const mockQuestions = [
            { ref: "Matthew 11:07-08", id: 1, verse: "Where, did Jesus ask, did the crowds go out to see a man dressed in soft clothing? The wilderness?", month: "october" },
            { ref: "Matthew 11:08", id: 2, verse: "Where are those who wear soft clothing? In kings' houses", month: "november" },
            { ref: "Matthew 11:09", id: 3, verse: "Who is more than a prophet? John (John the Baptist)", month: "december" },
            { ref: "Matthew 11:09", id: 4, verse: "About whom did Jesus say, 'Yes, I tell you, and more than a prophet'? John (John the Baptist)", month: "january" },
            { ref: "Matthew 11:10", id: 5, verse: "Who will I send before your face? My messenger", month: "february" },
            { ref: "Matthew 11:10", id: 6, verse: "What will my messenger prepare before you? Your way", month: "march" },
            { ref: "Matthew 11:11", id: 7, verse: "Who is greater than John the Baptist? The one who is least in the kingdom", month: "october" },
            { ref: "Matthew 11:11", id: 8, verse: "Than whom is no one greater among those born of women? John the Baptist", month: "november" },
            { ref: "Matthew 11:12", id: 9, verse: "When has the kingdom of heaven suffered violence? The days of John the Baptist until now", month: "december" },
            { ref: "Matthew 11:12", id: 10, verse: "What has the kingdom of heaven suffered from the days of John the Baptist until now? Violence", month: "january" },
            { ref: "Matthew 11:12", id: 11, verse: "By what do the violent take it? Force", month: "february" }
        ];
        this.notriggers = [];
        let htmlArr = verse.verse.split(' ');
        if(!this.ftvsSorted) await this.loadVerseDicts()
    
        let monthsTrigs = {}
        let arr_of_question = ( verse.verse.includes('?') ? verse.verse.split('?')[0] : verse.verse).split(' ')
      
        let allMonthsV =  this.quizMonths.map(m=>m[0])
        const MonthIndex =  allMonthsV.findIndex(v=> v === verse.month);
       const allMonths = allMonthsV.filter(m=>allMonthsV.slice(MonthIndex,).includes(m))
       //console.warn(allMonthsV, MonthIndex, allMonths, 1259, verse.month, verse)
       let list = dict;
       if(!dict) { list =   verse.type ==='ftv/quote' ?   this.ftvsSorted[verse.numVerses]:  Object.values(this.question_dict) }
        if(!list ) list = mockQuestions;
        let  trigs = [];
        let  test = []
        let uniqueWordNum = -2;
        let qsForM = [];
        let uinqueWord = 'nothing'
        //console.log('htmlArr', htmlArr)
        for (let i = 0; i < allMonths.length; i++) {
            const monthName = allMonths[i];
           const monthSel = allMonthsV.slice(0, i+1+MonthIndex) //set the months for each loop
         qsForM = list.filter(q=>monthSel.includes(q.month ))
         ///console.warn('all', monthSel, monthName, qsForM, htmlArr, arr_of_question, uniqueWordNum,uinqueWord)     
             if(!qsForM) console.error('bad abd bad abd abd qsforrrrrrrrrrrrr ms ')
        const   unique = await this.findUniqueTriggerWord(arr_of_question, qsForM, '', monthName)
    uniqueWordNum = unique.uniqueWordNum;
          uinqueWord =  arr_of_question[uniqueWordNum]
          htmlArr[uniqueWordNum] = `<span class="${monthName}">${uinqueWord}</span>`;
//console.warn( unique || 'hi')
            monthsTrigs[monthName] = uniqueWordNum;
            trigs.push({month: monthName, htmlArr: htmlArr,  id: verse.id, trigNum:uniqueWordNum, word:uinqueWord, question:verse})
            test.push({month: monthName, htmlArr: htmlArr, verse: verse.verse, id: verse.id, t:uniqueWordNum})
           
        }
        this.allQuestionsTrigs.push({trigs:trigs, id: verse.id} )

         const  htmlToDisplay = htmlArr.join(' ').split('?')[0] + '?' || 'Error rendering content'

        return {test, trigs, htmlArr, uniqueWordNum, htmlToDisplay, monthsTrigs}
    }
/*must be callback funcitons
@<lllll>*/ 
    
    deepStudy (type, ...args) {
        if(type === 'new'){
           this. newStudy(...args)
        } else if(type === 'check'){
            this.checkStudy(...args)
        }else{

        }
    }
    updateClientInfo(info, name, setItem = true) {
        // Check if the user wants to set an item
        if (setItem) {
            // Correctly stringify the info object
            const stringifiedInfo = JSON.stringify(info);
            
            // Correctly use localStorage.setItem with both a key (name) and a value
            try {
                localStorage.setItem(name, stringifiedInfo);
                this.delog(`Successfully saved data with key: "${name}"`);
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        } else {
            // If not setting, get the item
            try {
                const storedInfo = localStorage.getItem(name);
                
                // Check if the item exists before parsing
                if (storedInfo === null) {
                    console.warn(`No data found for key: "${name}"`);
                    return null; // Return null if nothing is found
                }
                
                // Correctly parse the JSON string back into an object
                const parsedInfo = JSON.parse(storedInfo);
                this.delog(`Successfully retrieved and parsed data with key: "${name}"`);
                
                return parsedInfo;
            } catch (e) {
                console.error('Error retrieving or parsing data from localStorage:', e);
                return null;
            }
        }
        return true; // Return a success indicator for the 'set' operation
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
    delog2(...args) {
        //checks for debug mode 
        if(args){
        if (this.deblog) {
            //this.delog(...args);
         console.log(...args)
            
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
          checkAnswer (answer=[], enteredAnswer=[]) {

            const commonWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'on', 'for', 'with', 'as', 'was', 'at', 'by', 'an', 'be', 'this', 'from'];
           const cleanAns = answer.split(' ').map(w=>this.stripChar(w))
           const cleanEntrAns = enteredAnswer.split(' ').map(w=>this.stripChar(w))
           const {correctedAnswer, misspelledWords} = this.spellCheck(cleanAns, cleanEntrAns, { correction:true})
              this.delog('correctedAnswer', correctedAnswer, 'misspelledWords', misspelledWords)
       const    fixedAns =   correctedAnswer.filter(word=> !commonWords.includes(word.toLowerCase()))
            const entrCout =  this.wordsCount(fixedAns)
            const ansCout =  this.wordsCount(answer)
            coutState= {}
            for (let i in entrCout){
                if(!ansCout[i]){
                    coutState[i] = 'extraIncorrectWords';
                    continue;
                }
                if(entrCout[i] === ansCout[i]){
                   coutState[i] = 'correct'
                }else if(entrCout[i -1] === ansCout[i]  || entrCout[i -3] === ansCout[i] || entrCout[i -2] === ansCout[i]){

                }
               
            }

            if(Object.values( coutState).every(e=> e === 'correct') || fixedAns.join(' ') === answer.join(' ')){
                return true;
            }else {
                return false;
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
    
    stripChar(input, messaa = 'errorr!!!' ) {
        // Define the set of characters to be stripped
        const charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ', '\n', '\r', '\t', '[', ']', '{', '}', '—', '–', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0','|']);
        
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
    
 // NOTE: This file assumes the existence of 'this.stripChar' and 'this.delog' methods on the class instance.

async findUniqueTriggerWord(ARRAY, _obj, currentVerseNumber = '', classwordname='highlightWord', classCHAR = false, stop=false) {
    if (!Array.isArray(ARRAY) || _obj === null) {
        console.error('Invalid input: ARRAY must be an array and _obj must be an object.');
        return { uniqueWordNum: -1, uniquecharNum: -1, absoluteCharIndex: -1 };
    }
    let logForchar = []
let htmlToDisplay;
let notquote = true;
if(currentVerseNumber === 'F') notquote = false
    const currentFullVerse = ARRAY.join(' ');
let obj;
let vOfV;
let htmlArr;

    if(notquote){
     obj = _obj.filter(v => {
       const Verse =  v.verse.includes('?') ? v.verse.split('?')[0] : v.verse;
        return this.stripChar(Verse) !== this.stripChar(currentFullVerse);
    });

}else{
     obj = _obj.filter(v => {
        //const Verse =  v.verse.includes('?') ? v.verse.split('?')[0] : v.verse;
         return v !== ARRAY.join(' ') ;
     });
     
}
if(obj.length === _obj.length) this.errors['filter Error']=  [obj, ARRAY];
    //this.delog('Filtered obj:', obj);
    //this.delog('Current full verse:', currentFullVerse);

    let uniqueWordNum = -1;
    let uniquecharNum = -1;
    let absoluteCharIndex = -1;
//this.delog(obj)
    for (let k = 0; k < ARRAY.length; k++) {
        const currentPrefix = this.stripChar(ARRAY.slice(0, k + 1).join(' '));
        //this.delog('Current prefix:', currentPrefix);

        const isSharedPrefix = obj.find(Verse => {
            let otherPrefix;
          if(!Verse.verse) {

                 otherPrefix = Verse.split(' ').slice(0, k + 1).join(' ') 
          }else{
             otherPrefix = Verse.verse.split(' ').slice(0, k + 1).join(' ') 
          }
            //this.delog('Other prefix:', otherPrefix, 'current', currentPrefix);
            return this.stripChar(otherPrefix) === currentPrefix;
        });
//this.delog(isSharedPrefix, 'sp')
        if (!isSharedPrefix) {
            
            uniqueWordNum = k;

            const uniqueWord = ARRAY[uniqueWordNum];
            //this.delog('uq', uniqueWord)
            //const lentoWordtoit =  < 0 ? ARRAY.slice(0, 1): ARRAY.slice(0, uniqueWordNum - 2)
            const wordLengthToUWord = this.stripChar(ARRAY.slice(0, uniqueWordNum).join(' ')).length + 1;
            //this.delog(lentoWordtoit)
            //this.delog(wordLengthToUWord)


            for (let j = 0; j < uniqueWord.length + 1; j++) {
                const char = this.stripChar(ARRAY.join(' ')).slice(0, j + wordLengthToUWord);
                //this.delog('Current char:', char);

                const isSharedChar = obj.find(Verse => {
                    let otherWordStripped;
                    if(Verse.verse) otherWordStripped = this.stripChar(Verse.verse); else otherWordStripped = this.stripChar(Verse)
                    logForchar.push('Other word stripped:', this.stripChar(otherWordStripped.slice(0, wordLengthToUWord + j)) , 'Current char:', char)
                    return this.stripChar(otherWordStripped.slice(0, wordLengthToUWord + j)) === char;
                });

                if (!isSharedChar) {

                    uniquecharNum = j;
                     let  offset = 0;
                      if (notquote && ARRAY[uniqueWordNum][0]) 
                        {offset = ARRAY[uniqueWordNum][0].includes('"') ? 1 :0;}
                      let Verse = [...ARRAY];
                     
                      Verse[uniqueWordNum] = `<span class=${classwordname}>${Verse[uniqueWordNum]}</span>`;
                       
                      
                      
                     
                      if(classCHAR) Verse[uniqueWordNum].split('')[j+offset] = `<span class=${classCHAR}>${Verse[uniqueWordNum][j+offset]}</span>`
                    if(stop)  Verse.splice(uniqueWordNum+1)
                     htmlArr=  [...Verse]
                       
                      Verse = Verse.join(' ') 
                      htmlToDisplay = `${Verse}`
                      const spaceoffset = ARRAY.slice(0, uniqueWordNum).length === 0 ? 0 :1;  
                    this.delog( ARRAY.slice(0, uniqueWordNum).join(' '), 'test')
                    absoluteCharIndex =  ARRAY.slice(0, uniqueWordNum).join(' ').length + j + offset + spaceoffset;
                    this.delog(ARRAY[uniqueWordNum], Verse, ARRAY, 'unique word ')
                    if(ARRAY[uniqueWordNum].includes(':') && notquote) absoluteCharIndex++;
                    
                    //ARRAY.join(' ')[absoluteCharIndex] === ' ' ? absoluteCharIndex++ : null;
                    uniquecharNum = absoluteCharIndex; 
                    break;
                }
            }
            this.delog(logForchar);
                    //this.delog(uniqueWordNum, uniquecharNum, 'unique stuff')
                    return { uniqueWordNum, uniquecharNum, htmlToDisplay, htmlArr, absoluteCharIndex};
                
            
        }
    }

    return { uniqueWordNum, uniquecharNum, absoluteCharIndex,htmlToDisplay, htmlArr};
}
/*// Total Absolute Index (1-based, assuming string indices are 0-based):
                    // (Raw prefix length) + (Raw unique prefix length)
                    // Note: If rawPrefix is not empty, 'join(' ')' already includes the space. If it is empty, length is 0.
                    absoluteCharIndex = lengthOfRawPrefix + rawUniquePrefixLength; 
                    
                    // Update uniquecharNum to be the absolute index as requested by your previous logic.
                    uniquecharNum = absoluteCharIndex; 
                    
                    // --- END FIX --- */
    
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
    async processQuestions(data) {
        const dataSplit = data.trim().split('\n');
        let questiondict = {};
        
        const regex = /^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ:|According to) )?(.*)$/;
        
        for (let val of dataSplit) {
            const match = val.match(/^(\w+ \d+:\d+[\w\d-]*) (\w) (?:(SQ:|According to) )?(.*)$/);
            this.c += 1;
            // check if a match was found
            if (match) {
                
                //const monthIndex = Math.floor((c - 1) / 20);
                let monthName;
                const ref1 = match[1];
                let splitref = ref1.split(' ');
                let book = splitref[0];
                let chapter = splitref[1].split(':');
                
                chapter = chapter[0];
                //this prevents stuff like Jonah chapter 1 from getting mixed in with Mat chp 1
                chapter = ref1.includes('Jonah') ? 'Jonah': chapter;
                if (book === 'Matthew') {
                    // Find the month array that contains the chapter number
                    const foundMonthArray = this.quizMonths.find(month => {
                        // This is the corrected check: access the nested array (at index 1)
                        // and convert the chapter string to a number
                        return month[1].includes(chapter);
                    });
                    // If a month was found, assign its name (at index 0)
                    if (foundMonthArray) {
                        monthName = foundMonthArray[0];
                    }
                } else {
                    monthName = 'march';
                }
                
                
                const flight1 = match[2];
                
                const typeQuestion = match[3];
                let type1; // declare type1 with a broader scope
                if (typeof (typeQuestion) != 'string') {
                    type1 = 'question';
                } else {
                    type1 = typeQuestion;
                }
                const questAns = match[4];
                let chp = ref1.split(' ')[1].split(':')[0];
                if(monthName === 'march') chp = 'Jonah';
                const book1 = ref1.split(' ')[0]
                this.chpsNums.add(chp)
                this.booksNums.add(book1)
                questiondict[this.c] = {
                    flight: flight1,
                    verse: questAns,
                    ref: ref1,
                    month: monthName,
                    type: type1,
                    chapter: chp,
                    id:this.c,
                    book:book1
                };
            }
        }
        
        
        this.delog('processed quotes', questiondict);
        return questiondict;
    }
    
    async processQuotes(quotesFTVs) {
        const data = quotesFTVs.trim().split("\n");
        let versedict = {};
        let c2 = 0;
        for (let val of data) {
            
            // simple macth method word, digit:digit , word, Quote/FTV word
            val = val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) Quote\/FTV (.*)$/);
            //example regex for questions
            // val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ|According to (?:\w+ \d+:\d+\w*\-?\d*))) (.*)$/)
            
            c2++;
            this.c += 1;
            if (val) {
                
                // Now, we correctly assign the month based on the verse number
                const monthIndex = Math.floor((c2 - 1) / 20);
                const monthName = this.quiMonths[monthIndex];
                const ref1 = val[1];
                const flight1 = val[2];
                const verse1 = val[3];
                let  chp = ref1.split(' ')[1].split(':')[0]
                //this prevents stuff like Jonah chapter 1 from getting mixed in with Mat chp 1
                chp = ref1.includes('Jonah') ? 'Jonah': chp;
                if (ref1.includes('-')) {
                    const verseParts = ref1.split(':');
                    if (verseParts.length > 1) {
                        const rangeParts = verseParts[1].split('-');
                        if (rangeParts.length === 2) {
                            this.numverses = parseInt(rangeParts[1]) - parseInt(rangeParts[0]) + 1;
                        }
                    }
                } else {
                    this.numverses = 1;
                }
                  if(monthName === 'march') chp = 'Jonah';
                  const book1 = ref1.split(' ')[0]
                  this.chpsNums.add(chp)
                  this.booksNums.add(book1)
                versedict[this.c] = {
                    flight: flight1,
                    verse: verse1,
                    ref: ref1,
                    month: monthName,
                    type: 'ftv/quote',
                    numVerses: this.numverses,
                    chapter: chp,
                    id:this.c,
                    book:book1,
                };
            }
        }
        this.delog('Processed verse_dict:', versedict); // Debugging log
        return versedict;
    }
    
    async initializeQuiz() {
       let allQs = {}
    

        try {
            this.question_dict = await this.loadQuestions();
            this.verse_dict = await this.loadQuotes();
            this.delog('Loaded question_dict:', this.question_dict);
            this.delog('Loaded verse_dict:', this.verse_dict);
            if (!this.verse_dict || !this.question_dict) {
                console.error('Failed to load verse_dict. Exiting quiz initialization.');
                return;
            }
            this.readyLoad = true;
        } catch (error) {
            console.error('Error initializing quiz:', error);
        }

         allQs = {...this.verse_dict, ...this.question_dict}
        localStorage.setItem('allQuestions', JSON.stringify({allQs}));
        
        this.clientanswers = {}
        const clientStro =  localStorage.getItem('storedQs')
      if() Object.entries(allQs).forEach( ([key, value]) => {
       if(value.incorrect || value.correct) this.clientanswers[key]  = value



        })
        console.log('clientanswers initialized:', this.clientanswers);
        if(!this.clientanswers) console.error('run run run clinent ans not wold run ')
            const DATA = await  this.loadCompleteQuestionDict();
       

        const QUESTIONS = this.question_dict;
        const VERSES = this.verse_dict;
    return { allQs, QUESTIONS, VERSES, DATA }
    }
    
   
    
    p(parhams, j, k, l, o, p, t) {
        this.delog(parhams, j, k, l, o, p, t);
    }
    
    correct(result) {
        this.id("correctbtnQ").style.display = 'none';
        if(this.subFinish) this.subFinish.style.display = 'none';
        if(!this.selVerses[this.cnum] || this.selVerses[this.cnum].ref){
            console.warn(this.selVerses[this.cnum])
        }
        //this.tifmerbtn.textContent = 'Timer';
        const verseRef = this.selVerses[this.cnum].ref; // Get the verse reference
        this.delog(this.ftv);
        //const versetype = `${this.ftv}@${verseRef}@${this.selVerses[this.cnum].numVerses}`; // 
        // If the verse is not yet in the clientanswers object, initialize it.
       
        this.next.style.display = 'block';
        let subm = this.id("submit");
        subm.style.display = 'none';
        clearInterval(this.timerid);
        
        // Increment the appropriate counter based on the result.
        if (result === 'right') {
            this.incorrect = false;
            //this.selVerses[this.cnum].correct = this.selVerses[this.cnum].correct ?? 0;
            try {
                
            
            let versedata = this.selVerses[this.cnum];
            const foundVerse = Object.values(this.clientanswers).find(Verse=>versedata.verse === Verse.verse);
            //this.delog(...versedata, 'vs ', versedata)
           if(foundVerse){
            this.clientanswers[foundVerse.id].correct++;
           }else{
         versedata.correct = 1;
           this.clientanswers[versedata.id] = versedata;
           }
        } catch (error) {
               this.delog('error', error)
        }
            this.vD.classList.add('correct');
            this.vD.classList.remove('incorrect');
            this.vD.classList.remove('blueborder');
            this.vC.classList.add('correct');
            this.vC.classList.remove('incorrect');
            this.vC.classList.remove('blueborder');
            this.ver.classList.add('correct');
            this.ver.classList.remove('incorrect');
            this.ver.classList.remove('blueborder');
        } else if (result === 'wrong') {
            this.incorrect = true
            //this.selVerses[this.cnum].incorrect = this.selVerses[this.cnum].incorrect ?? 0;
            //this.selVerses[this.cnum].incorrect += 1;
            try {
                 
           
                let versedata = this.selVerses[this.cnum];
                const foundVerse = Object.values(this.clientanswers).find(Verse=>versedata.id === Verse.id);
                //this.delog(...versedata, 'vs ', versedata)
               if(foundVerse){
                this.clientanswers[foundVerse.id].incorrect++;
               }else{
             versedata.incorrect = 1;
               this.clientanswers[versedata.id] = versedata;
               }
        } catch (error) {
            this.delog('error', error)
        }
            this.vD.classList.add('incorrect');
            this.vD.classList.remove('correct');
            this.vD.classList.remove('blueborder');
            this.vC.classList.add('incorrect');
            this.vC.classList.remove('correct');
            this.vC.classList.remove('blueborder');
            this.ver.classList.add('incorrect');
            this.ver.classList.remove('correct');
            this.ver.classList.remove('blueborder');
        }
        if (this.selVerses[this.cnum].type != 'ftv/quote') this.selVerses[this.cnum].verse = this.selVerses[this.cnum].aq;
                
        
        if(this.type ==='review'&&result==='right'){
            const verseRef = this.selVerses[this.cnum].ref; 
            const vType =  this.selVerses[this.cnum].type;
            const vId =  this.selVerses[this.cnum].id;
           this.selVerses =  this.selVerses.filter(q=>q.id !== vId );
           if(this.selVerses.length === 0) console.warn('empty selVerses')
           return 
        }
       
        this.delog(this.clientanswers); // Log the object to see the updated data.
        //this.ver.ariaDisabled = 'true';
    }
    
   
 levenshteinDistance = (a, b) => {
        const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
            Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
        );

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + 1
                    );
                }
            }
        }
        return matrix[a.length][b.length];
    };


    
    levenshtein(a, b, Percent = 75) {
        const matrix = [];
        
        // Ensure both strings are lowercase for comparison
        a = a.toLowerCase();
        b = b.toLowerCase();
        const bLen = b.length;
        // Initialize the first row and column
        for (let i = 0; i <= a.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= b.length; j++) {
            matrix[0][j] = j;
        }
        
        // Fill in the rest of the matrix
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,    // deletion
                        matrix[i][j - 1] + 1,    // insertion
                        matrix[i - 1][j - 1] + 1 // substitution
                    );
                }
            }
        }
        const matrixValue = matrix[a.length][b.length];
        if (typeof (Percent) === 'number') {
            const per = (1 - matrixValue / bLen) * 100;
            if (per >= Percent) {
                return true;
            } else {
                return false;
            }
        } else {
            return matrixValue;
        }
    }
    
    // makes the document method easier
    
   finish(textElement, timeouts){
    for (const timeoutId of timeouts) {
        clearTimeout(timeoutId);
    }
    const f_submit = this.id('f-submit');
        const f_txt = this.id('f-txt');
        let subm = this.id("submit");
                const btn = this.id('f-btn');
                
    delog('f_submit good', this.txt)
     
    const Blocks = Array.from(this.vD.children);
    let entered_words = Blocks.map(Block => {
        return Block.textContent.trim();
    }).join(' ');
    this.delog(entered_words, 'ew 1305', this.txt)
   // this.id('f-btn').classList.remove('f-btn-black')
    if(this.stripChar(this.ver.value) === this.stripChar(this.txt) || this.stripChar(entered_words) === this.stripChar(this.txt)){
        //f_txt.innerHTML = 'Question Correct';
        //this.id('f-btn').classList.add('correct1')
        btn.disabled = true;
          this.retryBtn.style.display = 'none'
          this.subFinish.style.display = 'none'
        subm.style.display = 'block';
        this.ver.placeholder = 'Answer the question';
        this.id("correctbtnQ").style.display = 'block'
        this.stop = false;
        //this.clear('quizHeader');
        this.ver.value = ''
        this.vD.innerHTML = ''
         this.vC.innerHTML = ''
         this.dragElements();
            textElement.innerHTML = this.txt;
        

    }else{
        this.answers.push({
            verse: this.selVerses[this.cnum],
            correct: false,
            //type: selVerses[cnum].type
        });
       this.stop = false;
     btn.style.display = 'none';
        this.retryBtn  =this.id('retry');
        this.retryBtn.style.display = 'block';
        this.retryBtn.removeEventListener('click', this.retryHandler); // Remove any existing event listener
        this.retryHandler = async () => {
            this.retryBtn.style.display = 'none';
            btn.removeEventListener('click', this.finish.bind(this));
            this.delog('retry is running');
            this.clear('quizHeader');
            await this.retryRun();
        };
        this.retryBtn.addEventListener('click', this.retryHandler, {once:true});
  this.id('f-btn').classList.add('f-incorrect')
  this.correct('wrong');
    }
   
}
    
    delay_text(txt, elm = 'p', par = 'quizHeader', delay = 0, COLOR = 0, id1 = 'false', id2 = 'f') {
        return new Promise((resolve) => {
         
            const parent = this.id(par);
            this.isrendered = false;
            const textElement = document.createElement(elm);
          
            if(typeof id1 === 'number' || typeof id2 === 'number'){
                this.stopDiv.style.display='block';


                textElement.id= 'q';
            }

            textElement.innerHTML = '';
            if (typeof (COLOR) === 'string') {
                textElement.style.color = COLOR;
            }
            parent.appendChild(textElement);
            if(this.quizSettings.highlight ==='ingore'){
                this.delog('ingoring');
                id1 = '';
                id2= '';
            }
            const one = {once:true};
            const timeouts = [];
            this.timeouts = timeouts;
            let isStopped = false;
            let isStoppedEvent = false;
            let totalDelay = 0;
            let stopThis = false;
            this.ANS2 = false;
            const words = txt.split(' ');
            let wordIndex = 0;
            let charIndex = 0;
            let currentHTML = '';
            let isHighlighted = false;
            let isHighlighted2 = false;
            let CHArNUm = 0;
            if(timeouts)
                for (const timeoutId of timeouts) {
                    clearTimeout(timeoutId);
                }
            // Helper function to stop the animation
            const stopAnimation = (event) => {

                 this.stopDiv.style.display = 'none';
                 if(stopThis) return;
                                 if (event.code === 'Space' || event === 'stop') {
                    this.stopDiv.removeEventListener('click', stop);
                   
                       this.stopDiv.style.display = 'none'
                    // Check if event is a valid Event object before calling preventDefault
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault(); // This line caused the error
    }
    for (const timeoutId of timeouts) {
        clearTimeout(timeoutId);
    }
              console.warn(isStopped)
                    if (isStopped) {
                         this.stopDiv.style.display === 'none'
                        this.isrendered = true;
                        this.ver.disabled = false;
                        resolve();
                        return;
                    }
                  
                   this.done = false
                   
                    const questionEl = this.id('q')
                    const wordsdisplayed = textElement.innerHTML;
                    let moreBtn = ` <button id="more-words">More</button>`;
                    if(!questionEl) console.warn('q u uoid is not htere hrer herrre')
                       
                    console.warn(currentHTML)
                    questionEl.innerHTML= `${currentHTML} ${moreBtn}`;
                    
                    const more = this.id('more-words');
                    this.id('quizHeader').addEventListener('click', (event)=>{
                        if(event.target.id === 'more-words' ){
                            console.warn(event.target.id,)
                        
                        if(wordIndex  === txt.split(' ').length || words.slice(0, wordIndex +1).join(' ')== txt) {console.warn('done');this.done = true; questionEl.innerHTML = txt; return;}
                        questionEl.innerHTML = `${words.slice(0, wordIndex +1).join(' ')}${moreBtn}`;
                        wordIndex++;
                        }                               
                    })
                    if(this.done) {this.stop=false; this.dragElements();return}
                    
                    const remainingWords = words.slice(wordIndex);
                    if (this.selVerses[this.cnum].type !== 'SQ:' && this.ftv !== 'ftv') {
                        
                    
                       
                        this.finishQ.style.display = 'block';
                        const f_submit = this.subFinish
                        const f_txt = this.id('f-txt');
                        let subm = this.id("submit");
                        const btn = this.id('f-btn');
                        subm.style.display = 'none';
                        this.stop = true;
                        this.txt = txt;
                        btn.disabled = false   
                        this.dragElements(this.txt)
                        this.subFinish.style.display = 'block'
                        if(f_submit) this.subFinish.addEventListener('click', this.finish.bind(this, textElement, timeouts), one)
                        //this.retry = this.id('retry');
                      
                       
                        this.delog('Remaining words:', remainingWords); // Debugging log
                        const remainingText = remainingWords.join(' ');
                        //const tx = currentHTML + remainingText;
                        
                        ///this.quest = remainingText + ' ' + this.quest;
                        //this.ANS = remainingText + ' ' + this.ANS;
                        //document.getElementById('pleasefinish').style.display = 'block';
                        this.ver.value = `${words.slice(0, wordIndex)} `;
                    }else{
                        console.warn('spik')
                    }

                    this.startTimer = true;
                    window.removeEventListener('keydown', stopAnimation);
                    ///hope thias don't casue ps 
                    isStopped = true;
                    resolve()
                    return;
              
                }
            };
            const stop = ()=>{
                if(stopThis) return;
                window.removeEventListener('keydown', stopAnimation);
                isStoppedEvent= true;
                console.warn('stopping')
              
                stopAnimation('stop');
                stopThis = true
               
            }
            //this.id('quizHeader').addEventListener('click', ()=>{stopAnimation('stop')})
            window.addEventListener('keydown', stopAnimation, {once:true});
            this.stopDiv .addEventListener('click', stop, {once:true})
            // This is the core logic of the whole code
            const typeWriter = () => {
                if (isStopped || wordIndex >= words.length || this.isend) {
                     this.stopDiv.style.display = 'none'
                    window.removeEventListener('keydown', stopAnimation);
                    this.isrendered = true;
                    this.ver.disabled = false;
                    this.startTimer = true;
                    this.id('quizHeader').removeEventListener('click', stopAnimation)
                    for (const timeoutId of timeouts) {
                        clearTimeout(timeoutId);
                    }
                    resolve();
                    return;
                }
                
                const word = words[wordIndex] + (wordIndex === words.length - 1 ? '' : ' ');
                const char = word[charIndex];
                
                // Check if the current word should be highlighted
                if (wordIndex === id1) {
                    if (!isHighlighted) {
                        currentHTML += '<span class="highlight-word">';
                        isHighlighted = true;
                    }
                } else {
                    if (isHighlighted) {
                        currentHTML += '</span>';
                        isHighlighted = false;
                        if(this.quizSettings.highlight === 'stop'){
                            isStoppedEvent= true;
                            console.warn('stopping')
                            stopAnimation('stop');
                        }
                    }
                }
                if (CHArNUm === id2 && !isStoppedEvent) {
                    if (!isHighlighted2) {
                        currentHTML += `<span class="highlight-char">${char}</span>`;
                        isHighlighted2 = true;
                    }
                } else {
                    /*if (isHighlighted2) {
                        currentHTML += '</span>';
                        isHighlighted2 = false;
                    }
                }/*/
               if(!isStoppedEvent) currentHTML += char;
                }
                
                // currentHTML += char;
                //this.delog('Current HTML:', currentHTML, 'char', char); // Debugging log
                textElement.innerHTML = currentHTML;
                CHArNUm++;
                charIndex++;
                if (charIndex >= word.length) {
                    charIndex = 0;
                    wordIndex++;
                }
                
                setTimeout(typeWriter, delay);
            };
            
            typeWriter();
        });
    }
    
    measure(item1, item2, split = false, splitValue = '') {
        let corchar = 0;
        let list2 = this.stripChar(item2);
        list2 = split ? list2.split(splitValue) : list2;
        
        let list1 = this.stripChar(item1);
        list1 = list1.split('');
        let setOfItem = new Set(list2);
        for (let thing of list1) {
            if (setOfItem.has(thing)) {
                corchar += 1; // correct characters
            } else {
                corchar -= 0.3;
            }
        }
        const percent = (corchar / list2.length) * 100;
        if (percent > 78) { //checks if percent is greater than 78%
            return true;
        } else {
            return false;
        }
    }
    
    // this function checks user input
    checkAlt(ogphars) {
        // This variable will hold the modified string.
        let switched = this.stripChar(ogphars);
        
        // A standard for loop is used to iterate through the alternative answers.
        for (let i = 0; i < this.altans.length; i++) {
            // Gets the current alternative phrase from the altans array.
            const altPhrase = this.stripChar(this.altans[i]);
            // Gets the corresponding correct answer.
            const correctPhrase = this.stripChar(this.corspondAns[i]);
            
            // Creates a regular expression to find the alternative phrase globally and case-insensitively.
            // The escape function ensures special characters in the phrase are handled correctly.
            const escapedAlt = altPhrase.replace(/[. *+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedAlt, 'gi');
            
            // Tests if the original phrase contains the alternative phrase.
            if (regex.test(switched)) {
                // Replaces the entire alternative phrase with the corresponding correct phrase.
                switched = switched.replace(regex, correctPhrase);
                // Returns the corrected string immediately after the first match is found.
            }
        }
        // Returns the original phrase if no match was found.
        return switched;
    }
    
    manageAnswer(ans, issplit = false, og = '') {
        //removes () and[] from answers
        let inAns;
        let lastWord;
        let altPhar = '';
        this.exANs = [];
        this.altans = [];
        this.cleanans = [];
        this.corspondAns = [];
        let isAlt = false;
        let isEx = false;
        
        //iterator 
        let ii = 0;
        //let exANs = null;
        if (!issplit) {
            inAns = ans.split(' ');
        } else {
            inAns = ans;
        }
        //if(inAns.includes('(') || inAns.includes('[')){
        for (let i of inAns) {
            if (i.includes('[') || isEx) {
                //maybe
                isEx = true;
                this.exANs.push(i);
                if (i.includes(']')) {
                    isEx = false;
                }
            } else if (i.includes('(') || isAlt) {
                //i.includes('(') || isAlt){
                //altans.pop()
                isAlt = true;
                
                altPhar += `${i} `;
                if (i.includes(')') || i.includes(',')) {
                    
                    this.corspondAns.push(lastWord);
                    this.altans.push(altPhar);
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
                this.cleanans.push(i);
            }
            ii++;
        }
        const switched = this.checkAlt(og);
        return [this.cleanans, this.altans, this.corspondAns, this.exANs, switched];
    }
    
    remover(pharse) {
    }
    
    ad(pr, ar, nu) {
        for (let i = 0; i < nu; i++) {
            ar.push(pr);
        }
    }
    
    async generateQuiz(quoteC = 3, ftvC = 2, lengthQuiz) {
        // quotes and ftvs
        let qf = [];
        //questions
        
        let atC = Math.floor(Math.random() * 4 + 1);
        let sqC = Math.floor(Math.random() * 4 + 1);
        const lenQ = lengthQuiz - quoteC + ftvC;
        const alrand = sqC + atC;
        let qC = lengthQuiz - alrand;
        //adds the stuff
        this.ad('question', this.qs, qC);
        this.ad('SQ:', this.qs, sqC);
        this.ad('According to', this.qs, atC);
        this.ad('quote', qf, quoteC);
        this.ad('ftv', qf, ftvC);
        qf = this.shuffleArray(qf);
        this.qs = this.shuffleArray(this.qs);
        let qfnum = 1;
        let ii = 0;
        let rAt = this.selVerses.filter(Verse => Verse.type === 'According to');
        let rSq = this.selVerses.filter(Verse => Verse.type === 'SQ:');
        let rQ = this.selVerses.filter(Verse => Verse.type === 'question');
        let rFQ = this.selVerses.filter(Verse => Verse.type === 'ftv/quote');
        this.selVerses = [];
        console.warn('this po')
        for (let i = 0; i < lengthQuiz; i++) {
            if (i === qfnum) {  
                //declare ftv globally
                //ftv = qs[ii]
                
                const yV = this.shuffleArray(rFQ, true)[0];
               if(yV) yV.type = qf[ii];
                this.selVerses.push(yV);
                qfnum += 4;
                ii++;
            } else {
                if (this.qs[i] === 'question') {
                    this.selVerses.push(this.shuffleArray(rQ, true)[0]);
                } else if (this.qs[i] === 'SQ:') {
                    this.selVerses.push(this.shuffleArray(rSq, true)[0]);
                } else {
                    this.selVerses.push(this.shuffleArray(rAt, true)[0]);
                }
            }
        }
        this.delog(this.selVerses, 'hope');
        return;
    }
    
    clear(par3) {
          this.id("correctbtnQ").style.display = 'none';
         this.subFinish.style.display = 'none';
        console.warn(this.currentVerseIndex, 'clear');
        this.finishQ.style.display = 'none';
        this.morebtn.style.display = 'none';
        this.vD.classList.remove('correct', 'incorrect');
        this.vD.classList.add('blueborder');
        this.vC.classList.remove('correct', 'incorrect');
        this.vC.classList.add('blueborder');
        this.ver.classList.remove('correct', 'incorrect');
        this.ver.classList.add('blueborder');
        this.vC.innerHTML = '';
        this.vD.innerHTML = '';
   
        this.ver.placeholder = 'Enter Answer';
        this.id('pleasefinish').style.display = 'none';
        this.id('pleasebtn').style.display = 'none';
        this.ver.value = '';
        this.id(par3).innerHTML = '';
        this.id('correctbtn').style.display = "none";
        this.id('incorrectbtn').style.display = "none";
        this.plsc.style.display = 'none';
          this.retryBtn.style.display = 'none'
    }
    
    checkAns() {
        this.isend = true;
        console.warn(this.currentVerseIndex, 'check ans');
        const displayAns = this.ANS;
        this.ANS &&=  this.manageAnswer(this.ANS, false)[0].join(' ');
        
        this.delog('quest valur at checkans:', this.quest, this.ANS);
        let inVerse = this.ver.value;
        this.id('correctbtn').style.display = "none";
        this.id('incorrectbtn').style.display = "none";
        
        this.plsc.style.display = 'none';
        if (this.isVerse) {
            const Blocks = Array.from(this.vD.children);
            let entered_words = Blocks.map(Block => {
                return Block.textContent.trim();
            }).join(' ');
            this.delog(entered_words);
            if (this.stripChar(inVerse) === this.stripChar(this.quest) || this.stripChar(entered_words) === this.stripChar(this.quest)) {
                this.id('correctbtn').style.display = "block";
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: true,
                });
                this.correctCount++;
                this.correct('right');
                
                return true;
            } else {
                this.id('incorrectbtn').style.display = "block";
                this.ver.value = `${this.ver.value} \n \nCorrect Answer: ${this.selVerses[this.cnum].ref}\n${this.selVerses[this.cnum].verse} `;
                
                this.vC.innerHTML = `Correct Answer: ${this.selVerses[this.cnum].ref}\n${this.selVerses[this.cnum].verse} `;
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: false
                });
                
                this.correct('wrong');
                return false;
            }
        } else if (!this.dragEnabled) {
            
            // This function compares a user's answer to the correct answer.
            // It returns 'Correct', 'Incorrect', or 'Needs More Info'.
            const checkAdvancedAnswer = (userAnswer, correctAnswer) => {
                // Step 1: Normalize both answers.
                // This removes leading/trailing whitespace, makes them lowercase, and removes common punctuation.
                const normalize = (str) => {
                    // Check if the input is a string before trying to normalize it.
                    if (typeof str !== 'string') {
                        return '';
                    }
                    // Convert to lowercase to ignore case differences.
                    // Remove leading/trailing spaces with trim().
                    // Use a regular expression to remove common punctuation and symbols.
                    // Replace multiple spaces with a single space.
                    return str.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=?\-_`~()'"]/g, '').replace(/\s{1,}/g, '');
                };
                
                const normalizedUser = normalize(userAnswer); // Normalize the user's answer.
                const normalizedCorrect = normalize(correctAnswer); // Normalize the correct answer.
                this.delog('norans', normalizedCorrect, normalizedUser);
                // Step 2: Check for an exact match.
                // This is the most straightforward check for correctness.
                if (normalizedUser === normalizedCorrect) {
                    // If the normalized answers are identical, the user is correct.
                    return 'Correct';
                }
                
                // Step 3: Check for a partial match.
                // This is where we determine if the user is close but needs more information.
                // We check if the user's answer contains a significant part of the correct answer.
                if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 2) {
                    // The includes() method checks if a string contains another string.
                    // We also check that the user's answer is not just a single letter or number,
                    // to avoid false positives (e.g., 'a' is in 'apple').
                    return 'More';
                }
                
                // Step 4: If no match is found, the answer is incorrect.
                // This is the final and default case if the answer is neither correct nor close.
                return 'Incorrect';
            };
            
            
            //delog('quest valur at checkans after AI:', ANS)
            let result;
            inVerse = this.manageAnswer(this.ANS, false, inVerse)[4];
            this.delog('user in', inVerse, this.ANS);
            result = checkAdvancedAnswer(inVerse, this.ANS);
            this.delog('Result of advanced check:', result); // Log the result for debugging.
            if (result === 'Correct') {
                this.id('correctbtn').style.display = "block";
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: true,
                });
                this.correctCount++;
                this.correct('right');
                return true;
            } else if (result === 'Incorrect') {
                this.id('incorrectbtn').style.display = "block";
                this.ver.value = `${this.ver.value} \n \nCorrect Answer: ${this.QUEST}?\n${displayAns}`;
                //vC.innerHTML =`${ver.value} \n \nCorrect Answer:${QUEST}?\n${ANS}`;
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: false
                });
                
                this.correct('wrong');
                return false;
            } else {
                this.morebtn.style.display = 'block';
            }
            
        } else  if(this.selVerses[this.cnum].type === 'deep'){
            this.deepStudy('check', this.ver.value, this.selVerses[this.cnum].answer);
        }
            else{
            // drag and drop elements
            const Blocks = Array.from(this.vD.children);
            let entered_words = Blocks.map(Block => {
                return Block.textContent.trim();
            });
            if (this.stripChar(entered_words.join(' ')) === this.stripChar(this.ANS)) {
                this.id('correctbtn').style.display = "block";
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: true,
                });
                this.correctCount++;
                this.correct('right');
                return true;
            } else {
                this.id('incorrectbtn').style.display = "block";
                this.ver.value = `${this.ver.value} \n \nCorrect Answer: ${this.QUEST}?\n${displayAns}`;
                this.vC.innerHTML = `Correct Answer: ${this.QUEST}?\n${displayAns}`;
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: false,
                    //type: selVerses[cnum].type
                });
             
                this.correct('wrong');
                return false;
            }
        }
    }
upTimerNew(remainingSeconds, totalDurationSeconds) {
    if(this.stopTimer)return;
        const timerElement = document.getElementById('quizTimer');
        const numberElement = timerElement.querySelector('.timer-number');
        
        // 1. Calculate the progress value (0 to 1)
        // 1 is 100% (full), 0 is 0% (empty)
        const progress = remainingSeconds / totalDurationSeconds;
        
        // 2. Set the CSS variable to update the visual fill
        timerElement.style.setProperty('--progress', progress);
        
        // 3. Update the number displayed in the middle
        numberElement.textContent = remainingSeconds;
        
        // Optional: Add the warning class when time is low
        if (remainingSeconds <= totalDurationSeconds * 0.2) {
            numberElement.classList.add('warning');
        } else {
            numberElement.classList.remove('warning');
        }
        return numberElement
    }
    quiztimer(timeleft = 30) {
        console.warn('starting quiz timer ')
        const totalTime = timeleft;
        if (!this.running) {
            clearInterval(this.timerid);
            this.TimeLeft = timeleft;
            return;
        }
        if (this.timerid) {
            clearInterval(this.timerid);
        }
        this.timerid = setInterval(() => {
            const numTime = this.upTimerNew(timeleft, totalTime)
            this.numberElement = numTime
            timeleft--;
            this.TimeLeft = timeleft;
            
            if (timeleft <= 0) {
                this.finishQ.style.display = 'none ';
                clearInterval(this.timerid);
                numTime.textContent = totalTime
                //this.numberElement.textContent = 'Timer is up';
                this.checkAns();
            }
        }, 1000);
    }
    
    updateProgressBar() {
        const totalQuestions = this.quizSettings.numQuestions;
        // counterToMax is incremented before this function is called, so it represents the current question number.
        const progressPercentage = ((this.counterToMax + 1) / totalQuestions) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
    }
   async  retryRun(){
        //this.currentVerseIndex--;
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

    }
    showResults(r) {
        // Stop the timer
        this.vC.style.display = 'none';
        this.vD.style.display = 'none';
        
        clearInterval(this.timerid);
        this.clear('quizHeader');
        if(this.timeouts) {
            for(time of this.timeouts){
                clearTimeout(time);
            }
        }
        this.stopTimer = true;
        // Hide quiz scene and show start scene
        document.getElementsByTagName('main')[1].style.display = 'none';
        this.id('quizTimer').style.display = 'none'
        this.numberElement.style.display = 'none';
        // Clear the quiz header content
        const quizHeader = this.id('quizHeader');
        quizHeader.innerText = '';
        this.delog(this.clientanswers);
        // Clear the verse input text area
        this.ver.value = '';
        this.id('questionNumber').style.display = 'none';
        this.progressBar.style.display = 'none';
        this.id('progressBar2').style.display = 'none';
        this.ver.style.display = 'none';
        // Hide the buttons and 'please wait' message
        this.id('next').style.display = 'none';
        this.id('pleasefinish').style.display = 'none';
        this.id('pleasebtn').style.display = 'none';
        this.id('More').style.display = 'none';
        this.ver.value = '';
        //id(par3).innerHTML = ''; 
          this.retryBtn.style.display = 'none'
        this.micBtn.style.display = 'none'
        micBtn.style.display = 'none'
        this.id('submit').style.display = 'none';
        this.id('BTN').style.display = 'none';
        this.id('correctbtn').style.display = "none";
        this.id('incorrectbtn').style.display = "none";
        this.plsc.style.display = 'none';
        //this.running = false;
        this.isend = true;
        this.id('quizTimer').style.display = 'none'
        this.updateClientInfo(this.clientanswers, 'storedQsArray', true);
        // Display summary
        const totalQuestions = this.quizSettings.numQuestions;
        const correctAnswers = this.correctCount;
        delog(this.answers)
        this.isend =  false;
        if(r==='r'){
            this.delay_text(`Review Complete!`, 'h2', 'quizHeader', 0, 'green');
            this.delay_text(`Corrected all questions`, 'p', 'quizHeader', 0, 'purple');


        }else{
        this.delay_text(`Quiz Complete!`, 'h2', 'quizHeader', 0, 'green');
        this.delay_text(`Your score: ${correctAnswers} out of ${totalQuestions}`, 'p', 'quizHeader', 0);
        //this.delog(answers)
       
        const review = this.id('review');
       

       
        const nextQuiz = this.id('new-quiz')
         nextQuiz.style.display = 'block'
        nextQuiz.addEventListener('click', (e2)=>{
            e2.target.style.display = 'none'
            this.clear('quizHeader');
            review.style.display = 'flex';
            this.delay_text('Review Incorrect Questions', 'h2', 'quizHeader', 0, 'purple');
            this.showWrongs();
            const a = this.id('startreview');
            a.style.display = 'block';
            a.addEventListener('click', async(e)=>{
          
                review.style.display = 'none';
                this.numberElement.style.display = 'flex';
                this.id('quizTimer').style.display = 'flex'
                this.isend = false;
                this.stopTimer = false;
            
                  this.micBtn.style.display = 'block'
        micBtn.style.display = 'block'
                            e.target.style.display = 'none';
                this.progressBar.style.display = 'block';
        this.id('progressBar2').style.display = 'block';
        this.id('BTN').style.display = 'block';
        if(!   this.dragEnabled){this.ver.style.display = 'block'}else{
            this.vD.style.display = 'block'
             this.vC.style.display = 'block'
        }  
                 this.type= 'review';
                //document.getElementsByClassName('nextScene').style.display = 'block';
                this.clear('quizHeader');
                this.id('submit').style.display = 'block'
                this.selVerses = this.answers.filter(q=>!q.correct).map(q=>q.verse);
                delog('new qs', this.selVerses);
                this.clear('review');
                //make the loop repeat forever
                this.currentVerseIndex = 0;
                 loadCompleteQuestionDict(); ///despite this being an async function it helps to save user waitimg 


                this.quizSettings.numQuestions = 10000000000000;
                await this.new_quote(
                    this.quizSettings.quizMode,
                    this.quizSettings.numQuestions,
                    this.quizSettings.verseSelection, this.speeddetext);
                    if (this.quizSettings.lenOfTimer === 0) {
                        this.numberElement.style.display = 'none';
                    } else {
                        console.warn('starting quiz timer at review')
                        this.quiztimer(this.Time);
                    }
                    if(this.stop) return
                //progressBar.style.width = '0%';
                //delog(selVerses)
                this.dragElements();
        
            })

        })
       
    }
       
        this.id('restart').style.display = 'block';
    }
    showWrongs(){
        let html;
        if (this.answers.some(a => !a.correct)) {
            html= '<!--satrt-->'
             this.answers.forEach(answer => {
                 if (!answer.correct) {
                 const ee = document.createElement                                  ('p');
                     if (answer.verse.type === 'ftv/quote' || answer.verse.type === 'quote' || answer.verse.type === 'ftv') {
                        
                         //this.delay_text(`${answer.verse.verse}`, 'h6', 'quizHeader', 0);
                         html+=`\n<div class="review-elm"><p >${answer.verse.ref} Quote/Ftv ${answer.verse.verse}</p></div>`;
                     } else {
                         const aAQ = answer.verse.aq.split('?');
                        html+= `<div class="review-elm"><p >${answer.verse.ref} ${aAQ[0]}?  ${aAQ[1]}</p></div>`;
                     }
                     ee.innerHTML = html;
                     html =''
                     review.appendChild(ee)
                 }
 
             });
             
         }
    }
    
    shuffleArray(array, itemOfArray = false) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        if (itemOfArray) {
            const r = Math.floor(Math.random() * array.length);
            const rand_itemOfarray = array[r];
            return [rand_itemOfarray, array];
        }
        return array;
    }
   

    upNumQ(params = this.currentQNum) {
        this.currentQNum += 1;
        this.id('questionNumber').textContent = this.currentQNum;
       
    }
    
    async new_quote(_ftv = 'quote', maxnum = 20, rand = 'random', speed = 0, isd) {
        this.next.style.display = 'none';
       // Stop the quiz if all questions are completed.
       if (this.currentVerseIndex >= this.selVerses.length && this.currentVerseIndex != maxnum) {
        this.currentVerseIndex = 0;
        //this.showResults();
        //return;
    }
       if (this.currentVerseIndex >= maxnum) {
        this.showResults();
        return;
    }
    if(this.type  ==='review' && this.selVerses.length === 0 ){
       
    
       this.showResults('r')
        return 
    }
    // Stop the quiz if all questions are completed.
   
        // Get the current verse data using the currentVerseIndex.
        const currentVerseData = this.selVerses[this.currentVerseIndex];
        
        // Check if the verse data is valid before continuing.
        if (!currentVerseData) {
            console.error('Error: current verse data is undefined.', this.currentVerseIndex);
            //this.showResults(); 
            // // Or handle the error differently

            return;
        }

        this.ftv = currentVerseData.type;
        let phars = '';
        
       
        this.cnum = this.currentVerseIndex;
      
        
        this.ftv = this.selVerses[this.cnum].type;
        if(this.ftv === 'ftv' || this.ftv === 'quote'||  this.ftv === 'ftv/quote'){
            this.isVerse = true;
        }else{
            this.isVerse = false;
        }
        let vtype;
        if (this.quizSettings.quizMode.includes('ftv')) {
            vtype = 'ftv';
            this.isftv = true;
        }
        
        if (this.quizSettings.quizMode.includes('quote')) {
            vtype = 'quote';
            this.isquote = true;
        }
        
        if (this.isquote && this.isftv && this.ftv === 'ftv/quote') {
            vtype = 'both';
        }
        
        if (this.ftv === 'ftv/quote') {
            this.ftv = vtype;
        }
        
        if (this.ftv === 'both') {
            const randtype = Math.floor(Math.random() * this.questTypes.length);
            this.ftv = this.questTypes[randtype];
            this.globalquestype = this.questTypes[randtype];
        }
        /* still used  */
        
        
        //let question_dict2 = question_dict;
        this.clear('quizHeader');
        const qh = 'quizHeader';
        this.currerentVerse = this.selVerses[this.cnum];
        let ftvTriggerI;
        this.verData = this.selVerses[this.cnum];
        const verData = this.selVerses[this.cnum];
        let uniqueWordNum;
        let uniquecharNum;
        this.QUEST = '';
        let tChar = 'ingore';
        //if(selVerses[cnum].type === 'ftv/quote'){
      if(this.setHref)  this.setHref.href = `/quiz_Study.html#quiz-${this.verData.id || 450}`;
        if (true) {
            if (this.ftv === 'ftv') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'ftv';
                const verseText = this.selVerses[this.cnum].verse;
                const words = verseText.split(' ');
                const first_5 = words.slice(0, 5);
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(words, this.ftvsSorted[verData.numVerses], this.cnum, 5));
                
                phars = first_5.join(' ');
                this.quest = words.slice(5).join(' ');
                this.delog(this.quest);
                 //tChar =  this.verse_dict2, phars, 0, phars.split('').length);
                //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
                
                await this.delay_text(`Finish the Verse:`, 'h4', 'quizHeader', 0, 'purple');
            } else if (this.ftv === 'quote') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'ftv';
                const verseData = this.selVerses[this.cnum];
                phars = verseData.ref;
                this.quest = verseData.verse;
                //tChar = findTrigChar(verse_dict2, quest, 0)
                ({uniquecharNum} =  await this.findUniqueTriggerWord(phars.split(' '), this.quotesSorted[verData.numVerses], "F"));
                uniquecharNum ++;
                await this.delay_text(`${this.selVerses[this.cnum].numVerses} Verse Quote:`, 'h4', 'quizHeader', 0, 'purple');
            } else if (this.ftv === 'SQ:') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = this.ftv;
                const getaq = this.selVerses[this.cnum].verse.split('?');
                this.QUEST = getaq[0];
                this.ANS = getaq[1];
                phars = `${this.QUEST}?`;
                this.selVerses[this.cnum].verse = this.QUEST;
                this.QUEST = this.QUEST.split(' ');
                //
                // tChar = this.findTrigChar(this.question_dict2, this.QUEST.join(' '), 0, this.QUEST.join(' ').split('').length);
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(this.QUEST, this.question_dict2, this.cnum, this.QUEST.length));
                this.QUEST = this.QUEST.join(' ');
                
                `if(ANS.includes('(')){
                    const sA =  ANS.split('(');
                    ANS2 = sA[1];
                    ANS = sA[0];
                }
                if(ANS.includes('[')){
                    ANS =  ANS.split('[')[0]
                }`;
                //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
                await this.delay_text(`Situation Question:`, 'h4', 'quizHeader', 0, 'purple');
                
            } else if (this.ftv === 'According to') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'at';
                const getaq = this.selVerses[this.cnum].verse.split('?');
                this.QUEST = getaq[0];
                this.ANS = getaq[1];
                phars = `According To: ${this.QUEST}?`;
                this.selVerses[this.cnum].verse = this.QUEST;
                this.QUEST = this.QUEST.split(' ');
                //tChar =  this.question_dict2, this.QUEST.join(' '), 0, this.QUEST.join(' ').split('').length) + 14;
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(this.QUEST, this.question_dict2, this.cnum, this.QUEST.length)) ;
               uniqueWordNum += 2;
               uniquecharNum += 14
                this.QUEST = this.QUEST.join(' ');
                
                
                //trigChar = findUniqueTriggerWord(QUEST.split(''), question_dict2, cnum , QUEST.length)[1];
                await this.delay_text(`Question`, 'h4', 'quizHeader', 0, 'purple');
            } else if (this.ftv === 'question') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'q';
                const getaq = this.selVerses[this.cnum].verse.split('?');
                this.QUEST = getaq[0];
                this.ANS = getaq[1];
                phars = `${this.QUEST}?`;
                this.selVerses[this.cnum].verse = this.QUEST;
                this.QUEST = this.QUEST.split(' ');
                //tChar = this.findTrigChar(this.question_dict2, this.QUEST.join(' '), 0, this.QUEST.join(' ').split('').length);
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(this.QUEST, this.question_dict2, this.cnum, this.QUEST.length));
                this.QUEST = this.QUEST.join(' ');
               
                
                
                //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
                await this.delay_text(`Question`, 'h4', 'quizHeader', 0, 'purple');
            } else if(this.ftv === 'deep') {
                console.warn('deep study mode');    
                this.deepStudy('new')
            }else{this.delog('failed at new', this.ftv);
            }
        }
        this.startTimer = false;
        this.delog(tChar, 'tc', this.ftvTriggerI, 'ftv1');
        if(this.ftv !== 'deep') {await this.delay_text(`${phars}`, 'p', 'quizHeader', speed, 'black', uniqueWordNum, uniquecharNum);
       if(isd) this.dragElements()
       }
        // Update the progress bar after a new question is loaded
        return this.quest, phars;
    }
    
    setupDropZone(containerId) {
        const container = document.getElementById(containerId);
        
        //clear all child blocks
        if (this.dragEnabled === false) {
            container.style.display = 'none';
            return;
        }
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        container.addEventListener('dragenter', (e) => {
            container.classList.add('drop-valid');
        });
        
        container.addEventListener('dragleave', (e) => {
            container.classList.remove('drop-valid');
        });
        
        container.addEventListener('drop', (eB) => {
            eB.preventDefault();
            container.classList.remove('drop-valid');
            
            const dataVBlock = eB.dataTransfer.getData('text/plain');
            const draggedElementVBlock = document.getElementById(dataVBlock);
            if (draggedElementVBlock) {
                container.appendChild(draggedElementVBlock);
            }
        });
        return container;
    }
    
    // This function initializes the clickable and draggable word blocks for the quiz.
    dragElements(txt) {
        if (this.dragEnabled === false) {
            this.setupDropZone('verse-con');
            this.setupDropZone('versedrop');
            return;
        }
        
        // Get the container for the draggable words.
        const draggableContainer = document.getElementById('verse-con');
        const dropContainer = document.getElementById('versedrop');
        dropContainer.innnerHTML = ''
          draggableContainer.innnerHTML = ''
        // Split the verse into individual words to create separate buttons.
        const rnum = Math.floor(Math.random() * 3 + 1);
        let blocks;
        let textAns = txt||this.ANS ;
        let dQuest =  txt || this.quest ;
        if (this.selVerses[this.cnum].type != 'ftv/quote' || txt) {
            
            
            blocks = textAns.split(' ');
            blocks = this.manageAnswer(blocks, true)[0];
            this.selVerses.forEach(itemSelected => {
                const randWord = this.shuffleArray(itemSelected.verse.split(' '), true)[0];
                this.randwords.push(randWord);
            });
            this.delog('random words', this.randwords);
            for (let i = 0; i < rnum; i++) {
                
                let randWORD = this.shuffleArray(this.randwords, true)[0];
                blocks.push(randWORD);
                this.delog('random word added', randWORD);
                
            }
        } else {

            blocks = dQuest.split(' ');
        }
        
        blocks = this.shuffleArray(blocks);
        let idIndex = 0;
        this.delog('block', blocks);
        // Iterate over each word block to create a new button element.
        blocks.forEach(block => {
            // Create a new button for each word.
            const button = document.createElement('button');
            // Set the text content of the button, adding a space for separation.
            if (block != '') {
                button.textContent = block + ' ';
                // Re-enable the draggable attribute for the button.
                button.draggable = true;
                
                // Add the base class for all draggable elements.
                button.className = 'draggable-block';
                
                // Assign a unique ID to each button to identify it later.
                button.id = `${idIndex}-${block}`;
                // Increment the ID index for the next button.
                idIndex++;
                // Append the newly created button to the draggable container in the HTML.
                if (button.textContent != '  ') {
                    draggableContainer.appendChild(button);
                }
            }
            
            
            // Add a 'dragstart' event listener to handle the beginning of a drag operation.
            button.addEventListener('dragstart', (eventdragB) => {
                // Set the data to be transferred during the drag, using the button's ID.
                eventdragB.dataTransfer.setData('text/plain', eventdragB.target.id);
                // Add a class to the button to visually indicate that it is being dragged.
                eventdragB.target.classList.add('is-dragging');
            });
            
            // Add a 'dragend' event listener to handle the end of a drag operation.
            button.addEventListener('dragend', (event) => {
                // Remove the dragging class to reset the element's appearance.
                event.target.classList.remove('is-dragging');
            });
            
            // Add a 'click' event listener to handle click-based movement.
            button.addEventListener('click', (event) => {
                // Check the current parent of the clicked button.
                const parentContainer = event.target.parentNode;
                // If the button is in the source container, move it to the drop container.
                if (parentContainer.id === 'verse-con') {
                    dropContainer.appendChild(event.target);
                }
                // Otherwise, if it's in the drop container, move it back to the source.
                else if (parentContainer.id === 'versedrop') {
                    draggableContainer.appendChild(event.target);
                }
            });
        });
        
        // Set up both the source and the drop zone containers as valid drop targets.
        this.setupDropZone('verse-con');
        this.setupDropZone('versedrop');
        
        // Add a listener to the new button to log IDs.
        //document.getElementById('getIDsButton').addEventListener('click', getDraggedElementIds);
    }
    
    handleSpaceEvent() {
        
        if (this.isVerse) {
            let Answer2;
            this.plsc.style.display = 'none';
            this.id('pleasefinish').style.display = 'none';
            this.id('correctbtn').style.display = "none";
            this.id('incorrectbtn').style.display = "none";
            this.id('puralbtn').style.display = 'none';
            
            let inpuT = this.ver.value;
            inpuT = inpuT.trim().split(' ');
            const user_word = inpuT[inpuT.length - 1];
            const Answer = this.quest.trim().split(' ');
            Answer2 = Answer[inpuT.length - 1];
            //special comparsion to be added
            if (Answer2[Answer2.length - 1] === 's' && user_word[user_word.length - 1] != 's') {
                //add dom for hint
                this.id('puralbtn').style.display = 'block';
                
            } else if (Answer2[Answer2.length - 1] != 's' && user_word[user_word.length - 1] === 's') {
                //add dom for
                this.id('puralbtn').style.display = 'block';
            } else
            
            //normal comparsion
            if (Answer2 && this.levenshtein(this.stripChar(user_word), this.stripChar(Answer2), 53)) {
                inpuT.pop();
                inpuT.push(Answer2);
                this.ver.value = inpuT.join(' ') + ' ';
            } else {
                this.plsc.style.display = 'block';
            }
            
            if (this.stripChar(inpuT) === this.stripChar(this.quest)) {
                this.id('correctbtn').style.display = "block";
                if (!this.answers[this.cnum]) {
                    this.answers[this.cnum] = { correct: 0 };
                }
                this.answers[this.cnum].correct += 1;
                this.correctCount++;
                this.correct('right');
                clearInterval(this.timerid);
            }
        }
    }
    idFinder(id){
      const idFound  = Object.values(this.verse_dict).find(q=>q.id === id);
      return idFound || false;
    }
    get HTML(){
        const top= this.SHEAD
        const foot= this.SFOOT;
        const body= this.SBODY
        const full = this.SETTINGSHTML;
        const scene = this.QUIZSECENE;
        const modal = this.dialogue;
        return {top, foot, body, full, scene, modal}
    }
    timer (){
        if(this.stopTimer){
            this.stopTimer = false
            return;
        }
        //this keeps time of how long in total the user has taken to complete the quiz
        this. seconds,  this.minutes  = 0;
        
        function timerfunc(){
            if(this.stopTimer) {clearInterval(timerID); this.endTime = `${this.minutes}:${this.seconds}`; return};
            this.seconds++;
            if(seconds === 60){
                this.minutes++;
                this.seconds = 0;
            }
        
        }
       const timerID =  setInterval(timerfunc.bind(this), 1000);
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
    console.error(this.errors)
    let checker = false;
        const submitButton = this.id('submit');
        if (submitButton) {
            submitButton.addEventListener("click", () => this.checkAns());
            //window.addEventListener("click", () => this.checkAns());
        }  
        
        if (this.ver) {
            this.ver.addEventListener('input', () => {
                // Check if the input value ends with a space and is not empty.
                if (this.ver.value.endsWith(' ') && this.ver.value.trim().length > 0) {
                    // If it does, run the handleSpaceEvent logic.
                    this.handleSpaceEvent();
                }
            });
        }
        
      
         
    
                
                async function Selectdata() {
                    
                    if (this.dragEnabled) {
                        this.ver.style.display = 'none';
                    }
                    
                    if(this.next) this.next.style.display = 'none';
                    delog(this.selVerses)
                    if (this.selverses && this.selVerses.length === 0  && customQuestions.length === 0) {
                        this.delog(this.question_dict, 'frist vd');
                        this.verse_dict = { ...this.verse_dict, ...this.question_dict };
                        this.delog(this.verse_dict, 'Vers dict after add');
                        const allQuestionsArray = Object.values(this.verse_dict)
                        this.updateClientInfo(allQuestionsArray, 'QuestionsToPrint', true);
                            this.updateClientInfo(this.quizSettings, "QuizSettings", true)
                        this.selVerses = Object.values(this.verse_dict).filter((Verse,i) => {
                            
                            
                            
                            
                           
                            let Test = this.quizSettings.months.includes(Verse.month) && this.quizSettings.flights.includes(Verse.flight) && this.quizSettings.quizMode.includes(Verse.type) && this.quizSettings.chapters.includes(Verse.chapter)
                            if(i===1 || i==10){
                            const isMonthIncluded = this.quizSettings.months.includes(Verse.month); // Checks the first condition: month inclusion
                            console.log("Month Inclusion Check:", isMonthIncluded);
                            
                            // 2. Check if the Verse flight is included in the allowed flights
                            const isFlightIncluded = this.quizSettings.flights.includes(Verse.flight); // Checks the second condition: flight inclusion
                            console.log("Flight Inclusion Check:", isFlightIncluded, Verse);
                            
                            // 3. Check if the Verse type is included in the allowed quiz modes
                            const isQuizModeIncluded = this.quizSettings.quizMode.includes(Verse.type); // Checks the third condition: quiz mode inclusion
                            console.log("Quiz Mode Inclusion Check:", isQuizModeIncluded);
                            
                            // 4. Check if the Verse chapter is included in the allowed chapters
                            const isChapterIncluded = this.quizSettings.chapters.includes(Verse.chapter); // Checks the fourth condition: chapter inclusion
                            console.log("Chapter Inclusion Check:", isChapterIncluded);
                            
                            // 5. The final overall result of the original statement
                            const test = isMonthIncluded && isFlightIncluded && isQuizModeIncluded && isChapterIncluded; // Combine the results to get the final boolean value
                            console.log("Final Test Result:", test);
                            }
                            //if(!Test) console.warn(Verse)
                            return Test;
                                
                
                        })
                       console.warn( this.setTrigForAllMonths(this.selVerses[7]));
                        if(this.selVerses.length === 0) {this.manageModal('No questions selected');
        return 'stop'}; //show a friendly wait message and have the user reclick the start button
                        //add the incorrect and correct propties to selVerses
                        
                    } else {
                        this.selVerses = customQuestions
                        console.warn('please fix', this.selVerses)
                        //this.quizSettings.numQuestions = clientAnswersLength;
                        //this.selVerses;
                        
                    //return;*//////////////////////////////////////////////
}
                }
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
                    async function loadVerseDicts() {
                        
                    
                           const {figureMonths} = this.hightestMonth(this.quizSettings.months)
                        this.verse_dict2 = this.fliterOutQs(Object.values(this.verse_dict), {m: figureMonths, f: this.quizSettings.selectedFlights, t: ['ftv/quote']})
                        
                        this.delog2('question_dict', '2');
                        this.question_dict2 = this.fliterOutQs(Object.values(this.verse_dict), {m: figureMonths, f: this.quizSettings.selectedFlights, t: ['question', 'According to', 'SQ:']})
                     this.  numVs.forEach(v=> { this.ftvsSorted[v] = this.verse_dict2.filter(verse=> verse.numVerses === v)})
                        this.delog2(this.ftvsSorted, 'sorted quotes by num verses');
                       
                        this.quoteRefArr = this.verse_dict2.map(Verse => Verse.ref);
                        this.quotesSorted = this.numVs.map(v=> this.ftvsSorted[v].map(ve=>ve.ref));
                    this.delog2('all dicts', this.question_dict2, this.verse_dict2, this.quoteRefArr, Object.values(this.verse_dict, 'verse dicts'));
                   
                    
                }
                    
                    await loadVerseDicts.bind(this)();
                    this.ftvQ = ['ftv', 'quote']
                    if (this.quizSettings.verseSelection === "random") {
                        this.selVerses = this.shuffleArray(this.selVerses);
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
                    
                   
                       
                   if(this.id('print')) {this.delog('print 101'); return;}
                    
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
                this.micBtn.addEventListener('click', async ()=>{
                    // Function to update your UI with the final text
                    const ver = this.id('verse')
                    const micSpan = this.id('micSpan')
                    const mic = this.id('micBtn')
function handleTranscription(text) {
    delog("Transcribed Text:", text);
    micSpan.textContent= 'Getting text...'
    ver.value = text;
    // Example: document.getElementById('myTextArea').value += text + ' ';
}

// Function to update your UI when the microphone is on
function handleStart() {
    delog("Recording started...");
    mic.classList.add('listening')
    micSpan.textContent = 'Listening'
    // Example: document.getElementById('myStatus').textContent = 'Listening...';
}
function toStop(){
    ver.addEventListener('input', ()=>recognition.stop())
}
// Function to update your UI when the microphone is off
function handleEnd() {
    delog("Recording ended.");
    mic.classList.remove('listening')
    micSpan.textContent = 'Press For Mic'
    // Example: document.getElementById('myStatus').textContent = 'Ready.';
}

// Function to handle any errors
function handleError(error) {
    console.error("An error occurred:", error);
    // Example: alert('Recording failed due to: ' + error);
}

// Start the recording when a button is clicked
let currentRecognition = null;

    this.vD.style.display = 'none';
                    this.vC.style.display = 'none';
                    this.ver.style.display = 'block';
                    this.dragEnabled = false;
    // Stop any existing session before starting a new one
    if (currentRecognition) {
        currentRecognition.stop();
        currentRecognition = null;
    }
    
    // Start the new recognition session
    currentRecognition = startVoiceRecognition(
        handleTranscription,
        handleStart,
        handleEnd,
        handleError, toStop
    );

                    //const micInput =  startVoiceRecognition()
                })
                this.Start();
                
            
        
        ///settings event 
        /* when the user clicks the settings icon, this code runs here*/
        if (this.btnTOModal) {
            this.btnTOModal.addEventListener('click', () => {
                this.manageModal(`<div class="option-section">
                <h3 class="section-title">Set Quiz Settings</h3>
                <h3 class="section-title">Speed of Text (In Milliseconds)</h3>
                <div class="range-display-container">
                    <input type="range" id="speed1" name="numQuestions" value="0" min="0" max="4000">
                    <span id="speedValue1">0</span>
                </div>
            </div>
             <div class="option-section">
                        <h3 class="section-title">Length of Timer (Length of zero will be no timer)</h3>
                        <input type="number" id="secs1" name="numQuestions1" value="30" min="0" max="1000" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    </div>
                    <div class="option-section">
                    <h3 class="section-title">Verse Selection</h3>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="type" value="d" id="d" >
                            <span class="radio-custom"></span>
                            Drag and Drop
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="type" value="t" id="t">
                            <span class="radio-custom"></span>
                            Text
                        </label>
                    </div>
                </div>
                 <div class="option-section">
                    <h3 class="section-title">Trigger Words</h3>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" id="highlight"name="verseSelectionH" value="highlight" checked>
                            <span class="radio-custom"></span>
                            Highlight
                        </label>
                        <label class="radio-label">
                            <input type="radio"id="ingore" name="verseSelectionH" value="ingore">
                            <span class="radio-custom"></span>
                            Ingore
                        </label>
                        <label class="radio-label">
                            <input type="radio" id="stop" name="verseSelectionH" value="stop" checked>
                            <span class="radio-custom"></span>
                            Stop at Word
                        </label>
                    </div>
                </div>
                
                `, true);
                
                
                const speedInput1 = this.id('speed1'); // Gets the range input element.
                const speedValueSpan1 = this.id('speedValue1'); // Gets the span element to display the value.
                `speedValueSpan1.textContent = speeddetext;
                speedValueSpan1.value = speeddetext;
                id(secs1).value = Time;`;
                if (this.dragEnabled) {
                    
                    this.id('d').checked = true;
                    this.id('t').checked = false;
                } else {
                    this.id('t').checked = true;
                    this.id('d').checked = false;
                }
                // Listen for the 'input' event, which fires continuously as the slider is moved.
                if (speedInput1) {
                    speedInput1.addEventListener('input', (event) => {
                        // Update the text content of the span with the current value of the input.
                        speedValueSpan1.textContent = event.target.value;
                    });
                }
            });
        }
         
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


}




  class BaseStudy extends QuizCompanion{
    constructor(debugMode, config){
        super(debugMode, 'deep_study', config)
        this.say = 'text'; //or passage
        // this.content also menas verse  and passage means all content in verse study
        // while content is used for the whole text in quizStudy 

        
        this.studyCommandIdMap = {
            where: ['beginning', 'second', 'atVersesEnd', 'end'],
            usedFor: ['MEMORY', 'QUIZ', 'EXTRA'],
            // Numerical ID 1 corresponds to the command for reviewing the passage structure.
            1: "review_structure", 
            // Numerical ID 2 corresponds to the command for reciting the entire passage.
            2: "recite_passage",
            // Numerical ID 3 corresponds to the command for focusing on a small chunk.
            3: "focus_chunk",
            // Numerical ID 4 corresponds to the command for typing the small chunk.
            4: "type_chunk",
            // Numerical ID 5 corresponds to the command for typing the entire verse.
            5: "type_verse",
            // Numerical ID 6 corresponds to the command for practicing difficult words.
            6: "practice_difficult",
            // Numerical ID 7 corresponds to the command for a general review of all content.
            7: "review_all"
        };
        
        this.memoryStudyCommands = {
            // The overall category or depth level of these commands.
            type: "deep", 
        // three types currentVerse, content, missedWordsToUse
            // An array containing specific study commands and their intended use cases.
            commands: [
                {
                    // The type of learning (deep memorization).
                    type: "deep", 
                    // Unique, non-random numerical identifier (mapped to 'review_structure').
                    id: 1, 
                    // Command focusing on reviewing the entire passage's context and flow.
                    statement: "Study the highlighted words", 
                    content:'highlightedContent',
                    // Use case simplified to a single word for sorting/filtering.
                    used_for: "QUIZ" ,
                    where: 'beginning',
                    hasAns: false
                   
                },
             
               
                {
                    // The type of learning (deep memorization).
                    type: "deep", 
                    // Unique, non-random numerical identifier (mapped to 'type_chunk').
                    id: 2, 
                    // Command requiring the user to type out the specific chunk they are studying.
                    statement: "Type the current chunk of words", 
                    content: 'chunk',
                    // Use case simplified to a single word for sorting/filtering.
                    used_for: "MEMORY" ,
                     where: 'beginning',
                     hasAns: true
                },
                { 
                    // The type of learning (deep memorization).
                    type: "deep", 
                    // Unique, non-random numerical identifier (mapped to 'type_verse').
                    id: 3, 
                    // Command demanding typing of the complete verse for rigorous testing.
                    statement: "Type all chunks just learned from memory", 
                    content: 'chunkSlice',
                    // Use case simplified to a single word for sorting/filtering.
                    used_for: "MEMORY" ,
                    for:'quiz',
                     where: 'beginning',
                     hasAns: true
                },
                {
                   // The type of learning (deep memorization).
                   type: "deep", 
                   // Unique, non-random numerical identifier (mapped to 'type_verse').
                   id: 4, 
                   // Command demanding typing of the complete verse for rigorous testing.
                   statement: `Type the full ${this.say || 'passage'} from memory`, 
                   content: 'content',
                   // Use case simplified to a single word for sorting/filtering.
                   used_for: "MEMORY" ,
                   for:'quiz',
                    where: 'end',
                    hasAns: true
               },
                  
                { 
                    // The type of learning (deep memorization).
                    type: "deep", 
                    // Unique, non-random numerical identifier (mapped to 'practice_difficult').
                    id: 5, 
                    name:'missed',
                    // Command to engage with words previously marked as difficult or forgotten.
                    statement: "Practice difficult or forgotten words", 
                    content: 'missedWordsToUse',
                    // Use case simplified to a single word for sorting/filtering.
                    used_for: "EXTRA" ,
                    end:true,
                    where: 'atVersesEnd',
                    hasAns: true
                },
                { 
                    // The type of learning (deep memorization).
                    type: "deep", 
                    // Unique, non-random numerical identifier (mapped to 'practice_difficult').
                    id: 6, 
                    name:'review',
                    // Command to engage with words previously marked as difficult or forgotten.
                    statement: "Recite all verses learned ", 
                    content: 'passage',
                    // Use case simplified to a single word for sorting/filtering.
                    used_for: "EXTRA" ,
                    end:true,
                    where: 'end',
                    hasAns: true
                },
               
            ]
        };
        this.answer;
        this.question;
        this.questVRef;
        this.missedWords ={}
        this.currrentId;
       this.chunk= null;
       this.anwserSectionHtml = `

       <textarea spellcheck="false" placeholder="Enter Text" id="verse" class="blueborder invisible-text" style="position:absolute;"></textarea>
       
       <div id="textarea-shadow" class="textarea-shadow blueborder"></div>
       
   
       `;
        //html stuff
        this.section =  this.id('answer-section')
        this.section.innerHTML = this.anwserSectionHtml;     
       
        if (this.id('new-quiz')) this.id('new-quiz').style.display = 'none';
        if (this.id('studyBtn')) this.id('studyBtn').style.display = 'none';
        if (this.id('quizTimer')) this.id('quizTimer').style.display = 'none';
        if (this.id('progressBar2')) this.id('progressBar2').style.display = 'block';
        if (this.id('progressBar')) {
            this.id('progressBar').style.width = '0%';
            this.id('progressBar').style.display = 'block';
        }
        this.card = this.id('quiz-card');
       
          //this.next = this.id('nextBtn');
        this.shadow = this.id('textarea-shadow');
        this.textarea = this.id('verse');
        this.textarea.classList.add('invisible-text');
         const textType = 't';
        if (textType === 't') {
            this.vD.style.display = 'none';
            this.vC.style.display = 'none';
            this.ver.style.display = 'block';
            this.dragEnabled = false;
        } else {
            this.vD.innerHTML = '';
            this.vC.innerHTML = '';
            this.ver.value = '';
            this.vD.style.display = 'block';
            this.vC.style.display = 'block';
            this.ver.style.display = 'none';
            
            if (this.isrendered) {
                this.dragElements();
            }
            this.dragEnabled = true
                }
        this.textarea.addEventListener('input', (e) => {
            this.shadow.innerText = e.target.value;
           /// this.shadow.style.height = e.target.scrollHeight + "px";
        console.log('input event', e.target.value);
        console.log('shadow text', this.shadow.innerText);
        console.log('shadow height', this.shadow.style.height);
        //end html stuff
      
        });
         
    }
    //html 
  
    newStudy(htmlElm= 'h3'){
      const area  =    this.id('quizHeader');
      const verseData = this.selVerses[this.cnum];
      area .innerHTML = `<${htmlElm} class="statement> ${this.selVerses[this.cnum].statement}</${htmlElm}>`;
      this.answer = this.selVerses[this.cnum].answer 
      this.chunk = this.selVerses[this.cnum].chunk || null; 
      if(!this.answerDeep) this.updateHtmlWithNextBtn()
     
  let display =`<div class="deep-display">${verseData.display || "Error with loading content"}</div>`;
  this.id('answerSection').innerHTML =   verseData.anwser ? this.anwserSectionHtml: display; 


}
    updateHtmlWithNextBtn(){
        this.next.style.display = 'block';
    }
    htmlState(toDisplay){
      return   toDisplay.map(word=>`<span class="${word.status}">${word.word}</span>`).join(' ')

    }

    checkStudy(enteredAnswer){
        const cleanEntered = enteredAnswer.split(' ').map(w => stripChar(w)).filter(w=>w); //the filter reomves empty strings
        
    const cleanAnswer = this.answer.split(' ').map(w => stripChar(w)).filter(w=>w); //the filter reomv
      const {correctedAnswer, missedWords}  = this.spellCheck(cleanAnswer, cleanEntered, { threshold: 2, correction: true });
    if(this.stripChar(correctedAnswer.join(' ')) === this.stripChar(this.answer)){
            ///directly send to corrrect if complete match
            const wordData = this.missedWords[this.currrentId];
            if (wordData && wordData.diff !== undefined) {
                // Directly use the valid reference for assignment.
                wordData.diff -= 1; 
            }
          this.correct('right')
        }else{
           this.correct('wrong')
           console.log('missed words', missedWords, this.currrentId);
           this.findWordsCount(cleanAnswer, cleanEntered) // id to be figuerd out
           this.rankedMissedWords = this.missedWords.sort( (a,b) => b.missed - a.missed );
          
           this.missedWordsList = this.randkedMissedWords.slice(0, 6).map( mw => mw.word); //top six missed words
           this.missedWordsToUse = this. missedWordsList.join(' ');
           console.log('missed words list', this.missedWordsList)
        }

    }
    
        /// implement later need code now!!!!
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
    findWordsCount(answer=[], enteredAnswer=[], id, resetID=true){
        if(resetID) this.missedWords[id] = []
       for  (word of answer){
            const countOfWordEntered  = enteredAnswer.filter(eWord => eWord === word).length;
            const actualCountOfWord  = answer.filter(aWord => aWord === word).length;
            console.log('count of word', word, countOfWord)
            const diff = actualCountOfWord - countOfWordEntered;
            if(diff === 0) continue;
            // negative diff means they entered more than required
            this.missedWords[id] .push( {word: word, missed:diff})
        }
        return this.missedWords[id];
       //this should use the whole context to find missing words what algorithm?
       //this algorithim right here : 
    }
    setWordState(answer=[], enteredAnswer=[]){
    let wordStates ,  missedWords = [];
        let wordsInAnswerMap = [...answer]; // Create a copy of the answer array to track used words.
         // Index to track the user's current token position.
         for(let i=0; i < enteredAnswer.length; i++){
            const actualWord = i >= answer.length ? false: answer[i]
            const userWord = enteredAnswer[i]; // Get the corresponding word from the user's input at the current position.
            let status = 'missed'; // Default status if no match is found.
            if(actualWord && actualWord === userWord){ // If the words match at the current position (perfect sequence).
                status = 'correct'; // Mark as correctly placed.
                wordsInAnswerMap.splice(i, 1); // Remove the matched word from the map.
         }else if(answer.includes(userWord)){
            status = 'misplaced';
           if(actualWord) wordsInAnswerMap.splice(i, 1); // Remove the matched word from the map.
         }else{
            status = 'incorrect';
         }
        
         wordStates.push( {word: actualWord, status: status ,index:i} )
         if(enteredAnswer.includes(actualWord) === false && actualWord){
            status = 'missed';
            console.log('missed at',  i, actualWord)
            missedWords.push({word: actualWord, index:i})
         }  

    }
    this.wordStates = wordStates;
return {wordStates, missedWords}
}
actualQuestState(anwser =[], states, missed){
    const status = ['correct', 'missed']
 missed.forEach(m =>{
   states[ m.index ] = m;
 })
return states;


}
    initWords(verseOrQuest, chunkLen=5){
        this.wholeContent = verseOrQuest;
        this.contentwords = verseOrQuest.split(' ');
        const len = this.contentwords.length;
        this.chunks = []
        const verselens =  chunkLen
     //////////////////math is good/////////////////////////////////
     ///console.log('math', verselens, leftOver, (len / 5))
     for(let i =0; i < len; i += verselens){
      const sectionRow = this.contentwords.slice(i, i + verselens);
      this.chunks.push(sectionRow) 
     }
       for (let i = 0; i < len; i += verselens) { // Loops through the length of the array in steps of verselens
            const indexChunk = []; // Creates a temporary array for the current chunk of indexes
            
            // Loop to fill the chunk with index numbers
            for (let j = i; j < i + verselens && j < len; j++) { // Ensures we don't exceed the total length
                indexChunk.push(j); // Adds the current word index to the chunk
            }
    
            this.indexChunks.push(indexChunk); // Pushes the array of indexes into the main chunks array
        }
        
        return [this.chunks, this.indexChunks]; // Returns the nested array of indexes
    
     //return this.chunks;
    }
}
    class VerseStudy extends BaseStudy { 
        constructor(verses){
            super()
            this.verses  =  verses  || localStorage.getItem('deepStudyVerses') || false; // the current value of this key will have the verse needed to study
            console.log('verseStudy')
        }
    }
    class QuizStudy extends BaseStudy { 
        constructor(questionID, type, chunkLen=3){
            super()
            this.type = type
   this.chunkLen =  chunkLen
           this.chunkLen = chunkLen;
          
                     
            
            this.onVInit(questionID)

           

            
        }
    formatQuizStudy (chunkes, commands, currentQObject, content, extras) {
        const [chunks, indexes] = chunkes
            const questionsObject = chunks.map( (chunk, i, chunkArr) => { 
            console.log(`Chunk ${i + 1}:`, chunk.join(' '));
            if(i === 0) commands.filter( cmd => cmd.where !== 'second' );
           const chunkSlice = chunkArr.slice(0, i + 1).flat().join(' ');
           const highlightedContent = content.split(' ').map( (word, j) => indexes[i].includes(j) ? `<span class="highlighted">${word}</span>` : word ).join(' ');
                
          const studyQuestions = commands.map(cmd => ({
            ...currentQObject, // Spreads existing properties from the base object
            type: 'deep', // Sets the question category to 'deep'
            cmdId: `${cmd.id}`, // Converts the command ID to a string
            id: `${i}#${cmd.id}`, // Creates a unique composite ID using an outer index 'i'
            statement: cmd.statement, // Assigns the specific command text
            chunk: chunk.join(' '), // Joins the current array of words into a single string
            // If command has an answer, check if it's ID 3 for specific slicing, else join the chunk
            answer: (cmd.hasAns) ? ((cmd.id === 3) ? chunkSlice : chunk.join(' ')) : false,
            // Determines what to display based on the command ID
            display: (cmd.id === 1) ? highlightedContent : this[cmd.content]
        })); // Closes the map function and returns the new array
                    
            return studyQuestions;


           })
           return questionsObject.flat()
          }
        async   onVInit( id){
           id = new Number(id)
           const type = this.type;
            const  {allQs}  = await this.initializeQuiz()
                this.allContent = allQs;
               
                this.content = Object.values(this.allContent).find(vq => {  return vq.id == id} ) 
                this.currentQObject = this.content
                console.log(id, 'id in study', allQs, this.content,  Object.values(this.allContent))
                this.content = this.content.verse
                if(type !== 'both') this.content = type === 'anwser' ? this.content.split('?')[1] : this.content.split('?')[0];
                [this.question, this.answer ] = this.content.split('?')
           
              const chunks = this.initWords(this.content, this.chunkLen);
              delog(chunks, 'chunks')
              const commands = this.memoryStudyCommands.commands.filter( cmd => cmd.used_for !== 'EXTRA' )
              const extras =  this.memoryStudyCommands.commands.filter( cmd => cmd.used_for === 'EXTRA' )
               
           
             this.selVerses= this.formatQuizStudy(chunks, commands, this.currentQObject,  this.content, extras);
             console.log( this.selVerses);
             const settings = {
                numQuestions: this.selVerses.length,
                lenOfTimer: 0,
                speed_tOf_text: 0,
                verseSelection: 'inOrder',
                quizMode: ['MEMORY', 'QUIZ'],
                months: [],
                ischp: false,
                flights: ['A', 'B', 'C', 'T'],
                selectedFlights: ['A', 'B', 'C', 'T'],
            }
             this.quizSettings = settings;
             console.log('quiz settings for deep study', this.quizSettings);
             
             this.startApp(settings, this.selVerses);
                      }
    }


class Sockets {
    // COMMENT: Defines the constructor to initialize the connection and state.
    constructor(wsPro = 'ws://localhost:3030') {
        this.clientWs = new WebSocket(wsPro); // COMMENT: Creates the WebSocket instance.
        this._connectionPromise = new Promise((resolve, reject) => { // COMMENT: Creates a Promise that resolves only when the WS connection is open.
            this.clientWs.onopen = (event) => { // COMMENT: Sets the correct handler for when the connection is established.
                console.log('Connection established.');
                resolve(this.clientWs); // COMMENT: Resolves the Promise, signaling the connection is ready.
            };
            // Optional: Handle connection errors here to reject the promise quickly
            this.clientWs.onerror = (error) => {
                console.error('WebSocket Error:', error);
                reject(error);
            };
        });
        // COMMENT: No need for this.sessionWs = {}; as response tracking is handled by the Promise.
    }

    // COMMENT: Sets up essential error and close handlers. No need for await/async here.
    handleConnection(onClose, onError) {
        this.clientWs.onclose = (event) => { // COMMENT: Defines the handler for connection closure.
            if (!event.wasClean) console.error('Error with unclean close', event);
            console.log('Connection closed', event);
            if (typeof onClose === 'function') onClose(); // COMMENT: Correctly calls the external onClose callback if provided.
        };
        this.clientWs.onerror = (error) => { // COMMENT: Defines the handler for connection errors.
            console.error('Error', error);
            if (typeof onError === 'function') onError(error); // COMMENT: Correctly calls the external onError callback if provided.
        };
        // NOTE: The onopen handler is handled in the constructor via _connectionPromise.
    }

    // COMMENT: Primary method for sending a message and awaiting a specific response.
    async emit(func, data = {}, ...eventArgs) {
        // 1. Await the connection readiness promise (The most critical fix).
        await this._connectionPromise; // COMMENT: Pauses execution until the WebSocket is confirmed to be OPEN (readyState = 1).

        return new Promise((resolve, reject) => {
            // 2. Create a unique ID for this request.
            const requestId = Date.now().toString() + Math.random().toString(36).substring(2, 9); // COMMENT: Generates a reliable unique request identifier.

            // 3. Define the temporary listener to wait for the specific response.
            const messageListener = (messageEvent) => {
                let res;
                try {
                    res = JSON.parse(messageEvent.data);
                } catch (e) {
                    console.error("Failed to parse incoming message:", e);
                    return;
                }

                // 4. Check if the incoming message is the response we are waiting for.
                if (res.responseToId === requestId) {
                    // 5. Success! Remove the temporary listener to clean up.
                    this.clientWs.removeEventListener('message', messageListener); // COMMENT: Removes the specific listener instance to prevent memory leaks and confusion.

                    // 6. Resolve the Promise with the response data.
                    resolve(res); // COMMENT: Returns the server response to the calling code.
                }
            };
            
            // 7. Attach the temporary listener *before* sending the request.
            this.clientWs.addEventListener('message', messageListener); // COMMENT: Attaches the message listener specifically for this request's resolution.

            // 8. Send the message payload.
            const payload = {
                func: func,
                args: eventArgs,
                payload: data,
                requestId: requestId // COMMENT: Includes the unique ID for the server to reference in its response.
            };
            this.clientWs.send(JSON.stringify(payload)); // COMMENT: Transmits the final JSON payload.
        });
    }

    // COMMENT: Removed the redundant asyncEmit method. 'emit' is already asynchronous and returns a Promise.
    // The user can simply call: const serverAction = await socketsInstance.emit(event, payload);
} 
function setQuizSetings (app){
    const quizSettings = {}
   
   //for now
   // Add if statements to check if the elements exist before accessing their values
   const verseSelectionElement = document.querySelector('input[name="verseSelection"]:checked');
   if (verseSelectionElement) {
       quizSettings.verseSelection = verseSelectionElement.value;
   }
   const verseSelectionElementH = document.querySelector('input[name="verseSelectionH"]:checked');
   if (verseSelectionElementH) {
       quizSettings.highlight = verseSelectionElementH.value;
   }
   const selquizMode = [];
   const quizModeElement = document.querySelectorAll('input[name="quizMode"]:checked');
   if (quizModeElement) {
       quizModeElement.forEach((checkboxqm) => {
           selquizMode.push(checkboxqm.value);
       });
   }
   
   let ischp = false;
   
   const selectedMonths = [];
   const monthCheckboxes = document.querySelectorAll('input[name="month"]:checked');
   if (monthCheckboxes) {
       monthCheckboxes.forEach((checkbox) => {
           selectedMonths.push(checkbox.value);
       });
   }
   quizSettings.ischp = false;
   quizSettings.months = selectedMonths;
   const selectedChps = [];
   const ChpCheckboxes = document.querySelectorAll('input[name="chp"]:checked');
   if (ChpCheckboxes) {
       ischp = true
       quizSettings.ischp = true;
       ChpCheckboxes.forEach((checkbox) => {
           selectedChps.push(checkbox.value);
       });
   }
   
   if(selectedChps.length === 0){
      ischp = false;
      quizSettings.ischp = false;
        const ChpCheckboxes = document.querySelectorAll('input[name="chp"]')
        ChpCheckboxes.checked = true;
        ChpCheckboxes.forEach((checkbox) => {
           selectedChps.push(checkbox.value);
       });

   }else{
       ischp = true;
       quizSettings.ischp = true;
   }
   quizSettings.chapters = selectedChps;
   
   const numQuestionsElement = document.getElementById('numQuestions');
   if (numQuestionsElement) {
       quizSettings.numQuestions = parseInt(numQuestionsElement.value);
   }
   
   const lenOfTimerElement = document.getElementById('secs');
   if (lenOfTimerElement) {
       quizSettings.lenOfTimer = parseInt(lenOfTimerElement.value);
   }
   const speed_tOf_text = document.getElementById('speed');
   if (speed_tOf_text) {
       if (typeof (parseFloat(speed_tOf_text.value)) != 'number') {
           quizSettings.speed_tOf_text = 0;
       } else {
           quizSettings.speed_tOf_text = parseFloat(speed_tOf_text.value);
       }
   }
   
   const selectedFlights = [];
   const flightCheckboxes = document.querySelectorAll('input[name="flight"]:checked');
   if (flightCheckboxes) {
       flightCheckboxes.forEach((checkbox) => {
           selectedFlights.push(checkbox.value);
       });
   }
   
   quizSettings.flights = selectedFlights;
   const title = document.getElementsByTagName('title');
   if (title.value === 'Practice Hard Verses') {
       //quizSettings.numQuestions = length(clientanswers);
   }
   
   if (quizSettings.flights.length === 0) {
       quizSettings.flights = ['A', 'B', 'C', 'T'];
   }
   if (quizSettings.months.length === 0) {
       quizSettings.months = app.quiMonths;
   }
   if(quizSettings.chapters.length === 0){
      quizSettings.chapters = app.quizMonths.map(Month=>{
          if( quizSettings.months.includes(Month[0])){
           return Month[1].join(' ')
          }
       }).join(' ').split(' ')
   }
   quizSettings.quizMode = selquizMode;
   if (quizSettings.quizMode.includes('ftv') || quizSettings.quizMode.includes('quote')) {
       // If the array includes either 'ftv' or 'quote', push the combined mode.
       selquizMode.push('ftv/quote');
   }
   quizSettings.quizMode = selquizMode;
   console.log('Quiz Settings Saved:', quizSettings);
 
   
   if (quizSettings.numQuestions > 100 || quizSettings.numQuestions === 0) {
       quizSettings.numQuestions = 20;
   }
   if (typeof (quizSettings.numQuestions) != 'number') {
       quizSettings.numQuestions = 100;
   }
   if (typeof (quizSettings.lenOfTimer) != 'number') {
       quizSettings.lenOfTimer = 0;
   };
   localStorage.setItem( "QuizSettings",JSON.stringify(quizSettings))
   return quizSettings;
}
const debug = true;
const logs =  []
function delog(...args){
    if(!debug) return;
    let cou = 0;
    console.log(logs)
    const closeMagic = ()=>cou++;
    logs.push(cou +' ', ...args)
   return closeMagic()

   
}
//new QuizCompanion
//const QuizApp = new quizCompanion()
export { debug, QuizCompanion, Sockets, HtmlContentHandling, delog, startVoiceRecognition, setQuizSetings, SETTINGSHTML, VerseStudy, QuizStudy}
