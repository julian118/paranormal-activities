import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

const backendUrl = "ws://localhost:8080/start_host_web_socket"

export const useWebSocketConnection = () => {
   const [lastMessageData, setLastMessageData] = useState(null)
   
   const { sendMessage, lastMessage, readyState } = useWebSocket(
      backendUrl,
      {
         share: true, 
         shouldReconnect: () => false
      }
   )

   // Handle received WebSocket messages
   useEffect(() => {
      if (lastMessage !== null) {
         try {
            const parsedData = JSON.parse(lastMessage.data)
            setLastMessageData(parsedData)
         } catch (error) {
            console.error("Failed to parse WebSocket message", error)
         }
      }
   }, [lastMessage])

   return {
      sendMessage,
      lastMessageData,
      readyState,
   }
}
