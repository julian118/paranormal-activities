export class Host {
    public hostedGameCode: string
    public deviceId: string
    
    constructor(
    hostedGameCode: string,
    deviceId: string,
    ) {
    this.hostedGameCode = hostedGameCode
    this.deviceId = deviceId
    }
  }