# Quiz-server
Back end design for my website in node js and express js
answer, jumpTime, status, req --like in data { data:{userrid:{status:?, req:?, jumpTime:?}} }
most data will need to be json.parse for redis keys--
data from serever when frined sent {req, username}
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
