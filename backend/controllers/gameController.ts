import ConnectionService from "../services/connectionService.ts"
import GameService from "../services/gameService.ts"
import { HostWebSocket } from "../types/hostWebSocket.ts"
import {
  AnswerMessage,
  ClearMessage,
  InformativeMessage,
  InputMessage,
} from "../types/messages.ts"
import { PlayerWebSocket } from "../types/userWebSocket.ts"

export default class GameController {
  gameService: GameService
  connectionService: ConnectionService
  constructor() {
    this.gameService = new GameService()
    this.connectionService = ConnectionService.getInstance()
  }

  informativeMessage(data: InformativeMessage) {
    this.gameService.informativeMessage(
      data.message,
      data.roomCode,
      data.playerNameArray,
    )
  }

  clearMessage(data: ClearMessage) {
    this.gameService.clear(data.roomCode, data.playerNameArray)
  }

  inputMessage(data: InputMessage) {
    this.gameService.inputMessage(
      data.message,
      data.placeholder,
      data.roomCode,
      data.playerNameArray,
    )
  }
  answerPrompt(data: AnswerMessage, playerWebSocket: PlayerWebSocket) {
    this.gameService.answerMessage(data.answer, playerWebSocket)
  }
}
