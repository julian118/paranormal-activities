import Player from "../models/Player.model";

interface PlayerListProps {
    players: Player[];
}
const PlayerList: React.FC<PlayerListProps> = props => {
    return (
        <ol className="list-group list-group-numbered">
            {props.players.map(player => (
                <li key={player.name} className="list-group-item">
                    {player.name}

                    {player.isPartyLeader ? ' 👑' : null}
                </li>
            ))}
        </ol>
    )
}


export default PlayerList