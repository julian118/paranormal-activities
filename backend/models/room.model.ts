import { Player } from "./player.model.ts"

export class Room {
  public roomCode: string
  public playerList: Map<string, Player>

  constructor(roomCode: string, playerList: Map<string, Player>) {
    this.roomCode = roomCode
    this.playerList = playerList
  }

  toJSON() {
    return {
      roomCode: this.roomCode,
      playerList: Array.from(this.playerList.values()), // Convert Map to an array of key-value pairs
    }
  }
}
