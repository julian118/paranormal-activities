import { useEffect, useState } from "react"
import { SendMessage } from "react-use-websocket"
import Room from "../../models/Room.model"
import Player from "../../models/Player.model"
import Timer from "../../components/timer/timer"
import { useNavigate } from "react-router-dom"
import './game.css'
import { getPlayerNameList } from '../utils/playerUtils'


interface gameProps {
    sendMessage: SendMessage
    room: Room
}
const Game: React.FC<gameProps> = (props) => {
    const [gameScreen, setGameScreen] = useState<JSX.Element>(<h1>nothing</h1>)
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const navigate = useNavigate()

    useEffect(() => {
        if (!props.room) {
          navigate('/');
        }
      }, [props.room, navigate]);


    const awaitQuestionPrompt = () => {
        props.sendMessage(JSON.stringify({
            event: "input-message",
            playerNameArray: getPlayerNameList(props.room.playerList),
            roomcode: props.room.roomcode,
            message: "message here",
            placeholder: "placeholder"
          }))
        setGameScreen(
        <>
            <h1>answer the question on your device</h1>
            <Timer duration={25}/>
        </>)
    }

    return (
        <div className="game-container">
            {gameScreen}
        </div>
    )
}

export default Game
