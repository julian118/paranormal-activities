import { Player } from "../models/player.model.ts"
import { Room } from "../models/room.model.ts"
import { UserWebSocket } from "../types/userWebSocket.ts"
import ConnectionService from "../services/connectionService.ts"
import GameService from "../services/gameService.ts"
import RoomService from "../services/roomService.ts"


export default class ConnectionController {
    private connectionService: ConnectionService;

    constructor(connectionService: ConnectionService, roomService: RoomService) {
        this.connectionService = new ConnectionService()
    }

    disconnectPlayer(socket: UserWebSocket) {
        this.connectionService.disconnectPlayer(socket)
    }
}