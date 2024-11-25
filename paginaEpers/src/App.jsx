import { useState } from 'react'
import './App.css'
import Map from './components/MapaEspiritus'
import Mediums from './components/Medium'
import Espiritus from './components/Espiritu'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/mediums" element={<Mediums />} />
        <Route path="/espiritus" element={<Espiritus />} />
      </Routes>
    </Router>
    
  )
}

export default App
