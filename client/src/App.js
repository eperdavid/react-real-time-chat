import "./App.css";

//import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";

/* import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001"); */

function App() {

  /* const test = () => {
    socket.emit("test", {message: "Hello"});
  }  */


  return (
    <div className="App">
      <ChatPage />
    </div>
  );
}

export default App;
