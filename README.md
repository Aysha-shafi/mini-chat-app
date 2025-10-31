# Architecture Overview

The app follows a client–server model with Socket.IO for bi-directional real-time communication.

### Frontend (Client)

- Built with React.

- Connects to the backend using Socket.IO client.

- Handles:

  - User login (username)

  - Real-time message rendering

  - Typing indicators

  - Emoji picker

  - Gravatar avatars

  - Message read receipts 

### Backend (Server)

- Built with Express.js and Socket.IO.

- Stores chat messages in MongoDB.

- Manages:

   - User connections (online/offline)

   - Broadcasting messages and typing updates

   - Handling read receipts

   - Generating Gravatar URLs for each user using their username-based email 

# Tech Stack

### Frontend:

- React

- Socket.IO Client

- Emoji Picker React

### Backend:

- Node.js

- Express.js

- Socket.IO

- MongoDB (via Mongoose)

- Gravatar

### Features

- ✅ Real-time messaging
- ✅ Online / Offline user tracking
- ✅ Typing indicator 
- ✅ Emoji picker support
- ✅ Message read receipts 
- ✅ Auto-generated avatars (via Gravatar)
- ✅ Message history (last 50 messages)

### Trade-offs and Design Decisions

- Gravatar Integration:
Simplified avatar system using username-based emails  instead of image uploads to avoid file handling complexity.

- Typing indicators:
Implemented using simple broadcast events — this avoids heavy message traffic but only supports one active indicator at a time.

- Read Receipts:
Implemented by tracking states (sent, delivered, seen) in MongoDB.
A trade-off is slight message update lag when persisting to the database.

- Message Persistence:
Only the last 50 messages are loaded at startup to balance speed and data size.

## 🚀 How to Run Locally
1️⃣ **Clone the repository**
```bash
git clone https://github.com/Aysha-shafi/mini-chat-app.git
cd mini-chat-app
```
2️⃣ **Install dependencies**

For both client and server:
```bash

cd client
npm install
cd ../server
npm install
```
3️⃣ **Setup environment variables**

Create a .env file inside the server/ folder:
```bash

MONGO_URI=your_mongodb_connection_string
PORT=3000
```
4️⃣ **Run the app**

In two separate terminals:
```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev

```

# Deployment Links
### Live Demo

🔗 https://mini-chat-app-5.onrender.com

### GitHub Repository

🔗 https://github.com/Aysha-shafi/mini-chat-app