import { Host } from "./host.model.ts"
import { Player } from "./player.model.ts"

export class Room {
  public roomcode: string
  public playerList: Map<string, Player>
  public host: Host
  public allowQuit: boolean

  constructor(
    roomcode: string,
    playerList: Map<string, Player>,
    host: Host,
    allowQuit: boolean,
  ) {
    this.roomcode = roomcode
    this.playerList = playerList
    this.host = host
    this.allowQuit = allowQuit
  }

  toJSON() {
    return {
      roomcode: this.roomcode,
      playerList: Array.from(this.playerList.values()), // Convert Map to an array of key-value pairs
      host: this.host,
      allowQuit: this.allowQuit,
    }
  }
}
