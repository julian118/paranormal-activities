import React, { useState, useEffect, useRef, createContext } from 'react';
import Titlescreen from './pages/titlescreen';
import Settings from './pages/settings';
import Lobby from './pages/lobby';
import music from './assets/ominous.mp3';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      })
    }
  }

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
          <Route path="/lobby" index element={<Lobby />} />
        </Routes>
      </BrowserRouter>
      <audio ref={audioRef} src={music} loop />
    </>
  )
}


export default App;
