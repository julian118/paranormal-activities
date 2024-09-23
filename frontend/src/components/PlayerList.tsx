import Player from "../models/Player.model";

interface PlayerListProps {
  players: Player[];
}
const PlayerList: React.FC<PlayerListProps> = (props) => {
  return (
    <>
      <h1>playerlist:</h1>
        <hr />
      <ul className="list-group">
        {props.players.map((player, index) => (
          <li key={player.name} className="list-group-item">
            {index + 1}.&nbsp;
            {player.name}

            {player.isPartyLeader ? " 👑" : null}
          </li>
        ))}
      </ul>
    </>
    
  );
};

export default PlayerList;
