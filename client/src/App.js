import { useState } from "react";
import "./App.css";

import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";

import io from 'socket.io-client';
const socket = io('http://localhost:3001');

function App() {
  console.log("App");

  const login = (username) => {
    setPage(<ChatPage socket={socket} username={username} />)
  }

  const [page, setPage] = useState(<HomePage socket={socket} login={login} />);

  

  return (
    <div className="App">
      {page}
    </div>
  );
}

export default App;
