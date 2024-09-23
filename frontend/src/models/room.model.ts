import Player from "./Player.model";

export default class Room {
    roomCode: string;
    playerList: Player[];
    deviceId: string;

    constructor(roomCode: string, playerList: Player[], deviceId: string) {
        this.roomCode = roomCode
        this.playerList = playerList
        this.deviceId = deviceId
    }
}