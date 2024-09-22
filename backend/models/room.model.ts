import { Host } from "./host.model.ts"
import { Player } from "./player.model.ts"

export class Room {
  public roomCode: string
  public playerList: Map<string, Player>
  public host: Host

  constructor(
    roomCode: string,
    playerList: Map<string, Player>,
    host: Host,
  ) {
    this.roomCode = roomCode
    this.playerList = playerList
    this.host = host
  }

  toJSON() {
    return {
      roomCode: this.roomCode,
      playerList: Array.from(this.playerList.values()), // Convert Map to an array of key-value pairs
      host: this.host
    }
  }
}
