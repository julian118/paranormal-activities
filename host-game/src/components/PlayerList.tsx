import './Playerlist.css'
import Player from "../models/Player.model"

interface PlayerListProps {
    players: Player[]
}
const PlayerList: React.FC<PlayerListProps> = (props) => {
    const maxPlayers: number = 10
    const minPlayers: number = 5
    const requirement: string = `${minPlayers - props.players.length} more required to start game`
    if (!PlayerList || PlayerList.length <= 0) {
        return (<><p>No players have joined</p></>)
    } else {
    return (
        <>
            <h2>joined players {props.players.length}/{maxPlayers}</h2> <br />
            <h2>{minPlayers > props.players.length ? requirement : 'waiting for party leader to start game'}</h2>
            <br />
            <ul className="player-list">
            {props.players.map((player, index) => (
            <li key={player.name} className={player.isPartyLeader ? "party-leader" : "player"}>
                {index + 1}.&nbsp;
                {player.name}
            </li>
            ))}
        </ul>
      </>
    )}
}

export default PlayerList