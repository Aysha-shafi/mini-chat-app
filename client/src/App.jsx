import React, { useState } from "react";
import Join from "./components/Join";
import Chat from "./components/Chat";

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div>
      {!username ? <Join onJoin={setUsername} /> : <Chat username={username} />}
    </div>
  );
}

export default App;
