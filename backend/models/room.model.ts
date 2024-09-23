import { Host } from "./host.model.ts"
import { Player } from "./player.model.ts"

export class Room {
  public roomCode: string
  public playerList: Map<string, Player>
  public host: Host
  public allowQuit: boolean

  constructor(
    roomCode: string,
    playerList: Map<string, Player>,
    host: Host,
    allowQuit: boolean,
  ) {
    this.roomCode = roomCode
    this.playerList = playerList
    this.host = host
    this.allowQuit = allowQuit
  }

  toJSON() {
    return {
      roomCode: this.roomCode,
      playerList: Array.from(this.playerList.values()), // Convert Map to an array of key-value pairs
      host: this.host,
      allowQuit: this.allowQuit,
    }
  }
}
