import ConnectionController from "../controllers/connectionController.ts"
import { Player } from "../models/player.model.ts"
import { PlayerWebSocket } from "../types/userWebSocket.ts"
import ConnectionService from "./connectionService.ts"

type BroadcastMessage = {
  [key: string]: any
} & {
  event: string
}

export default class GameService {
  private connectionService: ConnectionService

  constructor() {
    this.connectionService = ConnectionService.getInstance()
  }

  informativeMessage(message: string, roomCode: string, playerNames: string[]) {
    let playerSockets: PlayerWebSocket[] = this.connectionService
      .getPlayerSocketsFromNameArray(playerNames, roomCode)

    console.log(`message: ${message} for players ${playerNames}`)
    const infoMessage: BroadcastMessage = {
      event: "informative-message",
      message: message,
    }

    for (const playerSocket of playerSockets) {
      if (playerSocket.readyState === WebSocket.OPEN) {
        playerSocket.send(JSON.stringify(infoMessage))
      }
    }
  }

  clear(roomCode: string, playerNames: string[]) {
    let playerSockets: PlayerWebSocket[] = this.connectionService
      .getPlayerSocketsFromNameArray(playerNames, roomCode)

    const infoMessage: BroadcastMessage = {
      event: "clear",
    }

    for (const playerSocket of playerSockets) {
      if (playerSocket.readyState === WebSocket.OPEN) {
        playerSocket.send(JSON.stringify(infoMessage))
      }
    }
  }
}
