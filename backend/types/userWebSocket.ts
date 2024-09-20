import { Player } from "../models/player.model.ts"


interface UserWebSocket extends WebSocket {
    player: Player
  }

export type { UserWebSocket }