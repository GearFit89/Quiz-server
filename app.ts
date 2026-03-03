import { app } from './mainApp.js'; // Import Express app
import { handleWsConnection } from './ws_connection.js'; // Import WS logic
import { WebSocketServer } from 'ws'; // Import WS server
import http from 'http'; // Import HTTP module
import fs from 'fs/promises'; // Import File System promises
import { Question } from './logic_scripts.js'; // Import Types

// Global variable for quiz data
let DATA: Question[] = []; 

/**
 * Loads the JSON data before the server starts listening.
 * This prevents the WebSocket logic from accessing an empty array.
 */
async function initializeData() { // Define initialization function
  try { // Start safety block
    const data = await fs.readFile('./json/questionsData.json', 'utf8'); // Read file
    DATA = JSON.parse(data); // Parse JSON string
    console.log(`Successfully loaded ${DATA.length} questions.`); // Log success
  } catch (error: any) { // Handle errors
    console.error('CRITICAL: Failed to load data:', error.message); // Log error
    process.exit(1); // Kill process on failure
  } // End catch
} // End function

const PORT = process.env.PORT || 3000; // Define port
const server = http.createServer(app as any); // Create HTTP server with Express
const wss = new WebSocketServer({ server }); // Attach WebSocket server to the HTTP server

// Initialize data then start the server
initializeData().then(() => { // Wait for JSON to load
  server.listen(PORT, () => { // Start listening on the port
    console.log(`Server running on port: ${PORT}`); // Log server status
    handleWsConnection(wss); // Initialize WebSocket handlers
  }); // End listen
}); // End initialization chain

export { DATA }; // Export data for other modules