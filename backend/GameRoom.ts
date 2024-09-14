import { Player } from "./models/player.model.ts"
import { Room } from "./models/room.model.ts"

export default class GameRoom {
  //public players: Player[] = []
  public rooms: Map<string, Room> = new Map()

  logActiveData(): void {
    //console.log(this.players)
    console.log(this.rooms)
  }

  createRoom(): Room {
    // Generate a unique room code
    let uniqueRoomCode: string
    do {
      uniqueRoomCode = this.generateRoomCode()
    } while (this.isRoomCodeTaken(uniqueRoomCode))

    // Create and add the new room
    const newRoom: Room = new Room(uniqueRoomCode, new Map())
    this.rooms.set(newRoom.roomCode, newRoom)

    return newRoom
  }

  // generate a random 4-letter room code
  private generateRoomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let result = ""
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Check if a room code is already taken
  private isRoomCodeTaken(code: string): boolean {
    return this.rooms.get(code) ? true : false
  }

  addPlayerToRoom(player: Player, room: Room): string {
    if (room.playerList.get(player.name)) {
      return "DUPLICATE_USERNAME"
    }

    room.playerList.set(player.name, player)
    return "SUCCESS"
  }

  removePlayerFromRoom(player: Player) {
    console.log(`${player.name} left the game ${player.connectedGameCode}`)

    const room = this.getRoomByCode(player.connectedGameCode)

    room?.playerList.delete(player.name)

    if (room && room?.playerList.size <= 0) {
      this.rooms.delete(room.roomCode)
    }
  }

  getRoomByCode(roomCode: string): Room | null {
    const room: Room | undefined = this.rooms.get(roomCode)

    if (!room) {
      return null
    }

    return room
  }
}
