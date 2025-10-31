import React, { useState } from "react";

const Join = ({ onJoin }) => {
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (username.trim()) {
      onJoin(username);
    }
  };

  return (
    <div className="join-screen" style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome to Mini Chat App </h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", marginTop: "20px" }}
      />
      <br />
      <button onClick={handleJoin} style={{ marginTop: "15px", padding: "10px 20px" }}>
        Join Chat
      </button>
    </div>
  );
};

export default Join;
