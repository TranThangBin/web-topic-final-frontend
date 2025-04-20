import { BrowserRouter as Router, Route, Routes } from "react-router";
import { LoginPage, RegisterPage } from "./components/auth-pages";
import { GameAddPage, GameHomePage } from "./components/game-pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game" element={<GameHomePage />} />
        <Route path="/game/new" element={<GameAddPage />} />
        <Route path="/game/:gameId" element={<GameAddPage />} />
      </Routes>
    </Router>
  );
}

export default App;
