import GameService from "../services/gameService.ts"
import { InformativeMessage } from "../types/messages.ts"

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
}
