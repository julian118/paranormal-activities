import { Player } from "../models/player.model.ts"
import { Room } from "../models/room.model.ts"
import { HostWebSocket } from "../types/hostWebSocket.ts"

export default class RoomService {
  //public players: Player[] = []

  private rooms: Map<string, Room> = new Map()

  logActiveData(): void {
    console.log("amount of active rooms: ", this.rooms.size)
  }

  private generateRoomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let result = ""
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private isRoomCodeTaken(code: string): boolean {
    return this.rooms.get(code) ? true : false
  }

  public generateUniqueRoomCode(): string {
    let uniqueRoomCode: string
    do {
      uniqueRoomCode = this.generateRoomCode()
    } while (this.isRoomCodeTaken(uniqueRoomCode))
    return uniqueRoomCode
  }

  public createRoom(hostSocket: HostWebSocket, uniqueRoomCode: string): Room {

    const newRoom: Room = new Room(uniqueRoomCode, new Map(), hostSocket.host)
    this.rooms.set(newRoom.roomCode, newRoom)
    return newRoom
  }

  public addPlayerToRoom(player: Player, room: Room) {
    if (room.playerList.get(player.name)) {
      throw new ReferenceError("Player with this name already exists.")
    }
    room.playerList.set(player.name, player)
  }

  public removePlayerFromRoom(player: Player) {
    console.log(`${player.name} left the game ${player.connectedGameCode}`)
    const room = this.getRoomByCode(player.connectedGameCode)
    room.playerList.delete(player.name)

    if (player.isPartyLeader) {
      const firstPlayer: Player = room.playerList.values().next().value
      if (firstPlayer) {
        firstPlayer.isPartyLeader = true
      }
    }
  }

  public getRoomByCode(roomCode: string): Room {
    const room: Room | undefined = this.rooms.get(roomCode)

    if (!room) {
      throw new ReferenceError(`Room with code ${roomCode} does not exist.`)
    }

    return room
  }

  public getPlayerByDeviceId(deviceId: string): Player {
    for (const room of this.rooms.values()) {
      for (const player of room.playerList.values()) {
        if (player.deviceId === deviceId) {
          console.log(`Found player with device id ${deviceId}: ${player.name}`)
          return player
        }
      }
    }
    throw new ReferenceError(
      `Player with device id: ${deviceId} does not exist.`,
    )
  }
}
