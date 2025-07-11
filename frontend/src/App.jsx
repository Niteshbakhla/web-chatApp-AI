import ChatBox from "./components/ChatBox";
import AuthPages from "./pages/Auth";
import ChatApp from "./pages/Chat";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;