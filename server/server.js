import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Message from "./models/Message.js";
import gravatar from "gravatar";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", async (username) => {
  console.log(` ${username} joined`);

  
  const fakeEmail = `${username}@example.com`;
  const avatar = gravatar.url(fakeEmail, { s: "200", d: "retro" }, true);



 const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      existingUser.id = socket.id;
      existingUser.status = "online";
      existingUser.avatar = avatar;

    } else {
      users.push({ id: socket.id, username, status: "online" ,avatar});
    }
    io.emit("users-update", users);
    socket.emit("join-success", { username ,avatar});

   
    const messages = await Message.find().sort({ ts: 1 }).limit(50);
    socket.emit("message-history", messages);
  });

  
  socket.on("message", async (data) => {
    const newMessage = new Message({
      text: data.text,
      sender: data.sender,
      status: [{ user: data.sender, state: "sent" }],
    });
    await newMessage.save();

    
    newMessage.status = [
      ...newMessage.status,
      ...users.map((u) => ({ user: u.username, state: "delivered" })),
    ];
    await newMessage.save();

    io.emit("message", {
      _id: newMessage._id,
      text: newMessage.text,
      sender: newMessage.sender,
      ts: newMessage.ts,
      status: newMessage.status,
    });
  });

  socket.on("message-seen", async ({ messageId, username }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;

      const existing = msg.status.find((s) => s.user === username);
      if (existing) {
        existing.state = "seen";
        existing.ts = new Date();
      } else {
        msg.status.push({ user: username, state: "seen", ts: new Date() });
      }

      await msg.save();

      io.emit("message-seen", { messageId, username });
    } catch (err) {
      console.error("Error updating seen:", err.message);
    }
  });

  socket.on("typing", ({ username }) => {
    socket.broadcast.emit("typing", { username }); 
  });

  socket.on("stop-typing", ({ username }) => {
    socket.broadcast.emit("stop-typing", { username });
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
    const disconnectedUser = users.find((u) => u.id === socket.id);
    if (disconnectedUser) disconnectedUser.status = "offline";

    io.emit("users-update", users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
