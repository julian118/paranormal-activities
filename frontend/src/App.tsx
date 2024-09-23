import { useEffect, useState } from "react";
import "./App.css";
import JoinRoomDetails from "./models/JoinRoomDetails.model.ts";
import useWebSocket from "react-use-websocket";
import PlayerList from "./components/PlayerList.tsx";
import MessageData from "./types/messageData.ts";
import Room from "./models/room.model.ts";
import Start from "./pages/Start.tsx";

enum GameState {
  Joining,
  Playing,
  Reconnecting,
  End 
}

const backendUrl = "ws://localhost:8080";
// const socketConnection = new WebSocket(backendUrl + "/start_web_socket");

export const App: React.FC = () => {
  const [gameState, setGameState] = useState(GameState.Joining);
  const [room, setRoom] = useState<Room>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [informativeMessage, setInformativeMessage] = useState<string | null>(null)

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    backendUrl + "/start_player_web_socket",
    {
      share: true,
      shouldReconnect: () => false,
    },
  );

  const getDeviceId = () => {
    let deviceId: string | null = localStorage.getItem("deviceId");
    if (!deviceId) {
      let newDeviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", newDeviceId);
      deviceId = newDeviceId;
    }
    return deviceId;
  };

  const joinGameHandler = (joinDetails: JoinRoomDetails) => {
    console.log(`sending: ${joinDetails}`);
    sendMessage(JSON.stringify({
      event: "join-room",
      roomCode: joinDetails.roomcode,
      name: joinDetails.name,
      deviceId: getDeviceId(),
    }));
  };

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const messageData: MessageData = JSON.parse(lastMessage.data);
        console.log("Parsed message data:", messageData);
        if (messageData.isError) {
          setErrorMessage(messageData.details!);
          return;
        }
        setErrorMessage(null)

        switch (messageData.event) {
          case "joined-room":
            setRoom(messageData.room);
            setGameState(GameState.Playing)
            break
          case "update-users":
            setRoom(messageData.room)
            break
          case "informative-message":
            setInformativeMessage(messageData.message!)
            break
          case "clear":
            setInformativeMessage(null)
        }

        
      } catch (error) {
        console.error("Failed to parse message data", error);
      }
    }
  }, [lastMessage]);

  return (
    <>
    {
      gameState == GameState.Joining 
      ? <Start onJoinRoom={joinGameHandler} errorMessage={errorMessage} />
      : null
    }
      <div className="container">
        {
          informativeMessage 
          ? <h4>{informativeMessage}</h4>
          : null
        }
      </div>
      <div className="container">
        {room
          ? <PlayerList players={room.playerList} />
          : <i>No room joined.</i>}
      </div>
    </>
  );
};

export default App;
