import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    // <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App;
