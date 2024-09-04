import { useState } from 'react'
import { PdfInput } from './components/main_pdf';
import { WebcamComponent } from './components/camera';
import { Chatbot } from './components/chatbot';
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
        <div className="pdf-container">  <PdfInput /></div>
        <div className="camera-container"><WebcamComponent /></div>
        <div className="chatbot-contaienr">  <Chatbot /></div>
      </div>
    </>
  )
}

export default App
