export class Player {
  public name: string;
  public connectedGameCode: string;
  public deviceId: string;
  public isPartyLeader: boolean;

  constructor(name: string, connectedGameCode: string, deviceId: string, isPartyLeader: boolean) {
    this.name = name
    this.connectedGameCode = connectedGameCode
    this.deviceId = deviceId
    this.isPartyLeader = isPartyLeader

  }
}
