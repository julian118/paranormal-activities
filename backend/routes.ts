// server.ts
import { JoinRoomMessage, LeaveRoomMessage, CreateRoomMessage } from "./types/messages.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import ConnectionController from "./services/connectionService.ts";
import RoomController from "./controllers/roomController.ts";
import { UserWebSocket } from "./types/userWebSocket.ts";

const app: Application = new Application();
const port: number = 8080;
const router: Router = new Router();

const connectionController: ConnectionController = new ConnectionController();
const roomController: RoomController = new RoomController();

router.get("/start_web_socket", async (ctx) => {
  const socket = await ctx.upgrade() as UserWebSocket;

  socket.onmessage = (message) => {
    console.log(message.data)
    const data = JSON.parse(message.data);

    switch (data.event) {
      case "create-room": {
        roomController.createRoom(data as CreateRoomMessage, socket);
        break;
      }
      case "join-room": {
        roomController.joinRoom(data as JoinRoomMessage, socket);
        break;
      }
      case "leave-room": {
        roomController.leaveRoom(socket);
        break;
      }
    }
  };

  socket.onopen = () => {
    console.log("socket opened!");
  };

  socket.onclose = () => {
    roomController.leaveRoom(socket);
    connectionController.disconnectPlayer(socket);
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/`,
    index: "public/index.html",
  });
});

console.log("Listening at http://localhost:" + port);
await app.listen({ port });
