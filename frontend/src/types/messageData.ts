import Player from "../models/Player.model";
import Room from "../models/room.model";

export default interface MessageData {
    event: string;
    room?: Room;
    player?: Player;
    isError?: boolean;
    details?: string;
    message?: string;
    placeholder?: string;
  }