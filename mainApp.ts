//Node js server
//This code will power the backend of my website
// I will need express js for handling input/output
const matthew: Record<string, Record<string, string[]>> = {}
const textdemo: Record<string, string[]> = {
    '5': [
      '1 Seeing the crowds, he went up on the mountain, and when he sat down, his disciples came to him.\n' +
        '\n' +
        'The Beatitudes\n' +
        '\n' +
        '  ',
      '2 And he opened his mouth and taught them, saying:\n\n  ',
      '3 “Blessed are the poor in spirit, for theirs is the kingdom of heaven.\n' +
        '\n' +
        '  ',
      '4 “Blessed are those who mourn, for they shall be comforted.\n\n  ',
      '5 “Blessed are the meek, for they shall inherit the earth.\n\n  ',
      '6 “Blessed are those who hunger and thirst for righteousness, for they shall be satisfied.\n' +
        '\n' +
        '  ',
      '7 “Blessed are the merciful, for they shall receive mercy.\n\n  ',
      '8 “Blessed are the pure in heart, for they shall see God.\n\n  ',
      '9 “Blessed are the peacemakers, for they shall be called sons of God.\n' +
        '\n' +
        '  ',
      '10 “Blessed are those who are persecuted for righteousness’ sake, for theirs is the kingdom of heaven.\n' +
        '\n' +
        '  ',
      '11 “Blessed are you when others revile you and persecute you and utter all kinds of evil against you falsely on my account. ',
      '12 Rejoice and be glad, for your reward is great in heaven, for so they persecuted the prophets who were before you.\n' +
        '\n' +
        'Salt and Light\n' +
        '\n' +
        '  ',
      '13 “You are the salt of the earth, but if salt has lost its taste, how shall its saltiness be restored? It is no longer good for anything except to be thrown out and trampled under people’s feet.\n' +
        '\n' +
        '  ',
      '14 “You are the light of the world. A city set on a hill cannot be hidden. ',
      '15 Nor do people light a lamp and put it under a basket, but on a stand, and it gives light to all in the house. ',
      '16 In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.\n' +
        '\n' +
        'Christ Came to Fulfill the Law\n' +
        '\n' +
        '  ',
      '17 “Do not think that I have come to abolish the Law or the Prophets; I have not come to abolish them but to fulfill them. ',
      '18 For truly, I say to you, until heaven and earth pass away, not an iota, not a dot, will pass from the Law until all is accomplished. ',
      '19 Therefore whoever relaxes one of the least of these commandments and teaches others to do the same will be called least in the kingdom of heaven, but whoever does them and teaches them will be called great in the kingdom of heaven. ',
      '20 For I tell you, unless your righteousness exceeds that of the scribes and Pharisees, you will never enter the kingdom of heaven.\n' +
        '\n' +
        'Anger\n' +
        '\n' +
        '  ',
      '21 “You have heard that it was said to those of old, ‘You shall not murder; and whoever murders will be liable to judgment.’ ',
      '22 But I say to you that everyone who is angry with his brother will be liable to judgment; whoever insults his brother will be liable to the council; and whoever says, ‘You fool!’ will be liable to the hell of fire. ',
      '23 So if you are offering your gift at the altar and there remember that your brother has something against you, ',
      '24 leave your gift there before the altar and go. First be reconciled to your brother, and then come and offer your gift. ',
      '25 Come to terms quickly with your accuser while you are going with him to court, lest your accuser hand you over to the judge, and the judge to the guard, and you be put in prison. ',
      '26 Truly, I say to you, you will never get out until you have paid the last penny.\n' +
        '\n' +
        'Lust\n' +
        '\n' +
        '  ',
      '27 “You have heard that it was said, ‘You shall not commit adultery.’ ',
      '28 But I say to you that everyone who looks at a woman with lustful intent has already committed adultery with her in his heart. ',
      '29 If your right eye causes you to sin, tear it out and throw it away. For it is better that you lose one of your members than that your whole body be thrown into hell. ',
      '30 And if your right hand causes you to sin, cut it off and throw it away. For it is better that you lose one of your members than that your whole body go into hell.\n' +
        '\n' +
        'Divorce\n' +
        '\n' +
        '  ',
      '31 “It was also said, ‘Whoever divorces his wife, let him give her a certificate of divorce.’ ',
      '32 But I say to you that everyone who divorces his wife, except on the ground of sexual immorality, makes her commit adultery, and whoever marries a divorced woman commits adultery.\n' +
        '\n' +
        'Oaths\n' +
        '\n' +
        '  ',
      '33 “Again you have heard that it was said to those of old, ‘You shall not swear falsely, but shall perform to the Lord what you have sworn.’ ',
      '34 But I say to you, Do not take an oath at all, either by heaven, for it is the throne of God, ',
      '35 or by the earth, for it is his footstool, or by Jerusalem, for it is the city of the great King. ',
      '36 And do not take an oath by your head, for you cannot make one hair white or black. ',
      '37 Let what you say be simply ‘Yes’ or ‘No’; anything more than this comes from evil.\n' +
        '\n' +
        'Retaliation\n' +
        '\n' +
        '  ',
      '38 “You have heard that it was said, ‘An eye for an eye and a tooth for a tooth.’ ',
      '39 But I say to you, Do not resist the one who is evil. But if anyone slaps you on the right cheek, turn to him the other also. ',
      '40 And if anyone would sue you and take your tunic, let him have your cloak as well. ',
      '41 And if anyone forces you to go one mile, go with him two miles. ',
      '42 Give to the one who begs from you, and do not refuse the one who would borrow from you.\n' +
        '\n' +
        'Love Your Enemies\n' +
        '\n' +
        '  ',
      '43 “You have heard that it was said, ‘You shall love your neighbor and hate your enemy.’ ',
      '44 But I say to you, Love your enemies and pray for those who persecute you, ',
      '45 so that you may be sons of your Father who is in heaven. For he makes his sun rise on the evil and on the good, and sends rain on the just and on the unjust. ',
      '46 For if you love those who love you, what reward do you have? Do not even the tax collectors do the same? ',
      '47 And if you greet only your brothers, what more are you doing than others? Do not even the Gentiles do the same? ',
      '48 You therefore must be perfect, as your heavenly Father is perfect.\n' +
        '\n' +
        'Giving to the Needy\n' +
        '\n' +
        '  '
    ],
    '6': [
      '1 “Beware of practicing your righteousness before other people in order to be seen by them, for then you will have no reward from your Father who is in heaven.\n' +
        '\n' +
        '  ',
      '2 “Thus, when you give to the needy, sound no trumpet before you, as the hypocrites do in the synagogues and in the streets, that they may be praised by others. Truly, I say to you, they have received their reward. ',
      '3 But when you give to the needy, do not let your left hand know what your right hand is doing, ',
      '4 so that your giving may be in secret. And your Father who sees in secret will reward you.\n' +
        '\n' +
        'The Lord’s Prayer\n' +
        '\n' +
        '  ',
      '5 “And when you pray, you must not be like the hypocrites. For they love to stand and pray in the synagogues and at the street corners, that they may be seen by others. Truly, I say to you, they have received their reward. ',
      '6 But when you pray, go into your room and shut the door and pray to your Father who is in secret. And your Father who sees in secret will reward you.\n' +
        '\n' +
        '  ',
      '7 “And when you pray, do not heap up empty phrases as the Gentiles do, for they think that they will be heard for their many words. ',
      '8 Do not be like them, for your Father knows what you need before you ask him. ',
      '9 Pray then like this:\n' +
        '\n' +
        '    “Our Father in heaven,\n' +
        '    hallowed be your name.\n' +
        '    ',
      '10 Your kingdom come,\n' +
        '    your will be done,\n' +
        '        on earth as it is in heaven.\n' +
        '    ',
      '11 Give us this day our daily bread,\n    ',
      '12 and forgive us our debts,\n' +
        '        as we also have forgiven our debtors.\n' +
        '    ',
      '13 And lead us not into temptation,\n' +
        '        but deliver us from evil.\n' +
        '    \n' +
        '    \n' +
        '      ',
      '14 For if you forgive others their trespasses, your heavenly Father will also forgive you, ',
      '15 but if you do not forgive others their trespasses, neither will your Father forgive your trespasses.\n' +
        '\n' +
        'Fasting\n' +
        '\n' +
        '  ',
      '16 “And when you fast, do not look gloomy like the hypocrites, for they disfigure their faces that their fasting may be seen by others. Truly, I say to you, they have received their reward. ',
      '17 But when you fast, anoint your head and wash your face, ',
      '18 that your fasting may not be seen by others but by your Father who is in secret. And your Father who sees in secret will reward you.\n' +
        '\n' +
        'Lay Up Treasures in Heaven\n' +
        '\n' +
        '  ',
      '19 “Do not lay up for yourselves treasures on earth, where moth and rust destroy and where thieves break in and steal, ',
      '20 but lay up for yourselves treasures in heaven, where neither moth nor rust destroys and where thieves do not break in and steal. ',
      '21 For where your treasure is, there your heart will be also.\n\n  ',
      '22 “The eye is the lamp of the body. So, if your eye is healthy, your whole body will be full of light, ',
      '23 but if your eye is bad, your whole body will be full of darkness. If then the light in you is darkness, how great is the darkness!\n' +
        '\n' +
        '  ',
      '24 “No one can serve two masters, for either he will hate the one and love the other, or he will be devoted to the one and despise the other. You cannot serve God and money.\n' +
        '\n' +
        'Do Not Be Anxious\n' +
        '\n' +
        '  ',
      '25 “Therefore I tell you, do not be anxious about your life, what you will eat or what you will drink, nor about your body, what you will put on. Is not life more than food, and the body more than clothing? ',
      '26 Look at the birds of the air: they neither sow nor reap nor gather into barns, and yet your heavenly Father feeds them. Are you not of more value than they? ',
      '27 And which of you by being anxious can add a single hour to his span of life? ',
      '28 And why are you anxious about clothing? Consider the lilies of the field, how they grow: they neither toil nor spin, ',
      '29 yet I tell you, even Solomon in all his glory was not arrayed like one of these. ',
      '30 But if God so clothes the grass of the field, which today is alive and tomorrow is thrown into the oven, will he not much more clothe you, O you of little faith? ',
      '31 Therefore do not be anxious, saying, ‘What shall we eat?’ or ‘What shall we drink?’ or ‘What shall we wear?’ ',
      '32 For the Gentiles seek after all these things, and your heavenly Father knows that you need them all. ',
      '33 But seek first the kingdom of God and his righteousness, and all these things will be added to you.\n' +
        '\n' +
        '  ',
      '34 “Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble.\n' +
        '\n'
    ]
  }
  matthew['Matthew'] = textdemo;
// Generate a unique ID for this session based on date and time
const demoId = new Date().toLocaleDateString() + 'Time since 1970 ' + new Date().getTime(); 
// Import the Express framework using ESM syntax

import express from 'express'; 
// Import the JSON Web Token library
import jWebTk from 'jsonwebtoken'; 
// Import cookie-parser for handling browser cookies
import cookieParser from 'cookie-parser'; 
// Import file system stream utilities
import { createWriteStream } from 'fs'; 
// Import morgan for HTTP request logging
import morgan from 'morgan'; 
// Import body-parser to process incoming request bodies
import bodyParser from 'body-parser'; 
// Import CORS to allow cross-origin resource sharing
import cors from 'cors'; 
// Import the Supabase client creation function
import { createClient } from '@supabase/supabase-js'; 
import { redis, RedisMananger } from './logic.js';
import { resolve } from 'dns';
import FileLogger from './Logger.js';
// Import OS information utilities
const DataBaseServiceKey = process.env.SQL_KEY // Supabase publicKEY
const DBurlKey = process.env.URL_KEY_DB // Supabase URL
// Set the debug flag to control logging verbosity
const debug = true; 
// Redefine console.debug to only log if the debug flag is true
console.debug = function(...args) { if(debug) console.log(...args); }; 
export const  IS_DEV_MODE = !(process.env.NODE_ENV === 'production')
// Log the generated session ID
console.log('id', demoId); 
const supabase = createClient(DBurlKey as string, DataBaseServiceKey as string)
// Access the JWT secret key from environment variables
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY; 
// Initialize the Express application instance
const app = express(); 
// Access the ESV API key from environment variables
const ESV_API_KEY = process.env.ESV_API_KEY; 
export const COOKIE_KEY = process.env.COOKIE_KEY
const logger = new FileLogger();
logger.clear();//clear the file for now 
console.log = (...args: any[]): void => {
  // Convert all arguments to a single string separated by spaces
  const message = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');

  logger.log(message); // Write the message to your log file

  // Optional: Uncomment the line below if you still want to see logs in the terminal too
  // originalConsoleLog(...args); 
};
/**
 * Your server logic continues below...
 * Ensure all other 'require' calls in the file are converted to 'import'
 */

// Initialize Supabase client

 // Initialize the Supabase client instance
//app.use(express.static('public')); // Serve static files (commented out)

const localUrl   = 'http://localhost:5173/';
const myUrl = 'https://gearfit89.github.io/Practice-TBQN-Quizzing/';
const resUrl = process.env.NODE_ENV === 'development' ?   localUrl: myUrl;
 // Parse JSON response safely
const PORT = process.env.PORT || 3000; // Define server port, using environment variable or default
const corsOptions = {
  // Specifies the allowed origins for CORS
  origin: ['http://localhost:5173','https://bible-quizzing.netlify.app','http://localhost:5174', 'https://gearfit89.github.io/Practice-TBQN-Quizzing/', 'http://localhost:8080','http://127.0.0.1:5500', 'http://127.0.0.1:5500/src'], // Allowed origins for CORS
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allows cookies and authorization headers
   // Status code for successful preflight requests
};


function generateRandomData(length:number) {
  // Create a container for 16 random bytes (128 bits)
  const array = new Uint8Array(length); 

  // Fill the array with cryptographically secure random numbers
  crypto.getRandomValues(array); 

  // The array now contains 16 random integers between 0 and 255
  console.log(array); 
  
  // Example: Convert to a Hex string for tokens or IDs
  const hexString = Array.from(array)
    .map(b => b.toString(16).padStart(2, '0')) // Convert each byte to hex
    .join(''); // Join them into one string

  return hexString;
}  

function createJwtCookie(res:any, req:any,  newJwt=false, data:Record<string, any>) {
  // Determine the secret key to use for signing or verifying
  const KEY = data.key || process.env.JWT_ACCESS_KEY; 

  // Branch logic: create a new token if newJwt is true
  if (newJwt) {
    try {
      // Create a signed token using the data provided; data is converted to a string
      const token = jWebTk.sign(JSON.stringify(data.payload), KEY as string); 
      console.log('sigining data', data, 'token ' , token)
      
      // Attach the token to the response object as a cookie
      res.cookie(data.name, token, {
        // Set the lifetime of the cookie (90 days)
        maxAge: data.age || 90 * 24 * 60 * 60 * 1000, 
        // Prevent client-side JavaScript from accessing the cookie for security
        httpOnly: true, 
      //signed: process.env.NODE_ENV === 'production',
        // Ensure cookies are only sent over HTTPS in production
        secure: process.env.NODE_ENV === 'production', 
        // Mitigate Cross-Site Request Forgery (CSRF) attacks
        sameSite: IS_DEV_MODE ?'lax':'strict' 
      });

      // Indicate successful creation
      return `success with ${data.name} cookie`; 
    } catch (error) {
      // Return false if signing fails
      return `${error} with ${data.name} cookie`
    }
  }
}












//--------------------Middle ware-------------------------------------
// 1. Create a Write Stream for the Log File
// This stream will append all log output to the file 'app.log' in the current directory.
const accessLogStream = createWriteStream('./app.log', { 
    flags: 'a' // 'a' means append, ensuring old logs are not overwritten.
});
















// 2. Configure Morgan to use the Custom Stream
// 'combined' is a standard Apache log format string.
// The 'stream' option pushes Morgan's output from the console to our file stream.
app.use(morgan('combined', { 
    stream: accessLogStream // Use the file stream for logging
}));
//app.use(cookieParser.JSONCookies())

// Middleware to read and log cookies
//app.use(createJwtCookie);   
app.use(cookieParser(COOKIE_KEY))
app.use(cors(corsOptions)); // Apply CORS middleware to Express app
app.use(bodyParser.json()); // Middleware to parse incoming JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Custom middleware to add errors to the response JSON object
// Using the root endpoint (e.g., https://quizzing-serverd.onrender.com/)
app.get('/', (req:any, res:any) => { // Respond to root path
  res.status(200).send('OK, the serveer is running'); // Send 200 status to stop 502 errors
});

// Using a dedicated health endpoint (e.g., https://quizzing-serverd.onrender.com/health)
app.get('/health', (req:any, res:any) => { // Respond to health path
  res.status(200).json({ status: 'UP', timestamp: new Date() }); // Return JSON status
});

// --- AUTHENTICATION FUNCTIONS ---

/**
 * Handles user sign-up (Supabase Auth).
 * Profile creation is now handled by a database trigger (handle_new_user_with_username).
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} username - The user's desired username.
 * @returns {{er: string, sucess: boolean}} - Error message or success status.
 */
async function handleUserSignUp (email: string, password: string, username: string, supabase: any) {
    const {error:usernameEr} = await supabase.from('profiles').select('*').eq('username', username).single()
    if(!usernameEr){ console.log('usern taken'); return {er: 'username already taken', sucess:false, errorCode:'6'}}
    let userid;
    try {
        // Step 1: Sign up the user with Supabase Auth
        // The username is passed in the options, which saves it in the 'raw_user_meta_data'
        // column of the auth.users table. The database trigger will read it from here.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email, // User email
            password, // User passwor // Embed username into user metadata for the trigger
        });

        if (authError) {
            console.error('Supabase Sign-Up Error:', authError.message); // Log authentication error
            return { er: authError.message, sucess: false,  errorCode:'7'}; // Return error message
        }
        //console.log('success', 'id', authData.id)
        userid = authData.user.id


      
        // Profile creation is now handled by the database trigger (RLS bypass)
        //return { sucess: true }; // Return success status after successful authentication
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('Error signing up user:', errorMessage); // Log general server/network error
        return { er: errorMessage, msg: 'Database error saving new user', sucess: false, errorCode:'8' }; // Return generic error
    }
 

    try{
        console.log(userid)
        const {data, error:errorUsernameusername} = await supabase.from('profiles').insert([{id:userid, username:username, email:email}])
        if(errorUsernameusername){
            console.error('Supabase username Error:', errorUsernameusername.message); // Log authentication error
            return { er: errorUsernameusername.message, sucess: false , errorCode:'9'}; // Ret

        }
        console.log('success in saving username')

        return {er:false, sucess:true, dataSet:{name:'accessToken', payload:{ id:userid, username: username, email}}}
    }catch(e){
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('error with adding username', errorMessage)
        return { er: errorMessage, sucess: false,  errorCode:'10' };
    }

};

/**
 * Handles user login with Supabase.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {{er: string, sucess: boolean, token: string}} - Error message, success status, and session token.
 */
async function handleUserLogin (email: string, password: string, supabase: any) {
   
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email, // User email
            password: password, // User password
        });

        if (error) {
            console.error('Supabase Login Error:', error.message); // Log login error
            return { er: error.message, sucess: false, errorCode:'11' }; // Return error
        }
         const userId =  data.user.id; 
         const {data:username, error:usernameError} = await supabase.from('profiles').select('username').eq('id', userId).single()
        // Return success with the session access token
        console.log( 'username:', username.username)
        if(usernameError)    return { er: 'Username error during login', sucess: false, errorCode:'13' };
        return { sucess: true, token: data.session.access_token, er:false, dataSet:{name:'accessToken', payload:{ id:userId, username: username.username, email}}}// Return success and access token

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('Error logging in user:', errorMessage); // Log general error
        return { er: 'Server error during login', sucess: false, errorCode:'12' }; // Return generic error
    }

};

// --- MIDDLEWARE FOR ACCOUNT VALIDATION ---

// Middleware to check validity of user input before hitting Supabase
const checkVaildAccountInfo = (req: any, res: any, next: any) => {
    const resjson: Record<string, any> = {} // Object to hold JSON response data
    resjson.errors = []; // Clear previous errors array

    const AccountData = req.body; // Get request body data
const passWord = AccountData.password
    // 1. Check Password Length (Supabase minimum is 6)
    if (AccountData.password.length < 6) {
        req.errorCode = '1'
        //addErrors(['password', 'Password must be at least 6 characters long'], resjson); // Add password error
    }
const passwRegex =  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\-]).{6,40}$/;
if(passwRegex.test(passWord)){
console.log('success with password')
}else{
req.errorCode = '2'
}
    // 2. Check Username Length
    if (AccountData.username.length > 30) {
        req.errorCode = '3'
        //addErrors(['username', `Username has got to be at most 15 characters long`], resjson); // Add username length error
    }

    // 3. Check Email Format
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email validation regex
    const email = AccountData.email; // Get email from request
    if (!regex.test(email) && email) { // Check email format if email is provided
        req.errorCode = '4'
    }

    // If any validation errors were found, stop execution and send 409 status
    if (req.errorCode) {
        console.error('data is not vaild', req.errorCode)
        res.status(409).json({error:req.errorCode})
        // Send 409 status with specific validation errors
        return; // Stop middleware chain
    }
    resjson.worked = ['vaild_info']
req.resJson = resjson;
    next(); // Continue to the route handler
};

// --- ROUTES ---

// Route for creating a new user account
app.post('/createAccount', checkVaildAccountInfo,  async(req, res, next) => {
   
    const AccountData = req.body; // Get account data
    const { er, sucess, errorCode, dataSet } = await handleUserSignUp(AccountData.email, AccountData.password, AccountData.username, supabase); // Call sign-up function

    if (sucess) {
        console.log('all sucess')
        const resJson:Record<string, any>=  {}
       
        resJson.sucess = 'Account Created'; // Set success message
        try{
        await updateTokens(supabase, dataSet?.payload.id, res)
        console.log('success with vookis')
        }catch(e){
        console.log(e, 'error'); // Log the error
        console.log(`${resUrl}create_account.html#${errorCode}`)
        res.status(409)
        res.json({error:e, message:er, errorCode})
        }
        res.status(202);
        //res.json({success:true, data:resJson})
        console.log('sent data', {success:true, data:resJson}) 
         res.json( {success:true, data:resJson})
    }
    else {
        //addErrors(['global', er]); // Add Supabase error to global errors
        console.log('glo', errorCode, er); // Log the error
        console.log(`${resUrl}create_account.html#${errorCode}`)
        res.status(409)
        res.json({error:errorCode, message:er})
        //console.warn( 'error code')// Send 400 status with Supabase error
    }
});

// Route for user login
app.post('/login',  async (req: any, res: any) => {
  
    const AccountData = req.body; // Get account data
    const { sucess, errorCode , dataSet} =  await handleUserLogin(AccountData.email, AccountData.password, supabase); // Call login function
console.log(sucess, 'log in')

    if (sucess && dataSet) {
  await  updateTokens(supabase, dataSet?.payload.id, res)
        console.log('success with vookis') 
        console.log('log in good')
        res.status(200) // Send success status with token
        res.json({success:true})
    } else {
        console.error('log send failed')
        res.status(400);
        res.json({error:errorCode, errorCode}); // Send 401 status on failure with error message
      }
});
console.log('hi app is running')
// Start the server
const quizMonths = [
  ['october', ['1', '2', '3', '4', '5'], 'Matthew'], 
  ['november', ['6', '7', '8', '9'], 'Matthew'], 
  ['december', ['10', '11', '12'], 'Matthew'], 
  ['january', ['13', '14'], 'Matthew'], 
  ['february', ['15', '16'], 'Matthew'], 
  ['march', ['Jonah'], 'Jonah']
];
/*const searchParams = new URLSearchParams(params); 
      searchParams.set('q', query); // Add the query to the search parameters
      
  try{
      // FIX: Added 'https://api.' to the URL for correct protocol and domain
    const response = await fetch(`https://api.esv.org/v3/passage/${endpoint}?${searchParams.toString()}`, {
        headers:{ */
// app.get('/modules/:month', async (req, res)=>{
//     console.log('rreq startedb')
//    const userInMonth = req.params.month //or for app.get use req.params.month
//   const month = quizMonths.find(Month=>Month[0] === userInMonth)
//   if(!month) {res.status(409).send('month not vaild'); return; }
//      const book = month[2];
//      const Maxchp = month[1][month[1].length -1];
//      const minChp = month[1][0]
     
//   const passageQuery = `${book}+${minChp}-${Maxchp}`;
//   async function getPassages(query='Matthew 1-3', params={
//     'include-headings': false,
//         'include-footnotes': false,
//             'include-chapter-numbers': true,
//         'include-short-copyright': true,
//         'include-passage-references': true,
//         'inline-styles':true

//   }, endpoint='text'){
// console.log('query', params)
//     ///params.q = query;
//     const _params = params;
//     const searchParams = new URLSearchParams(params); 
//       //SsearchParams.set('q', query);
//       console.debug('search params', searchParams.toString())
//       const url = `https:///api.esv.org/v3/passage/${endpoint}/?q=${query}&${searchParams.toString()}`
//       console.debug('url', url)
//   try{
//     const response = await fetch(url, {
//         headers:{
//             'Authorization': `Token ${ESV_API_KEY}`
//         },
         
        
    
//     })
//       if(response.ok){
//         const retrunedQuery = await response.json();
//         //console.log('success with getting passage from esv.org', retrunedQuery.passages[0] )
//         const passage = retrunedQuery.passages[0];
//         return { passage }

//       }else{
//         console.error('Error with getting passage', response.status)
//         const err = 'response not ok';
//         return { err }
//       }
   
//   } catch(e){
//     const errorMessage = e instanceof Error ? e.message : 'Unknown error';
//     console.error('error in geting passage from esv.org', errorMessage)
//     return { err: {message: errorMessage} }
// }

// }
  

// const {err, passage}  = await getPassages(passageQuery);

//  if(err){
//     console.error(err, 'error with esv api')
//     res.status(409).json({errors:'failded esv api'+ (err?.message || 'unknown error')})
//     return;
//  }
//  const sorted = (sortPassages as any)(passage, book, month[1]);
//  res.status(200).json(sorted);
// })

async function veifyTokens (sp: any, {accessToken, refreshToken, id}: any, res: any) {
  console.log('---string vefity--\n')
  try{
    if(!refreshToken || !id) {return {error:' refresh token not there or id not there', verified:false ,update:0}}
  const {data, error:a} = await sp.from('profiles').select('access_id, session_id').eq('id', id).single();
 
  if(a){ return { error:'error',  verified:false ,update:0}};
  if(!data){
    return {error:'data token is missing',  verified:false ,update:0}
 }
  const {session_id, access_id} = data;
  console.log(data, 'upd saup virg data', refreshToken, accessToken);
  console.log('compare refrsh', session_id.replaceAll('"', '') , 'vs', refreshToken.replaceAll('"', '') as string )
   console.log(access_id.replaceAll('"', '') , 'access vs', accessToken  as string )
 if( session_id.replaceAll('"', '') !== refreshToken.replaceAll('"', '') as string) {return {error:' refresh token are not equal', verified:false ,update:0}}
console.warn('refresh equl;;;;;;;;;;;;;;;;;;')
 if(accessToken  && accessToken === access_id ){
  return {verified:true, update:0}

 }else if(!accessToken ){
 const {success, error} =  await updateTokens(sp, id, res)
 if(error) return { error, verified:false, update:-1};
 return {verified:true, update:1}
 }else if(accessToken.replaceAll('"', '') !== access_id){
  return {error:'access token is not equal', verified:false ,update:0}


 }
}
 catch(e){
  const errorMessage = e instanceof Error ? e.message : 'Unknown error';
  return {error:errorMessage, verified:false ,update:0}}
}
async function updateTokens (sp: any, id: any, res: any) {
  
try{
console.log('update data', id);
const newRefresh = {token:generateRandomData(32), id};
const newAccess = generateRandomData(32);
const refreshData: Record<string, any> = {name:'refreshToken', payload:newRefresh, age: 90 * 24 *60 *60 *1000, user_id:id}//90 days

  const accessData: Record<string, any> = { name:'accessToken', payload:newAccess, age:  24 *60 *60 *1000, user_id:id}//1 day
createJwtCookie(res, null, true, refreshData)
  createJwtCookie(res, null, true, accessData)
console.log('updates', refreshData, newRefresh, 'a time', accessData, newAccess)
const { error:err}  = await sp.from('profiles').update({access_id:accessData.payload, session_id:refreshData.payload.token}).eq('id', id)

if(err) return { error:'error'};
return { success:true }
}catch(e){
const errorMessage = e instanceof Error ? e.message : 'Unknown error';
return {error:errorMessage }
}
}



                                            
app.get('/session',async (req: any, res: any)=>{
  const cookies = req.cookies //req.signedCookies
  console.log('--session apemt--', req.cookies, 'sogned', req.signedCookies, cookies.accessToken)
 let userId = req.ip; // Assign the request IP address to the userId variable
let attempts = 0; // Initialize a counter to track the number of polling attempts
const maxAttempts = 6; // Set the maximum number of times to check before giving up

while (await redis.exists('user:' + userId + ':pendingSession') && attempts < maxAttempts) { // Check if the lock exists and we haven't timed out
 if (attempts >= 7){res.status(409);console.warn('too many trys');res.json({error:'too many apemts  ',signIn:false, success:false, data:{}});return;}

  await new Promise((resolve) => setTimeout(resolve, 2000)); // Pause execution for 2000ms before the next check
  attempts++; // Increment the attempt counter
}

await redis.set('user:' + userId + ':pendingSession', 'true', 'EX', 10); // Set the lock with a 10-second automatic expiration for safety
  try{
    
    
  const accessTokenStr= cookies.accessToken || '';
    const refreshTokenStr = jWebTk.verify(cookies.refreshToken, JWT_ACCESS_KEY as string) 
  if(!refreshTokenStr){ res.status(405);res.json({error:'refresh missing', signIn:false, success:false, data:{}});console.error('refremis');return;}
  const accessToken =  accessTokenStr === '' ?false:jWebTk.verify(accessTokenStr, JWT_ACCESS_KEY as string) as string
    const refreshToken =    typeof refreshTokenStr ==='string'? JSON.parse(refreshTokenStr || '{}') : refreshTokenStr
  
  
  if( !refreshToken.id){ res.status(409);res.json({error:'refresh id is missing',signIn:false, success:false, data:{}});return;}
  
   const {token, id} = refreshToken
  
 const result = await veifyTokens(supabase, {accessToken, refreshToken:token, id}, res)
 const {error, update, verified} = result || {}

if(error) console.error(error)
  if(error){ res.status(408); res.json({error, signIn:false, success:false, data:{}});return;}
if(update === 1) {res.json({status:'updated', signIn:true});return;}
res.json({success:true, signIn:true, status:'success with access'})
console.log('success with session v:', verified, accessToken, id, )
  }catch(e){
    console.error(e, 'err at get sesion')
    res.status(410);
    res.json({error:e, signIn:false, success:false, data:{}})
  }
 await  redis.del('user:'+userId+':pendingSession')
})






/*async function name(book, minChp, Maxchp) {
    

const passageQuery = `${book}+${minChp}-${Maxchp}`;

   console.log('passage query', passageQuery)

  
 


//const {err, passage}  = await getPassages('Matthew+5-6')
const passage = matthew
const {esvText, sections} = sortPassages(passage, 'Matthew', ['5', '6'])
try{
//console.log('esv text', esvText.Matthew)
}catch(e){
    console.error('error with esv text', e)
}
console.log('sections', sections)
//console.log(err, passage)
}
//na



*/ 

export { 
    // Export the database URL key
    DBurlKey, 
    // Export the database service key
    DataBaseServiceKey, 
    // Export the JWT secret key
    JWT_ACCESS_KEY, 
    // Export the utility to create JWT cookies
    createJwtCookie, 
    // Export the validation middleware
    checkVaildAccountInfo, 
    // Export the sign-up handler
    handleUserSignUp, 
    // Export the login handler
    handleUserLogin, 
    // Export the initialized Supabase instance
    supabase, 
    // Export the Express application instance
    app, 
    // Export the defined server port
    PORT 
};