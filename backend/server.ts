// server.js

// todo list
// () calling getGameRoomByCode every time is unnessesary but adding the property to player creates a stack overflow

import GameRoom from "./GameRoom.ts"
import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { Room } from "./models/room.model.ts"
import { Player } from "./models/player.model.ts"
import { mergeHeaders } from "jsr:@oak/commons@^1.0/cookie_map"

/*
connected clients data structure:
[
  [ROOMCODE1 : [
      [playername1 : SOCKET1],
      [playername2 : SOCKET2]
    ]
  ],
  [ROOMCODE2 : [
      [playername1 : SOCKET1],
      [playername2 : SOCKET2]
    ]
  ]
]
*/

type BroadcastMessage = {
  [key: string]: any
} & {
  event: string
}

const connectedClients: Map<string, Map<string, UserWebSocket>> = new Map()

const app = new Application()
const port = 8080
const router = new Router()
const gameRoom = new GameRoom()

function mapToArrayOfObjects<T>(map: Map<any, T>): T[] {
  const result: T[] = []
  
  for (const [, value] of map) {
      result.push(value)
  }
  return result
}

interface UserWebSocket extends WebSocket {
  player: Player
}

gameRoom.logActiveData()

function broadcastToPlayer(message: BroadcastMessage, socket: UserWebSocket) {
  const jsonMessage = JSON.stringify(message)

  if (socket.readyState == WebSocket.OPEN) {
    socket.send(jsonMessage)
  }
}

function broadcastToRoom(message: BroadcastMessage, roomCode: string) {
  const jsonMessage = JSON.stringify(message)
  const clients = connectedClients.get(roomCode)

  logPlayers(roomCode)

  // Check if there are any clients for the room
  if (!clients) {
    console.error(`No clients found for room ${roomCode}`)
    return
  }

  // Iterate over the WebSocket objects in the map
  for (const client of clients.values()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonMessage)
    }
  }
}

function logPlayers(roomcode: string) {
  const clients = connectedClients.get(roomcode)

  if (!clients) {
    return
  }
  // Iterate over the WebSocket objects in the map
  console.log(`All clients in room ${roomcode}`)
  for (const client of clients.values()) {
    if (client.readyState === WebSocket.OPEN) {
      console.log(` - ${client.player.name}`)
    }
  }
  console.log('')
}

// send updated users list to all connected clients
function broadcastGameInformation(room: Room) {
  const playerList = room.playerList
  console.log(
    "Sending updated username list to all clients: " +
      JSON.stringify(playerList),
  )
  const message: BroadcastMessage = {
    event: "update-users",
    room: room
  }
  broadcastToRoom(message, room.roomCode)
  
}

router.get("/start_web_socket", async (ctx) => {
  const socket = await ctx.upgrade() as UserWebSocket

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data)
    switch (data.event) {
      case "create-room": {     

        // create a new room
        const newRoom: Room = gameRoom.createRoom(socket)

        // adding player and room to the map of connected clients
        connectedClients.set(newRoom.roomCode, new Map())

        const message: BroadcastMessage = {
          event: "create-room",
          room: newRoom
        }
        broadcastToRoom(message, newRoom.roomCode)
        broadcastToPlayer(message, socket)
        break
      }
      case "join-room": {
        const targetRoom: Room | null = gameRoom.getRoomByCode(data.roomCode)
        let isPartyLeader = false
        if (targetRoom?.playerList.size === 0) {
          isPartyLeader = true
        }
        const newPlayer: Player = new Player(data.name, data.roomCode, data.deviceId, isPartyLeader)
        
        if (!targetRoom) {
          const message: BroadcastMessage = {
            event: "error-room-nonexistent",
            isError: true,
            details: "The room you are trying to join does not exist."
          }
          broadcastToPlayer(message, socket)
          break
        }
        if (targetRoom.playerList.has(newPlayer.name)) {
          const message: BroadcastMessage = {
            event: "error-name-taken",
            isError: true,
            details: "Someone in your room already has your name."
          }
          broadcastToPlayer(message, socket)
          break
        }
        gameRoom.addPlayerToRoom(newPlayer, targetRoom)

        socket.player = newPlayer
        connectedClients.get(newPlayer.connectedGameCode)?.set(
          newPlayer.name,
          socket,
        )
        const message: BroadcastMessage = {
          event: "join-room",
          room: targetRoom
        }
    
        broadcastToRoom(message, targetRoom.roomCode)
        broadcastToPlayer(message, socket)
        break
      }
      case "leave-room": {
        const targetPlayer: Player = socket.player
        gameRoom.removePlayerFromRoom(targetPlayer)
        connectedClients.get(targetPlayer.connectedGameCode)?.delete(
          targetPlayer.name,
        )
        const room: Room | null = gameRoom.getRoomByCode(targetPlayer.connectedGameCode)
        if (room) {
          broadcastGameInformation(room)
        }
        
      }
    }
  }
  socket.onopen = () => {
    console.log("socket opened!")
  }

  // when a client disconnects, remove them from the connected clients list
  // and broadcast the active users list
  socket.onclose = () => {
    console.log("Socket closed!")
    if (socket.player) {
      connectedClients.get(socket.player.connectedGameCode)?.delete(socket.player.name)
      gameRoom.removePlayerFromRoom(socket.player)
      const room: Room | null = gameRoom.getRoomByCode(
        socket.player.connectedGameCode,
      )
      if (room) {
        broadcastGameInformation(room)
      }
    }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/`,
    index: "public/index.html",
  })
})

console.log("Listening at http://localhost:" + port)
await app.listen({ port })
