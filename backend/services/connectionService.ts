import GameRoom from "./roomService.ts"
import { Room } from "../models/room.model.ts"
import { Player } from "../models/player.model.ts"
import { PlayerWebSocket } from "../types/userWebSocket.ts"
import BroadcastMessage from "../types/broadcastMessage.ts"
import { HostWebSocket } from "../types/hostWebSocket.ts"
import { Host } from "../models/host.model.ts"



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
  connectedPlayers: Map<string, Map<string, PlayerWebSocket>> = new Map()
  connectedHosts: Map<string, HostWebSocket> = new Map()

  broadcastToPlayer(message: BroadcastMessage, playerSocket: PlayerWebSocket) {
    const jsonMessage = JSON.stringify(message)
    if (playerSocket.readyState == WebSocket.OPEN) {
      playerSocket.send(jsonMessage)
    }
  }

  broadcastToHost(message: BroadcastMessage, hostSocket: HostWebSocket) {
    const jsonMessage = JSON.stringify(message)
    if (hostSocket.readyState == WebSocket.OPEN) {
      hostSocket.send(jsonMessage)
    }
  }

  broadcastToRoom(message: BroadcastMessage, room: Room) {
    const jsonMessage = JSON.stringify(message)
    const clients = this.connectedPlayers.get(room.roomCode)
    const host = this.connectedHosts.get(room.roomCode)

    if (!host) {
      throw new ReferenceError(`Host for room ${room.roomCode} not found`)
    }

    if (host.readyState === WebSocket.OPEN) {
      host.send(jsonMessage)
    }

    // Check if there are any clients for the room
    if (!clients) {
      throw new ReferenceError(`No clients found for room ${room.roomCode}`)
    }

    // Iterate over the WebSocket objects in the map
    for (const client of clients.values()) {
      console.log(`trying to send message to ${client.player.name}`)
      if (client.readyState === WebSocket.OPEN) {
        console.log("success")
        client.send(jsonMessage)
      } else {
        console.log("something went wrong")
      }
    }
  }

  private logPlayers(roomcode: string) {
    const sockets = this.connectedPlayers.get(roomcode)
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
       [...playerList],
    )
    const message: BroadcastMessage = {
      event: "update-users",
      room: room,
    }
    this.broadcastToRoom(message, room)
  }

  addRoomConnection(roomCode: string) {
    this.connectedPlayers.set(roomCode, new Map())
  }

  connectPlayer(player: Player, playerSocket: PlayerWebSocket) {
    playerSocket.player = player
    const roomMap: Map<string, PlayerWebSocket> | undefined = this.connectedPlayers.get(player.connectedGameCode)
    if (!roomMap) {
      throw new ReferenceError("The room you are trying to connect to does not exist")
    }
    roomMap.set(player.name, playerSocket)

    console.log(roomMap)
  }

  disconnectPlayer(playerSocket: PlayerWebSocket) {
    console.log("Socket closed!")
    const player: Player = playerSocket.player
    this.connectedPlayers.get(player.connectedGameCode)?.delete(player.name)
  }

  connectHost(host: Host, hostSocket: HostWebSocket) {
    hostSocket.host = host
    this.connectedHosts.set(host.hostedGameCode, hostSocket)
  }

  disconnectHost(hostSocket: HostWebSocket) {
    this.connectedHosts.delete(hostSocket.host.hostedGameCode)
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
