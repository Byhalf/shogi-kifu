import {Koma, LATIN_TO_CSA, PlayerType} from '../interfaces/koma';
import {Move} from '../interfaces/move';

export class ShogiConverter {
  static boardStateToCSA(state: (Koma | undefined)[][], firstPlayer: PlayerType): string {
    let result = ""
    for (let i = 0; i < state.length; i++) {
      result += "P" + (i + 1);
      for (let tile of state[i]) {
        if (tile === undefined) {
          result += " * "
        } else if (tile.player === firstPlayer) {
          result += "+" + LATIN_TO_CSA[tile.kind]
        } else {
          result += "-" + LATIN_TO_CSA[tile.kind]
        }
      }
      if (i !== state.length - 1) {
        result += "\n"
      }
    }
    return result;
  }

  static moveToCSA(move: Move): string {
    return "";
  }
}
