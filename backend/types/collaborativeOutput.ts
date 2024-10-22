import { Player } from "../models/player.model.ts"

type CollaborativeOutput = {
  prompt: string
  fullOutput: {
    player: Player
    output: string
  }[]
}

const CollaborativeOutputUtils = {
  getPlayerNameList(output: CollaborativeOutput): string[] {
    return output.fullOutput.map(entry => entry.player.name)
  },

  fromPlayers(prompt: string, players: Player[]): CollaborativeOutput {
    const fullOutput = players.map(player => ({ player, output: '' }))
    return { prompt, fullOutput }
  }
}

export { type CollaborativeOutput, CollaborativeOutputUtils }
