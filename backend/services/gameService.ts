import ConnectionController from "../controllers/connectionController.ts"
import { Player } from "../models/player.model.ts"
import { HostWebSocket } from "../types/hostWebSocket.ts"
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
    const playerSockets: PlayerWebSocket[] = this.connectionService
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

  inputMessage(
    message: string,
    placeholder: string,
    roomCode: string,
    playerNames: string[],
  ) {
    const playerSockets: PlayerWebSocket[] = this.connectionService
      .getPlayerSocketsFromNameArray(playerNames, roomCode)
    const inputMessage: BroadcastMessage = {
      event: "input-message",
      message: message,
      placeholder: placeholder,
    }

    for (const playerSocket of playerSockets) {
      if (playerSocket.readyState === WebSocket.OPEN) {
        playerSocket.send(JSON.stringify(inputMessage))
      }
    }
  }
  answerMessage(answer: string, playerWebSocket: PlayerWebSocket) {
    const answerMessage: BroadcastMessage = {
      event: "answer-message",
      answer: answer,
      roomCode: playerWebSocket.player.connectedGameCode,
      player: playerWebSocket.player.name
    }
    const roomCode: string = playerWebSocket.player.connectedGameCode
    const host: HostWebSocket | undefined = this.connectionService
      .connectedHosts.get(roomCode)
    if (host) {
      this.connectionService.broadcastToHost(answerMessage, host)
    }
  }

  clear(roomCode: string, playerNames: string[]) {
    const playerSockets: PlayerWebSocket[] = this.connectionService
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
