import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import Picker from "emoji-picker-react";

const Chat = ({ username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const joinedRef = useRef(false);
  const chatEndRef = useRef(null);

  
  useEffect(() => {
    if (!joinedRef.current) {
socket.emit("join", username);
      joinedRef.current = true;
    }

    socket.on("message-history", (data) => setMessages(data));
    socket.on("message", (data) => setMessages((prev) => [...prev, data]));
    socket.on("users-update", (data) => setUsers(data));

    socket.on("typing", (data) => setTypingUser(data.username));
    socket.on("stop-typing", () => setTypingUser(""));

   
    socket.on("message-seen", ({ messageId, username }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                status: [
                  ...(msg.status || []),
                  { user: username, state: "seen" },
                ],
              }
            : msg
        )
      );
    });

    return () => {
      socket.off("message-history");
      socket.off("message");
      socket.off("users-update");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("message-seen");
    };
  }, [username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { text: message, sender: username });
      setMessage("");
      socket.emit("stop-typing", { username });
      setShowEmojiPicker(false);
    }
  };

  //Typing handler
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { username });
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stop-typing", { username });
    }, 800);
  };

  //Emoji click handler
  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

 
  const markAsSeen = (messageId) => {
    socket.emit("message-seen", { messageId, username });
  };

  // 🔹 Format time
  const formatTime = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  
  const getTickIcon = (msg) => {
    if (!msg.status || msg.sender !== username) return null;
    const states = msg.status.map((s) => s.state);

   
    if (states.includes("seen")) {
      return (
        <span style={{ color: "#2196F3" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#2196F3"
            viewBox="0 0 16 16"
            style={{ verticalAlign: "middle", marginLeft: "5px" }}
          >
            <path d="M13.485 1.379l.708.708L5.207 11.073 1.5 7.366l.708-.708 3 3 8.277-8.279z" />
            <path d="M15.485 3.379l.708.708L7.207 13.073l-.708-.708L15.485 3.379z" />
          </svg>
        </span>
      );
    }

    
    if (states.includes("delivered")) {
      return (
        <span style={{ color: "gray" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="gray"
            viewBox="0 0 16 16"
            style={{ verticalAlign: "middle", marginLeft: "5px" }}
          >
            <path d="M13.485 1.379l.708.708L5.207 11.073 1.5 7.366l.708-.708 3 3 8.277-8.279z" />
            <path d="M15.485 3.379l.708.708L7.207 13.073l-.708-.708L15.485 3.379z" />
          </svg>
        </span>
      );
    }

   
    return (
      <span style={{ color: "gray" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="gray"
          viewBox="0 0 16 16"
          style={{ verticalAlign: "middle", marginLeft: "5px" }}
        >
          <path d="M13.485 1.379l.708.708L5.207 11.073 1.5 7.366l.708-.708 3 3 8.277-8.279z" />
        </svg>
      </span>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f7f9fb" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #ccc",
          padding: "15px",
          background: "#fff",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}> Users</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u) => (
  <li
    key={u.id}
    style={{
      margin: "6px 0",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <img
      src={u.avatar}
      alt={`${u.username}'s avatar`}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
    <span
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: u.status === "online" ? "green" : "red",
      }}
    ></span>
    <span>{u.username}</span>
  </li>
))}


        </ul>
      </div>

      {/* Chat Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "15px",
            background: "#eef3f8",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => markAsSeen(msg._id)}
              style={{
                marginBottom: "10px",
                textAlign: msg.sender === username ? "right" : "left",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background:
                    msg.sender === username ? "#d1e7dd" : "#ffffff",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                <strong>{msg.sender}</strong>
                <p style={{ margin: "5px 0" }}>{msg.text}</p>
                <small style={{ fontSize: "0.75rem", color: "gray" }}>
                  {formatTime(msg.ts)} {getTickIcon(msg)}
                </small>
              </div>
            </div>
          ))}

          {typingUser && (
            <p
              style={{
                fontStyle: "italic",
                color: "gray",
                marginBottom: "10px",
              }}
            >
               {typingUser} is typing...
            </p>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            background: "#fff",
            borderTop: "1px solid #ccc",
            position: "relative",
          }}
        >
          {/* Emoji button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            😊
          </button>

          
          {showEmojiPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "60px",
                left: "10px",
                zIndex: 10,
              }}
            >
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
