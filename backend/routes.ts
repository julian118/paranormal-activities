// server.ts
import {
  CreateRoomMessage,
  InformativeMessage,
  JoinRoomMessage,
} from "./types/messages.ts"
import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import ConnectionController from "./controllers/connectionController.ts"
import RoomController from "./controllers/roomController.ts"
import { PlayerWebSocket } from "./types/userWebSocket.ts"
import { HostWebSocket } from "./types/hostWebSocket.ts"
import GameController from "./controllers/gameController.ts"

const app: Application = new Application()
const port: number = 8080
const router: Router = new Router()

const connectionController: ConnectionController = new ConnectionController()
const roomController: RoomController = new RoomController()
const gameController: GameController = new GameController()

router.get("/start_player_web_socket", async (ctx) => {
  const socket = await ctx.upgrade() as PlayerWebSocket

  socket.onmessage = (message: any) => {
    console.log(message.data)
    const data = JSON.parse(message.data)

    switch (data.event) {
      case "join-room": {
        roomController.joinRoom(data as JoinRoomMessage, socket)
        break
      }
      case "leave-room": {
        roomController.leaveRoom(socket)
        break
      }
    }
  }

  socket.onopen = () => {
    console.log("client socket opened!")
  }

  socket.onclose = () => {
    console.log("client socket closed!")
    roomController.leaveRoom(socket)
    connectionController.disconnectPlayer(socket)
  }
})

router.get("/start_host_web_socket", async (ctx) => {
  const hostSocket = await ctx.upgrade() as HostWebSocket

  hostSocket.onmessage = (message: any) => {
    console.log(message.data)
    const data = JSON.parse(message.data)

    switch (data.event) {
      case "create-room": {
        roomController.createRoom(data as CreateRoomMessage, hostSocket)
        break
      }
      case "informative-message": {
        gameController.informativeMessage(data as InformativeMessage)
        break
      }
      default:
        console.error("invalid message recieved")
    }
  }

  hostSocket.onopen = () => {
    console.log("host socket opened!")
  }

  hostSocket.onclose = () => {
    console.log("host socket closed!")
    roomController.deleteRoom(hostSocket.host)
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
