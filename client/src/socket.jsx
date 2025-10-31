import { io } from "socket.io-client";


const socket = io("https://mini-chat-app-4.onrender.com", {
  transports: ["websocket"],
});

export default socket;
