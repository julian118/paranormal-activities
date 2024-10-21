import Player from "../../models/Player.model";

export function getPlayerNameList(playerList: Player[]): string[] {
    return playerList.map(player => player.name)
}
