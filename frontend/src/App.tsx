import { useEffect } from 'react'
import './App.css'
import Start from './pages/Start.tsx'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export const App: React.FC = () => {
  const backend_url = "ws://localhost:8080"
  // const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(backend_url)
    

  
  return (
    <>
      <Start></Start>
    </>
  )
}

export default App
