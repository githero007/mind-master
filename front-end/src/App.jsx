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
        <PdfInput />
        <WebcamComponent />
        <Chatbot />
      </div>
    </>
  )
}

export default App
