import GameService from "../services/gameService.ts"
import { ClearMessage, InformativeMessage } from "../types/messages.ts"

export default class GameController {
  gameService: GameService
  constructor() {
    this.gameService = new GameService()
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
}
