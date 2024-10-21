import GameLoop from "../services/gameLoop.ts"

export class Host {
  public hostedGameCode: string
  public gameLoopInstance: GameLoop | null
  public deviceId: string

  constructor(
    hostedGameCode: string,
    gameLoopInstance: GameLoop | null,
    deviceId: string,
  ) {
    this.hostedGameCode = hostedGameCode
    this.gameLoopInstance = gameLoopInstance
    this.deviceId = deviceId
  }
}
