import { Player } from "./player.model.ts"
import { Room } from "./room.model.ts"

export class BroadcastMessage {
  public event: string
  public room: Room
  public player?: Player

  constructor(event: string, room: Room, player?: Player) {
    this.event = event
    this.room = room
    this.player = player
  }
}
