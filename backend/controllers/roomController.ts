import { Player } from "../models/player.model.ts";
import { Room } from "../models/room.model.ts";
import RoomService from "../services/roomService.ts"
import ConnectionService from "../services/connectionService.ts"
import { CreateRoomMessage, JoinRoomMessage, LeaveRoomMessage } from "../types/messages.ts"
import { UserWebSocket } from "../types/userWebSocket.ts"
import BroadcastMessage from "../types/broadcastMessage.ts"

export default class RoomController {
  private roomService: RoomService;
  private connectionService: ConnectionService;

  constructor() {
    this.roomService = new RoomService()
    this.connectionService = new ConnectionService()
  }

  createRoom(message: CreateRoomMessage, hostSocket: UserWebSocket) {
    try {
      const room: Room = this.roomService.createRoom(hostSocket)
      console.log(room)
      this.connectionService.broadcastGameInformation(room)
    } catch (error: unknown) {
      this.broadcastError("An unknown error occured", hostSocket)
      console.error(error)
    }
  }

  joinRoom(message: JoinRoomMessage, socket: UserWebSocket) {
    try {
      const room: Room = this.roomService.getRoomByCode(message.roomCode)
      const player: Player = new Player(message.name, room.roomCode, message.deviceId, false) 
      this.roomService.addPlayerToRoom(player, room)
      this.connectionService.broadcastGameInformation(room)
      const broadcastMessage: BroadcastMessage = {
        event: "joined-room",
        room: room
      }
      this.connectionService.broadcastToPlayer(broadcastMessage, socket)
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.broadcastError(error.message, socket)
      } else {
        this.broadcastError("An unknown error occured", socket)
        console.error(error)
      }
    }
  }

  leaveRoom(socket: UserWebSocket) {
    this.roomService.removePlayerFromRoom(socket.player)
    const room: Room = this.roomService.getRoomByCode(socket.player.connectedGameCode)
    this.connectionService.broadcastGameInformation(room)
  }

  private broadcastError(details: string, socket: UserWebSocket) {
    const message: BroadcastMessage = {
      event: "error-message",
      isError: true,
      details: details
    }
    this.connectionService.broadcastToPlayer(message, socket)
  }
}
