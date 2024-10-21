import { Room } from "../models/room.model.ts"
import ConnectionService from "./connectionService.ts"
import GameService from "./gameService.ts"
import PromptService from "./promptService.ts"
import RoomService from "./roomService.ts"

export default class GameLoop {
    gameService: GameService
    connectionService: ConnectionService
    roomService: RoomService
    promptService: PromptService
    room: Room
    
    constructor(roomcode: string) {
        this.gameService = new GameService()
        this.roomService = RoomService.getInstance()
        this.promptService = new PromptService()
        this.connectionService = ConnectionService.getInstance()
        this.room = this.roomService.getRoomByCode(roomcode)
    }

    public async main() {
        await this.explanation(20)
        console.log('done')
        // voteMedium(20)
        await this.mediumAnswerPrompt(20)
        // spiritsAnswerPrompt(20)
        // displayEncounter(20)
        // mediumInterperatesEncounter(20)
        // displayInterpertation(20)
        // rankResponses
    }

    async explanation(durationSeconds: number) {
        console.log(`Waiting for ${durationSeconds} seconds`)
        await new Promise(r => setTimeout(r, 2000));
    }

    async mediumAnswerPrompt(durationSeconds: number) {
        const randomPrompt: string = await this.promptService.getRandomPrompt()
        const placeholder: string = "fill in the blank"

        this.gameService.inputMessage(
            randomPrompt,
            placeholder,
            this.room.roomcode,
            [this.room.playerList.entries().next().value.name]
        )
    }
}
