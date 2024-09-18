import { Player } from "./models/player.model.ts";

type BroadcastMessage = {
  [key: string]: any;
} & {
  event: string;
};

export default class GeneralGame {
  informativeMessage(message: string, playerList: Player[]) {

    console.log(`message: ${message} for players ${playerList}`)
    const infoMessage: BroadcastMessage = {
      event: "informative-message",
      message: message,
    };

    for (const player of playerList) {
      if (player.socket.readyState === WebSocket.OPEN) {
        player.socket.send(JSON.stringify(infoMessage));
      }
    }
  }

  clear(playerList: Player[]) {
    const infoMessage: BroadcastMessage = {
      event: "clear",
    };

    for (const player of playerList) {
      if (player.socket.readyState === WebSocket.OPEN) {
        player.socket.send(JSON.stringify(infoMessage));
      }
    }
  }
}
