import { useEffect, useState } from "react"
import { SendMessage } from "react-use-websocket"
import Room from "../../models/Room.model"
import Player from "../../models/Player.model"
import Timer from "../../components/timer/timer"
import { useNavigate } from "react-router-dom"
import './game.css'

interface gameProps {
    sendMessage: SendMessage
    room: Room
}
const Game: React.FC<gameProps> = (props) => {
    const [gameScreen, setGameScreen] = useState<JSX.Element>(<h1>nothing</h1>)
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const navigate = useNavigate()
    
    function getPlayerNameList(playerList: Player[]): string[] {
        return playerList.map(player => player.name)
    }

    useEffect(() => {
        if (!props.room) {
          navigate('/');
        }
      }, [props.room, navigate]);

    useEffect(() => {
        const runGameFlow = async () => {
            displayExplanation()
            await sleep(5000)
            awaitQuestionPrompt()
            await sleep(25000)
            displayPlayerScores()
            await sleep(5000)  
        }

        runGameFlow()
    }, [])

    const displayExplanation = () => {
        setGameScreen(
            <>
                <h1>explanation</h1>
                <Timer duration={5}/>
            </>
        )
    }
    const awaitQuestionPrompt = () => {
        props.sendMessage(JSON.stringify({
            event: "input-message",
            playerNameArray: getPlayerNameList(props.room.playerList),
            roomCode: props.room.roomCode,
            message: "message here",
            placeholder: "placeholder"
          }))
        setGameScreen(
        <>
            <h1>answer the question on your device</h1>
            <Timer duration={25}/>
        </>)
    }
    const displayPlayerScores = () => {
        props.sendMessage(JSON.stringify({
            event: "clear-message",
            playerNameArray: getPlayerNameList(props.room.playerList),
            roomCode: props.room.roomCode,
          }))
        setGameScreen(<>
            <h1>player scores</h1>
            <Timer duration={5}/>
        </>)
    }
    
    const awaitPickBestQuestions = () => {

    }
    const awaitAnswer = () => {

    }
    const displayAnswer = () => {

    }
    const awaitVoting = () => {

    }

    return (
        <div className="game-container">
            {gameScreen}
        </div>
    )
}

export default Game
