import logo from '../assets/paranormal-logo.png';
import { motion } from "framer-motion";
import './lobby.css';
import { useEffect } from 'react';
import Room from '../models/Room.model';
import { Link } from 'react-router-dom';
import PlayerList from '../components/PlayerList';

type LobbyProps = {
  room?: Room;
  createRoom: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ room, createRoom }) => {
  const hover = {
    y: [-15, -35, 0, -30, 0, -15],
    rotate: [0, 5, -5, -5, 5, 0],
    color: ['black', 'black', 'crimson', 'crimson']
  };

  const hoverTransition = {
    duration: 12,
    ease: "easeInOut",
    repeat: Infinity
  };

  useEffect(() => {
    if (!room) {
        createRoom()
    }
  }, [room, createRoom]);

  if (!room) {
    return(
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>)
  }

  return (
    <div className="d-flex align-items-center flex-column">
    <Link to="/">back to home</Link>
      <img src={logo} alt="" className='main-logo' />
      <div className='d-flex justify-content-space-evenly'>
        <h1>enter room code: </h1>
        <motion.h1 
          animate={hover}
          transition={hoverTransition}
          className='room-code'>
          {room!.roomCode}
        </motion.h1>
      </div>
      <br />
        <PlayerList players={room.playerList}></PlayerList>
    </div>
  );
};

export default Lobby;
