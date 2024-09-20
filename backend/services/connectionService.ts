import GameRoom from "./roomService.ts"
import { Room } from "../models/room.model.ts"
import { Player } from "../models/player.model.ts"
import { UserWebSocket } from "../types/userWebSocket.ts"
import BroadcastMessage from "../types/broadcastMessage.ts"



export default class ConnectionService {
  /*
    connected clients data structure:
[
    [ROOMCODE1 : [
        [deviceID : SOCKET],
        [deviceID : SOCKET]
        ]
    ],
    [ROOMCODE2 : [
        [deviceID : SOCKET],
        [deviceID : SOCKET]
        ]
    ]
]
    */
  connectedClients: Map<string, Map<string, UserWebSocket>> = new Map()

  broadcastToPlayer(message: BroadcastMessage, socket: UserWebSocket) {
    const jsonMessage = JSON.stringify(message)

    if (socket.readyState == WebSocket.OPEN) {
      socket.send(jsonMessage)
    }
  }

  broadcastToRoom(message: BroadcastMessage, room: Room) {
    const jsonMessage = JSON.stringify(message)
    const clients = this.connectedClients.get(room.roomCode)

    if (room.host.readyState === WebSocket.OPEN) {
      room.host.send(jsonMessage)
    }

    // Check if there are any clients for the room
    if (!clients) {
      console.error(`No clients found for room ${room.roomCode}`)
      return
    }

    // Iterate over the WebSocket objects in the map
    for (const client of clients.values()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonMessage)
      }
    }
  }

  private logPlayers(roomcode: string) {
    const sockets = this.connectedClients.get(roomcode)
    if (!sockets) {
      return
    }
    console.log(`All players in room ${roomcode}`)
    for (const socket of sockets.values()) {
      console.log(` - ${socket.player.name}`)
    }
  }

  // send updated users list to all connected clients
  broadcastGameInformation(room: Room) {
    const playerList = room.playerList
    console.log(
      "Sending updated username list to all clients: " +
        JSON.stringify(playerList),
    )
    const message: BroadcastMessage = {
      event: "update-users",
      room: room,
    }
    this.broadcastToRoom(message, room)
  }

  disconnectPlayer(socket: UserWebSocket) {
    console.log("Socket closed!")
    const player: Player = socket.player
    this.connectedClients.get(player.connectedGameCode)?.delete(player.deviceId)
  }

  /*

  private createRoom(socket: UserWebSocket) {
    // create a new room
    const newRoom: Room = this.gameRoom.createRoom(socket)

    // adding player and room to the map of connected clients
    this.connectedClients.set(newRoom.roomCode, new Map())

    const message: BroadcastMessage = {
      event: "create-room",
      room: newRoom,
    }
    this.broadcastToRoom(message, newRoom.roomCode)
    this.broadcastToPlayer(message, socket)
  }

  private joinRoom(socket: UserWebSocket, data: BroadcastMessage) {
    const targetRoom: Room = this.gameRoom.getRoomByCode(data.roomCode)
    let isPartyLeader = false
    if (targetRoom?.playerList.size === 0) {
      isPartyLeader = true
    }
    const newPlayer: Player = new Player(
      data.name,
      data.roomCode,
      data.deviceId,
      isPartyLeader,
    )

    if (!targetRoom) {
      const message: BroadcastMessage = {
        event: "error-room-nonexistent",
        isError: true,
        details: "The room you are trying to join does not exist.",
      }
      this.broadcastToPlayer(message, socket)
      return
    }
    if (targetRoom.playerList.has(newPlayer.name)) {
      const message: BroadcastMessage = {
        event: "error-name-taken",
        isError: true,
        details: "Someone in your room already has your name.",
      }
      this.broadcastToPlayer(message, socket)
      return
    }
    this.gameRoom.addPlayerToRoom(newPlayer, targetRoom)

    socket.player.deviceId = newPlayer.deviceId

    this.connectedClients.get(newPlayer.connectedGameCode)?.set(
      newPlayer.deviceId,
      socket,
    )
    const message: BroadcastMessage = {
      event: "join-room",
      room: targetRoom,
    }

    this.broadcastToRoom(message, targetRoom.roomCode)
    this.broadcastToPlayer(message, socket)
  }

  private leaveRoom(socket: UserWebSocket) {
    const targetPlayer: Player = this.gameRoom.getPlayerByDeviceId(
      socket.deviceId,
    )
    if (targetPlayer) {
      this.gameRoom.removePlayerFromRoom(targetPlayer)
      this.connectedClients.get(targetPlayer.connectedGameCode)?.delete(
        targetPlayer.name,
      )
      const room: Room = this.gameRoom.getRoomByCode(
        targetPlayer.connectedGameCode,
      )
      if (room) {
        this.broadcastGameInformation(room)
      }
    }
  }

  disconnectPlayer(socket: UserWebSocket) {
    console.log("Socket closed!")
    const player: Player = socket.player
    this.connectedClients.get(player.connectedGameCode)?.delete(player.deviceId)
    this.gameRoom.removePlayerFromRoom(player)
    const room: Room = this.gameRoom.getRoomByCode(
      player.connectedGameCode,
    )

    this.broadcastGameInformation(room)
  }
    */
}
