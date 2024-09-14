// server.js

// todo list
// () calling getGameRoomByCode every time is unnessesary but adding the property to player creates a stack overflow

import GameRoom from "./GameRoom.ts"
import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { Room } from "./models/room.model.ts"
import { Player } from "./models/player.model.ts"
import { BroadcastMessage } from "./models/broadcastMessage.model.ts"

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
function broadcastToRoom(message: BroadcastMessage) {
  const roomCode = message.room.roomCode
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
  broadcastToRoom(
    new BroadcastMessage(
      "update-users",
      room,
    ),
  )
}

router.get("/start_web_socket", async (ctx) => {
  const socket = await ctx.upgrade() as UserWebSocket

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data)
    switch (data.event) {
      case "create-room": {
        // leave the current game
        if (socket.player) {
          gameRoom.removePlayerFromRoom(socket.player)
          const oldRoom: Room | null = gameRoom.getRoomByCode(socket.player.connectedGameCode)
          if (oldRoom) {
            broadcastGameInformation(oldRoom)
          }
          
        }

        // create a new room
        const newRoom: Room = gameRoom.createRoom()
        const newPlayer: Player = new Player(data.name, newRoom.roomCode)
        gameRoom.addPlayerToRoom(newPlayer, newRoom)

        // adding player and room to the map of connected clients
        connectedClients.set(newRoom.roomCode, new Map())
        socket.player = newPlayer
        connectedClients.get(newPlayer.connectedGameCode)?.set(
          newPlayer.name,
          socket,
        )

        broadcastToRoom(
          new BroadcastMessage(
            "create-room",
            newRoom,
          ),
        )
        broadcastToPlayer(
          new BroadcastMessage(
            "create-room",
            newRoom,
            newPlayer
          ),
          socket
        )
        break
      }
      case "join-room": {
        const newPlayer: Player = new Player(data.name, data.roomCode)
        const targetRoom: Room | null = gameRoom.getRoomByCode(data.roomCode)

        if (!targetRoom) {
          socket.close(1008, `room ${data.roomCode} doesnt exist`)
          break
        }
        if (targetRoom.playerList.has(newPlayer.name)) {
          socket.close(1008, `Username ${name} is already taken`)
          break
        }
        gameRoom.addPlayerToRoom(newPlayer, targetRoom)

        socket.player = newPlayer
        connectedClients.get(newPlayer.connectedGameCode)?.set(
          newPlayer.name,
          socket,
        )

    
        broadcastToRoom(
          new BroadcastMessage(
            "join-room",
            targetRoom
          ),
        )
        broadcastToPlayer(
          new BroadcastMessage(
            "join-room",
            targetRoom,
            newPlayer
          ),
          socket
        )
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
    // broadcastGameInformation(socket.player.connectedGameCode, socket.player)
  }

  // when a client disconnects, remove them from the connected clients list
  // and broadcast the active users list
  socket.onclose = () => {
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
