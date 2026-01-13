import React from "react";
import { Routes, Route } from "react-router-dom";
import Chatbot from "./pages/Chatbot/Chatbot";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat" element={<Chatbot />} />
    </Routes>
    
  )
}

export default App;

