import {KomaType} from './koma';

export const MovementType = {
  MOVE: '-',
  CAPTURE: 'x',
  DROP: '*',
  PROMOTE: '+'
} as const;

// Type derived from the object's values
export type movementType = typeof MovementType[keyof typeof MovementType];

export type playerAction = Move | 'UNDO';

//western notation
export interface Move {
  koma: KomaType; //1
  origin?: { x: number, y: number };  // 2
  movement: movementType; // 3
  destination: { x: number, y: number }; //4
  promotion?: '=' | "*"; //5
  player: "sente" | "gote";
  eatenKoma?: KomaType;
}
