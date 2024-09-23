import ConnectionController from "../controllers/connectionController.ts"
import { Player } from "../models/player.model.ts"
import { Room } from "../models/room.model.ts"
import { HostWebSocket } from "../types/hostWebSocket.ts"

export default class RoomService {
  //public players: Player[] = []

  private static instance: RoomService
  private rooms: Map<string, Room>

  private constructor() {
    this.rooms = new Map()
  }

  public static getInstance(): RoomService {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService()
    }
    return RoomService.instance
  }

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
    const newRoom: Room = new Room(
      uniqueRoomCode,
      new Map(),
      hostSocket.host,
      true,
    )
    this.rooms.set(newRoom.roomCode, newRoom)
    return newRoom
  }

  public addPlayerToRoom(player: Player, room: Room) {
    if (room.playerList.get(player.name)) {
      throw new ReferenceError("Player with this name already exists.")
    }
    if (room.playerList.size == 0) {
      player.isPartyLeader = true
    }
    room.playerList.set(player.name, player)
  }

  public removePlayerFromRoom(player: Player) {
    console.log(`${player.name} left the game ${player.connectedGameCode}`)
    const room = this.getRoomByCode(player.connectedGameCode)
    if (!room.allowQuit) {
      return
    }
    room.playerList.delete(player.name)
    if (!player.isPartyLeader) {
      return
    }
    const firstPlayer: Player = room.playerList.values().next().value
    if (firstPlayer) {
      firstPlayer.isPartyLeader = true
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
      const player = Array.from(room.playerList.values()).find(
        (player) => player.deviceId === deviceId,
      )

      if (player) {
        console.log(`Found player with device id ${deviceId}: ${player.name}`)
        return player
      }
    }

    throw new ReferenceError(
      `Player with device id: ${deviceId} does not exist.`,
    )
  }
}
