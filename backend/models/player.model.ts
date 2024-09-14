export class Player {
  public name: string
  public connectedGameCode: string

  constructor(name: string, connectedGameCode: string) {
    this.name = name
    this.connectedGameCode = connectedGameCode
  }
}
