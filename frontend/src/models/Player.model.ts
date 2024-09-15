
export default class Player {
    name: string;
    deviceId: string;
    isPartyLeader: boolean;

    constructor (name: string, deviceId: string, isPartyLeader: boolean) {
        this.name = name
        this.deviceId = deviceId
        this.isPartyLeader = isPartyLeader
    }
}