# Quiz-server
The main server in my online Bible quizzing app. It provides an auth system, using supabase and my own cookie system. On the same port (300) exsits my websocket server that also verifies users. wss_funcs is where the funcs are designed to be called from the client.
## Project Structure

```
Quiz-server/
├── mainApp.js          # Express server setup
├── app.ts              # HTTP & WebSocket initialization
├── logic.ts            # Core quiz logic & Redis management
├── wss_functions.ts    # WebSocket message handlers
├── logic_scripts.js    # Question filtering & validation
└── nodemail            # Email template utilities
```

## Key Concepts

### Redis Data Structure
- **User Auth**: `user:{userId}` → Authentication tokens
- **User Profile**: `user:{username}` → Profile data
- **Room Data**: `room:{roomId}` → Active quiz sessions
- **Player States**: `room:{roomId}:players:states` → Real-time player status

### Server States
- `CONNECTING` → Establishing WebSocket
- `OPEN` → Ready for messages
- `RECONNECTING` → Attempting recovery
- `CLOSED` → Connection lost

### Quiz Data Format
```json
{
    "id": 1,
    "question": "Who was the father of Isaac",
    "answer": "Abraham",
    "ref": "Genesis 21:3",
    "month": "october"
}
```

## Quick Start for Contributors
1. Install dependencies: `npm install`
2. Set environment: `REDIS_HOST`, `REDIS_PORT`, `ESV_API_KEY`
3. Run: `npm run dev`
4. WebSocket connects on `/` with upgradable HTTP
