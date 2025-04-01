/*Koma means shogi piece*/

export interface Koma {
  kind: KomaType;
  player: PlayerType;
}

export type PlayerType = 'gote' | 'sente';

export type KomaType = KomaUnpromoted | KomaPromoted | 'K' | 'G';

type KomaUnpromoted = 'p' | 'l' | 'n' | 's' | 'b' | 'r';
type KomaPromoted = 'P' | 'L' | 'N' | 'S' | 'B' | 'R';


// Set for quick lookup
const unPromotedSet = new Set<KomaUnpromoted>(['p', 'l', 'n', 's', 'b', 'r']);

// Type guard function
export function isKomaUnpromoted(koma: KomaType): koma is KomaUnpromoted {
  return unPromotedSet.has(koma as KomaUnpromoted);
}

export function swapPlayer(player: PlayerType): PlayerType;
export function swapPlayer(koma: Koma): Koma;

export function swapPlayer(arg: PlayerType | Koma): PlayerType | Koma {
  if (typeof arg === "string") {
    return arg === "sente" ? "gote" : "sente"; // Swap PlayerType
  } else {
    arg.player = swapPlayer(arg.player); // Swap Koma player
    return arg;
  }
}

export function unPromotePiece(komaType: KomaType): KomaType {
  if (komaType === 'G' || komaType === 'K') {
    return komaType;
  }
  return komaType.toLowerCase() as KomaUnpromoted;
}

export function promotePiece(komaType: KomaType): KomaType {
  if (komaType === 'G' || komaType === 'K') {
    return komaType as KomaType;
  }
  return komaType.toUpperCase() as KomaPromoted;
}


export const KOMA_SVG_MAP: Record<string, string> = {
  'p_sente': 'assets/koma/0FU.svg',
  'l_sente': 'assets/koma/0KY.svg',
  'n_sente': 'assets/koma/0KE.svg',
  's_sente': 'assets/koma/0GI.svg',
  'G_sente': 'assets/koma/0KI.svg',
  'b_sente': 'assets/koma/0KA.svg',
  'r_sente': 'assets/koma/0HI.svg',
  'K_sente': 'assets/koma/0GY.svg',

  'B_sente': 'assets/koma/0UM.svg',
  'R_sente': 'assets/koma/0RY.svg',
  'P_sente': 'assets/koma/0NG.svg',
  'L_sente': 'assets/koma/0TO.svg',
  'N_sente': 'assets/koma/0NY.svg',
  'S_sente': 'assets/koma/0NK.svg',

  'p_gote': 'assets/koma/1FU.svg',
  'l_gote': 'assets/koma/1KY.svg',
  'n_gote': 'assets/koma/1KE.svg',
  's_gote': 'assets/koma/1GI.svg',
  'G_gote': 'assets/koma/1KI.svg',
  'b_gote': 'assets/koma/1KA.svg',
  'r_gote': 'assets/koma/1HI.svg',
  'K_gote': 'assets/koma/1OU.svg',

  'B_gote': 'assets/koma/1UM.svg',
  'R_gote': 'assets/koma/1RY.svg',
  'P_gote': 'assets/koma/1NG.svg',
  'L_gote': 'assets/koma/1TO.svg',
  'N_gote': 'assets/koma/1NY.svg',
  'S_gote': 'assets/koma/1NK.svg',

};


export function getSvg(koma: Koma): string; // Signature 1 (with Koma)
export function getSvg(type: KomaType, player: PlayerType): string; // Signature 2 (with type and player)
export function getSvg(arg1: Koma | KomaType, arg2?: PlayerType): string {
  if (arg2 !== undefined) {
    return KOMA_SVG_MAP[arg1 + '_' + arg2];
  } else {
    const koma = arg1 as Koma;
    return KOMA_SVG_MAP[koma.kind + '_' + koma.player];
  }
}
