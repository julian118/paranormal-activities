import React, { useState, useEffect, useRef, createContext } from 'react';
import useWebSocket from "react-use-websocket";
import Titlescreen from './pages/titlescreen';
import Settings from './pages/settings';
import Lobby from './pages/lobby';
import music from './assets/ominous.mp3';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Room from './models/Room.model';
import MessageData from './types/messageData';

const backendUrl = "ws://localhost:8080";

function App() {
  const [room, setRoom] = useState<Room>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    backendUrl + "/start_host_web_socket",
    {
      share: true,
      shouldReconnect: () => false,
    },
  )

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      })
    }
  }

  const getDeviceId = () => {
    let deviceId: string | null = localStorage.getItem("deviceId");
    if (!deviceId) {
      let newDeviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", newDeviceId);
      deviceId = newDeviceId;
    }
    return deviceId;
  }

  const createRoom = () => {
    console.log('tryna make a room bitches')
    sendMessage(
      JSON.stringify({
        event: "create-room",
        deviceId: getDeviceId(),
      })
    )
  }

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData: MessageData = JSON.parse(lastMessage.data);
      console.log("Parsed message data:", messageData);
      setRoom(new Room(messageData.room!.roomCode, messageData.room!.playerList, messageData.room!.deviceId));  
    }
  }, [lastMessage]);

  useEffect(() => {
    if (location.pathname === '/') {
      playAudio();
    }
  }, [location.pathname])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" index element={<Titlescreen />} />
          <Route path="/settings" index element={<Settings />} />
          <Route path="/lobby" index element={
            <Lobby room={room} createRoom={createRoom} />
            } />
        </Routes>
      </BrowserRouter>
      <audio ref={audioRef} src={music} loop />
    </>
  )
}


export default App;
