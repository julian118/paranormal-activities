// server.js
import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { Player } from "./models/player.model.ts"
import ServerController from "./serverController.ts"

const app = new Application()
const port = 8080
const router = new Router()
const serverController = new ServerController()

interface UserWebSocket extends WebSocket {
  deviceId: string
}

router.get("/start_web_socket", async (ctx) => {
  const socket = await ctx.upgrade() as UserWebSocket

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data)

    switch (data.event) {
      case "create-room": {     
        serverController.createRoom(socket)
        break
      }
      case "join-room": {
        serverController.joinRoom(socket, data)
        break
      }
      case "leave-room": {
        serverController.leaveRoom(socket)
      }
    }
  }
  socket.onopen = () => {
    console.log("socket opened!")
  }

  // when a client disconnects, remove them from the connected clients list and broadcast the active users list
  socket.onclose = () => {
    serverController.disconnectPlayer(socket)
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
