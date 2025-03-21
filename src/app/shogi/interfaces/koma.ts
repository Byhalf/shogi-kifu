/*Koma means shogi piece*/

export interface Koma{
  kind: KomaType;
  player : 'gote' | 'sente';
}


export type KomaType =
  | 'P' | 'L' | 'N' | 'S' | 'G' | 'B' | 'R' | 'K'  //promoted pieces
  | 'p' | 'l' | 'n' | 's' | 'b' | 'r'; // Regular pieces

export const KOMA_SVG_MAP: Record<string, string> = {
  'p_sente': 'assets/koma/0FU.svg',
  'l_sente': 'assets/koma/0KY.svg',
  'n_sente': 'assets/koma/0KE.svg',
  's_sente': 'assets/koma/0GI.svg',
  'G_sente': 'assets/koma/0GI.svg',
  'b_sente': 'assets/koma/0KA.svg',
  'r_sente': 'assets/koma/0HI.svg',
  'K_sente': 'assets/koma/0GY.svg',

  'p_gote': 'assets/koma/1FU.svg',
  'l_gote': 'assets/koma/1KY.svg',
  'n_gote': 'assets/koma/1KE.svg',
  's_gote': 'assets/koma/1GI.svg',
  'G_gote': 'assets/koma/1GI.svg',
  'b_gote': 'assets/koma/1KA.svg',
  'r_gote': 'assets/koma/1HI.svg',
  'K_gote': 'assets/koma/1OU.svg'
};

export const INITIAL_SHOGI_BOARD: Array<Array<Koma | undefined>> = [
  [
    { kind: 'l', player: 'gote' }, { kind: 'n', player: 'gote' }, { kind: 's', player: 'gote' },
    { kind: 'G', player: 'gote' }, { kind: 'K', player: 'gote' }, { kind: 'G', player: 'gote' },
    { kind: 's', player: 'gote' }, { kind: 'n', player: 'gote' }, { kind: 'l', player: 'gote' }
  ],
  [
    undefined, { kind: 'r', player: 'gote' }, undefined, undefined, undefined, undefined, undefined,
    { kind: 'b', player: 'gote' }, undefined
  ],
  [
      { kind: 'p', player: 'gote' }, { kind: 'p', player: 'gote' }, { kind: 'p', player: 'gote' },
      { kind: 'p', player: 'gote' }, { kind: 'p', player: 'gote' }, { kind: 'p', player: 'gote' },
      { kind: 'p', player: 'gote' }, { kind: 'p', player: 'gote' }, { kind: 'p', player: 'gote' }
      ],
  // Empty rows
  [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
  [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
  [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],

  // sente
  [
    { kind: 'p', player: 'sente' }, { kind: 'p', player: 'sente' }, { kind: 'p', player: 'sente' },
    { kind: 'p', player: 'sente' }, { kind: 'p', player: 'sente' }, { kind: 'p', player: 'sente' },
    { kind: 'p', player: 'sente' }, { kind: 'p', player: 'sente' }, { kind: 'p', player: 'sente' }
  ],
  [
    undefined, { kind: 'b', player: 'sente' }, undefined, undefined, undefined, undefined, undefined,
    { kind: 'r', player: 'sente' }, undefined
  ],
  [
    { kind: 'l', player: 'sente' }, { kind: 'n', player: 'sente' }, { kind: 's', player: 'sente' },
    { kind: 'G', player: 'sente' }, { kind: 'K', player: 'sente' }, { kind: 'G', player: 'sente' },
    { kind: 's', player: 'sente' }, { kind: 'n', player: 'sente' }, { kind: 'l', player: 'sente' }
  ],
];


export function getSvg(koma: Koma) {
  return KOMA_SVG_MAP[koma.kind + '_'+koma.player];
}
