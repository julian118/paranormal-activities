
import { Player } from "../models/player.model.ts"


export interface PlayerWebSocket extends WebSocket {
    player: Player
}


