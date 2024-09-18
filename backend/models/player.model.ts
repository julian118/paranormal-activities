export class Player {
  public name: string;
  public connectedGameCode: string;
  public deviceId: string;
  public isPartyLeader: boolean;
  public socket: WebSocket;

  constructor(
    name: string, 
    connectedGameCode: string, 
    deviceId: string, 
    isPartyLeader: boolean,
    socket: WebSocket
  ) {
    this.name = name
    this.connectedGameCode = connectedGameCode
    this.deviceId = deviceId
    this.isPartyLeader = isPartyLeader
    this.socket = socket

  }
}
