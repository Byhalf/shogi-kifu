/*Koma means shogi piece*/

export interface Koma{
  kind: KomaType;
  player : 'top' | 'bottom';
}


export type KomaType =
  | 'P' | 'L' | 'N' | 'S' | 'G' | 'B' | 'R' | 'K'  //promoted pieces
  | 'p' | 'l' | 'n' | 's' | 'b' | 'r'; // Regular pieces

export const KOMA_SVG_MAP: Record<string, string> = {
  'p_bottom': 'assets/koma/0FU.svg',
  'l_bottom': 'assets/koma/0KY.svg',
  'n_bottom': 'assets/koma/0KE.svg',
  's_bottom': 'assets/koma/0GI.svg',
  'G_bottom': 'assets/koma/0GI.svg',
  'b_bottom': 'assets/koma/0KA.svg',
  'r_bottom': 'assets/koma/0HI.svg',
  'K_bottom': 'assets/koma/0GY.svg',

  'p_top': 'assets/koma/1FU.svg',
  'l_top': 'assets/koma/1KY.svg',
  'n_top': 'assets/koma/1KE.svg',
  's_top': 'assets/koma/1GI.svg',
  'G_top': 'assets/koma/1GI.svg',
  'b_top': 'assets/koma/1KA.svg',
  'r_top': 'assets/koma/1HI.svg',
  'K_top': 'assets/koma/1OU.svg'
};

export const INITIAL_SHOGI_BOARD: Array<Array<Koma | undefined>> = [
  [
    { kind: 'l', player: 'top' }, { kind: 'n', player: 'top' }, { kind: 's', player: 'top' },
    { kind: 'G', player: 'top' }, { kind: 'K', player: 'top' }, { kind: 'G', player: 'top' },
    { kind: 's', player: 'top' }, { kind: 'n', player: 'top' }, { kind: 'l', player: 'top' }
  ],
  [
    undefined, { kind: 'r', player: 'top' }, undefined, undefined, undefined, undefined, undefined,
    { kind: 'b', player: 'top' }, undefined
  ],
  [
      { kind: 'p', player: 'top' }, { kind: 'p', player: 'top' }, { kind: 'p', player: 'top' },
      { kind: 'p', player: 'top' }, { kind: 'p', player: 'top' }, { kind: 'p', player: 'top' },
      { kind: 'p', player: 'top' }, { kind: 'p', player: 'top' }, { kind: 'p', player: 'top' }
      ],
  // Empty rows
  [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
  [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
  [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],

  // bottom
  [
    { kind: 'p', player: 'bottom' }, { kind: 'p', player: 'bottom' }, { kind: 'p', player: 'bottom' },
    { kind: 'p', player: 'bottom' }, { kind: 'p', player: 'bottom' }, { kind: 'p', player: 'bottom' },
    { kind: 'p', player: 'bottom' }, { kind: 'p', player: 'bottom' }, { kind: 'p', player: 'bottom' }
  ],
  [
    undefined, { kind: 'b', player: 'bottom' }, undefined, undefined, undefined, undefined, undefined,
    { kind: 'r', player: 'bottom' }, undefined
  ],
  [
    { kind: 'l', player: 'bottom' }, { kind: 'n', player: 'bottom' }, { kind: 's', player: 'bottom' },
    { kind: 'G', player: 'bottom' }, { kind: 'K', player: 'bottom' }, { kind: 'G', player: 'bottom' },
    { kind: 's', player: 'bottom' }, { kind: 'n', player: 'bottom' }, { kind: 'l', player: 'bottom' }
  ],



];


