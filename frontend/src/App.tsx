import { useEffect, useState } from "react";
import "./App.css";
import Start from "./pages/Start.tsx";
import JoinRoomDetails from "./models/JoinRoomDetails.model.ts";
import useWebSocket from "react-use-websocket";
import Game from "./pages/Game.tsx";
import PlayerList from "./components/PlayerList.tsx";
import Player from "./models/Player.model.ts";

interface Room {
  roomCode: string;
  playerList: Player[];
  deviceId: string;
}

interface MessageData {
  event: string;
  room?: Room;
  player?: Player;
  isError?: boolean;
  details?: string;
}

enum ActivePage {
  Start,
  Game,
  Host,
}

const backendUrl = "ws://localhost:8080";
// const socketConnection = new WebSocket(backendUrl + "/start_web_socket");

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState(ActivePage.Start);
  const [room, setRoom] = useState<Room>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    backendUrl + "/start_web_socket",
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
        setErrorMessage(null);

        setRoom(messageData.room);
        setActivePage(ActivePage.Game);
      } catch (error) {
        console.error("Failed to parse message data", error);
      }
    }
  }, [lastMessage]);

  const pageSwitch = (activePage: ActivePage) => {
    switch (activePage) {
      case ActivePage.Game:
        return <Game></Game>;
      default:
        return (
          <Start onJoinRoom={joinGameHandler} errorMessage={errorMessage} />
        );
    }
  };
  return (
    <>
      {pageSwitch(activePage)}

      <div className="container">
        {room
          ? <PlayerList players={room.playerList} />
          : <i>No room joined.</i>}
      </div>
    </>
  );
};

export default App;
